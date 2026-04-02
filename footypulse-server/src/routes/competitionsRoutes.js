// ============================================
// src/routes/competitionsRoutes.js
// ============================================
// UPDATED: Added routes for:
//   - POST /:id/setup-season   → uses stored procedure sp_setup_competition_season
//   - GET /:id/overview        → uses database function fn_get_competition_overview
//   - GET /audit               → audit log from shadow table (populated by trigger)
// ============================================

const router = require('express').Router();
const controller = require('../controllers/competitionsController');
const { auth } = require('../middleware/auth');

// ── Audit log (must come BEFORE /:id) ──
router.get('/audit', auth, controller.getAuditLog);
router.get('/audit/:competitionId', auth, controller.getAuditLog);

// ── Nested resources (must come BEFORE /:id) ──
router.get('/:id/seasons', controller.getSeasons);
router.get('/:id/matches', controller.getMatches);
router.get('/:id/scorers', controller.getScorers);
router.get('/:id/news', controller.getNews);

// Database Function: fn_get_competition_overview — full competition summary
router.get('/:id/overview', controller.getOverview);

// Stored Procedure: sp_setup_competition_season
// Multi-step: deactivate old seasons → create new season → initialize standings
// All within explicit transaction control (BEGIN/COMMIT/ROLLBACK)
router.post('/:id/setup-season', auth, controller.setupSeason);

// ── Standard CRUD ──
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;