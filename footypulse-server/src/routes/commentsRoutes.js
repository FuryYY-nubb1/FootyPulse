// ============================================
// src/routes/commentsRoutes.js
// ============================================

const router = require('express').Router();
const controller = require('../controllers/commentsController');
const { auth } = require('../middleware/auth');
const commentRules = require('../validators/commentValidator');
const validate = require('../middleware/validate');

router.get('/article/:articleId', controller.getByArticle);   // GET /comments/article/5
router.get('/:commentId/replies', controller.getReplies);     // GET /comments/12/replies
router.post('/', commentRules.create, validate, controller.create);  // Public (or add auth)
router.put('/:id', auth, controller.update);
router.patch('/:id/like', controller.like);                   // PATCH /comments/12/like
router.delete('/:id', auth, controller.remove);

module.exports = router;
