import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto & {
      verificationToken?: string;
      verificationTokenExpiry?: Date;
      emailVerified?: boolean;
      termsAcceptedAt?: Date;
    },
  ): Promise<User> {
    try {
      const {
        password,
        verificationToken,
        verificationTokenExpiry,
        emailVerified = false, // Default to false if not provided
        termsAccepted,
        newsletterOptIn = false,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        recaptchaToken,
        ...user
      } = createUserDto;

      const hashedPassword = await hash(password);
      return await this.prisma.user.create({
        data: {
          password: hashedPassword,
          ...user,
          verificationToken,
          verificationTokenExpiry,
          emailVerified,
          termsAccepted,
          termsAcceptedAt: termsAccepted ? new Date() : null, // Set to current date if accepted
          newsletterOptIn,
        },
      });
    } catch (error) {
      this.logger.error('Error creating user', (error as Error).stack);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async markEmailAsVerified(userId: string): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          emailVerified: true,
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });
    } catch (error) {
      this.logger.error(
        'Error marking email as verified',
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Error marking email as verified');
    }
  }

  async findByVerificationToken(token: string) {
    try {
      return await this.prisma.user.findFirst({
        where: { verificationToken: token },
      });
    } catch (error) {
      this.logger.error(
        'Error finding user by verification token',
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Error finding user by verification token',
      );
    }
  }

  async updateVerificationToken(userId: string, token: string, expiry: Date) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          verificationToken: token,
          verificationTokenExpiry: expiry,
        },
      });
    } catch (error) {
      this.logger.error(
        'Error updating verification token',
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Error updating verification token',
      );
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          password: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          refreshToken: true,
          avatar: true,
          emailVerified: true,
          verificationToken: true,
          verificationTokenExpiry: true,
          termsAccepted: true,
          newsletterOptIn: true,
        },
      });
    } catch (error) {
      this.logger.error('Error finding user by email', (error as Error).stack);
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

  async findByUsername(username: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
          email: true,
          password: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          refreshToken: true,
          avatar: true,
          emailVerified: true,
          verificationToken: true,
          verificationTokenExpiry: true,
          termsAccepted: true,
          newsletterOptIn: true,
        },
      });
    } catch (error) {
      this.logger.error(
        'Error finding user by username',
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Error finding user by username');
    }
  }

  async findByUserId(userId: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          password: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          refreshToken: true,
          avatar: true,
          emailVerified: true,
          verificationToken: true,
          verificationTokenExpiry: true,
          termsAccepted: true,
          newsletterOptIn: true,
        },
      });
    } catch (error) {
      this.logger.error('Error finding user by userId', (error as Error).stack);
      throw new InternalServerErrorException('Error finding user by userId');
    }
  }

  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async updatePasswordResetToken(userId: string, token: string, expiry: Date) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          pwdResetToken: token,
          pwdResetTokenExpiry: expiry,
        },
      });
    } catch (error) {
      this.logger.error(
        'Error updating password reset token',
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Error updating password reset token',
      );
    }
  }

  async findByPasswordResetToken(token: string) {
    try {
      return await this.prisma.user.findFirst({
        where: { pwdResetToken: token },
      });
    } catch (error) {
      this.logger.error(
        'Error finding user by reset token',
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Error finding user by reset token',
      );
    }
  }

  async updatePassword(userId: string, hashedPassword: string) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          pwdResetToken: null,
          pwdResetTokenExpiry: null,
        },
      });
    } catch (error) {
      this.logger.error('Error updating password', (error as Error).stack);
      throw new InternalServerErrorException('Error updating password');
    }
  }

  async updateProfile(
    userId: string,
    profileData: Partial<{
      firstName: string;
      lastName?: string;
      username: string;
      newsletterOptIn: boolean;
    }>,
  ) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: profileData,
      });
    } catch (error) {
      this.logger.error('Error updating user profile', (error as Error).stack);
      throw new InternalServerErrorException('Error updating user profile');
    }
  }

  async updateTermsAcceptance(
    userId: string,
    termsAccepted: boolean,
    newsletterOptIn: boolean = false,
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          termsAccepted,
          termsAcceptedAt: termsAccepted ? new Date() : null,
          newsletterOptIn,
        },
      });
    } catch (error) {
      this.logger.error(
        'Error updating terms acceptance',
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Error updating terms acceptance');
    }
  }

  async updateNewsletterPreference(
    email: string,
    preference: boolean,
  ): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      await this.prisma.user.update({
        where: { email },
        data: { newsletterOptIn: preference },
      });
    } catch (error) {
      this.logger.error(
        'Error updating newsletter preference',
        error instanceof Error ? error.stack : String(error),
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating newsletter preference',
      );
    }
  }
}
