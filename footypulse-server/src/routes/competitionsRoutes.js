

const router = require('express').Router();
const controller = require('../controllers/competitionsController');
const { auth } = require('../middleware/auth');

router.get('/audit', auth, controller.getAuditLog);
router.get('/audit/:competitionId', auth, controller.getAuditLog);

router.get('/:id/seasons', controller.getSeasons);
router.get('/:id/matches', controller.getMatches);
router.get('/:id/scorers', controller.getScorers);
router.get('/:id/news', controller.getNews);

router.get('/:id/overview', controller.getOverview);

router.post('/:id/setup-season', auth, controller.setupSeason);

// ── Standard CRUD ──
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;