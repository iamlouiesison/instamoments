import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.APP_VERSION || '0.1.0',
  
  // Before send to filter sensitive data
  beforeSend(event) {
    // Remove sensitive information from server errors
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    
    // Remove auth tokens from headers
    if (event.request?.headers) {
      const headers = event.request.headers;
      if (headers.authorization) {
        headers.authorization = '[REDACTED]';
      }
      if (headers.cookie) {
        headers.cookie = '[REDACTED]';
      }
    }
    
    // Remove database connection strings
    if (event.message) {
      event.message = event.message.replace(
        /(postgresql:\/\/[^@]+@[^\/]+)/g,
        '[REDACTED_DB_URL]'
      );
    }
    
    return event;
  },
  
  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
});
