// ============================================
// src/routes/standingsRoutes.js
// ============================================

const router = require('express').Router();
const controller = require('../controllers/standingsController');
const { auth } = require('../middleware/auth');

router.get('/season/:seasonId', controller.getBySeason);  // GET /standings/season/3?group=A
router.get('/:id', controller.getById);
router.post('/', auth, controller.create);
router.post('/bulk', auth, controller.createBulk);        // POST /standings/bulk
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
