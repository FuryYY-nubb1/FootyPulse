

const router = require('express').Router();
const controller = require('../controllers/pollsController');
const { auth } = require('../middleware/auth');
const pollRules = require('../validators/pollValidator');
const validate = require('../middleware/validate');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/results', controller.getResults);
router.get('/:id/user-vote/:userId', controller.getUserVote);


router.post('/:id/votes', controller.vote);

router.post('/', auth, pollRules.create, validate, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;