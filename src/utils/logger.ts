import pi from 'picocolors';
import { ZodError } from 'zod';

function customLogger(first: string | Function, ...rest: string[]) {
  return typeof first === 'function'
    ? console.log(first('[SPRITE]'), ...rest)
    : console.log('[SPRITE]', first, ...rest);
}

export const logger = {
  log: (msg: string, ...rest: string[]) => customLogger(msg, ...rest),
  success: (...msg: string[]) => customLogger(pi.green, ...msg),
  warn: (...msg: string[]) => customLogger(pi.yellow, ...msg),
  error: (...msg: string[]) => customLogger(pi.red, ...msg),
  zodError: (errors: ZodError) => {
    for (const err of errors.errors) {
      customLogger(pi.red, err.message);
    }
  },
};

export class SpriteError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'SpriteError';
    logger.error(message ?? 'error');
    Error.captureStackTrace(this, this.constructor); // Maintains proper stack trace
  }
}
