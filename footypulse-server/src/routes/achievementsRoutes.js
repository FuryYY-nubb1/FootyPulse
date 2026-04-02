// ============================================
// src/routes/achievementsRoutes.js
// ============================================
// UPDATED: Added GET /most-decorated → complex query
// ============================================

const router = require('express').Router();
const controller = require('../controllers/achievementsController');
const { auth } = require('../middleware/auth');

// ── Analytics (must come BEFORE /:id) ──
router.get('/most-decorated', controller.getMostDecorated);

// ── Standard CRUD ──
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;