// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// Log entry interface
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
  route?: string;
  userAgent?: string;
}

// Log configuration
export interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableLocalStorage: boolean;
  enableRemoteLogging: boolean;
  maxLocalLogs: number;
  remoteEndpoint?: string;
  includeTimestamp: boolean;
  includeContext: boolean;
}

// Default configuration
const DEFAULT_CONFIG: LogConfig = {
  level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableLocalStorage: process.env.NODE_ENV === 'development',
  enableRemoteLogging: process.env.NODE_ENV === 'production',
  maxLocalLogs: 1000,
  includeTimestamp: true,
  includeContext: true,
};

// Main logging class
export class Logger {
  private static instance: Logger;
  private config: LogConfig;
  private logs: LogEntry[] = [];
  private isInitialized = false;

  private constructor(config: Partial<LogConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  static getInstance(config?: Partial<LogConfig>): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  // Initialize logger
  init(): void {
    if (this.isInitialized) return;

    // Load existing logs from localStorage
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      this.loadLogsFromStorage();
    }

    this.isInitialized = true;
  }

  // Log methods
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  // Main logging method
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    // Check if we should log this level
    if (level < this.config.level) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      error,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      route: typeof window !== 'undefined' ? window.location.pathname : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    // Add to internal logs
    this.logs.push(logEntry);

    // Trim logs if we exceed max
    if (this.logs.length > this.config.maxLocalLogs) {
      this.logs = this.logs.slice(-this.config.maxLocalLogs);
    }

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Local storage logging
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      this.logToLocalStorage(logEntry);
    }

    // Remote logging
    if (this.config.enableRemoteLogging && this.config.remoteEndpoint) {
      this.logToRemote(logEntry).catch(err => {
        console.warn('Failed to log to remote endpoint:', err);
      });
    }
  }

  // Log to console with appropriate styling
  private logToConsole(entry: LogEntry): void {
    const timestamp = this.config.includeTimestamp 
      ? `[${entry.timestamp.toISOString()}]` 
      : '';
    
    const levelStr = LogLevel[entry.level];
    const contextStr = this.config.includeContext && entry.context 
      ? ` ${JSON.stringify(entry.context)}` 
      : '';
    
    const errorStr = entry.error 
      ? `\nError: ${entry.error.message}\nStack: ${entry.error.stack}` 
      : '';

    const fullMessage = `${timestamp} [${levelStr}] ${entry.message}${contextStr}${errorStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(fullMessage);
        break;
      case LogLevel.INFO:
        console.info(fullMessage);
        break;
      case LogLevel.WARN:
        console.warn(fullMessage);
        break;
      case LogLevel.ERROR:
        console.error(fullMessage);
        break;
      case LogLevel.FATAL:
        console.error(`🚨 FATAL: ${fullMessage}`);
        break;
    }
  }

  // Log to localStorage
  private logToLocalStorage(entry: LogEntry): void {
    try {
      const existingLogs = this.getLogsFromStorage();
      existingLogs.push(entry);

      // Keep only maxLocalLogs
      if (existingLogs.length > this.config.maxLocalLogs) {
        existingLogs.splice(0, existingLogs.length - this.config.maxLocalLogs);
      }

      localStorage.setItem('instamoments_logs', JSON.stringify(existingLogs));
    } catch (error) {
      console.warn('Failed to log to localStorage:', error);
    }
  }

  // Log to remote endpoint
  private async logToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...entry,
          timestamp: entry.timestamp.toISOString(),
          error: entry.error ? {
            message: entry.error.message,
            stack: entry.error.stack,
            name: entry.error.name,
          } : undefined,
        }),
      });
    } catch (error) {
      throw new Error(`Remote logging failed: ${error}`);
    }
  }

  // Get current user ID from various sources
  private getCurrentUserId(): string | undefined {
    try {
      // Try to get from localStorage
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('instamoments_user');
        if (user) {
          const userData = JSON.parse(user);
          return userData.id;
        }
      }
    } catch {
      // Ignore errors
    }
    return undefined;
  }

  // Get session ID
  private getSessionId(): string | undefined {
    try {
      if (typeof window !== 'undefined') {
        let sessionId = sessionStorage.getItem('instamoments_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('instamoments_session_id', sessionId);
        }
        return sessionId;
      }
    } catch {
      // Ignore errors
    }
    return undefined;
  }

  // Load logs from localStorage
  private loadLogsFromStorage(): void {
    try {
      const storedLogs = localStorage.getItem('instamoments_logs');
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        this.logs = parsedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
      }
    } catch (error) {
      console.warn('Failed to load logs from localStorage:', error);
    }
  }

  // Get logs from localStorage
  private getLogsFromStorage(): LogEntry[] {
    try {
      const storedLogs = localStorage.getItem('instamoments_logs');
      if (storedLogs) {
        return JSON.parse(storedLogs);
      }
    } catch (error) {
      console.warn('Failed to get logs from localStorage:', error);
    }
    return [];
  }

  // Get all logs
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // Get logs by time range
  getLogsByTimeRange(start: Date, end: Date): LogEntry[] {
    return this.logs.filter(log => 
      log.timestamp >= start && log.timestamp <= end
    );
  }

  // Search logs
  searchLogs(query: string): LogEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.logs.filter(log => 
      log.message.toLowerCase().includes(lowerQuery) ||
      (log.context && JSON.stringify(log.context).toLowerCase().includes(lowerQuery)) ||
      (log.error && log.error.message.toLowerCase().includes(lowerQuery))
    );
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
    
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('instamoments_logs');
      } catch (error) {
        console.warn('Failed to clear logs from localStorage:', error);
      }
    }
  }

  // Export logs
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Get log statistics
  getLogStats(): {
    total: number;
    byLevel: Record<string, number>;
    byHour: Record<string, number>;
  } {
    const byLevel: Record<string, number> = {};
    const byHour: Record<string, number> = {};

    this.logs.forEach(log => {
      // Count by level
      const levelStr = LogLevel[log.level];
      byLevel[levelStr] = (byLevel[levelStr] || 0) + 1;

      // Count by hour
      const hour = log.timestamp.getHours();
      byHour[hour.toString()] = (byHour[hour.toString()] || 0) + 1;
    });

    return {
      total: this.logs.length,
      byLevel,
      byHour,
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<LogConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): LogConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Utility functions for quick logging
export const logDebug = (message: string, context?: Record<string, any>) => {
  logger.debug(message, context);
};

export const logInfo = (message: string, context?: Record<string, any>) => {
  logger.info(message, context);
};

export const logWarn = (message: string, context?: Record<string, any>) => {
  logger.warn(message, context);
};

export const logError = (message: string, error?: Error, context?: Record<string, any>) => {
  logger.error(message, error, context);
};

export const logFatal = (message: string, error?: Error, context?: Record<string, any>) => {
  logger.fatal(message, error, context);
};

// React hook for logging
export const useLogger = () => {
  return {
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
    fatal: logger.fatal.bind(logger),
    getLogs: logger.getLogs.bind(logger),
    getLogStats: logger.getLogStats.bind(logger),
    clearLogs: logger.clearLogs.bind(logger),
    exportLogs: logger.exportLogs.bind(logger),
  };
};
