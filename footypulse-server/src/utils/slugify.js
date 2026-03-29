
const slugify = require('slugify');

const createSlug = (text) => {
  const base = slugify(text, {
    lower: true,
    strict: true,      // Remove special characters
    trim: true,
  });
  // Append timestamp to ensure uniqueness
  return `${base}-${Date.now()}`;
};

module.exports = { createSlug };
