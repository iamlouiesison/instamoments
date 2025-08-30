import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ErrorType, ErrorSeverity } from './error-handling';
import { logger } from './logging';

// API error response interface
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}

// API success response interface
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
  requestId: string;
}

// Common error codes
export enum ApiErrorCode {
  // Validation errors (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Authentication errors (401)
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Authorization errors (403)
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Not found errors (404)
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  
  // Conflict errors (409)
  CONFLICT = 'CONFLICT',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  
  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server errors (500)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  
  // Custom errors
  CAMERA_ACCESS_DENIED = 'CAMERA_ACCESS_DENIED',
  STORAGE_UPLOAD_FAILED = 'STORAGE_UPLOAD_FAILED',
  PWA_INSTALLATION_FAILED = 'PWA_INSTALLATION_FAILED',
}

// HTTP status code mapping
export const ERROR_STATUS_MAP: Record<ApiErrorCode, number> = {
  [ApiErrorCode.VALIDATION_ERROR]: 400,
  [ApiErrorCode.MISSING_REQUIRED_FIELD]: 400,
  [ApiErrorCode.INVALID_FORMAT]: 400,
  [ApiErrorCode.UNAUTHORIZED]: 401,
  [ApiErrorCode.INVALID_CREDENTIALS]: 401,
  [ApiErrorCode.TOKEN_EXPIRED]: 401,
  [ApiErrorCode.FORBIDDEN]: 403,
  [ApiErrorCode.INSUFFICIENT_PERMISSIONS]: 403,
  [ApiErrorCode.NOT_FOUND]: 404,
  [ApiErrorCode.RESOURCE_NOT_FOUND]: 404,
  [ApiErrorCode.CONFLICT]: 409,
  [ApiErrorCode.DUPLICATE_ENTRY]: 409,
  [ApiErrorCode.RATE_LIMIT_EXCEEDED]: 429,
  [ApiErrorCode.INTERNAL_SERVER_ERROR]: 500,
  [ApiErrorCode.DATABASE_ERROR]: 500,
  [ApiErrorCode.EXTERNAL_SERVICE_ERROR]: 500,
  [ApiErrorCode.CAMERA_ACCESS_DENIED]: 403,
  [ApiErrorCode.STORAGE_UPLOAD_FAILED]: 500,
  [ApiErrorCode.PWA_INSTALLATION_FAILED]: 500,
};

// Generate request ID for tracking
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create error response
export function createErrorResponse(
  code: ApiErrorCode,
  message: string,
  details?: any,
  status?: number
): NextResponse<ApiErrorResponse> {
  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();
  const httpStatus = status || ERROR_STATUS_MAP[code];

  const errorResponse: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details,
      timestamp,
      requestId,
    },
  };

  // Log the error
  logger.error(`API Error: ${code} - ${message}`, undefined, {
    code,
    message,
    details,
    requestId,
    status: httpStatus,
  });

  // Report to error handling system
  errorHandler.handleError(new Error(message), {
    errorType: mapErrorCodeToType(code),
    severity: mapErrorCodeToSeverity(code),
    metadata: {
      code,
      details,
      requestId,
      status: httpStatus,
    },
  });

  return NextResponse.json(errorResponse, {
    status: httpStatus,
    headers: {
      'X-Request-ID': requestId,
      'X-Error-Code': code,
    },
  });
}

// Create success response
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();

  const successResponse: ApiSuccessResponse<T> = {
    success: true,
    data,
    timestamp,
    requestId,
  };

  return NextResponse.json(successResponse, {
    status,
    headers: {
      'X-Request-ID': requestId,
    },
  });
}

// Map error code to error type
function mapErrorCodeToType(code: ApiErrorCode): ErrorType {
  switch (code) {
    case ApiErrorCode.VALIDATION_ERROR:
    case ApiErrorCode.MISSING_REQUIRED_FIELD:
    case ApiErrorCode.INVALID_FORMAT:
      return ErrorType.VALIDATION;
    
    case ApiErrorCode.UNAUTHORIZED:
    case ApiErrorCode.INVALID_CREDENTIALS:
    case ApiErrorCode.TOKEN_EXPIRED:
      return ErrorType.AUTHENTICATION;
    
    case ApiErrorCode.FORBIDDEN:
    case ApiErrorCode.INSUFFICIENT_PERMISSIONS:
      return ErrorType.AUTHORIZATION;
    
    case ApiErrorCode.DATABASE_ERROR:
      return ErrorType.DATABASE;
    
    case ApiErrorCode.STORAGE_UPLOAD_FAILED:
      return ErrorType.STORAGE;
    
    case ApiErrorCode.CAMERA_ACCESS_DENIED:
      return ErrorType.CAMERA;
    
    case ApiErrorCode.PWA_INSTALLATION_FAILED:
      return ErrorType.PWA;
    
    default:
      return ErrorType.UNKNOWN;
  }
}

// Map error code to severity
function mapErrorCodeToSeverity(code: ApiErrorCode): ErrorSeverity {
  switch (code) {
    case ApiErrorCode.VALIDATION_ERROR:
    case ApiErrorCode.MISSING_REQUIRED_FIELD:
    case ApiErrorCode.INVALID_FORMAT:
      return ErrorSeverity.LOW;
    
    case ApiErrorCode.UNAUTHORIZED:
    case ApiErrorCode.INVALID_CREDENTIALS:
    case ApiErrorCode.TOKEN_EXPIRED:
    case ApiErrorCode.FORBIDDEN:
    case ApiErrorCode.INSUFFICIENT_PERMISSIONS:
      return ErrorSeverity.MEDIUM;
    
    case ApiErrorCode.DATABASE_ERROR:
    case ApiErrorCode.EXTERNAL_SERVICE_ERROR:
    case ApiErrorCode.STORAGE_UPLOAD_FAILED:
      return ErrorSeverity.HIGH;
    
    case ApiErrorCode.INTERNAL_SERVER_ERROR:
      return ErrorSeverity.CRITICAL;
    
    default:
      return ErrorSeverity.MEDIUM;
  }
}

// Handle common errors
export function handleValidationError(field: string, message: string): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    ApiErrorCode.VALIDATION_ERROR,
    `Validation failed for field: ${field}`,
    { field, message }
  );
}

export function handleUnauthorizedError(message: string = 'Authentication required'): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    ApiErrorCode.UNAUTHORIZED,
    message
  );
}

export function handleForbiddenError(message: string = 'Access denied'): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    ApiErrorCode.FORBIDDEN,
    message
  );
}

export function handleNotFoundError(resource: string): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    ApiErrorCode.RESOURCE_NOT_FOUND,
    `${resource} not found`
  );
}

export function handleDatabaseError(error: Error, operation: string): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    ApiErrorCode.DATABASE_ERROR,
    `Database operation failed: ${operation}`,
    { operation, originalError: error.message }
  );
}

export function handleStorageError(error: Error, operation: string): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    ApiErrorCode.STORAGE_UPLOAD_FAILED,
    `Storage operation failed: ${operation}`,
    { operation, originalError: error.message }
  );
}

export function handleCameraError(error: Error, action: string): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    ApiErrorCode.CAMERA_ACCESS_DENIED,
    `Camera access denied for: ${action}`,
    { action, originalError: error.message }
  );
}

// Wrapper for API handlers to catch errors
export function withErrorHandling<T>(
  handler: (req: NextRequest) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest): Promise<NextResponse<T | ApiErrorResponse>> => {
    try {
      return await handler(req);
    } catch (error) {
      // Log the unexpected error
      logger.error('Unexpected API error', error instanceof Error ? error : new Error(String(error)), {
        url: req.url,
        method: req.method,
        headers: Object.fromEntries(req.headers.entries()),
      });

      // Report to error handling system
      errorHandler.handleError(
        error instanceof Error ? error : new Error(String(error)),
        {
          errorType: ErrorType.UNKNOWN,
          severity: ErrorSeverity.HIGH,
          route: req.nextUrl?.pathname,
          metadata: {
            url: req.url,
            method: req.method,
          },
        }
      );

      // Return generic error response
      return createErrorResponse(
        ApiErrorCode.INTERNAL_SERVER_ERROR,
        'An unexpected error occurred',
        process.env.NODE_ENV === 'development' ? {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        } : undefined
      );
    }
  };
}

// Rate limiting helper
export function createRateLimitError(limit: number, window: string): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    ApiErrorCode.RATE_LIMIT_EXCEEDED,
    `Rate limit exceeded. Maximum ${limit} requests per ${window}`,
    { limit, window }
  );
}

// Validation helper
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

// Validation middleware
export function validateRequest(
  req: NextRequest,
  requiredFields: string[]
): NextResponse<ApiErrorResponse> | null {
  try {
    const body = req.body ? req.json() : {};
    const { isValid, missingFields } = validateRequiredFields(body, requiredFields);

    if (!isValid) {
      return createErrorResponse(
        ApiErrorCode.MISSING_REQUIRED_FIELD,
        'Missing required fields',
        { missingFields }
      );
    }

    return null; // No error
  } catch {
    return createErrorResponse(
      ApiErrorCode.VALIDATION_ERROR,
      'Invalid request body',
      { error: 'Failed to parse request body' }
    );
  }
}
