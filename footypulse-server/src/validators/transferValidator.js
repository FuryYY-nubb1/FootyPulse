
const { body } = require('express-validator');

const transferRules = {
  create: [
    body('person_id').isInt({ min: 1 }).withMessage('Valid person_id is required'),
    body('to_team_id').isInt({ min: 1 }).withMessage('Valid to_team_id is required'),
    body('transfer_type').isIn(['permanent', 'loan', 'loan_return', 'free', 'youth'])
      .withMessage('Invalid transfer_type'),
  ],

  update: [
    body('status').optional().isIn(['rumor', 'negotiating', 'agreed', 'official', 'cancelled'])
      .withMessage('Invalid transfer status'),
    body('fee').optional().isDecimal().withMessage('Fee must be a valid number'),
  ],
};

module.exports = transferRules;
