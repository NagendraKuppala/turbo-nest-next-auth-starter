import {
  ConflictException,
  Inject,
  forwardRef,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateProfileDto } from '../user/dto/update-profile.dto';
import { UserService } from 'src/user/user.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { Role } from '@prisma/client';
import { EmailService } from 'src/email/email.service';
import { nanoid } from 'nanoid';
import {
  AuthJwtPayload,
  NewsletterUnsubscribePayload,
} from './types/auth-jwtPayload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    @Inject(refreshConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  // SignUp user service
  async registerUser(createUserDto: CreateUserDto) {
    const userEmailExists = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (userEmailExists)
      throw new ConflictException('User email already exists!');

    const userUsernameExists = await this.userService.findByUsername(
      createUserDto.username,
    );
    if (userUsernameExists)
      throw new ConflictException('Username already exists!');

    // Verify reCAPTCHA token
    await this.verifyRecaptcha(createUserDto.recaptchaToken!);

    if (!createUserDto.termsAccepted) {
      throw new BadRequestException(
        'Terms and Privacy Policy must be accepted',
      );
    }

    // Generate verification token
    const verificationToken = nanoid(32);
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { recaptchaToken: _, ...userData } = createUserDto;

    // Create user with verification token
    const newUser = await this.userService.create({
      ...userData,
      verificationToken,
      verificationTokenExpiry,
      termsAcceptedAt: new Date(),
    });

    try {
      // Send verification email
      await this.emailService.sendVerificationEmail(
        newUser.email,
        verificationToken,
        newUser.username ?? '',
      );
    } catch (error) {
      // Log error but don't fail registration
      console.error('Failed to send verification email:', error);
    }

    // Return user data without tokens
    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      avatar: newUser.avatarUrl,
      emailVerified: newUser.emailVerified,
      message: 'Registration successful. Please verify your email.',
    };
  }

  // Verify reCAPTCHA token
  private async verifyRecaptcha(token: string) {
    const recaptchaSecret = this.configService.get<string>(
      'RECAPTCHA_SECRET_KEY',
    );
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';

    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${recaptchaSecret}&response=${token}`,
    });

    interface RecaptchaResponse {
      success: boolean;
      challenge_ts?: string;
      hostname?: string;
      score?: number;
      action?: string;
      'error-codes'?: string[];
    }

    const data = (await response.json()) as RecaptchaResponse;

    if (!data.success) {
      throw new BadRequestException('Invalid CAPTCHA');
    }
  }

  // Validate user service - Local
  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException('Invalid Credentials - Email not found!');

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Email not verified. Please check your inbox for the verification email.',
      );
    }

    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid Credentials!');

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatarUrl,
    };
  }

  // Verify email
  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const user = await this.userService.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (
      !user.verificationTokenExpiry ||
      user.verificationTokenExpiry < new Date()
    ) {
      throw new BadRequestException('Verification token has expired');
    }

    if (user.emailVerified) {
      return { message: 'Email already verified' };
    }

    await this.userService.markEmailAsVerified(user.id);
    return { message: 'Email verified successfully' };
  }

  // Resend verification email
  async resendVerificationEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new verification token
    const verificationToken = nanoid(32);
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.userService.updateVerificationToken(
      user.id,
      verificationToken,
      verificationTokenExpiry,
    );

    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.username ?? '',
    );

    return { message: 'Verification email sent successfully' };
  }

  // Login user service
  async loginUser(
    userId: string,
    email?: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    role?: Role,
    avatarUrl?: string,
  ) {
    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Email not verified. Please check your inbox for the verification email.',
      );
    }

    const { accessToken, refreshToken } = await this.generateJwtToken(userId);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      email: email || user.email,
      username: username || user.username,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      role: role || user.role,
      avatar: avatarUrl || user.avatarUrl,
      emailVerified: user.emailVerified,
      accessToken,
      refreshToken,
    };
  }

  // Generate JWT token service
  async generateJwtToken(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return { accessToken, refreshToken };
  }

  // Validate user service - JWT
  async validateJwtUser(userId: string) {
    const user = await this.userService.findByUserId(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatarUrl,
    };
  }

  // Validate refresh token service
  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findByUserId(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    if (!user.refreshToken)
      throw new UnauthorizedException('Refresh token missing!');
    const isRefreshTokenValid = await verify(user.refreshToken, refreshToken);
    if (!isRefreshTokenValid)
      throw new UnauthorizedException('Invalid Refresh Token!');
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatarUrl,
    };
  }

  // Refresh token service
  async refreshToken(
    userId: string,
    email?: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    role?: Role,
    avatarUrl?: string,
  ) {
    const { accessToken, refreshToken } = await this.generateJwtToken(userId);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
      role: role,
      avatar: avatarUrl,
      accessToken,
      refreshToken,
    };
  }

  // Google OAuth service
  async validateGoogleOAuthUser(googleUser: CreateUserDto) {
    try {
      // Check if user exists
      let user = await this.userService.findByEmail(googleUser.email);
      let isNewUser = false;

      if (user) {
        // If user exists but email not verified, mark it as verified
        if (user.emailVerified === false) {
          await this.userService.markEmailAsVerified(user.id);
          // Get updated user info
          user = await this.userService.findByEmail(googleUser.email);
        }

        return { user, isNewUser };
      } else {
        // Create new user with email already verified
        const randomPassword = nanoid(16);
        const hashedPassword = await hash(randomPassword);
        isNewUser = true;
        // Create new user with verification already done
        const newUser = await this.userService.create({
          ...googleUser,
          password: hashedPassword,
          emailVerified: true, // Auto-verify Google OAuth users
          termsAccepted: false, // Require explicit terms acceptance
          newsletterOptIn: false,
        });

        return { newUser, isNewUser };
      }
    } catch (error) {
      console.error(
        'Google OAuth user validation error',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Failed to authenticate with Google',
      );
    }
  }

  // Forgot password
  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Return success even if user not found for security reasons
      return {
        message:
          'If your email exists in our system, you will receive a password reset link.',
      };
    }

    // Generate reset token
    const pwdResetToken = nanoid(32);
    const pwdResetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await this.userService.updatePasswordResetToken(
      user.id,
      pwdResetToken,
      pwdResetTokenExpiry,
    );

    await this.emailService.sendPasswordResetEmail(
      user.email,
      pwdResetToken,
      user.username ?? '',
    );

    return {
      message:
        'If your email exists in our system, you will receive a password reset link.',
    };
  }

  // Reset password
  async resetPassword(token: string, password: string) {
    if (!token) {
      throw new BadRequestException('Reset token is required');
    }

    const user = await this.userService.findByPasswordResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    if (!user.pwdResetTokenExpiry || user.pwdResetTokenExpiry < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Hash the new password
    const hashedPassword = await hash(password);

    // Update user password and clear reset token
    await this.userService.updatePassword(user.id, hashedPassword);

    return { message: 'Password has been reset successfully' };
  }

  // Update user profile
  async updateUserProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    try {
      // Check if username already exists for another user
      if (updateProfileDto.username) {
        const existingUser = await this.userService.findByUsername(
          updateProfileDto.username,
        );

        if (existingUser && existingUser.id !== userId) {
          throw new ConflictException('Username is already taken');
        }
      }

      // Update the user profile
      const updatedUser = await this.userService.updateProfile(userId, {
        firstName: updateProfileDto.firstName,
        lastName: updateProfileDto.lastName,
        username: updateProfileDto.username,
        newsletterOptIn: updateProfileDto.newsletterOptIn,
      });

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        avatar: updatedUser.avatarUrl,
        emailVerified: updatedUser.emailVerified,
        newsletterOptIn: updatedUser.newsletterOptIn,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user profile');
    }
  }

  // Change user password
  async changeUserPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      // Find the user
      const user = await this.userService.findByUserId(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Verify current password
      const isPasswordValid = await verify(user.password, currentPassword);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Hash the new password
      const hashedPassword = await hash(newPassword);

      // Update the password
      await this.userService.updatePassword(userId, hashedPassword);

      return { message: 'Password changed successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error changing password');
    }
  }

  async acceptOAuthTerms(
    userId: string,
    termsAccepted: boolean,
    newsletterOptIn: boolean = false,
  ) {
    if (!termsAccepted) {
      throw new BadRequestException(
        'Terms and Privacy Policy must be accepted',
      );
    }

    try {
      const user = await this.userService.findByUserId(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userService.updateTermsAcceptance(
        userId,
        termsAccepted,
        newsletterOptIn,
      );

      return {
        message: 'Terms acceptance recorded successfully',
        success: true,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error recording terms acceptance',
      );
    }
  }

  // Unsubscribe from newsletter
  async unsubscribeFromNewsletter(token: string): Promise<void> {
    try {
      const payload = this.jwtService.verify<NewsletterUnsubscribePayload>(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      if (!payload || payload.purpose !== 'newsletter-unsubscribe') {
        throw new Error('Invalid unsubscribe token');
      }

      await this.userService.updateNewsletterPreference(payload.email, false);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Invalid or expired unsubscribe link');
    }
  }

  // Sign out service
  async signOut(userId: string) {
    return this.userService.updateHashedRefreshToken(userId, null);
  }
}
