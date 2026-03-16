-- ============================================================================
-- FOOTYPULSE — SQL QUERY REFERENCE
-- ============================================================================
-- This file shows every SELECT query the app uses across all 18 tables.
-- Run these in Neon SQL Editor AFTER running schema.sql + seed.sql
-- to verify data and see how JOINs connect tables together.
--
-- TABLE MAP:
--   users → auth
--   countries → stadiums, teams, competitions, persons
--   stadiums → teams, matches
--   teams → contracts, matches, standings, transfers, achievements, articles, polls
--   competitions → seasons → matches → match_players, match_events
--   persons → contracts, match_players, match_events, transfers, achievements
--   articles → comments
--   polls → poll_votes
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  1. USERS — Login / Register / Profile                                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Find user by email (login)
SELECT user_id, email, password_hash, name, role
FROM users WHERE email = 'admin@footypulse.com';

-- Find user by ID (auth/me)
SELECT user_id, email, name, role, created_at
FROM users WHERE user_id = 1;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  2. COUNTRIES — Basic CRUD                                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All countries
SELECT * FROM countries ORDER BY name;

-- By 3-letter code
SELECT * FROM countries WHERE code = 'ENG';

-- Countries in a confederation
SELECT * FROM countries WHERE confederation = 'UEFA' ORDER BY name;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  3. STADIUMS — JOIN with countries                                     ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All stadiums with country name
SELECT s.*, c.name AS country_name
FROM stadiums s
JOIN countries c ON s.country_id = c.country_id
ORDER BY s.capacity DESC;

-- Stadiums in a specific country
SELECT s.*, c.name AS country_name
FROM stadiums s
JOIN countries c ON s.country_id = c.country_id
WHERE s.country_id = 1
ORDER BY s.capacity DESC;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  4. TEAMS — JOINs with countries, stadiums; filter by type             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All clubs with country + stadium info
SELECT t.*, c.name AS country_name, st.name AS stadium_name, st.capacity AS stadium_capacity
FROM teams t
JOIN countries c ON t.country_id = c.country_id
LEFT JOIN stadiums st ON t.stadium_id = st.stadium_id
WHERE t.team_type = 'club'
ORDER BY t.name
LIMIT 20 OFFSET 0;

-- National teams only
SELECT t.*, c.name AS country_name
FROM teams t
JOIN countries c ON t.country_id = c.country_id
WHERE t.team_type = 'national'
ORDER BY t.fifa_ranking;

-- Count teams
SELECT COUNT(*) FROM teams;

-- Team by ID (detail page)
SELECT t.*, c.name AS country_name, st.name AS stadium_name, st.capacity AS stadium_capacity
FROM teams t
JOIN countries c ON t.country_id = c.country_id
LEFT JOIN stadiums st ON t.stadium_id = st.stadium_id
WHERE t.team_id = 2;

-- Team squad (current contracts with person info)
SELECT p.person_id, p.display_name, p.primary_position, p.photo_url,
       c.jersey_number, c.contract_type, c.start_date, c.end_date
FROM contracts c
JOIN persons p ON c.person_id = p.person_id
WHERE c.team_id = 2 AND c.is_current = true
ORDER BY c.jersey_number;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  5. COMPETITIONS — JOINs with countries                                ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All competitions
SELECT comp.*, c.name AS country_name
FROM competitions comp
LEFT JOIN countries c ON comp.country_id = c.country_id
ORDER BY comp.level, comp.name;

-- Filter by type
SELECT comp.*, c.name AS country_name
FROM competitions comp
LEFT JOIN countries c ON comp.country_id = c.country_id
WHERE comp.competition_type = 'league'
ORDER BY comp.name;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  6. SEASONS — JOINs with competitions                                  ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All seasons with competition name
SELECT s.*, comp.name AS competition_name
FROM seasons s
JOIN competitions comp ON s.competition_id = comp.competition_id
ORDER BY s.is_current DESC, s.start_date DESC;

-- Current seasons only
SELECT s.*, comp.name AS competition_name
FROM seasons s
JOIN competitions comp ON s.competition_id = comp.competition_id
WHERE s.is_current = true;

-- Seasons for a specific competition
SELECT s.*, comp.name AS competition_name
FROM seasons s
JOIN competitions comp ON s.competition_id = comp.competition_id
WHERE s.competition_id = 1
ORDER BY s.start_date DESC;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  7. PERSONS — Players, Managers, Referees                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All players with nationality
SELECT p.*, c.name AS nationality
FROM persons p
LEFT JOIN countries c ON p.nationality_id = c.country_id
WHERE p.person_type = 'player'
ORDER BY p.market_value DESC NULLS LAST
LIMIT 20 OFFSET 0;

-- Search players by name
SELECT p.*, c.name AS nationality
FROM persons p
LEFT JOIN countries c ON p.nationality_id = c.country_id
WHERE p.first_name ILIKE '%sal%' OR p.last_name ILIKE '%sal%';

-- All managers
SELECT p.*, c.name AS nationality
FROM persons p
LEFT JOIN countries c ON p.nationality_id = c.country_id
WHERE p.person_type = 'manager';

-- Player detail by ID
SELECT p.*, c.name AS nationality
FROM persons p
LEFT JOIN countries c ON p.nationality_id = c.country_id
WHERE p.person_id = 5;

-- Player career (all contracts past + present)
SELECT c.*, t.name AS team_name, t.short_name, t.logo_url,
       pt.name AS parent_club_name
FROM contracts c
JOIN teams t ON c.team_id = t.team_id
LEFT JOIN teams pt ON c.parent_club_id = pt.team_id
WHERE c.person_id = 5
ORDER BY c.start_date DESC;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  8. CONTRACTS — JOINs with persons + teams                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All current contracts at a team (squad)
SELECT c.*, p.display_name, p.primary_position, p.photo_url, p.person_type
FROM contracts c
JOIN persons p ON c.person_id = p.person_id
WHERE c.team_id = 7 AND c.is_current = true
ORDER BY c.contract_type, c.jersey_number;

-- Manager of a team
SELECT c.*, p.display_name, p.preferred_formation,
       c.matches_managed, c.wins, c.draws, c.losses
FROM contracts c
JOIN persons p ON c.person_id = p.person_id
WHERE c.team_id = 2 AND c.contract_type = 'manager' AND c.is_current = true;

-- Loan players (contract_type = 'loan')
SELECT c.*, p.display_name, t.name AS team_name, pt.name AS parent_club_name
FROM contracts c
JOIN persons p ON c.person_id = p.person_id
JOIN teams t ON c.team_id = t.team_id
LEFT JOIN teams pt ON c.parent_club_id = pt.team_id
WHERE c.contract_type = 'loan' AND c.is_current = true;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  9. MATCHES — Most complex: 6 JOINs, multiple filters                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All matches with full context (home/away teams, competition, stadium, referee)
SELECT m.*,
       ht.name  AS home_team_name, ht.short_name AS home_short, ht.logo_url AS home_logo,
       at.name  AS away_team_name, at.short_name AS away_short, at.logo_url AS away_logo,
       s.name   AS season_name,
       comp.name AS competition_name, comp.short_name AS competition_short,
       st.name  AS stadium_name,
       ref.display_name AS referee_name
FROM matches m
JOIN teams ht ON m.home_team_id = ht.team_id
JOIN teams at ON m.away_team_id = at.team_id
JOIN seasons s ON m.season_id = s.season_id
JOIN competitions comp ON s.competition_id = comp.competition_id
LEFT JOIN stadiums st ON m.stadium_id = st.stadium_id
LEFT JOIN persons ref ON m.referee_id = ref.person_id
ORDER BY m.match_date DESC, m.kick_off_time DESC
LIMIT 20 OFFSET 0;

-- LIVE matches only
SELECT m.*,
       ht.name AS home_team_name, ht.short_name AS home_short,
       at.name AS away_team_name, at.short_name AS away_short,
       comp.name AS competition_name
FROM matches m
JOIN teams ht ON m.home_team_id = ht.team_id
JOIN teams at ON m.away_team_id = at.team_id
JOIN seasons s ON m.season_id = s.season_id
JOIN competitions comp ON s.competition_id = comp.competition_id
WHERE m.status = 'live';

-- Matches by date
SELECT m.*,
       ht.name AS home_team_name, ht.short_name AS home_short,
       at.name AS away_team_name, at.short_name AS away_short,
       comp.name AS competition_name
FROM matches m
JOIN teams ht ON m.home_team_id = ht.team_id
JOIN teams at ON m.away_team_id = at.team_id
JOIN seasons s ON m.season_id = s.season_id
JOIN competitions comp ON s.competition_id = comp.competition_id
WHERE m.match_date = '2024-08-17';

-- Matches for a specific team (home OR away)
SELECT m.*,
       ht.name AS home_team_name, ht.short_name AS home_short,
       at.name AS away_team_name, at.short_name AS away_short,
       comp.name AS competition_name
FROM matches m
JOIN teams ht ON m.home_team_id = ht.team_id
JOIN teams at ON m.away_team_id = at.team_id
JOIN seasons s ON m.season_id = s.season_id
JOIN competitions comp ON s.competition_id = comp.competition_id
WHERE m.home_team_id = 2 OR m.away_team_id = 2
ORDER BY m.match_date DESC;

-- Head-to-head between two teams
SELECT m.*,
       ht.name AS home_team_name, at.name AS away_team_name,
       comp.name AS competition_name
FROM matches m
JOIN teams ht ON m.home_team_id = ht.team_id
JOIN teams at ON m.away_team_id = at.team_id
JOIN seasons s ON m.season_id = s.season_id
JOIN competitions comp ON s.competition_id = comp.competition_id
WHERE (m.home_team_id = 1 AND m.away_team_id = 2)
   OR (m.home_team_id = 2 AND m.away_team_id = 1)
ORDER BY m.match_date DESC
LIMIT 10;

-- Upcoming scheduled matches
SELECT m.*,
       ht.name AS home_team_name, ht.short_name AS home_short,
       at.name AS away_team_name, at.short_name AS away_short,
       comp.name AS competition_name, st.name AS stadium_name
FROM matches m
JOIN teams ht ON m.home_team_id = ht.team_id
JOIN teams at ON m.away_team_id = at.team_id
JOIN seasons s ON m.season_id = s.season_id
JOIN competitions comp ON s.competition_id = comp.competition_id
LEFT JOIN stadiums st ON m.stadium_id = st.stadium_id
WHERE m.status = 'scheduled'
ORDER BY m.match_date, m.kick_off_time;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  10. MATCH PLAYERS — Lineups for a match                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All players in a match
SELECT mp.*, p.display_name, p.photo_url, t.name AS team_name, t.short_name
FROM match_players mp
JOIN persons p ON mp.person_id = p.person_id
JOIN teams t ON mp.team_id = t.team_id
WHERE mp.match_id = 1
ORDER BY mp.team_id, mp.is_starter DESC, mp.position;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  11. MATCH EVENTS — Goals, cards, subs for a match                    ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All events in a match (with player names)
SELECT me.*,
       p.display_name  AS player_name,
       rp.display_name AS related_player_name,
       t.short_name    AS team_name
FROM match_events me
JOIN teams t ON me.team_id = t.team_id
LEFT JOIN persons p ON me.person_id = p.person_id
LEFT JOIN persons rp ON me.related_person_id = rp.person_id
WHERE me.match_id = 1
ORDER BY me.minute, me.added_time;

-- Just goals for a match
SELECT me.*, p.display_name AS scorer, rp.display_name AS assister, t.short_name
FROM match_events me
JOIN teams t ON me.team_id = t.team_id
LEFT JOIN persons p ON me.person_id = p.person_id
LEFT JOIN persons rp ON me.related_person_id = rp.person_id
WHERE me.match_id = 7 AND me.event_type IN ('goal', 'own_goal', 'penalty');


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  12. STANDINGS — League table with team info                           ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Full league table for a season
SELECT st.*, t.name AS team_name, t.short_name, t.logo_url, t.primary_color
FROM standings st
JOIN teams t ON st.team_id = t.team_id
WHERE st.season_id = 1
ORDER BY st.position;

-- La Liga standings
SELECT st.*, t.name AS team_name, t.short_name
FROM standings st
JOIN teams t ON st.team_id = t.team_id
WHERE st.season_id = 2
ORDER BY st.position;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  13. TRANSFERS — JOINs with persons + from/to teams                   ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All transfers with full context
SELECT tr.*,
       p.display_name AS player_name, p.primary_position, p.photo_url,
       ft.name AS from_team_name, ft.short_name AS from_short,
       tt.name AS to_team_name,   tt.short_name AS to_short
FROM transfers tr
JOIN persons p ON tr.person_id = p.person_id
LEFT JOIN teams ft ON tr.from_team_id = ft.team_id
JOIN teams tt ON tr.to_team_id = tt.team_id
ORDER BY tr.transfer_date DESC NULLS FIRST
LIMIT 20 OFFSET 0;

-- Only official completed transfers
SELECT tr.*, p.display_name AS player_name,
       ft.name AS from_team_name, tt.name AS to_team_name
FROM transfers tr
JOIN persons p ON tr.person_id = p.person_id
LEFT JOIN teams ft ON tr.from_team_id = ft.team_id
JOIN teams tt ON tr.to_team_id = tt.team_id
WHERE tr.status = 'official'
ORDER BY tr.fee DESC NULLS LAST;

-- Transfer rumors
SELECT tr.*, p.display_name AS player_name,
       ft.name AS from_team_name, tt.name AS to_team_name
FROM transfers tr
JOIN persons p ON tr.person_id = p.person_id
LEFT JOIN teams ft ON tr.from_team_id = ft.team_id
JOIN teams tt ON tr.to_team_id = tt.team_id
WHERE tr.status IN ('rumor', 'negotiating')
ORDER BY tr.fee DESC NULLS LAST;

-- Transfers for a specific player
SELECT tr.*, ft.name AS from_team_name, tt.name AS to_team_name
FROM transfers tr
LEFT JOIN teams ft ON tr.from_team_id = ft.team_id
JOIN teams tt ON tr.to_team_id = tt.team_id
WHERE tr.person_id = 15;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  14. ACHIEVEMENTS — Team + player awards with context                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All achievements
SELECT a.*,
       t.name  AS team_name,
       p.display_name AS person_name,
       comp.name AS competition_name,
       s.name AS season_name
FROM achievements a
LEFT JOIN teams t ON a.team_id = t.team_id
LEFT JOIN persons p ON a.person_id = p.person_id
LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
LEFT JOIN seasons s ON a.season_id = s.season_id
ORDER BY a.year DESC, a.is_major DESC;

-- Major achievements only
SELECT a.*, t.name AS team_name, p.display_name AS person_name
FROM achievements a
LEFT JOIN teams t ON a.team_id = t.team_id
LEFT JOIN persons p ON a.person_id = p.person_id
WHERE a.is_major = true
ORDER BY a.year DESC;

-- Achievements for a specific player
SELECT a.*, comp.name AS competition_name
FROM achievements a
LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
WHERE a.person_id = 14;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  15. ARTICLES — News with related entities                            ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All published articles
SELECT a.*,
       t.name    AS team_name,    t.short_name AS team_short,
       comp.name AS competition_name,
       p.display_name AS person_name
FROM articles a
LEFT JOIN teams t ON a.team_id = t.team_id
LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
LEFT JOIN persons p ON a.person_id = p.person_id
WHERE a.status = 'published'
ORDER BY a.published_at DESC
LIMIT 20 OFFSET 0;

-- Featured articles
SELECT a.*, t.name AS team_name
FROM articles a
LEFT JOIN teams t ON a.team_id = t.team_id
WHERE a.status = 'published' AND a.is_featured = true
ORDER BY a.published_at DESC;

-- Article by slug (for URL-based lookup)
SELECT a.*,
       t.name AS team_name, comp.name AS competition_name,
       p.display_name AS person_name
FROM articles a
LEFT JOIN teams t ON a.team_id = t.team_id
LEFT JOIN competitions comp ON a.competition_id = comp.competition_id
LEFT JOIN persons p ON a.person_id = p.person_id
WHERE a.slug = 'salah-double-sinks-united-2024';

-- Filter by article type
SELECT a.*, t.name AS team_name
FROM articles a
LEFT JOIN teams t ON a.team_id = t.team_id
WHERE a.status = 'published' AND a.article_type = 'transfer'
ORDER BY a.published_at DESC;

-- Increment view count
UPDATE articles SET view_count = view_count + 1 WHERE article_id = 1;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  16. COMMENTS — Nested comments on articles                           ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Top-level comments on an article
SELECT * FROM comments
WHERE article_id = 1 AND parent_id IS NULL AND status = 'approved'
ORDER BY created_at DESC
LIMIT 50;

-- Replies to a specific comment
SELECT * FROM comments
WHERE parent_id = 1 AND status = 'approved'
ORDER BY created_at ASC;

-- Like a comment
UPDATE comments SET likes_count = likes_count + 1 WHERE comment_id = 1;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  17. POLLS — Active polls with related entities                       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All active polls
SELECT po.*,
       t.name AS team_name, comp.name AS competition_name,
       p.display_name AS person_name
FROM polls po
LEFT JOIN teams t ON po.team_id = t.team_id
LEFT JOIN competitions comp ON po.competition_id = comp.competition_id
LEFT JOIN persons p ON po.person_id = p.person_id
WHERE po.status = 'active'
ORDER BY po.featured DESC, po.created_at DESC;

-- Featured polls
SELECT * FROM polls WHERE featured = true AND status = 'active';


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  18. POLL VOTES — User votes with duplicate check                     ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- All votes for a poll
SELECT * FROM poll_votes WHERE poll_id = 1 ORDER BY voted_at;

-- Check if user already voted
SELECT * FROM poll_votes WHERE poll_id = 1 AND user_id = 'user_john';


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  BONUS: CROSS-TABLE AGGREGATE QUERIES                                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Top scorers (from match_events)
SELECT p.display_name, t.short_name AS team,
       COUNT(*) AS goals
FROM match_events me
JOIN persons p ON me.person_id = p.person_id
JOIN teams t ON me.team_id = t.team_id
WHERE me.event_type IN ('goal', 'penalty')
GROUP BY p.person_id, p.display_name, t.short_name
ORDER BY goals DESC
LIMIT 10;

-- Most valuable squad
SELECT t.name, SUM(p.market_value) AS total_value
FROM contracts c
JOIN teams t ON c.team_id = t.team_id
JOIN persons p ON c.person_id = p.person_id
WHERE c.is_current = true AND c.contract_type = 'player'
GROUP BY t.team_id, t.name
ORDER BY total_value DESC;

-- Global search across multiple tables
SELECT 'team' AS type, team_id AS id, name, short_name AS detail FROM teams WHERE name ILIKE '%liver%'
UNION ALL
SELECT 'person', person_id, display_name, primary_position FROM persons WHERE first_name ILIKE '%sal%' OR last_name ILIKE '%sal%'
UNION ALL
SELECT 'article', article_id, title, article_type FROM articles WHERE title ILIKE '%salah%' AND status = 'published'
UNION ALL
SELECT 'competition', competition_id, name, competition_type FROM competitions WHERE name ILIKE '%premier%';
