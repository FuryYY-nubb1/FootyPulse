
const router = require('express').Router();
const controller = require('../controllers/transfersController');
const { auth } = require('../middleware/auth');
const transferRules = require('../validators/transferValidator');
const validate = require('../middleware/validate');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, transferRules.create, validate, controller.create);
router.put('/:id', auth, transferRules.update, validate, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
