import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...user } = createUserDto;
      const hashedPassword = await hash(password);
      return await this.prisma.user.create({
        data: {
          password: hashedPassword,
          ...user,
        },
      });
    } catch (error) {
      this.logger.error('Error creating user', (error as Error).stack);
      throw new InternalServerErrorException('Error creating user');
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
          role: true,
          refreshToken: true,
          avatarUrl: true, // Make sure avatarUrl is included in selection
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
          role: true,
          refreshToken: true,
          avatarUrl: true, // Make sure avatarUrl is included in selection
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
          role: true,
          refreshToken: true,
          avatarUrl: true, // Make sure avatarUrl is included in selection
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
}
