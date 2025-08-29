import { errorHandler } from './error-handling';
import { monitoringService } from './monitoring';
import { logger } from './logging';

// Initialize all services
export function initializeServices() {
  try {
    // Initialize error handling
    errorHandler.init();
    logger.info('Error handling service initialized');

    // Initialize monitoring
    monitoringService.init();
    logger.info('Monitoring service initialized');

    // Initialize logging
    logger.init();
    logger.info('Logging service initialized');

    logger.info('All services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize services:', error);
  }
}

// Cleanup services (for cleanup on unmount)
export function cleanupServices() {
  try {
    monitoringService.destroy();
    logger.info('Services cleaned up successfully');
  } catch (error) {
    console.error('Failed to cleanup services:', error);
  }
}

// Check if services are ready
export function areServicesReady(): boolean {
  return errorHandler['isInitialized'] && monitoringService['isInitialized'];
}
