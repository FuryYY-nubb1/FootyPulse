
const db = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.search = asyncHandler(async (req, res) => {
  const { q, type = 'all' } = req.query;
  const limit = parseInt(req.query.limit) || 10;

  if (!q || q.trim().length < 2) {
    throw ApiError.badRequest('Search query must be at least 2 characters');
  }

  const searchTerm = `%${q.trim()}%`;
  const results = {};

  if (type === 'all' || type === 'persons' || type === 'players') {
    const persons = await db.query(
      `SELECT p.person_id, p.display_name, p.person_type, p.primary_position,
      p.photo_url, p.market_value,
      t.name AS team_name, t.logo_url AS team_logo, t.team_id,
      c.jersey_number,
      'person' AS result_type
       FROM persons p
       LEFT JOIN contracts c ON c.person_id = p.person_id AND c.is_current = true
       LEFT JOIN teams t ON c.team_id = t.team_id
       WHERE p.first_name ILIKE $1 OR p.last_name ILIKE $1 OR p.display_name ILIKE $1
       ORDER BY p.market_value DESC NULLS LAST
       LIMIT $2`,
      [searchTerm, limit]
    );
    results.persons = persons.rows;
    results.players = persons.rows;
  }

  let playerTeamIds = [];
  if (results.players && results.players.length > 0) {
    playerTeamIds = results.players
      .filter(p => p.team_id)
      .map(p => p.team_id)
      .filter((id, i, arr) => arr.indexOf(id) === i);
  }

  // Direct name match + teams from matched players' contracts
  if (type === 'all' || type === 'teams') {
    let teamQuery = `
      SELECT team_id, name, short_name, logo_url, team_type, 'team' AS result_type
      FROM teams WHERE name ILIKE $1 OR short_name ILIKE $1`;
    const teamValues = [searchTerm];
    let idx = 2;

    if (playerTeamIds.length > 0) {
      teamQuery += ` OR team_id = ANY($${idx})`;
      teamValues.push(playerTeamIds);
      idx++;
    }

    teamQuery += ` LIMIT $${idx}`;
    teamValues.push(limit);

    const teams = await db.query(teamQuery, teamValues);
    results.teams = teams.rows;
  }

  if (type === 'all' || type === 'competitions') {
    const competitions = await db.query(
      `SELECT competition_id, name, short_name, competition_type, logo_url, 'competition' AS result_type
       FROM competitions WHERE name ILIKE $1 OR short_name ILIKE $1 LIMIT $2`,
      [searchTerm, limit]
    );
    results.competitions = competitions.rows;
  }

  if (type === 'all' || type === 'articles') {
    const articles = await db.query(
      `SELECT article_id, title, slug, excerpt, article_type,
              media->>'featured_image' AS cover_image,
              published_at, author_name,
              'article' AS result_type
       FROM articles WHERE status = 'published'
       AND (title ILIKE $1 OR excerpt ILIKE $1 OR content ILIKE $1) LIMIT $2`,
      [searchTerm, limit]
    );
    results.articles = articles.rows;
  }

  if (type === 'all' || type === 'matches') {
    const allTeamIds = [...playerTeamIds];

    // Also find team IDs by direct name match
    const teamNameMatch = await db.query(
      `SELECT team_id FROM teams WHERE name ILIKE $1 OR short_name ILIKE $1`,
      [searchTerm]
    );
    for (const row of teamNameMatch.rows) {
      if (!allTeamIds.includes(row.team_id)) {
        allTeamIds.push(row.team_id);
      }
    }

    if (allTeamIds.length > 0) {
      const matches = await db.query(
        `SELECT m.match_id, m.match_date, m.kick_off_time, m.status,
        m.home_score, m.away_score,
        m.home_team_id, m.away_team_id,
        ht.name AS home_team_name, ht.short_name AS home_short, ht.logo_url AS home_logo,
        at.name AS away_team_name, at.short_name AS away_short, at.logo_url AS away_logo,
        comp.name AS competition_name, comp.logo_url AS competition_logo,
        'match' AS result_type
         FROM matches m
         JOIN teams ht ON m.home_team_id = ht.team_id
         JOIN teams at ON m.away_team_id = at.team_id
         JOIN seasons s ON m.season_id = s.season_id
         JOIN competitions comp ON s.competition_id = comp.competition_id
         WHERE m.home_team_id = ANY($1) OR m.away_team_id = ANY($1)
         ORDER BY m.match_date DESC
         LIMIT $2`,
        [allTeamIds, limit]
      );
      results.matches = matches.rows;
    } else {
      results.matches = [];
    }
  }

  res.json({ success: true, query: q, data: results });
});