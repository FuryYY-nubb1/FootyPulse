// ============================================
// src/validators/matchValidator.js
// ============================================

const { body } = require('express-validator');

const matchRules = {
  create: [
    body('season_id').isInt({ min: 1 }).withMessage('Valid season_id is required'),
    body('home_team_id').isInt({ min: 1 }).withMessage('Valid home_team_id is required'),
    body('away_team_id').isInt({ min: 1 }).withMessage('Valid away_team_id is required'),
    body('match_date').isISO8601().withMessage('Valid match_date is required (YYYY-MM-DD)'),
    body('home_team_id').custom((value, { req }) => {
      if (value === req.body.away_team_id) throw new Error('Home and away teams must be different');
      return true;
    }),
  ],

  update: [
    body('status').optional().isIn(['scheduled', 'live', 'finished', 'postponed', 'cancelled'])
      .withMessage('Invalid match status'),
    body('home_score').optional().isInt({ min: 0 }).withMessage('home_score must be >= 0'),
    body('away_score').optional().isInt({ min: 0 }).withMessage('away_score must be >= 0'),
  ],
};

module.exports = matchRules;
