
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
