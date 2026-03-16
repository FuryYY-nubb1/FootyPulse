// ============================================
// src/routes/matchesRoutes.js
// ============================================
// NOTE: Order matters! Static routes before parameterized routes.
//       /live must come before /:id or Express treats "live" as an ID.
// ============================================

const router = require('express').Router();
const controller = require('../controllers/matchesController');
const { auth } = require('../middleware/auth');
const matchRules = require('../validators/matchValidator');
const validate = require('../middleware/validate');

router.get('/live', controller.getLive);                         // GET /matches/live
router.get('/date/:date', controller.getByDate);                 // GET /matches/date/2025-01-15
router.get('/h2h/:team1/:team2', controller.getHeadToHead);      // GET /matches/h2h/1/2
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, matchRules.create, validate, controller.create);
router.put('/:id', auth, matchRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
