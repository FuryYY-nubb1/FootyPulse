// ============================================
// src/routes/commentsRoutes.js
// ============================================
// UPDATED: POST / (create) now requires auth middleware
//          so only authenticated users can comment.
// ============================================

const router = require('express').Router();
const controller = require('../controllers/commentsController');
const { auth } = require('../middleware/auth');
const commentRules = require('../validators/commentValidator');
const validate = require('../middleware/validate');

router.get('/article/:articleId', controller.getByArticle);   // GET /comments/article/5
router.get('/:commentId/replies', controller.getReplies);     // GET /comments/12/replies
router.post('/', auth, commentRules.create, validate, controller.create);  // Auth required
router.put('/:id', auth, controller.update);
router.patch('/:id/like', controller.like);                   // PATCH /comments/12/like
router.delete('/:id', auth, controller.remove);

module.exports = router;