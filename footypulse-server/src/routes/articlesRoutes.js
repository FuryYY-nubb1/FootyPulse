// ============================================
// src/routes/articlesRoutes.js
// ============================================
// UPDATED: Added routes for:
//   - POST /:id/publish        → uses stored procedure sp_publish_article
//   - GET /stats               → uses database function fn_get_article_stats
//   - GET /trending            → complex query (trending score formula)
//   - GET /authors             → complex query (author leaderboard aggregation)
//   - GET /by-competition      → complex query (articles grouped by competition)
//   - GET /audit               → audit log from shadow table (populated by trigger)
// ============================================

const router = require('express').Router();
const controller = require('../controllers/articlesController');
const { auth } = require('../middleware/auth');
const articleRules = require('../validators/articleValidator');
const validate = require('../middleware/validate');

// ── Analytics & Statistics (must come BEFORE /:id and /slug/:slug) ──

// Database Function: fn_get_article_stats — computed article statistics
router.get('/stats', controller.getStats);

// Complex Query 1: Trending articles — multi-table join + computed score
router.get('/trending', controller.getTrending);

// Complex Query 2: Author leaderboard — aggregation across articles
router.get('/authors', controller.getAuthorLeaderboard);

// Complex Query 3: Articles grouped by competition — join + aggregation
router.get('/by-competition', controller.getByCompetition);

// Audit log from shadow table (populated by trigger trg_audit_article)
router.get('/audit', auth, controller.getAuditLog);
router.get('/audit/:articleId', auth, controller.getAuditLog);

// ── Stored Procedure: sp_publish_article ──
// Multi-step: validate → publish → manage breaking/featured limits
// All within explicit transaction control (BEGIN/COMMIT/ROLLBACK)
router.post('/:id/publish', auth, controller.publish);

// ── Standard CRUD ──
router.get('/', controller.getAll);
router.get('/slug/:slug', controller.getBySlug);
router.get('/:id', controller.getById);
router.post('/', auth, articleRules.create, validate, controller.create);
router.put('/:id', auth, articleRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;