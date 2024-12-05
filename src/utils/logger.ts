import pi from 'picocolors';
import { ZodError } from 'zod';

function customLogger(first: string | Function | null, ...rest: string[]) {
  if (typeof first === 'function') {
    return console.log(first('[SPRITE]'), ...rest);
  } else if (first === null) {
    return console.log('        ', ...rest);
  }
  return console.log('[SPRITE]', first, ...rest);
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
