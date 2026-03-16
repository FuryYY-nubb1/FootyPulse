// ============================================
// src/controllers/countriesController.js
// ============================================
// MODEL: src/models/countryModel.js
// ROUTES: src/routes/countriesRoutes.js
// ============================================

const CountryModel = require('../models/countryModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getAll = asyncHandler(async (req, res) => {
  const countries = await CountryModel.getAll();
  res.json({ success: true, data: countries });
});

exports.getById = asyncHandler(async (req, res) => {
  const country = await CountryModel.getById(req.params.id);
  if (!country) throw ApiError.notFound('Country not found');
  res.json({ success: true, data: country });
});

exports.getByCode = asyncHandler(async (req, res) => {
  const country = await CountryModel.getByCode(req.params.code.toUpperCase());
  if (!country) throw ApiError.notFound('Country not found');
  res.json({ success: true, data: country });
});

exports.create = asyncHandler(async (req, res) => {
  const country = await CountryModel.create(req.body);
  res.status(201).json({ success: true, data: country });
});

exports.update = asyncHandler(async (req, res) => {
  const country = await CountryModel.update(req.params.id, req.body);
  if (!country) throw ApiError.notFound('Country not found');
  res.json({ success: true, data: country });
});

exports.remove = asyncHandler(async (req, res) => {
  const country = await CountryModel.delete(req.params.id);
  if (!country) throw ApiError.notFound('Country not found');
  res.json({ success: true, message: 'Country deleted' });
});
