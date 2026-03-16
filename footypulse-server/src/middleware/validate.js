// ============================================
// src/middleware/validate.js
// ============================================
// PURPOSE: Runs express-validator rules and returns errors if any
// USED BY: Route files — sits between validator rules and controller
//
// EXAMPLE in routes:
//   const { teamRules } = require('../validators/teamValidator');
//   const validate = require('../middleware/validate');
//
//   router.post('/teams', auth, teamRules.create, validate, controller.create);
//   //                          ↑ rules          ↑ check   ↑ handler
// ============================================

const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
      value: e.value,
    })),
  });
};

module.exports = validate;
