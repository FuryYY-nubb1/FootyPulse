// ============================================
// src/routes/teamsRoutes.js
// ============================================

const router = require('express').Router();
const controller = require('../controllers/teamsController');
const { auth } = require('../middleware/auth');
const teamRules = require('../validators/teamValidator');
const validate = require('../middleware/validate');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/squad', controller.getSquad);
router.post('/', auth, teamRules.create, validate, controller.create);
router.put('/:id', auth, teamRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
