

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');


const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};


exports.register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Check if user exists
  const existing = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw ApiError.conflict('Email already registered');
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const result = await db.query(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, $3) RETURNING user_id, email, name, role, created_at`,
    [email, passwordHash, name]
  );

  const user = result.rows[0];
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    data: { user, token },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const user = result.rows[0];

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = generateToken(user);

  res.json({
    success: true,
    data: {
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    },
  });
});

exports.me = asyncHandler(async (req, res) => {
  const result = await db.query(
    'SELECT user_id, email, name, role, created_at FROM users WHERE user_id = $1',
    [req.user.user_id]
  );

  if (result.rows.length === 0) {
    throw ApiError.notFound('User not found');
  }

  res.json({ success: true, data: result.rows[0] });
});
