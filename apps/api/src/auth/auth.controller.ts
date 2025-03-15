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
import { ConfigService } from '@nestjs/config';
import { AuthUserType } from './types/auth-user.d';

interface AuthRequest {
  user: AuthUserType;
}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('signup')
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
  loginUser(@Request() req: AuthRequest) {
    return this.authService.loginUser(req.user);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req: AuthRequest) {
    return this.authService.refreshToken(req.user);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleLoginCallback(@Request() req: AuthRequest, @Res() res: Response) {
    try {
      const { needsTermsAcceptance, ...userData } = req.user;
      const userWithTokens = await this.authService.loginUser(userData);

      // Create a Record<string, string> object for URLSearchParams
      const paramsObject: Record<string, string> = {
        accessToken: userWithTokens.accessToken || '',
        refreshToken: userWithTokens.refreshToken || '',
        userId: userWithTokens.id,
        email: userWithTokens.email,
        username: userWithTokens.username || '',
        firstName: userWithTokens.firstName || '',
        lastName: userWithTokens.lastName || '',
        role: userWithTokens.role,
        avatar: userWithTokens.avatar || '',
        emailVerified: String(
          needsTermsAcceptance ? true : userWithTokens.emailVerified,
        ),
        newsletterOptIn: String(userWithTokens.newsletterOptIn),
      };

      if (needsTermsAcceptance) {
        paramsObject.needsTermsAcceptance = 'true';
      }

      const queryParams = new URLSearchParams(paramsObject);

      const redirectPath = needsTermsAcceptance
        ? '/auth/accept-terms'
        : '/api/auth/google/callback';

      return res.redirect(
        `${this.configService.get('FRONTEND_URL')}${redirectPath}?${queryParams.toString()}`,
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
  acceptOAuthTerms(@Body() acceptTermsDto: AcceptTermsDto) {
    return this.authService.acceptOAuthTerms(
      acceptTermsDto.userId,
      acceptTermsDto.termsAccepted,
      acceptTermsDto.newsletterOptIn,
    );
  }

  @Post('signout')
  signOut(@Request() req: AuthRequest) {
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
  updateProfile(
    @Request() req: AuthRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateUserProfile(req.user.id, updateProfileDto);
  }

  @Patch('updatePassword')
  updatePassword(
    @Request() req: AuthRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.changeUserPassword(
      req.user.id,
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword,
    );
  }

  @Public()
  @Get('unsubscribed')
  async unsubscribeNewsletter(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    try {
      await this.authService.unsubscribeFromNewsletter(token);
      return res.redirect(
        `${this.configService.get('FRONTEND_URL')}/auth/unsubscribed?success=true`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid unsubscribe link';
      return res.redirect(
        `${this.configService.get('FRONTEND_URL')}/auth/unsubscribed?success=false&error=${encodeURIComponent(
          errorMessage,
        )}`,
      );
    }
  }

  @Roles('ADMIN')
  @Get('admin/dashboard')
  adminRoute(@Request() req: AuthRequest) {
    return {
      message: `This route is protected by JWT. User ID: ${req.user.id} Email: ${req.user.email}`,
    };
  }

  @Get('profile')
  profileRoute(@Request() req: AuthRequest) {
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
