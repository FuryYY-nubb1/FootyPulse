

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes from unexpected errors
    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods for common HTTP errors
  static badRequest(msg) {
    return new ApiError(400, msg || 'Bad request');
  }

  static unauthorized(msg) {
    return new ApiError(401, msg || 'Unauthorized');
  }

  static forbidden(msg) {
    return new ApiError(403, msg || 'Forbidden');
  }

  static notFound(msg) {
    return new ApiError(404, msg || 'Resource not found');
  }

  static conflict(msg) {
    return new ApiError(409, msg || 'Resource already exists');
  }

  static internal(msg) {
    return new ApiError(500, msg || 'Internal server error');
  }
}

module.exports = ApiError;
