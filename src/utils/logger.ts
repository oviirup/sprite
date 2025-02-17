import { PKG_NAME } from '@/const';
import pi from 'picocolors';

function customLogger(first: string | Function, ...rest: string[]) {
  return typeof first === 'function'
    ? console.log(first(`${PKG_NAME}:`), ...rest)
    : console.log(`${PKG_NAME}:`, first, ...rest);
}

export const logger = {
  log: (msg: string, ...rest: string[]) => customLogger(msg, ...rest),
  info: (...msg: string[]) => customLogger(pi.blue, ...msg),
  success: (...msg: string[]) => customLogger(pi.green, ...msg),
  warn: (...msg: string[]) => customLogger(pi.yellow, ...msg),
  error: (...msg: string[]) => customLogger(pi.red, ...msg),
};

export class SpriteError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'SpriteError';
    logger.error(message ?? 'error');
    Error.captureStackTrace(this, this.constructor); // Maintains proper stack trace
  }
}
