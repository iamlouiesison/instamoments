import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay for debugging
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  
  // Before send to filter sensitive data
  beforeSend(event) {
    // Remove sensitive information
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
    
    return event;
  },
  
  // Integrations
  integrations: [
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  
  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
});
