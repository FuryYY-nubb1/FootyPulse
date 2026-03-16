// ============================================
// src/routes/searchRoutes.js
// ============================================

const router = require('express').Router();
const controller = require('../controllers/searchController');

router.get('/', controller.search);   // GET /search?q=messi&type=all

module.exports = router;
