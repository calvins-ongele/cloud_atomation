// engine/core/http/errors.ts

export class AppError extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor(message: string | any, status = 400, code?: string, details?:any) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details
  }
} 

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: any) {
    super(message, 422, "VALIDATION_ERROR");
    (this as any).details = details;
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}
