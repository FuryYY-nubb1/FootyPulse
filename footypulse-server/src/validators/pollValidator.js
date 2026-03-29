
const { body } = require('express-validator');

const pollRules = {
  create: [
    body('question').trim().notEmpty().withMessage('Question is required')
      .isLength({ max: 300 }).withMessage('Question must be under 300 characters'),
    body('options').isArray({ min: 2 }).withMessage('At least 2 options are required'),
    body('poll_type').optional().isIn(['single', 'multiple', 'rating', 'prediction'])
      .withMessage('Invalid poll_type'),
  ],

  vote: [
    body('poll_id').isInt({ min: 1 }).withMessage('Valid poll_id is required'),
    body('user_id').trim().notEmpty().withMessage('user_id is required'),
    body('selected_options').isArray({ min: 1 }).withMessage('At least 1 option must be selected'),
  ],
};

module.exports = pollRules;