// ============================================
// src/routes/matchesRoutes.js
// ============================================
// UPDATED: Added routes for:
//   - POST /:id/record-result  → uses stored procedure sp_record_match_result
//   - GET /league-stats/:seasonId → uses database function fn_get_league_stats
//   - GET /team-form/:teamId   → uses database function fn_get_team_form
//   - GET /top-scorers/:seasonId → complex query (multi-table join + aggregation)
//   - GET /top-assists/:seasonId → complex query (multi-table join + aggregation)
//   - GET /team-cards/:seasonId  → complex query (multi-table join + aggregation)
//   - GET /audit                → audit log from shadow table (populated by trigger)
// ============================================

const router = require('express').Router();
const controller = require('../controllers/matchesController');
const matchEventsController = require('../controllers/matchEventsController');
const matchPlayersController = require('../controllers/matchPlayersController');
const { auth } = require('../middleware/auth');
const matchRules = require('../validators/matchValidator');
const validate = require('../middleware/validate');

// ── Analytics & Statistics (must come BEFORE /:id) ──

// Database Function: fn_get_league_stats — computed league statistics
router.get('/league-stats/:seasonId', controller.getLeagueStats);

// Database Function: fn_get_team_form — recent form for a team
router.get('/team-form/:teamId', controller.getTeamForm);

// Complex Query 1: Top scorers — multi-table join + aggregation
router.get('/top-scorers/:seasonId', controller.getTopScorers);

// Complex Query 2: Top assisters — multi-table join + aggregation
router.get('/top-assists/:seasonId', controller.getTopAssisters);

// Complex Query 3: Team discipline cards — multi-table join + aggregation
router.get('/team-cards/:seasonId', controller.getTeamCards);

// Audit log from shadow table (populated by trigger trg_audit_match)
router.get('/audit', auth, controller.getAuditLog);
router.get('/audit/:matchId', auth, controller.getAuditLog);

// ── Existing special routes ──
router.get('/live', controller.getLive);
router.get('/date/:date', controller.getByDate);
router.get('/h2h/:team1/:team2', controller.getHeadToHead);

// ── Nested resources ──
router.get('/:id/events', matchEventsController.getByMatch);
router.get('/:id/players', matchPlayersController.getByMatch);

// ── Stored Procedure: sp_record_match_result ──
// Multi-step: update match + update standings + update manager records
// All within explicit transaction control (BEGIN/COMMIT/ROLLBACK)
router.post('/:id/record-result', auth, controller.recordResult);

// ── Standard CRUD ──
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, matchRules.create, validate, controller.create);
router.put('/:id', auth, matchRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;