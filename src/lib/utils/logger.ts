/**
 * Logger Utility
 * 
 * Provides safe logging that only outputs in development mode.
 * In production, logs are suppressed to avoid exposing sensitive information.
 */

const isDevelopment = __DEV__;

type LogLevel = 'log' | 'info' | 'warn' | 'error';

/**
 * Safe logger that only logs in development
 */
class Logger {
  private log(level: LogLevel, ...args: any[]): void {
    if (isDevelopment) {
      console[level](...args);
    }
  }

  debug(...args: any[]): void {
    this.log('log', ...args);
  }

  info(...args: any[]): void {
    this.log('info', ...args);
  }

  warn(...args: any[]): void {
    this.log('warn', ...args);
  }

  /**
   * Error logging is always enabled, even in production,
   * but we sanitize the output to avoid leaking sensitive data
   */
  error(...args: any[]): void {
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, log errors without potentially sensitive details
      console.error('[Error occurred]');
    }
  }
}

export const logger = new Logger();
