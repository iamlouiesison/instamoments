import * as Sentry from '@sentry/nextjs';

// Performance metrics interface
export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToFirstByte: number;
  domContentLoaded: number;
  windowLoad: number;
}

// Health check interface
export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  checks: {
    database: boolean;
    storage: boolean;
    auth: boolean;
    api: boolean;
  };
  responseTime: number;
  errors: string[];
}

// Monitoring configuration
export interface MonitoringConfig {
  enablePerformanceTracking: boolean;
  enableHealthChecks: boolean;
  enableUptimeMonitoring: boolean;
  healthCheckInterval: number; // milliseconds
  performanceThresholds: Partial<PerformanceMetrics>;
}

// Default monitoring configuration
const DEFAULT_CONFIG: MonitoringConfig = {
  enablePerformanceTracking: true,
  enableHealthChecks: true,
  enableUptimeMonitoring: true,
  healthCheckInterval: 30000, // 30 seconds
  performanceThresholds: {
    pageLoadTime: 3000,
    firstContentfulPaint: 1800,
    largestContentfulPaint: 2500,
    firstInputDelay: 100,
    cumulativeLayoutShift: 0.1,
    timeToFirstByte: 800,
  },
};

// Main monitoring class
export class MonitoringService {
  private static instance: MonitoringService;
  private config: MonitoringConfig;
  private healthCheckInterval?: NodeJS.Timeout;
  private isInitialized = false;
  private performanceObserver?: PerformanceObserver;
  private navigationObserver?: PerformanceObserver;

  private constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  static getInstance(config?: Partial<MonitoringConfig>): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService(config);
    }
    return MonitoringService.instance;
  }

  // Initialize monitoring service
  init(): void {
    if (this.isInitialized) return;

    if (this.config.enablePerformanceTracking) {
      this.initPerformanceTracking();
    }

    if (this.config.enableHealthChecks) {
      this.initHealthChecks();
    }

    if (this.config.enableUptimeMonitoring) {
      this.initUptimeMonitoring();
    }

    this.isInitialized = true;
  }

  // Initialize performance tracking
  private initPerformanceTracking(): void {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    this.trackCoreWebVitals();

    // Track custom performance metrics
    this.trackCustomMetrics();

    // Track navigation performance
    this.trackNavigationPerformance();
  }

  // Track Core Web Vitals
  private trackCoreWebVitals(): void {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'paint') {
              const paintEntry = entry as PerformancePaintTiming;
              if (paintEntry.name === 'first-contentful-paint') {
                this.recordMetric('firstContentfulPaint', paintEntry.startTime);
              }
            }
          }
        });
        this.performanceObserver.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('Failed to observe paint timing:', error);
      }
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('largestContentfulPaint', entry.startTime);
          }
        });
        lcpObserver.observe({ entryType: 'largest-contentful-paint' });
      } catch (error) {
        console.warn('Failed to observe LCP:', error);
      }
    }

    // First Input Delay
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('firstInputDelay', entry.processingStart - entry.startTime);
          }
        });
        fidObserver.observe({ entryType: 'first-input' });
      } catch (error) {
        console.warn('Failed to observe FID:', error);
      }
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
          this.recordMetric('cumulativeLayoutShift', clsValue);
        });
        clsObserver.observe({ entryType: 'layout-shift' });
      } catch (error) {
        console.warn('Failed to observe CLS:', error);
      }
    }
  }

  // Track custom performance metrics
  private trackCustomMetrics(): void {
    if (typeof window === 'undefined') return;

    // Page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.recordMetric('pageLoadTime', loadTime);
      this.recordMetric('windowLoad', loadTime);
    });

    // DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
      const domReadyTime = performance.now();
      this.recordMetric('domContentLoaded', domReadyTime);
    });

    // Time to first byte
    if (performance.getEntriesByType('navigation').length > 0) {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.recordMetric('timeToFirstByte', navigationEntry.responseStart - navigationEntry.requestStart);
    }
  }

  // Track navigation performance
  private trackNavigationPerformance(): void {
    if (typeof window === 'undefined') return;

    // Track route changes in Next.js
    let currentPath = window.location.pathname;
    
    const observeRouteChange = () => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        this.trackRouteChange(currentPath, newPath);
        currentPath = newPath;
      }
    };

    // Use MutationObserver to detect route changes
    const observer = new MutationObserver(observeRouteChange);
    observer.observe(document.body, { childList: true, subtree: true });

    // Also listen to popstate events
    window.addEventListener('popstate', observeRouteChange);
  }

  // Record a performance metric
  private recordMetric(name: string, value: number): void {
    // Send to Sentry for performance monitoring (using captureMessage instead of metrics)
    Sentry.captureMessage(`Performance Metric: ${name} = ${value}ms`, {
      level: 'info',
      tags: { metric: name, value: value.toString() },
    });

    // Check against thresholds
    const threshold = this.config.performanceThresholds[name as keyof PerformanceMetrics];
    if (threshold && value > threshold) {
      Sentry.captureMessage(`Performance threshold exceeded: ${name} = ${value}ms`, {
        level: 'warning',
        tags: { metric: name, value: value.toString() },
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}:`, value);
    }
  }

  // Track route change
  private trackRouteChange(from: string, to: string): void {
    const navigationStart = performance.now();
    
    // Record navigation timing
    Sentry.captureMessage('Route change detected', {
      level: 'info',
      tags: { from, to },
    });
    
    // Track navigation performance
    setTimeout(() => {
      const navigationTime = performance.now() - navigationStart;
      this.recordMetric('routeChangeTime', navigationTime);
    }, 100);
  }

  // Initialize health checks
  private initHealthChecks(): void {
    if (typeof window === 'undefined') return;

    // Run initial health check
    this.runHealthCheck();

    // Set up periodic health checks
    this.healthCheckInterval = setInterval(() => {
      this.runHealthCheck();
    }, this.config.healthCheckInterval);
  }

  // Run health check
  private async runHealthCheck(): Promise<void> {
    const startTime = Date.now();
    const healthCheck: HealthCheck = {
      status: 'healthy',
      timestamp: new Date(),
      checks: {
        database: false,
        storage: false,
        auth: false,
        api: false,
      },
      responseTime: 0,
      errors: [],
    };

    try {
      // Check API health
      const apiHealth = await this.checkApiHealth();
      healthCheck.checks.api = apiHealth.healthy;
      if (!apiHealth.healthy) {
        healthCheck.errors.push(`API: ${apiHealth.error}`);
      }

      // Check database connectivity (via API)
      const dbHealth = await this.checkDatabaseHealth();
      healthCheck.checks.database = dbHealth.healthy;
      if (!dbHealth.healthy) {
        healthCheck.errors.push(`Database: ${dbHealth.error}`);
      }

      // Check storage health
      const storageHealth = await this.checkStorageHealth();
      healthCheck.checks.storage = storageHealth.healthy;
      if (!storageHealth.healthy) {
        healthCheck.errors.push(`Storage: ${storageHealth.error}`);
      }

      // Check auth service
      const authHealth = await this.checkAuthHealth();
      healthCheck.checks.auth = authHealth.healthy;
      if (!authHealth.healthy) {
        healthCheck.errors.push(`Auth: ${authHealth.error}`);
      }

      // Determine overall status
      const healthyChecks = Object.values(healthCheck.checks).filter(Boolean).length;
      const totalChecks = Object.keys(healthCheck.checks).length;
      
      if (healthyChecks === totalChecks) {
        healthCheck.status = 'healthy';
      } else if (healthyChecks >= totalChecks * 0.5) {
        healthCheck.status = 'degraded';
      } else {
        healthCheck.status = 'unhealthy';
      }

    } catch (error) {
      healthCheck.status = 'unhealthy';
      healthCheck.errors.push(`Health check failed: ${error}`);
    } finally {
      healthCheck.responseTime = Date.now() - startTime;
      
      // Report health status to Sentry
      this.reportHealthStatus(healthCheck);
      
      // Store health status locally
      this.storeHealthStatus(healthCheck);
    }
  }

  // Check API health
  private async checkApiHealth(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const response = await fetch('/api/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        return { healthy: true };
      } else {
        return { healthy: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  // Check database health
  private async checkDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const response = await fetch('/api/health/database', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        return { healthy: true };
      } else {
        return { healthy: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  // Check storage health
  private async checkStorageHealth(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const response = await fetch('/api/health/storage', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        return { healthy: true };
      } else {
        return { healthy: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  // Check auth health
  private async checkAuthHealth(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const response = await fetch('/api/health/auth', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        return { healthy: true };
      } else {
        return { healthy: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  // Report health status to Sentry
  private reportHealthStatus(healthCheck: HealthCheck): void {
    // Send health metrics to Sentry
    Sentry.captureMessage(`Health check status: ${healthCheck.status}`, {
      level: healthCheck.status === 'unhealthy' ? 'error' : 'warning',
      tags: { 
        healthStatus: healthCheck.status,
        responseTime: healthCheck.responseTime.toString(),
      },
      extra: healthCheck,
    });
  }

  // Store health status locally
  private storeHealthStatus(healthCheck: HealthCheck): void {
    try {
      if (typeof window === 'undefined') return;

      const healthHistory = this.getHealthHistory();
      healthHistory.push(healthCheck);

      // Keep only last 100 health checks
      if (healthHistory.length > 100) {
        healthHistory.splice(0, healthHistory.length - 100);
      }

      localStorage.setItem('instamoments_health_history', JSON.stringify(healthHistory));
    } catch (error) {
      console.warn('Failed to store health status:', error);
    }
  }

  // Get health history from local storage
  getHealthHistory(): HealthCheck[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const history = localStorage.getItem('instamoments_health_history');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  // Initialize uptime monitoring
  private initUptimeMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.recordUptimeEvent('page_hidden');
      } else {
        this.recordUptimeEvent('page_visible');
      }
    });

    // Track online/offline status
    window.addEventListener('online', () => {
      this.recordUptimeEvent('connection_online');
    });

    window.addEventListener('offline', () => {
      this.recordUptimeEvent('connection_offline');
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.recordUptimeEvent('page_unload');
    });
  }

  // Record uptime event
  private recordUptimeEvent(event: string): void {
    Sentry.captureMessage(`Uptime event: ${event}`, {
      level: 'info',
      tags: { event },
    });
  }

  // Get current performance metrics
  getPerformanceMetrics(): Partial<PerformanceMetrics> {
    if (typeof window === 'undefined') return {};

    const metrics: Partial<PerformanceMetrics> = {};

    // Get navigation timing
    if (performance.getEntriesByType('navigation').length > 0) {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      metrics.timeToFirstByte = navigationEntry.responseStart - navigationEntry.requestStart;
      metrics.domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart;
      metrics.windowLoad = navigationEntry.loadEventEnd - navigationEntry.loadEventStart;
    }

    // Get paint timing
    const paintEntries = performance.getEntriesByType('paint');
    for (const entry of paintEntries) {
      if (entry.name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = entry.startTime;
      }
    }

    return metrics;
  }

  // Cleanup monitoring service
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    if (this.navigationObserver) {
      this.navigationObserver.disconnect();
    }

    this.isInitialized = false;
  }
}

// Export singleton instance
export const monitoringService = MonitoringService.getInstance();

// Utility functions for monitoring
export const trackPerformance = (name: string, value: number) => {
  monitoringService['recordMetric'](name, value);
};

export const trackRouteChange = (from: string, to: string) => {
  monitoringService['trackRouteChange'](from, to);
};

export const getHealthStatus = () => {
  const history = monitoringService.getHealthHistory();
  return history.length > 0 ? history[history.length - 1] : null;
};

// React hook for monitoring
export const useMonitoring = () => {
  return {
    getPerformanceMetrics: monitoringService.getPerformanceMetrics.bind(monitoringService),
    getHealthStatus: () => getHealthStatus(),
    trackPerformance: trackPerformance,
    trackRouteChange: trackRouteChange,
  };
};
