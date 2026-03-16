// ============================================
// src/utils/slugify.js
// ============================================
// PURPOSE: Generates URL-friendly slugs for articles
// USED BY: articlesController.js when creating articles
//
// EXAMPLE:
//   createSlug("Messi Scores Hat-Trick!") → "messi-scores-hat-trick-1705234567890"
// ============================================

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
