import { Prisma } from "@prisma/client";

class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InsufficientParametersError extends AppError {
  constructor(message: string = "Insufficient parameters") {
    super(400, message);
    Object.setPrototypeOf(this, InsufficientParametersError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(500, message);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(401, message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Not authorized") {
    super(403, message);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(404, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(409, message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(500, message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export const handleError = (error: unknown) => {
  // Handle custom AppError instances first
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({
        success: false,
        error: {
          message: error.message,
          statusCode: error.statusCode,
          isOperational: error.isOperational,
        },
      }),
    };
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    switch (error.code) {
      case "P2002":
        return {
          statusCode: 409,
          body: JSON.stringify({
            success: false,
            error: {
              message: "Unique constraint violation",
              statusCode: 409,
              isOperational: true,
              details: error.meta,
            },
          }),
        };
      case "P2025":
        return {
          statusCode: 404,
          body: JSON.stringify({
            success: false,
            error: {
              message: "Record not found",
              statusCode: 404,
              isOperational: true,
            },
          }),
        };
      case "P2003":
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: {
              message: "Foreign key constraint violation",
              statusCode: 400,
              isOperational: true,
              details: error.meta,
            },
          }),
        };
      default:
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            error: {
              message: "Database operation failed",
              statusCode: 500,
              isOperational: true,
              code: error.code,
            },
          }),
        };
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: {
          message: "Invalid data provided",
          statusCode: 400,
          isOperational: true,
        },
      }),
    };
  }

  // Handle Prisma initialization errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: {
          message: "Database connection failed",
          statusCode: 500,
          isOperational: false,
        },
      }),
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: {
          message: error.message,
          statusCode: 500,
          isOperational: false,
        },
      }),
    };
  }

  // Handle unknown errors
  console.error("Unhandled error:", error);
  return {
    statusCode: 500,
    body: JSON.stringify({
      success: false,
      error: {
        message: `An unexpected error occurred`,
        statusCode: 500,
        isOperational: false,
      },
    }),
  };
};
