import { registerAs } from '@nestjs/config';

export default registerAs('google-oauth', () => {
  if (!process.env.GOOGLE_OAUTH_CLIENT_ID) {
    throw new Error('GOOGLE_OAUTH_CLIENT_ID environment variable is not set');
  }

  if (!process.env.GOOGLE_OAUTH_CLIENT_SECRET) {
    throw new Error(
      'GOOGLE_OAUTH_CLIENT_SECRET environment variable is not set',
    );
  }

  if (!process.env.GOOGLE_OAUTH_CALLBACK_URL) {
    throw new Error(
      'GOOGLE_OAUTH_CALLBACK_URL environment variable is not set',
    );
  }

  if (!process.env.GOOGLE_OAUTH_SCOPE) {
    throw new Error('GOOGLE_OAUTH_SCOPE environment variable is not set');
  }

  return {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_OAUTH_CALLBACK_URL,
    scope: process.env.GOOGLE_OAUTH_SCOPE,
  };
});
