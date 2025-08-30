import * as Sentry from '@sentry/nextjs';

// Error types for different scenarios
export enum ErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NETWORK = 'network',
  DATABASE = 'database',
  STORAGE = 'storage',
  CAMERA = 'camera',
  PWA = 'pwa',
  UNKNOWN = 'unknown',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error context interface
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  route?: string;
  userAgent?: string;
  timestamp: Date;
  errorType: ErrorType;
  severity: ErrorSeverity;
  metadata?: Record<string, any>;
}

// Main error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Initialize error handling
  init() {
    if (this.isInitialized) return;
    
    // Set up global error handlers
    this.setupGlobalHandlers();
    this.isInitialized = true;
  }

  // Handle and report errors
  handleError(
    error: Error | string,
    context: Partial<ErrorContext> = {}
  ): void {
    const errorContext: ErrorContext = {
      timestamp: new Date(),
      errorType: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      ...context,
    };

    // Determine error type and severity
    this.analyzeError(error, errorContext);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', error, errorContext);
    }

    // Report to Sentry
    this.reportToSentry(error, errorContext);

    // Log to local storage for offline debugging
    this.logToLocalStorage(error, errorContext);
  }

  // Analyze error to determine type and severity
  private analyzeError(error: Error | string, context: ErrorContext): void {
    const errorMessage = typeof error === 'string' ? error : error.message;
    // Note: errorStack is currently unused but kept for future analysis
    // const errorStack = typeof error === 'string' ? undefined : error.stack;

    // Determine error type based on message content
    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      context.errorType = ErrorType.VALIDATION;
      context.severity = ErrorSeverity.LOW;
    } else if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
      context.errorType = ErrorType.AUTHENTICATION;
      context.severity = ErrorSeverity.MEDIUM;
    } else if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
      context.errorType = ErrorType.AUTHORIZATION;
      context.severity = ErrorSeverity.HIGH;
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      context.errorType = ErrorType.NETWORK;
      context.severity = ErrorSeverity.MEDIUM;
    } else if (errorMessage.includes('database') || errorMessage.includes('sql')) {
      context.errorType = ErrorType.DATABASE;
      context.severity = ErrorSeverity.HIGH;
    } else if (errorMessage.includes('storage') || errorMessage.includes('upload')) {
      context.errorType = ErrorType.STORAGE;
      context.severity = ErrorSeverity.MEDIUM;
    } else if (errorMessage.includes('camera') || errorMessage.includes('getUserMedia')) {
      context.errorType = ErrorType.CAMERA;
      context.severity = ErrorSeverity.MEDIUM;
    } else if (errorMessage.includes('service worker') || errorMessage.includes('pwa')) {
      context.errorType = ErrorType.PWA;
      context.severity = ErrorSeverity.MEDIUM;
    }

    // Adjust severity based on context
    if (context.route?.includes('/auth') && context.errorType === ErrorType.AUTHENTICATION) {
      context.severity = ErrorSeverity.CRITICAL;
    }
  }

  // Report error to Sentry
  private reportToSentry(error: Error | string, context: ErrorContext): void {
    try {
      if (typeof error === 'string') {
        Sentry.captureMessage(error, {
          level: this.mapSeverityToSentryLevel(context.severity),
          tags: {
            errorType: context.errorType,
            severity: context.severity,
            route: context.route,
          },
          extra: {
            ...context,
            timestamp: context.timestamp.toISOString(),
          },
        });
      } else {
        Sentry.captureException(error, {
          tags: {
            errorType: context.errorType,
            severity: context.severity,
            route: context.route,
          },
          extra: {
            ...context,
            timestamp: context.timestamp.toISOString(),
          },
        });
      }
    } catch (sentryError) {
      // Fallback to console if Sentry fails
      console.error('Failed to report to Sentry:', sentryError);
    }
  }

  // Map internal severity to Sentry levels
  private mapSeverityToSentryLevel(severity: ErrorSeverity): Sentry.SeverityLevel {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'info';
      case ErrorSeverity.MEDIUM:
        return 'warning';
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.CRITICAL:
        return 'fatal';
      default:
        return 'error';
    }
  }

  // Log error to local storage for offline debugging
  private logToLocalStorage(error: Error | string, context: ErrorContext): void {
    try {
      if (typeof window === 'undefined') return;

      const errorLog = {
        message: typeof error === 'string' ? error : error.message,
        stack: typeof error === 'string' ? undefined : error.stack,
        ...context,
        timestamp: context.timestamp.toISOString(),
      };

      const existingLogs = this.getLocalErrorLogs();
      existingLogs.push(errorLog);

      // Keep only last 100 errors
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }

      localStorage.setItem('instamoments_error_logs', JSON.stringify(existingLogs));
    } catch (storageError) {
      // Ignore storage errors
      console.warn('Failed to log error to localStorage:', storageError);
    }
  }

  // Get error logs from local storage
  getLocalErrorLogs(): any[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const logs = localStorage.getItem('instamoments_error_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  // Clear local error logs
  clearLocalErrorLogs(): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem('instamoments_error_logs');
    } catch {
      // Ignore storage errors
    }
  }

  // Set up global error handlers
  private setupGlobalHandlers(): void {
    if (typeof window === 'undefined') return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          errorType: ErrorType.UNKNOWN,
          severity: ErrorSeverity.HIGH,
          metadata: { reason: event.reason },
        }
      );
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        errorType: ErrorType.UNKNOWN,
        severity: ErrorSeverity.HIGH,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });
  }

  // Create user-friendly error messages
  getUserFriendlyMessage(error: Error | string, context: ErrorContext): string {
    // Note: errorMessage is currently unused but kept for future customization
    // const errorMessage = typeof error === 'string' ? error : error.message;

    switch (context.errorType) {
      case ErrorType.VALIDATION:
        return 'Please check your input and try again.';
      case ErrorType.AUTHENTICATION:
        return 'Please log in to continue.';
      case ErrorType.AUTHORIZATION:
        return 'You don\'t have permission to perform this action.';
      case ErrorType.NETWORK:
        return 'Network error. Please check your connection and try again.';
      case ErrorType.DATABASE:
        return 'Service temporarily unavailable. Please try again later.';
      case ErrorType.STORAGE:
        return 'Unable to save your data. Please try again.';
      case ErrorType.CAMERA:
        return 'Camera access is required. Please allow camera permissions.';
      case ErrorType.PWA:
        return 'App error. Please refresh the page and try again.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  // Check if error is recoverable
  isRecoverable(context: ErrorContext): boolean {
    return context.severity !== ErrorSeverity.CRITICAL;
  }

  // Get error recovery suggestions
  getRecoverySuggestions(context: ErrorContext): string[] {
    const suggestions: string[] = [];

    switch (context.errorType) {
      case ErrorType.VALIDATION:
        suggestions.push('Check all required fields are filled');
        suggestions.push('Ensure data format is correct');
        break;
      case ErrorType.AUTHENTICATION:
        suggestions.push('Try logging in again');
        suggestions.push('Check your credentials');
        break;
      case ErrorType.NETWORK:
        suggestions.push('Check your internet connection');
        suggestions.push('Try again in a few moments');
        break;
      case ErrorType.CAMERA:
        suggestions.push('Allow camera permissions in browser settings');
        suggestions.push('Try refreshing the page');
        break;
      case ErrorType.PWA:
        suggestions.push('Refresh the page');
        suggestions.push('Clear browser cache and try again');
        break;
      default:
        suggestions.push('Try refreshing the page');
        suggestions.push('Contact support if the problem persists');
    }

    return suggestions;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error scenarios
export const handleValidationError = (error: Error, field?: string) => {
  errorHandler.handleError(error, {
    errorType: ErrorType.VALIDATION,
    severity: ErrorSeverity.LOW,
    metadata: { field },
  });
};

export const handleAuthError = (error: Error, userId?: string) => {
  errorHandler.handleError(error, {
    errorType: ErrorType.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    userId,
  });
};

export const handleNetworkError = (error: Error, endpoint?: string) => {
  errorHandler.handleError(error, {
    errorType: ErrorType.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    metadata: { endpoint },
  });
};

export const handleDatabaseError = (error: Error, operation?: string) => {
  errorHandler.handleError(error, {
    errorType: ErrorType.DATABASE,
    severity: ErrorSeverity.HIGH,
    metadata: { operation },
  });
};

export const handleCameraError = (error: Error, action?: string) => {
  errorHandler.handleError(error, {
    errorType: ErrorType.CAMERA,
    severity: ErrorSeverity.MEDIUM,
    metadata: { action },
  });
};

// React hook for error handling
export const useErrorHandler = () => {
  return {
    handleError: errorHandler.handleError.bind(errorHandler),
    getUserFriendlyMessage: errorHandler.getUserFriendlyMessage.bind(errorHandler),
    isRecoverable: errorHandler.isRecoverable.bind(errorHandler),
    getRecoverySuggestions: errorHandler.getRecoverySuggestions.bind(errorHandler),
  };
};
