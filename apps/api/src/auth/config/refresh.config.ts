import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs('refresh-jwt', (): JwtSignOptions => {
  if (!process.env.REFRESH_JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return {
    secret: process.env.REFRESH_JWT_SECRET,
    expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
  };
});
