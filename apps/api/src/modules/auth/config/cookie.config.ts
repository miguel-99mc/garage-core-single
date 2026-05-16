import { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  path: '/',
};
