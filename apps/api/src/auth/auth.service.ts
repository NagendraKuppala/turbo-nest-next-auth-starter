import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { hash, verify } from 'argon2';
import { UnauthorizedException } from '@nestjs/common';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  //SignUp user service
  async registerUser(createUserDto: CreateUserDto) {
    const userEmailExists = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (userEmailExists)
      throw new ConflictException('User email already exist!');

    const userUsernameExists = await this.userService.findByUsername(
      createUserDto.username,
    );
    if (userUsernameExists)
      throw new ConflictException('Username already exist!');

    const newUser = await this.userService.create(createUserDto);

    // Then generate and store tokens
    const { accessToken, refreshToken } = await this.generateJwtToken(
      newUser.id,
    );
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(
      newUser.id,
      hashedRefreshToken,
    );

    // Return user data with tokens
    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      avatar: newUser.avatarUrl,
      accessToken,
      refreshToken,
    };
  }

  // Validate user service - Local
  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException('Invalid Credentials - Email not found!');

    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid Credentials!');

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatarUrl,
    };
  }

  // Login user service
  async loginUser(
    userId: string,
    email?: string,
    username?: string,
    role?: Role,
    avatarUrl?: string,
  ) {
    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { accessToken, refreshToken } = await this.generateJwtToken(userId);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      email: email || user.email,
      username: username || user.username,
      role: role || user.role,
      avatar: avatarUrl || user.avatarUrl,
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
      role: user.role,
      avatar: user.avatarUrl,
    };
  }

  // Refresh token service
  async refreshToken(
    userId: string,
    email?: string,
    username?: string,
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
      role: role,
      avatar: avatarUrl,
      accessToken,
      refreshToken,
    };
  }

  // Google OAuth service
  async validateGoogleOAuthUser(googleUser: CreateUserDto) {
    // Implement Google OAuth service
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return this.userService.create(googleUser);
  }

  // Sign out service
  async signOut(userId: string) {
    return this.userService.updateHashedRefreshToken(userId, null);
  }
}
