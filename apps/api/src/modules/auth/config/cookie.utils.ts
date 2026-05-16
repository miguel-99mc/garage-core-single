import { CookieOptions, Response } from 'express';
import { baseCookieOptions } from './cookie.config';

export function setCookie(res: Response, name: string, value: string, options?: CookieOptions) {
  res.cookie(name, value, {
    ...baseCookieOptions,
    ...options,
  });
}

export function clearCookie(res: Response, name: string) {
  res.clearCookie(name, baseCookieOptions);
}
