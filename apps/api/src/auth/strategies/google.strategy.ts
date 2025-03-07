import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: googleConfig.clientId,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackUrl,
      scope: googleConfig.scope,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      if (!profile.emails?.length) {
        throw new UnauthorizedException('No email provided from Google OAuth!');
      }

      if (!profile.name) {
        throw new UnauthorizedException('No name provided from Google OAuth!');
      }

      if (!profile.photos?.length) {
        throw new UnauthorizedException(
          'No Avatar provided from Google OAuth!',
        );
      }

      const user = await this.authService.validateGoogleOAuthUser({
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        username: profile.displayName || profile.emails[0].value,
        avatarUrl: profile.photos[0].value,
        password: '',
      });

      if (!user) {
        throw new UnauthorizedException(
          'Failed to authenticate with Google OAuth!',
        );
      }

      done(null, {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        emailVerified: true, // Important: Mark as verified
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(
        'Failed to authenticate user via Google OAuth',
      );
    }
  }
}
