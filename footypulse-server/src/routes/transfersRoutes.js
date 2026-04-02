// ============================================
// src/routes/transfersRoutes.js
// ============================================
// UPDATED: Added routes for:
//   - POST /execute              → sp_execute_transfer procedure
//   - GET /stats                 → fn_get_transfer_stats function
//   - GET /spending              → complex query (spending by league)
//   - GET /audit                 → audit log from shadow table
// ============================================

const router = require('express').Router();
const controller = require('../controllers/transfersController');
const { auth } = require('../middleware/auth');
const transferRules = require('../validators/transferValidator');
const validate = require('../middleware/validate');

// ── Analytics (must come BEFORE /:id) ──
router.get('/stats', controller.getStats);
router.get('/spending', controller.getSpending);
router.get('/audit', auth, controller.getAuditLog);
router.get('/audit/:transferId', auth, controller.getAuditLog);

// Stored Procedure: sp_execute_transfer
router.post('/execute', auth, controller.executeTransfer);

// ── Standard CRUD ──
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, transferRules.create, validate, controller.create);
router.put('/:id', auth, transferRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;