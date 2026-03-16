// ============================================
// src/validators/commentValidator.js
// ============================================

const { body } = require('express-validator');

const commentRules = {
  create: [
    body('article_id').isInt({ min: 1 }).withMessage('Valid article_id is required'),
    body('user_id').trim().notEmpty().withMessage('user_id is required'),
    body('user_name').trim().notEmpty().withMessage('user_name is required'),
    body('content').trim().notEmpty().withMessage('Comment content is required')
      .isLength({ max: 2000 }).withMessage('Comment must be under 2000 characters'),
  ],
};

module.exports = commentRules;
