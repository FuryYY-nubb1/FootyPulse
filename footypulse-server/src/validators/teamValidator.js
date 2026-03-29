
const { body } = require('express-validator');

const teamRules = {
  create: [
    body('name').trim().notEmpty().withMessage('Team name is required'),
    body('team_type').isIn(['club', 'national']).withMessage('team_type must be club or national'),
    body('country_id').isInt({ min: 1 }).withMessage('Valid country_id is required'),
  ],

  update: [
    body('name').optional().trim().notEmpty().withMessage('Team name cannot be empty'),
    body('team_type').optional().isIn(['club', 'national']).withMessage('team_type must be club or national'),
    body('country_id').optional().isInt({ min: 1 }).withMessage('Valid country_id is required'),
  ],
};

module.exports = teamRules;
