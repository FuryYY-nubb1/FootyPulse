

const router = require('express').Router();
const controller = require('../controllers/pollVotesController');
const { auth } = require('../middleware/auth');
const pollRules = require('../validators/pollValidator');
const validate = require('../middleware/validate');

router.get('/poll/:pollId', controller.getByPoll);           // GET /poll-votes/poll/3
router.post('/', pollRules.vote, validate, controller.vote); // POST /poll-votes
router.delete('/:id', auth, controller.remove);

module.exports = router;