
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

exports.executeTransfer = asyncHandler(async (req, res) => {
  const { person_id, from_team_id, to_team_id, transfer_type, fee,
          transfer_date, window_year, window_type, jersey_number } = req.body;

  if (!person_id || !to_team_id || !transfer_type) {
    throw ApiError.badRequest('person_id, to_team_id, and transfer_type are required');
  }

  const transfer = await TransferModel.executeTransfer(
    person_id, from_team_id || null, to_team_id, transfer_type,
    fee || null, transfer_date || null, window_year || null,
    window_type || null, jersey_number || null
  );

  res.status(201).json({
    success: true,
    message: 'Transfer executed. Old contract ended, new contract created.',
    data: transfer,
  });
});


exports.getStats = asyncHandler(async (req, res) => {
  const windowYear = req.query.window_year ? parseInt(req.query.window_year) : null;
  const windowType = req.query.window_type || null;
  const stats = await TransferModel.getTransferStats(windowYear, windowType);
  res.json({ success: true, data: stats });
});


exports.getSpending = asyncHandler(async (req, res) => {
  const windowYear = req.query.window_year ? parseInt(req.query.window_year) : null;
  const spending = await TransferModel.getSpendingByLeague(windowYear);
  res.json({ success: true, data: spending });
});

exports.getAuditLog = asyncHandler(async (req, res) => {
  const transferId = req.params.transferId ? parseInt(req.params.transferId) : null;
  const limit = parseInt(req.query.limit) || 50;
  const audit = await TransferModel.getAuditLog(transferId, limit);
  res.json({ success: true, data: audit });
});