// ============================================
// src/routes/matchesRoutes.js
// ============================================
// NOTE: Order matters! Static routes before parameterized routes.
//       /live must come before /:id or Express treats "live" as an ID.
//       Nested resources (/:id/events, /:id/players) must come before /:id too.
// ============================================

const router = require('express').Router();
const controller = require('../controllers/matchesController');
const matchEventsController = require('../controllers/matchEventsController');
const matchPlayersController = require('../controllers/matchPlayersController');
const { auth } = require('../middleware/auth');
const matchRules = require('../validators/matchValidator');
const validate = require('../middleware/validate');

// --- Static routes first ---
router.get('/live', controller.getLive);                         // GET /matches/live
router.get('/date/:date', controller.getByDate);                 // GET /matches/date/2025-01-15
router.get('/h2h/:team1/:team2', controller.getHeadToHead);      // GET /matches/h2h/1/2

// --- Nested resources (must come before /:id) ---
router.get('/:id/events', matchEventsController.getByMatch);     // GET /matches/5/events
router.get('/:id/players', matchPlayersController.getByMatch);   // GET /matches/5/players

// --- Standard CRUD ---
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, matchRules.create, validate, controller.create);
router.put('/:id', auth, matchRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;