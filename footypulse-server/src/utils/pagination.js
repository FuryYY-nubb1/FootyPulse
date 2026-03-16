// ============================================
// src/utils/pagination.js
// ============================================
// PURPOSE: Standardizes pagination across all list endpoints
// USED BY: Controllers that return lists (GET /api/v1/teams, etc.)
//
// EXAMPLE in controller:
//   const { page, limit, offset } = getPagination(req.query);
//   const { rows, rowCount } = await TeamModel.getAll(limit, offset);
//   res.json(paginate(rows, totalCount, { page, limit }));
// ============================================

const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const paginate = (data, total, { page, limit }) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  },
});

module.exports = { getPagination, paginate };
