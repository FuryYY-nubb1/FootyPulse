// ============================================
// src/routes/contractsRoutes.js
// ============================================
// UPDATED: Added GET /expiring → complex query for expiring contracts
// ============================================

const router = require('express').Router();
const controller = require('../controllers/contractsController');
const { auth } = require('../middleware/auth');

// ── Analytics (must come BEFORE /:id) ──
router.get('/expiring', controller.getExpiring);

// ── Standard CRUD ──
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;