
// src/validators/articleValidator.js

const { body } = require('express-validator');

const articleRules = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required')
      .isLength({ max: 250 }).withMessage('Title must be under 250 characters'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('author_name').trim().notEmpty().withMessage('Author name is required'),
    body('article_type').optional()
      .isIn(['news', 'match_report', 'transfer', 'feature', 'opinion', 'interview', 'preview', 'breaking'])
      .withMessage('Invalid article_type'),
  ],

  update: [
    body('title').optional().trim().notEmpty().isLength({ max: 250 }),
    body('content').optional().trim().notEmpty(),
    body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  ],
};

module.exports = articleRules;
