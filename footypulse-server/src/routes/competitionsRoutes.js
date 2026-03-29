
const router = require('express').Router();
const controller = require('../controllers/competitionsController');
const { auth } = require('../middleware/auth');

// --- Nested resources (must come BEFORE /:id) ---
router.get('/:id/seasons', controller.getSeasons);              // GET /competitions/1/seasons
router.get('/:id/matches', controller.getMatches);              // GET /competitions/1/matches?seasonId=1&matchday=25
router.get('/:id/scorers', controller.getScorers);              // GET /competitions/1/scorers?seasonId=1
router.get('/:id/news', controller.getNews);                    // GET /competitions/1/news

// --- Standard CRUD ---
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;