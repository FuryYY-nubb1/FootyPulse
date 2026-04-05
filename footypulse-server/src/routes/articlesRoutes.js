
const router = require('express').Router();
const controller = require('../controllers/articlesController');
const { auth } = require('../middleware/auth');
const articleRules = require('../validators/articleValidator');
const validate = require('../middleware/validate');

router.get('/stats', controller.getStats);

router.get('/trending', controller.getTrending);

router.get('/authors', controller.getAuthorLeaderboard);

router.get('/by-competition', controller.getByCompetition);

router.get('/audit', auth, controller.getAuditLog);
router.get('/audit/:articleId', auth, controller.getAuditLog);

router.post('/:id/publish', auth, controller.publish);

// ── Standard CRUD ──
router.get('/', controller.getAll);
router.get('/slug/:slug', controller.getBySlug);
router.get('/:id', controller.getById);
router.post('/', auth, articleRules.create, validate, controller.create);
router.put('/:id', auth, articleRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;