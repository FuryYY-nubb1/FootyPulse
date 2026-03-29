

const TransferModel = require('../models/transferModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginate } = require('../utils/pagination');

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const filters = {
    person_id: req.query.person_id,
    team_id: req.query.team_id,
    transfer_type: req.query.transfer_type,
    status: req.query.status,
    window_year: req.query.window_year,
    window_type: req.query.window_type,
  };
  const [transfers, total] = await Promise.all([
    TransferModel.getAll(limit, offset, filters),
    TransferModel.getCount(filters),
  ]);
  res.json(paginate(transfers, total, { page, limit }));
});

exports.getById = asyncHandler(async (req, res) => {
  const transfer = await TransferModel.getById(req.params.id);
  if (!transfer) throw ApiError.notFound('Transfer not found');
  res.json({ success: true, data: transfer });
});

exports.create = asyncHandler(async (req, res) => {
  const transfer = await TransferModel.create(req.body);
  res.status(201).json({ success: true, data: transfer });
});

exports.update = asyncHandler(async (req, res) => {
  const transfer = await TransferModel.update(req.params.id, req.body);
  if (!transfer) throw ApiError.notFound('Transfer not found');
  res.json({ success: true, data: transfer });
});

exports.remove = asyncHandler(async (req, res) => {
  const transfer = await TransferModel.delete(req.params.id);
  if (!transfer) throw ApiError.notFound('Transfer not found');
  res.json({ success: true, message: 'Transfer deleted' });
});
