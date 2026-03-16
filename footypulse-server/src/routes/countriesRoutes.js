// ============================================
// src/routes/countriesRoutes.js
// ============================================
// CONTROLLER: src/controllers/countriesController.js
//
// ENDPOINTS:
//   GET    /api/v1/countries          → List all countries
//   GET    /api/v1/countries/:id      → Get by ID
//   GET    /api/v1/countries/code/:code → Get by 3-letter code
//   POST   /api/v1/countries          → Create (auth required)
//   PUT    /api/v1/countries/:id      → Update (auth required)
//   DELETE /api/v1/countries/:id      → Delete (auth required)
// ============================================

const router = require('express').Router();
const controller = require('../controllers/countriesController');
const { auth } = require('../middleware/auth');

router.get('/', controller.getAll);
router.get('/code/:code', controller.getByCode);
router.get('/:id', controller.getById);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
