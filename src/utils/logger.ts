import pi from 'picocolors';
import { ZodError } from 'zod';

function customLogger(first: string | Function | null, ...rest: string[]) {
  rest = rest.map((msg) => pi.dim(`         ${msg}`));
  typeof first === 'function'
    ? console.log(first('[SPRITE]'), ...rest)
    : first === null
      ? console.log(...rest)
      : console.log('[SPRITE]', first, ...rest);
}

export const logger = {
  log: (first: string | Function | null, ...rest: string[]) => customLogger(first, ...rest),
  success: (...msg: string[]) => customLogger(pi.green, ...msg),
  warn: (...msg: string[]) => customLogger(pi.yellow, ...msg),
  error: (...msg: string[]) => customLogger(pi.red, ...msg),
  zodError: (errors: ZodError) => {
    for (const err of errors.errors) {
      customLogger(pi.red, err.message);
      customLogger(null, pi.dim(err.path.join(' 🞄 ')));
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
