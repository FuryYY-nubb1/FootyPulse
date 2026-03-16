// ============================================
// src/routes/articlesRoutes.js
// ============================================

const router = require('express').Router();
const controller = require('../controllers/articlesController');
const { auth } = require('../middleware/auth');
const articleRules = require('../validators/articleValidator');
const validate = require('../middleware/validate');

router.get('/', controller.getAll);
router.get('/slug/:slug', controller.getBySlug);          // GET /articles/slug/messi-hat-trick-123
router.get('/:id', controller.getById);
router.post('/', auth, articleRules.create, validate, controller.create);
router.put('/:id', auth, articleRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
