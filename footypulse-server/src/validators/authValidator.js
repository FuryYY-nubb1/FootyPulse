// ============================================
// src/validators/authValidator.js
// ============================================
// PURPOSE: Validation rules for auth endpoints
// USED BY: src/routes/authRoutes.js
//
// HOW VALIDATORS CONNECT TO ROUTES:
//   router.post('/register', authRules.register, validate, controller.register);
//   1. authRules.register → array of express-validator checks
//   2. validate middleware → checks for errors, returns 400 if any
//   3. controller.register → runs only if validation passes
// ============================================

const { body } = require('express-validator');

const authRules = {
  register: [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ],

  login: [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
};

module.exports = authRules;
