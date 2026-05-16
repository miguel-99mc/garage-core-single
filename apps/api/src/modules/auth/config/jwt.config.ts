import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const jwtConfig = (config: ConfigService): JwtModuleOptions => {
  return {
    secret: config.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN') as any,
    },
  };
};
