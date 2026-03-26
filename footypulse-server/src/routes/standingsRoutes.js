// ============================================
// src/routes/standingsRoutes.js
// ============================================
// FIXED: Added root GET / route for query-param based lookups
//        Frontend calls: GET /standings?competitionId=1&seasonId=1
// ============================================

const router = require('express').Router();
const controller = require('../controllers/standingsController');
const { auth } = require('../middleware/auth');

// --- Query-param based lookup (used by frontend) ---
router.get('/', controller.getByQuery);                    // GET /standings?competitionId=1&seasonId=1

// --- URL-param based lookup (original) ---
router.get('/season/:seasonId', controller.getBySeason);   // GET /standings/season/3?group=A
router.get('/:id', controller.getById);

// --- Mutations ---
router.post('/', auth, controller.create);
router.post('/bulk', auth, controller.createBulk);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;