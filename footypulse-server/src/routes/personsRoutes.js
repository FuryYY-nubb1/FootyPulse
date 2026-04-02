// ============================================
// src/routes/personsRoutes.js
// ============================================
// UPDATED: Added routes for:
//   - GET /top-valued         → complex query (top valued players)
//   - GET /:id/career-stats   → fn_get_player_career_stats function
// ============================================

const router = require('express').Router();
const controller = require('../controllers/personsController');
const { auth } = require('../middleware/auth');
const personRules = require('../validators/personValidator');
const validate = require('../middleware/validate');

// ── Analytics (must come BEFORE /:id) ──
router.get('/top-valued', controller.getTopValued);

// ── Standard + nested ──
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/career', controller.getCareer);
router.get('/:id/contracts', controller.getCareer);
router.get('/:id/stats', controller.getStats);
router.get('/:id/achievements', controller.getAchievements);
router.get('/:id/transfers', controller.getTransfers);

// Database Function: fn_get_player_career_stats
router.get('/:id/career-stats', controller.getCareerStats);

router.post('/', auth, personRules.create, validate, controller.create);
router.put('/:id', auth, personRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;