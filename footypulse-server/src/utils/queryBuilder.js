// ============================================
// src/utils/queryBuilder.js
// ============================================
// PURPOSE: Builds dynamic WHERE clauses from query parameters
// USED BY: Model files for filtered queries
//
// EXAMPLE:
//   // URL: /api/v1/teams?country_id=5&team_type=club
//   const filters = { country_id: 5, team_type: 'club' };
//   const { whereClause, values } = buildWhereClause(filters);
//   // whereClause = "WHERE country_id = $1 AND team_type = $2"
//   // values = [5, 'club']
// ============================================

const buildWhereClause = (filters) => {
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      conditions.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  return { whereClause, values, paramIndex };
};

const buildUpdateQuery = (table, idField, id, updates) => {
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      setClauses.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (setClauses.length === 0) return null;

  values.push(id);
  const query = `UPDATE ${table} SET ${setClauses.join(', ')} WHERE ${idField} = $${paramIndex} RETURNING *`;

  return { query, values };
};

module.exports = { buildWhereClause, buildUpdateQuery };
