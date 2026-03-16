// ============================================
// src/routes/matchPlayersRoutes.js
// ============================================

const router = require('express').Router();
const controller = require('../controllers/matchPlayersController');
const { auth } = require('../middleware/auth');

router.get('/match/:matchId', controller.getByMatch);   // GET /match-players/match/5
router.get('/:id', controller.getById);
router.post('/', auth, controller.create);
router.post('/bulk', auth, controller.createBulk);       // POST /match-players/bulk
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
