'use client';

import { useEffect } from 'react';
import { initializeServices, cleanupServices } from '@/lib/init';

export function ServiceInitializer() {
  useEffect(() => {
    // Initialize services when component mounts
    try {
      initializeServices();
    } catch (error) {
      console.warn('Failed to initialize services:', error);
    }

    // Cleanup services when component unmounts
    return () => {
      try {
        cleanupServices();
      } catch (error) {
        console.warn('Failed to cleanup services:', error);
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
}
