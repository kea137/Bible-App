/**
 * Secure Logger
 * 
 * A production-safe logging utility that only logs in development mode
 * and sanitizes potentially sensitive information.
 */

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development' || (typeof __DEV__ !== 'undefined' && __DEV__);

/**
 * Sanitize data to remove sensitive information
 */
function sanitize(data: any): any {
  if (typeof data === 'string') {
    // Remove potential tokens, passwords, etc.
    return data.replace(/Bearer\s+[^\s]+/gi, 'Bearer [REDACTED]')
               .replace(/"password"\s*:\s*"[^"]*"/gi, '"password":"[REDACTED]"')
               .replace(/"token"\s*:\s*"[^"]*"/gi, '"token":"[REDACTED]"');
  }
  return data;
}

/**
 * Production-safe logger
 */
export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args.map(sanitize));
    }
  },

  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args.map(sanitize));
    }
  },

  warn: (...args: any[]) => {
    // Always log warnings, but sanitize
    console.warn(...args.map(sanitize));
  },

  error: (...args: any[]) => {
    // Always log errors, but sanitize
    console.error(...args.map(sanitize));
  },

  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args.map(sanitize));
    }
  },
};
