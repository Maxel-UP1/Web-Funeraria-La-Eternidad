import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET ?? 'fallback-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret',
  expiration: process.env.JWT_EXPIRATION ?? '15m',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION ?? '7d',
}));
