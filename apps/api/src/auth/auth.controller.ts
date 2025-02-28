import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { Request, UseGuards } from '@nestjs/common';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  loginUser(
    @Request()
    req: {
      user: { id: string; email?: string; username?: string; role?: Role };
    },
  ) {
    return this.authService.loginUser(
      req.user.id,
      req.user.email,
      req.user.username,
      req.user.role,
    );
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req: { user: { id: string; email?: string } }) {
    return this.authService.refreshToken(req.user.id, req.user.email);
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
      user: { id: string; email?: string; username?: string; role?: Role };
    },
    @Res() res: Response,
  ) {
    const response = await this.authService.loginUser(
      req.user.id,
      req.user.email,
      req.user.username,
      req.user.role,
    );
    const frontendUrl = process.env.FRONTEND_URL;
    res.redirect(
      `${frontendUrl}/api/auth/google/callback?accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&userId=${response.id}&email=${response.email}&username=${response.username}&role=${response.role}`,
    );
  }

  @Post('signout')
  signOut(@Request() req: { user: { id: string } }) {
    return this.authService.signOut(req.user.id);
  }

  @Roles('ADMIN')
  @Get('posts')
  protectedRoute(@Request() req: { user: { id: string; email?: string } }) {
    return {
      message: `This route is protected by JWT. User ID: ${req.user.id} Email: ${req.user.email}`,
    };
  }
}
