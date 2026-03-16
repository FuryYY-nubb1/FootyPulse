// ============================================
// src/utils/asyncHandler.js
// ============================================
// PURPOSE: Wraps async route handlers so thrown errors are automatically
//          passed to Express's error handler (next(err))
// USED BY: Every controller function
//
// WITHOUT THIS: You'd need try/catch in every controller:
//   exports.getAll = async (req, res, next) => {
//     try { ... } catch(err) { next(err); }
//   };
//
// WITH THIS: Clean and simple:
//   exports.getAll = asyncHandler(async (req, res) => { ... });
// ============================================

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
