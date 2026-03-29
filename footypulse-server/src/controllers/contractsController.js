

const ContractModel = require('../models/contractModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    team_id: req.query.team_id,
    person_id: req.query.person_id,
    is_current: req.query.is_current,
    contract_type: req.query.contract_type,
  };
  const [contracts, total] = await Promise.all([
    ContractModel.getAll(limit, offset, filters),
    ContractModel.getCount(filters),
  ]);
  res.json(paginate(contracts, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const contract = await ContractModel.getById(req.params.id);
  if (!contract) throw ApiError.notFound('Contract not found');
  res.json({ success: true, data: contract });
});

exports.create = asyncHandler(async (req, res) => {
  const contract = await ContractModel.create(req.body);
  res.status(201).json({ success: true, data: contract });
});

exports.update = asyncHandler(async (req, res) => {
  const contract = await ContractModel.update(req.params.id, req.body);
  if (!contract) throw ApiError.notFound('Contract not found');
  res.json({ success: true, data: contract });
});

exports.remove = asyncHandler(async (req, res) => {
  const contract = await ContractModel.delete(req.params.id);
  if (!contract) throw ApiError.notFound('Contract not found');
  res.json({ success: true, message: 'Contract deleted' });
});
