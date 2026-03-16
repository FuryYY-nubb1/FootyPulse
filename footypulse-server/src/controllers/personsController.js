// ============================================
// src/controllers/personsController.js
// ============================================

const PersonModel = require('../models/personModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    person_type: req.query.person_type,
    primary_position: req.query.position,
    nationality_id: req.query.nationality_id,
    search: req.query.search,
  };
  const [persons, total] = await Promise.all([
    PersonModel.getAll(limit, offset, filters),
    PersonModel.getCount(filters),
  ]);
  res.json(paginate(persons, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const person = await PersonModel.getById(req.params.id);
  if (!person) throw ApiError.notFound('Person not found');
  res.json({ success: true, data: person });
});

exports.getCareer = asyncHandler(async (req, res) => {
  const career = await PersonModel.getCareer(req.params.id);
  res.json({ success: true, data: career });
});

exports.create = asyncHandler(async (req, res) => {
  const person = await PersonModel.create(req.body);
  res.status(201).json({ success: true, data: person });
});

exports.update = asyncHandler(async (req, res) => {
  const person = await PersonModel.update(req.params.id, req.body);
  if (!person) throw ApiError.notFound('Person not found');
  res.json({ success: true, data: person });
});

exports.remove = asyncHandler(async (req, res) => {
  const person = await PersonModel.delete(req.params.id);
  if (!person) throw ApiError.notFound('Person not found');
  res.json({ success: true, message: 'Person deleted' });
});
