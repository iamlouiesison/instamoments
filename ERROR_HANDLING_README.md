# Error Handling & Monitoring System

This document describes the comprehensive error handling and monitoring system implemented for the InstaMoments application.

## Overview

The system provides:
- **Error Tracking**: Sentry integration for production error monitoring
- **Performance Monitoring**: Core Web Vitals and custom metrics tracking
- **Health Checks**: System health monitoring for API, database, storage, and auth
- **Logging**: Structured logging with multiple levels and storage options
- **Error Boundaries**: React error boundaries with user-friendly fallbacks
- **API Error Handling**: Consistent error responses across all API endpoints

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Error Handling & Monitoring                  │
├─────────────────────────────────────────────────────────────────┤
│  Frontend Components  │  Services  │  API Endpoints  │  Storage │
│  ┌─────────────────┐  │ ┌─────────┐ │ ┌─────────────┐ │ ┌──────┐ │
│  │ Error Boundaries│  │ │Error    │ │ │ Health      │ │ │Local │ │
│  │ Performance     │  │ │Handler  │ │ │ Checks      │ │ │Storage│ │
│  │ Monitor         │  │ │Logger   │ │ │ Error       │ │ │Sentry│ │
│  │ Debug Dashboard │  │ │Monitor  │ │ │ Responses   │ │ │Remote│ │
│  └─────────────────┘  │ └─────────┘ │ └─────────────┘ │ └──────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Error Boundaries

#### EnhancedErrorBoundary
- Catches React component errors
- Provides user-friendly error messages
- Integrates with error handling system
- Supports error reporting and retry functionality

```tsx
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';

<EnhancedErrorBoundary>
  <YourComponent />
</EnhancedErrorBoundary>
```

### 2. Performance Monitoring

#### PerformanceMonitor
- Real-time Core Web Vitals tracking
- Performance scoring system
- System health status display
- Expandable detailed metrics

```tsx
import { PerformanceMonitor } from '@/components/ui/performance-monitor';

<PerformanceMonitor />
```

### 3. Debug Dashboard

#### Debug Page (`/debug`)
- Test error handling scenarios
- View logs and error logs
- Monitor system health
- Export debugging data

Access at: `http://localhost:3000/debug`

## Services

### 1. Error Handler (`@/lib/error-handling`)

Centralized error handling service with:
- Error type classification
- Severity levels
- Sentry integration
- Local storage logging
- User-friendly messages

```typescript
import { errorHandler, handleValidationError } from '@/lib/error-handling';

// Handle errors
errorHandler.handleError(error, {
  errorType: 'validation',
  severity: 'low',
  metadata: { field: 'email' }
});

// Utility functions
handleValidationError(error, 'email');
handleAuthError(error, userId);
handleNetworkError(error, endpoint);
```

### 2. Monitoring Service (`@/lib/monitoring`)

Performance and health monitoring with:
- Core Web Vitals tracking
- Health check endpoints
- Uptime monitoring
- Performance thresholds

```typescript
import { monitoringService, useMonitoring } from '@/lib/monitoring';

// Get performance metrics
const metrics = monitoringService.getPerformanceMetrics();

// React hook
const { getPerformanceMetrics, getHealthStatus } = useMonitoring();
```

### 3. Logger (`@/lib/logging`)

Structured logging service with:
- Multiple log levels (DEBUG, INFO, WARN, ERROR, FATAL)
- Local storage persistence
- Remote logging support
- Context and metadata support

```typescript
import { logger, useLogger } from '@/lib/logging';

// Log messages
logger.info('User logged in', { userId, timestamp });
logger.error('API call failed', error, { endpoint, method });

// React hook
const { debug, info, warn, error, fatal } = useLogger();
```

### 4. API Error Handler (`@/lib/api-error-handler`)

Consistent API error responses with:
- Standardized error codes
- HTTP status mapping
- Request ID tracking
- Error logging integration

```typescript
import { 
  createErrorResponse, 
  handleValidationError,
  withErrorHandling 
} from '@/lib/api-error-handler';

// Create error responses
return createErrorResponse(
  ApiErrorCode.VALIDATION_ERROR,
  'Invalid email format',
  { field: 'email' }
);

// Wrap API handlers
export const GET = withErrorHandling(async (req: NextRequest) => {
  // Your API logic here
});
```

## API Endpoints

### Health Checks

#### Main Health Check
```
GET /api/health
```
Returns overall system health status.

#### Database Health
```
GET /api/health/database
```
Checks database connectivity and performance.

#### Storage Health
```
GET /api/health/storage
```
Verifies storage bucket access and permissions.

#### Auth Health
```
GET /api/health/auth
```
Tests authentication service functionality.

## Configuration

### Environment Variables

Create a `.env.local` file with:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_DSN=your_sentry_dsn_here

# App Configuration
NEXT_PUBLIC_APP_VERSION=0.1.0
APP_VERSION=0.1.0

# Optional: Remote Logging
NEXT_PUBLIC_REMOTE_LOGGING_ENDPOINT=your_endpoint_here
```

### Sentry Setup

1. Create a Sentry account at [sentry.io](https://sentry.io)
2. Create a new project for your Next.js app
3. Copy the DSN from your project settings
4. Add the DSN to your environment variables

## Usage Examples

### 1. Basic Error Handling

```typescript
import { useErrorHandler } from '@/components/ui/enhanced-error-boundary';

function MyComponent() {
  const { handleError, getUserFriendlyMessage } = useErrorHandler();

  const handleSubmit = async () => {
    try {
      await submitForm();
    } catch (error) {
      handleError(error, {
        errorType: 'validation',
        severity: 'low',
        route: '/form'
      });
      
      const message = getUserFriendlyMessage(error, {
        errorType: 'validation',
        severity: 'low'
      });
      
      setError(message);
    }
  };
}
```

### 2. API Error Handling

```typescript
import { withErrorHandling, validateRequest } from '@/lib/api-error-handler';

export const POST = withErrorHandling(async (req: NextRequest) => {
  // Validate required fields
  const validation = validateRequest(req, ['email', 'password']);
  if (validation) return validation;

  try {
    const body = await req.json();
    // Process request...
    
    return createSuccessResponse({ success: true });
  } catch (error) {
    return handleDatabaseError(error, 'user_creation');
  }
});
```

### 3. Performance Tracking

```typescript
import { trackPerformance, trackRouteChange } from '@/lib/monitoring';

// Track custom metrics
trackPerformance('custom_metric', 150);

// Track route changes
trackRouteChange('/dashboard', '/profile');
```

### 4. Logging

```typescript
import { useLogger } from '@/lib/logging';

function MyComponent() {
  const logger = useLogger();

  useEffect(() => {
    logger.info('Component mounted', { component: 'MyComponent' });
    
    return () => {
      logger.info('Component unmounted', { component: 'MyComponent' });
    };
  }, []);
}
```

## Error Types and Severity

### Error Types
- `validation`: Form validation errors
- `authentication`: Login/auth failures
- `authorization`: Permission issues
- `network`: Connection problems
- `database`: Database operation failures
- `storage`: File upload/storage issues
- `camera`: Camera access problems
- `pwa`: Service worker issues

### Severity Levels
- `low`: Minor issues, user can continue
- `medium`: Moderate issues, may affect functionality
- `high`: Significant issues, functionality impaired
- `critical`: Critical failures, app unusable

## Performance Metrics

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **FID (First Input Delay)**: Target < 100ms
- **CLS (Cumulative Layout Shift)**: Target < 0.1

### Custom Metrics
- Page load time
- Route change time
- API response time
- Database query time

## Health Check Status

### Status Levels
- **healthy**: All systems operational
- **degraded**: Some systems impaired
- **unhealthy**: Critical systems down

### Checked Services
- API endpoints
- Database connectivity
- Storage access
- Authentication service

## Monitoring and Alerts

### Sentry Integration
- Automatic error capture
- Performance monitoring
- Session replay
- Release tracking

### Local Monitoring
- Browser console logging
- Local storage persistence
- Performance metrics
- Health status history

## Best Practices

### 1. Error Handling
- Always use the error handling system for errors
- Provide user-friendly error messages
- Log errors with appropriate context
- Use error boundaries for React components

### 2. Performance
- Monitor Core Web Vitals
- Set appropriate performance thresholds
- Track custom metrics for business logic
- Use performance monitoring in development

### 3. Logging
- Use appropriate log levels
- Include relevant context
- Avoid logging sensitive information
- Use structured logging format

### 4. Health Checks
- Monitor critical services
- Set appropriate timeouts
- Provide detailed error information
- Use health checks for uptime monitoring

## Troubleshooting

### Common Issues

#### Sentry Not Working
1. Check environment variables
2. Verify DSN is correct
3. Check browser console for errors
4. Ensure Sentry project is active

#### Health Checks Failing
1. Verify Supabase connection
2. Check API endpoint availability
3. Review error logs
4. Test individual health endpoints

#### Performance Issues
1. Check Core Web Vitals
2. Review performance thresholds
3. Analyze custom metrics
4. Check for memory leaks

### Debug Tools

Use the debug dashboard at `/debug` to:
- Test error scenarios
- View system logs
- Monitor performance
- Check system health

## Future Enhancements

### Planned Features
- Real-time error notifications
- Advanced performance analytics
- Custom alert rules
- Integration with external monitoring tools
- Automated error resolution suggestions

### Contributing

To add new error types or monitoring features:
1. Update the appropriate service
2. Add tests for new functionality
3. Update documentation
4. Follow existing patterns and conventions

## Support

For issues or questions:
- Check the debug dashboard
- Review error logs
- Check Sentry dashboard
- Contact the development team

---

This system provides comprehensive error handling and monitoring capabilities to ensure the InstaMoments application runs smoothly and provides excellent user experience.
