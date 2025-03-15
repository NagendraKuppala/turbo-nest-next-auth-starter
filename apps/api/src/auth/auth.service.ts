import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateProfileDto } from '../user/dto/update-profile.dto';

import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';

import { hash, verify } from 'argon2';
import { nanoid } from 'nanoid';
import refreshConfig from './config/refresh.config';

import {
  AuthJwtPayload,
  NewsletterUnsubscribePayload,
} from './types/auth-jwtPayload';
import { AuthUserType, AuthUserResponse } from './types/auth-user';

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

  // HELPERs

  /**
   * Check if email or username already exists
   */
  private async validateUniqueUserFields(
    email: string,
    username: string,
  ): Promise<void> {
    const userEmailExists = await this.userService.findByEmail(email);
    if (userEmailExists) {
      throw new ConflictException('User email already exists!');
    }

    const userUsernameExists = await this.userService.findByUsername(username);
    if (userUsernameExists) {
      throw new ConflictException('Username already exists!');
    }
  }

  /**
   * Generate verification token with expiry
   */
  private generateVerificationToken(expiryHours = 24): {
    token: string;
    expiry: Date;
  } {
    return {
      token: nanoid(32),
      expiry: new Date(Date.now() + expiryHours * 60 * 60 * 1000),
    };
  }

  /**
   * Generate password reset token with expiry
   */
  private generatePasswordResetToken(expiryHours = 1): {
    token: string;
    expiry: Date;
  } {
    return {
      token: nanoid(32),
      expiry: new Date(Date.now() + expiryHours * 60 * 60 * 1000),
    };
  }

  /**
   * Map user entity to user response DTO
   */
  private mapUserToResponse(
    user: AuthUserType,
    includeTokens = false,
    tokens?: { accessToken?: string; refreshToken?: string },
  ): AuthUserResponse {
    const response = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      newsletterOptIn: user.newsletterOptIn,
    };

    if (includeTokens && tokens) {
      return { ...response, ...tokens };
    }

    return response;
  }

  // ====================================================
  // AUTHENTICATION METHODS
  // ====================================================

  async registerUser(createUserDto: CreateUserDto) {
    // Use the helper method to validate unique user fields
    await this.validateUniqueUserFields(
      createUserDto.email,
      createUserDto.username,
    );

    // Verify reCAPTCHA token
    await this.verifyRecaptcha(createUserDto.recaptchaToken!);

    if (!createUserDto.termsAccepted) {
      throw new BadRequestException(
        'Terms and Privacy Policy must be accepted',
      );
    }

    // Generate verification token using helper
    const { token: verificationToken, expiry: verificationTokenExpiry } =
      this.generateVerificationToken(24);

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

    // Return user data using helper
    return this.mapUserToResponse(newUser, false, {});
  }

  // Login user service
  async loginUser(authUser: AuthUserType): Promise<AuthUserResponse> {
    const { id } = authUser;
    const user = await this.userService.findByUserId(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Email not verified. Please check your inbox for the verification email.',
      );
    }

    const { accessToken, refreshToken } = await this.generateJwtToken(id);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(id, hashedRefreshToken);

    return this.mapUserToResponse(
      {
        ...authUser,
        emailVerified: user.emailVerified,
        newsletterOptIn: user.newsletterOptIn,
      },
      true,
      { accessToken, refreshToken },
    );
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

    return this.mapUserToResponse(user);
  }

  // Validate user service - JWT
  async validateJwtUser(userId: string) {
    const user = await this.userService.findByUserId(userId);
    if (!user) throw new UnauthorizedException('User not found!');

    return this.mapUserToResponse(user);
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

  // Validate refresh token service
  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findByUserId(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    if (!user.refreshToken)
      throw new UnauthorizedException('Refresh token missing!');
    const isRefreshTokenValid = await verify(user.refreshToken, refreshToken);
    if (!isRefreshTokenValid)
      throw new UnauthorizedException('Invalid Refresh Token!');

    return this.mapUserToResponse(user);
  }

  // Refresh token service
  async refreshToken(authUser: AuthUserType) {
    const { id } = authUser;
    const { accessToken, refreshToken } = await this.generateJwtToken(id);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(id, hashedRefreshToken);

    return this.mapUserToResponse(authUser, true, {
      accessToken,
      refreshToken,
    });
  }

  // ====================================================
  // OAUTH METHODS
  // ====================================================

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

  // ====================================================
  // EMAIL VERIFICATION METHODS
  // ====================================================

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

    // Generate new verification token using helper
    const { token: verificationToken, expiry: verificationTokenExpiry } =
      this.generateVerificationToken(24);

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

  // ====================================================
  // PASSWORD MANAGEMENT METHODS
  // ====================================================

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

    // Generate reset token using helper
    const { token: pwdResetToken, expiry: pwdResetTokenExpiry } =
      this.generatePasswordResetToken(1);

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

  // ====================================================
  // PROFILE MANAGEMENT METHODS
  // ====================================================

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

      return this.mapUserToResponse(updatedUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user profile');
    }
  }

  // ====================================================
  // UTILITIES
  // ====================================================

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
