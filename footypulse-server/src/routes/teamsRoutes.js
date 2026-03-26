// ============================================
// src/routes/teamsRoutes.js
// ============================================
// FIXED: Added /:id/matches and /:id/transfers routes
// ============================================

const router = require('express').Router();
const controller = require('../controllers/teamsController');
const { auth } = require('../middleware/auth');
const teamRules = require('../validators/teamValidator');
const validate = require('../middleware/validate');

// --- Nested resources (must come BEFORE /:id) ---
router.get('/:id/squad', controller.getSquad);
router.get('/:id/matches', controller.getMatches);       // GET /teams/2/matches
router.get('/:id/transfers', controller.getTransfers);    // GET /teams/2/transfers
router.get('/:id/stats', controller.getStats);            // GET /teams/2/stats

// --- Standard CRUD ---
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, teamRules.create, validate, controller.create);
router.put('/:id', auth, teamRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;