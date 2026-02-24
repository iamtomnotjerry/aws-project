// Simple contextual logger for production visibility
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      level,
      message,
      ...(context && { context }),
    };

    if (process.env.NODE_ENV === 'production') {
      // In production, we log JSON for parsing by CloudWatch / Datadog
      console[level === 'debug' ? 'log' : level](JSON.stringify(payload));
    } else {
      // In development, pretty-print
      console[level === 'debug' ? 'log' : level](
        `[${timestamp}] [${level.toUpperCase()}] ${message}`,
        context ? JSON.stringify(context, null, 2) : ''
      );
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.log('error', message, {
      ...context,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, context);
    }
  }
}

export const logger = new Logger();
