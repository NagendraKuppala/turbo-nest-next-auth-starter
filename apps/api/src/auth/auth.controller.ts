import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Res,
  Query,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateProfileDto } from '../user/dto/update-profile.dto';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';
import { AcceptTermsDto } from '../user/dto/accept-terms.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { Request, UseGuards } from '@nestjs/common';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(200)
  resendVerificationEmail(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  loginUser(
    @Request()
    req: {
      user: {
        id: string;
        email?: string;
        username?: string;
        firstName?: string;
        lastName?: string;
        role?: Role;
        avatarUrl?: string;
      };
    },
  ) {
    return this.authService.loginUser(
      req.user.id,
      req.user.email,
      req.user.username,
      req.user.firstName,
      req.user.lastName,
      req.user.role,
      req.user.avatarUrl,
    );
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(
    @Request()
    req: {
      user: {
        id: string;
        email?: string;
        username?: string;
        firstName?: string;
        lastName?: string;
        role?: Role;
        avatarUrl?: string;
      };
    },
  ) {
    return this.authService.refreshToken(
      req.user.id,
      req.user.email,
      req.user.username,
      req.user.firstName,
      req.user.lastName,
      req.user.role,
      req.user.avatarUrl,
    );
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleLoginCallback(
    @Request()
    req: {
      user: {
        id: string;
        email?: string;
        username?: string;
        firstName?: string;
        lastName?: string;
        role?: Role;
        avatarUrl?: string;
        emailVerified?: boolean;
        needsTermsAcceptance?: boolean;
      };
    },
    @Res() res: Response,
  ) {
    try {
      const { needsTermsAcceptance, ...userData } = req.user;
      const tokens = await this.authService.loginUser(
        userData.id,
        userData.email,
        userData.username,
        userData.firstName,
        userData.lastName,
        userData.role,
        userData.avatarUrl,
      );

      // If user hasn't accepted terms, redirect to terms page
      if (needsTermsAcceptance) {
        const queryParams = new URLSearchParams({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          userId: tokens.id,
          email: tokens.email,
          username: tokens.username || '',
          firstName: tokens.firstName || '',
          lastName: tokens.lastName || '',
          role: tokens.role,
          avatar: tokens.avatar || '',
          emailVerified: String(true),
          needsTermsAcceptance: 'true',
        });

        return res.redirect(
          `${this.configService.get('FRONTEND_URL')}/auth/accept-terms?${queryParams.toString()}`,
        );
      }

      // If user has already accepted terms, redirect to callback as normal
      const queryParams = new URLSearchParams({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: tokens.id,
        email: tokens.email,
        username: tokens.username || '',
        firstName: tokens.firstName || '',
        lastName: tokens.lastName || '',
        role: tokens.role,
        avatar: tokens.avatar || '',
        emailVerified: String(tokens.emailVerified),
      });
      return res.redirect(
        `${this.configService.get('FRONTEND_URL')}/api/auth/google/callback?${queryParams.toString()}`,
      );
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      return res.redirect(
        `${this.configService.get('FRONTEND_URL')}/auth/signin?error=oauth_failed`,
      );
    }
  }

  @Public()
  @Post('oauth/accept-terms')
  async acceptOAuthTerms(@Body() acceptTermsDto: AcceptTermsDto) {
    return this.authService.acceptOAuthTerms(
      acceptTermsDto.userId,
      acceptTermsDto.termsAccepted,
      acceptTermsDto.newsletterOptIn,
    );
  }

  @Post('signout')
  signOut(@Request() req: { user: { id: string } }) {
    return this.authService.signOut(req.user.id);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @Patch('updateProfile')
  async updateProfile(
    @Request() req: { user: { id: string } },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateUserProfile(req.user.id, updateProfileDto);
  }

  @Patch('updatePassword')
  async updatePassword(
    @Request() req: { user: { id: string } },
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.changeUserPassword(
      req.user.id,
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword,
    );
  }

  @Roles('ADMIN')
  @Get('admin/dashboard')
  adminRoute(@Request() req: { user: { id: string; email?: string } }) {
    return {
      message: `This route is protected by JWT. User ID: ${req.user.id} Email: ${req.user.email}`,
    };
  }

  @Get('profile')
  profileRoute(@Request() req: { user: { id: string; email?: string } }) {
    return {
      message: `This route is protected by JWT. User ID: ${req.user.id} Email: ${req.user.email}`,
    };
  }

  @Public()
  @Get('posts')
  postRoute() {
    return {
      message: `This route is public. You can access Posts page without authentication.`,
    };
  }
}
