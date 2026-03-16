// ============================================
// src/validators/personValidator.js
// ============================================

const { body } = require('express-validator');

const personRules = {
  create: [
    body('person_type').isIn(['player', 'manager', 'referee']).withMessage('person_type must be player, manager, or referee'),
    body('first_name').trim().notEmpty().withMessage('First name is required'),
    body('last_name').trim().notEmpty().withMessage('Last name is required'),
    body('primary_position').optional().isIn(['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'])
      .withMessage('Invalid position'),
    body('preferred_foot').optional().isIn(['left', 'right', 'both']).withMessage('preferred_foot must be left, right, or both'),
  ],

  update: [
    body('person_type').optional().isIn(['player', 'manager', 'referee']),
    body('first_name').optional().trim().notEmpty(),
    body('last_name').optional().trim().notEmpty(),
  ],
};

module.exports = personRules;
