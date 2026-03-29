

const router = require('express').Router();
const controller = require('../controllers/teamsController');
const { auth } = require('../middleware/auth');
const teamRules = require('../validators/teamValidator');
const validate = require('../middleware/validate');

router.get('/:id/squad', controller.getSquad);
router.get('/:id/matches', controller.getMatches);       
router.get('/:id/transfers', controller.getTransfers);   
router.get('/:id/stats', controller.getStats);            

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, teamRules.create, validate, controller.create);
router.put('/:id', auth, teamRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;