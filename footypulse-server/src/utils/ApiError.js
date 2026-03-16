// ============================================
// src/utils/ApiError.js
// ============================================
// PURPOSE: Custom error class that carries an HTTP status code
// USED BY: Controllers throw these → errorHandler middleware catches them
// 
// EXAMPLE:
//   throw ApiError.notFound('Country not found');
//   throw ApiError.badRequest('Name is required');
//   throw new ApiError(409, 'Email already exists');
// ============================================

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
