// ============================================
// src/routes/personsRoutes.js
// ============================================

const router = require('express').Router();
const controller = require('../controllers/personsController');
const { auth } = require('../middleware/auth');
const personRules = require('../validators/personValidator');
const validate = require('../middleware/validate');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/career', controller.getCareer);
router.get('/:id/contracts', controller.getCareer);
router.get('/:id/stats', controller.getStats);
router.get('/:id/achievements', controller.getAchievements);
router.get('/:id/transfers', controller.getTransfers);
router.post('/', auth, personRules.create, validate, controller.create);
router.put('/:id', auth, personRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;