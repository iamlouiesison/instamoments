'use client';

import { useEffect } from 'react';

export function BasicServiceInitializer() {
  useEffect(() => {
    // Initialize basic services when component mounts
    try {
      // Set up basic global error handlers
      if (typeof window !== 'undefined') {
        const handleError = (event: ErrorEvent) => {
          console.error('Global error caught:', event.error);
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
          console.error('Unhandled promise rejection:', event.reason);
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        // Cleanup function
        return () => {
          window.removeEventListener('error', handleError);
          window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
      }
    } catch (error) {
      console.warn('Failed to initialize basic services:', error);
    }
  }, []);

  // This component doesn't render anything
  return null;
}
