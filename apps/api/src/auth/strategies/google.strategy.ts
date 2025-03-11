import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

// Define these interfaces at the module level so they can be exported if needed
interface UserWithTermsAccepted {
  id: string;
  email: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  role: string;
  avatarUrl: string | null;
  termsAccepted: boolean;
}

interface UserResult {
  user: UserWithTermsAccepted;
  isNewUser: boolean;
}

interface NewUserResult {
  newUser: UserWithTermsAccepted;
  isNewUser: boolean;
}

//type GoogleOAuthResult = UserWithTermsAccepted | UserResult | NewUserResult;

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

      const result = await this.authService.validateGoogleOAuthUser({
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        username: profile.displayName || profile.emails[0].value,
        avatarUrl: profile.photos[0].value,
        password: '',
        termsAccepted: false, // Google OAuth users need explicit terms acceptance
        newsletterOptIn: false, // Default to false for OAuth users
        recaptchaToken: 'google-oauth', // Not needed for OAuth users
        emailVerified: true, // OAuth users are pre-verified
      });

      // Extract user data from result based on its structure
      let userData: UserWithTermsAccepted;
      let isNewUser = false;

      // Type guards for the different result structures
      const isNewUserResult = (obj: unknown): obj is NewUserResult =>
        obj !== null &&
        typeof obj === 'object' &&
        'newUser' in obj &&
        'isNewUser' in obj;

      const isUserResult = (obj: unknown): obj is UserResult =>
        obj !== null &&
        typeof obj === 'object' &&
        'user' in obj &&
        'isNewUser' in obj;

      const isDirectUser = (obj: unknown): obj is UserWithTermsAccepted =>
        obj !== null &&
        typeof obj === 'object' &&
        'id' in obj &&
        'email' in obj &&
        'termsAccepted' in obj;

      // Extract user data based on result structure
      if (isNewUserResult(result)) {
        userData = result.newUser;
        isNewUser = result.isNewUser;
      } else if (isUserResult(result)) {
        userData = result.user;
        isNewUser = result.isNewUser;
      } else if (isDirectUser(result)) {
        userData = result;
      } else {
        throw new UnauthorizedException(
          'Invalid user data from Google OAuth authentication',
        );
      }

      if (!userData) {
        throw new UnauthorizedException(
          'Failed to authenticate with Google OAuth!',
        );
      }

      const needsTermsAcceptance = !userData.termsAccepted;

      done(null, {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        avatarUrl: userData.avatarUrl,
        emailVerified: true, // OAuth users are pre-verified
        needsTermsAcceptance, // Flag to indicate if terms need acceptance
        isNewUser,
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
