-- ============================================
-- FOOTYPULSE DATABASE SEED DATA
-- Run this after schema.sql to populate the database
-- ============================================

-- Clear existing data (in reverse order of dependencies)
TRUNCATE TABLE poll_votes CASCADE;
TRUNCATE TABLE polls CASCADE;
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE articles CASCADE;
TRUNCATE TABLE achievements CASCADE;
TRUNCATE TABLE transfers CASCADE;
TRUNCATE TABLE standings CASCADE;
TRUNCATE TABLE match_events CASCADE;
TRUNCATE TABLE match_players CASCADE;
TRUNCATE TABLE matches CASCADE;
TRUNCATE TABLE contracts CASCADE;
TRUNCATE TABLE persons CASCADE;
TRUNCATE TABLE seasons CASCADE;
TRUNCATE TABLE competitions CASCADE;
TRUNCATE TABLE teams CASCADE;
TRUNCATE TABLE stadiums CASCADE;
TRUNCATE TABLE countries CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset sequences
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
ALTER SEQUENCE countries_country_id_seq RESTART WITH 1;
ALTER SEQUENCE stadiums_stadium_id_seq RESTART WITH 1;
ALTER SEQUENCE teams_team_id_seq RESTART WITH 1;
ALTER SEQUENCE competitions_competition_id_seq RESTART WITH 1;
ALTER SEQUENCE seasons_season_id_seq RESTART WITH 1;
ALTER SEQUENCE persons_person_id_seq RESTART WITH 1;
ALTER SEQUENCE contracts_contract_id_seq RESTART WITH 1;
ALTER SEQUENCE matches_match_id_seq RESTART WITH 1;
ALTER SEQUENCE match_players_match_player_id_seq RESTART WITH 1;
ALTER SEQUENCE match_events_event_id_seq RESTART WITH 1;
ALTER SEQUENCE standings_standing_id_seq RESTART WITH 1;
ALTER SEQUENCE transfers_transfer_id_seq RESTART WITH 1;
ALTER SEQUENCE achievements_achievement_id_seq RESTART WITH 1;
ALTER SEQUENCE articles_article_id_seq RESTART WITH 1;
ALTER SEQUENCE comments_comment_id_seq RESTART WITH 1;
ALTER SEQUENCE polls_poll_id_seq RESTART WITH 1;
ALTER SEQUENCE poll_votes_vote_id_seq RESTART WITH 1;

-- ============================================
-- 1. USERS
-- ============================================
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@footypulse.com', '$2b$10$abcdefghijklmnopqrstuv', 'Admin User', 'admin'),
('editor@footypulse.com', '$2b$10$abcdefghijklmnopqrstuv', 'John Editor', 'editor'),
('writer@footypulse.com', '$2b$10$abcdefghijklmnopqrstuv', 'Sarah Writer', 'user');

-- ============================================
-- 2. COUNTRIES
-- ============================================
INSERT INTO countries (name, code, flag_url, confederation) VALUES
('England', 'ENG', 'https://flagcdn.com/w320/gb-eng.png', 'UEFA'),
('Spain', 'ESP', 'https://flagcdn.com/w320/es.png', 'UEFA'),
('Germany', 'GER', 'https://flagcdn.com/w320/de.png', 'UEFA'),
('Italy', 'ITA', 'https://flagcdn.com/w320/it.png', 'UEFA'),
('France', 'FRA', 'https://flagcdn.com/w320/fr.png', 'UEFA'),
('Portugal', 'POR', 'https://flagcdn.com/w320/pt.png', 'UEFA'),
('Netherlands', 'NED', 'https://flagcdn.com/w320/nl.png', 'UEFA'),
('Belgium', 'BEL', 'https://flagcdn.com/w320/be.png', 'UEFA'),
('Brazil', 'BRA', 'https://flagcdn.com/w320/br.png', 'CONMEBOL'),
('Argentina', 'ARG', 'https://flagcdn.com/w320/ar.png', 'CONMEBOL'),
('Uruguay', 'URU', 'https://flagcdn.com/w320/uy.png', 'CONMEBOL'),
('Croatia', 'CRO', 'https://flagcdn.com/w320/hr.png', 'UEFA'),
('Poland', 'POL', 'https://flagcdn.com/w320/pl.png', 'UEFA'),
('Norway', 'NOR', 'https://flagcdn.com/w320/no.png', 'UEFA'),
('Egypt', 'EGY', 'https://flagcdn.com/w320/eg.png', 'CAF'),
('Senegal', 'SEN', 'https://flagcdn.com/w320/sn.png', 'CAF'),
('South Korea', 'KOR', 'https://flagcdn.com/w320/kr.png', 'AFC'),
('Japan', 'JPN', 'https://flagcdn.com/w320/jp.png', 'AFC'),
('Morocco', 'MAR', 'https://flagcdn.com/w320/ma.png', 'CAF'),
('Colombia', 'COL', 'https://flagcdn.com/w320/co.png', 'CONMEBOL');

-- ============================================
-- 3. STADIUMS
-- ============================================
INSERT INTO stadiums (name, city, country_id, capacity, opened_year, surface_type) VALUES
('Old Trafford', 'Manchester', 1, 74140, 1910, 'Grass'),
('Anfield', 'Liverpool', 1, 53394, 1884, 'Grass'),
('Emirates Stadium', 'London', 1, 60260, 2006, 'Grass'),
('Etihad Stadium', 'Manchester', 1, 53400, 2003, 'Grass'),
('Stamford Bridge', 'London', 1, 40341, 1877, 'Grass'),
('Tottenham Hotspur Stadium', 'London', 1, 62850, 2019, 'Grass'),
('Camp Nou', 'Barcelona', 2, 99354, 1957, 'Grass'),
('Santiago Bernabéu', 'Madrid', 2, 81044, 1947, 'Grass'),
('Wanda Metropolitano', 'Madrid', 2, 68456, 2017, 'Grass'),
('Allianz Arena', 'Munich', 3, 75000, 2005, 'Grass'),
('Signal Iduna Park', 'Dortmund', 3, 81365, 1974, 'Grass'),
('San Siro', 'Milan', 4, 75923, 1926, 'Grass'),
('Stadio Olimpico', 'Rome', 4, 70634, 1953, 'Grass'),
('Allianz Stadium', 'Turin', 4, 41507, 2011, 'Grass'),
('Parc des Princes', 'Paris', 5, 47929, 1972, 'Grass'),
('Estádio da Luz', 'Lisbon', 6, 64642, 2003, 'Grass'),
('Estádio do Dragão', 'Porto', 6, 50033, 2003, 'Grass'),
('Johan Cruyff Arena', 'Amsterdam', 7, 54990, 1996, 'Grass');

-- ============================================
-- 4. TEAMS (Club Teams)
-- ============================================
INSERT INTO teams (name, short_name, team_type, country_id, city, stadium_id, founded_year, logo_url, primary_color) VALUES
-- Premier League
('Manchester United', 'Man United', 'club', 1, 'Manchester', 1, 1878, 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1920px-Manchester_United_FC_crest.svg.png', '#DA291C'),
('Liverpool FC', 'Liverpool', 'club', 1, 'Liverpool', 2, 1892, 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/500px-Liverpool_FC.svg.png', '#C8102E'),
('Arsenal FC', 'Arsenal', 'club', 1, 'London', 3, 1886, 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1280px-Arsenal_FC.svg.png', '#EF0107'),
('Manchester City', 'Man City', 'club', 1, 'Manchester', 4, 1880, 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1920px-Manchester_City_FC_badge.svg.png', '#6CABDD'),
('Chelsea FC', 'Chelsea', 'club', 1, 'London', 5, 1905, 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/500px-Chelsea_FC.svg.png', '#034694'),
('Tottenham Hotspur', 'Spurs', 'club', 1, 'London', 6, 1882, 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Tottenham_Hotspur.svg/960px-Tottenham_Hotspur.svg.png', '#132257'),

-- La Liga
('FC Barcelona', 'Barcelona', 'club', 2, 'Barcelona', 7, 1899, 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1920px-FC_Barcelona_%28crest%29.svg.png', '#A50044'),
('Real Madrid CF', 'Real Madrid', 'club', 2, 'Madrid', 8, 1902, 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1280px-Real_Madrid_CF.svg.png', '#FFFFFF'),
('Atlético Madrid', 'Atlético', 'club', 2, 'Madrid', 9, 1903, 'https://logo.url/atletico.png', '#CB3524'),

-- Bundesliga
('Bayern Munich', 'Bayern', 'club', 3, 'Munich', 10, 1900, 'https://logo.url/bayern.png', '#DC052D'),
('Borussia Dortmund', 'Dortmund', 'club', 3, 'Dortmund', 11, 1909, 'https://logo.url/dortmund.png', '#FDE100'),

-- Serie A
('AC Milan', 'Milan', 'club', 4, 'Milan', 12, 1899, 'https://logo.url/acmilan.png', '#FB090B'),
('Inter Milan', 'Inter', 'club', 4, 'Milan', 12, 1908, 'https://logo.url/inter.png', '#0068A8'),
('Juventus FC', 'Juventus', 'club', 4, 'Turin', 14, 1897, 'https://logo.url/juventus.png', '#000000'),
('AS Roma', 'Roma', 'club', 4, 'Rome', 13, 1927, 'https://logo.url/roma.png', '#8B0304'),

-- Ligue 1
('Paris Saint-Germain', 'PSG', 'club', 5, 'Paris', 15, 1970, 'https://logo.url/psg.png', '#004170'),

-- Portugal
('SL Benfica', 'Benfica', 'club', 6, 'Lisbon', 16, 1904, 'https://logo.url/benfica.png', '#E30613'),
('FC Porto', 'Porto', 'club', 6, 'Porto', 17, 1893, 'https://logo.url/porto.png', '#003399'),

-- Netherlands
('Ajax Amsterdam', 'Ajax', 'club', 7, 'Amsterdam', 18, 1900, 'https://logo.url/ajax.png', '#D2122E');

-- ============================================
-- 5. TEAMS (National Teams)
-- ============================================
INSERT INTO teams (name, short_name, team_type, country_id, national_team_level, fifa_ranking, logo_url, primary_color) VALUES
('England National Team', 'England', 'national', 1, 'senior_men', 4, 'https://logo.url/england.png', '#FFFFFF'),
('Spain National Team', 'Spain', 'national', 2, 'senior_men', 8, 'https://logo.url/spain.png', '#C60B1E'),
('Germany National Team', 'Germany', 'national', 3, 'senior_men', 11, 'https://logo.url/germany.png', '#000000'),
('France National Team', 'France', 'national', 5, 'senior_men', 2, 'https://logo.url/france.png', '#0055A4'),
('Brazil National Team', 'Brazil', 'national', 9, 'senior_men', 5, 'https://logo.url/brazil.png', '#009739'),
('Argentina National Team', 'Argentina', 'national', 10, 'senior_men', 1, 'https://logo.url/argentina.png', '#74ACDF'),
('Portugal National Team', 'Portugal', 'national', 6, 'senior_men', 6, 'https://logo.url/portugal.png', '#FF0000');

-- ============================================
-- 6. COMPETITIONS
-- ============================================
INSERT INTO competitions (name, short_name, competition_type, country_id, level, season_format, logo_url) VALUES
('Premier League', 'EPL', 'league', 1, 1, 'league', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/3840px-Premier_League_Logo.svg.png'),
('La Liga', 'La Liga', 'league', 2, 1, 'league', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/1920px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png'),
('Bundesliga', 'Bundesliga', 'league', 3, 1, 'league', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/1920px-Bundesliga_logo_%282017%29.svg.png'),
('Serie A', 'Serie A', 'league', 4, 1, 'league', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/Serie_A_ENILIVE_logo.svg/960px-Serie_A_ENILIVE_logo.svg.png'),
('Ligue 1', 'Ligue 1', 'league', 5, 1, 'league', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Logo_Ligue_1_McDonald%27s_2024.svg/960px-Logo_Ligue_1_McDonald%27s_2024.svg.png'),
('UEFA Champions League', 'UCL', 'international', NULL, 1, 'group_knockout', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/UEFA_Champions_League.svg/1920px-UEFA_Champions_League.svg.png'),
('FA Cup', 'FA Cup', 'cup', 1, 1, 'knockout', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/FA_Cup_logo_%282020%29.svg/1280px-FA_Cup_logo_%282020%29.svg.png'),
('Copa del Rey', 'Copa del Rey', 'cup', 2, 1, 'knockout', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Copa_Del_Rey_Official_Logo.png/500px-Copa_Del_Rey_Official_Logo.png'),
('FIFA World Cup', 'World Cup', 'international', NULL, 1, 'group_knockout', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/960px-2026_FIFA_World_Cup_emblem.svg.png'),
('UEFA Europa League', 'UEL', 'international', NULL, 2, 'group_knockout', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/UEFA_Europa_League_logo_%282024_version%29.svg/500px-UEFA_Europa_League_logo_%282024_version%29.svg.png');


-- 7. SEASONS
-- ============================================
INSERT INTO seasons (competition_id, name, start_date, end_date, is_current, stages) VALUES
-- Current Seasons
(1, '2024/25', '2024-08-16', '2025-05-25', TRUE, '["Matchday 1", "Matchday 2", "Matchday 3", "Matchday 4", "Matchday 5"]'),
(2, '2024/25', '2024-08-15', '2025-05-31', TRUE, '["Matchday 1", "Matchday 2", "Matchday 3"]'),
(3, '2024/25', '2024-08-23', '2025-05-17', TRUE, '["Matchday 1", "Matchday 2", "Matchday 3"]'),
(4, '2024/25', '2024-08-17', '2025-05-25', TRUE, '["Matchday 1", "Matchday 2", "Matchday 3"]'),
(5, '2024/25', '2024-08-16', '2025-05-18', TRUE, '["Matchday 1", "Matchday 2", "Matchday 3"]'),
(6, '2024/25', '2024-09-17', '2025-05-31', TRUE, '["Group Stage", "Round of 16", "Quarter-finals", "Semi-finals", "Final"]'),

-- Previous Season
(1, '2023/24', '2023-08-11', '2024-05-19', FALSE, '["Matchday 1", "Matchday 38"]'),
(6, '2023/24', '2023-09-19', '2024-06-01', FALSE, '["Group Stage", "Round of 16", "Quarter-finals", "Semi-finals", "Final"]');

-- 8. PERSONS (Players)

INSERT INTO persons (person_type, first_name, last_name, date_of_birth, nationality_id, photo_url, height_cm, preferred_foot, primary_position, market_value) VALUES
-- Manchester United
('player', 'Bruno', 'Fernandes', '1994-09-08', 6, 'https://photo.url/bruno.jpg', 179, 'right', 'CAM', 75000000.00),
('player', 'Marcus', 'Rashford', '1997-10-31', 1, 'https://photo.url/rashford.jpg', 180, 'right', 'LW', 70000000.00),
('player', 'Casemiro', 'Silva', '1992-02-23', 9, 'https://assets.manutd.com/AssetPicker/images/0/0/22/86/1464003/18-Casemiro1751376486567.png', 185, 'right', 'CDM', 60000000.00),

-- Liverpool
('player', 'Mohamed', 'Salah', '1992-06-15', 15, 'https://photo.url/salah.jpg', 175, 'left', 'RW', 80000000.00),
('player', 'Virgil', 'van Dijk', '1991-07-08', 7, 'https://photo.url/vandijk.jpg', 195, 'right', 'CB', 75000000.00),
('player', 'Trent', 'Alexander-Arnold', '1998-10-07', 1, 'https://photo.url/taa.jpg', 180, 'right', 'RB', 70000000.00),

-- Arsenal
('player', 'Bukayo', 'Saka', '2001-09-05', 1, 'https://photo.url/saka.jpg', 178, 'left', 'RW', 120000000.00),
('player', 'Martin', 'Ødegaard', '1998-12-17', 14, 'https://photo.url/odegaard.jpg', 178, 'left', 'CAM', 100000000.00),
('player', 'Gabriel', 'Magalhães', '1997-12-19', 9, 'https://photo.url/gabriel.jpg', 190, 'left', 'CB', 50000000.00),

-- Manchester City
('player', 'Erling', 'Haaland', '2000-07-21', 14, 'https://photo.url/haaland.jpg', 194, 'left', 'ST', 180000000.00),
('player', 'Kevin', 'De Bruyne', '1991-06-28', 8, 'https://photo.url/kdb.jpg', 181, 'right', 'CAM', 80000000.00),
('player', 'Rodri', 'Hernández', '1996-06-22', 2, 'https://photo.url/rodri.jpg', 191, 'right', 'CDM', 120000000.00),

-- Real Madrid
('player', 'Vinícius', 'Júnior', '2000-07-12', 9, 'https://photo.url/vinicius.jpg', 176, 'right', 'LW', 150000000.00),
('player', 'Jude', 'Bellingham', '2003-06-29', 1, 'https://www.mundiario.com/asset/thumbnail,1280,720,center,center/media/mundiario/images/2023/07/27/2023072717354448867.png', 186, 'right', 'CM', 180000000.00),
('player', 'Federico', 'Valverde', '1998-07-22', 11, 'https://photo.url/valverde.jpg', 182, 'right', 'CM', 120000000.00),

-- Barcelona
('player', 'Robert', 'Lewandowski', '1988-08-21', 13, 'https://photo.url/lewandowski.jpg', 185, 'right', 'ST', 30000000.00),
('player', 'Pedri', 'González', '2002-11-25', 2, 'https://photo.url/pedri.jpg', 174, 'right', 'CM', 100000000.00),
('player', 'Gavi', 'Páez', '2004-08-05', 2, 'https://photo.url/gavi.jpg', 173, 'right', 'CM', 90000000.00),

-- PSG
('player', 'Kylian', 'Mbappé', '1998-12-20', 5, 'https://photo.url/mbappe.jpg', 178, 'right', 'ST', 180000000.00),
('player', 'Achraf', 'Hakimi', '1998-11-04', 19, 'https://photo.url/hakimi.jpg', 181, 'right', 'RB', 65000000.00),

-- Bayern Munich
('player', 'Harry', 'Kane', '1993-07-28', 1, 'https://assets.bundesliga.com/player/dfl-obj-j00zz3-dfl-clu-00000g-dfl-sea-0001k9.png', 188, 'right', 'ST', 100000000.00),
('player', 'Jamal', 'Musiala', '2003-02-26', 3, 'https://photo.url/musiala.jpg', 180, 'right', 'CAM', 120000000.00);

-- 9. PERSONS (Managers)

INSERT INTO persons (person_type, first_name, last_name, date_of_birth, nationality_id, photo_url, preferred_formation) VALUES
('manager', 'Erik', 'ten Hag', '1970-02-02', 7, 'https://photo.url/tenhag.jpg', '4-2-3-1'),
('manager', 'Jürgen', 'Klopp', '1967-06-16', 3, 'https://photo.url/klopp.jpg', '4-3-3'),
('manager', 'Mikel', 'Arteta', '1982-03-26', 2, 'https://photo.url/arteta.jpg', '4-3-3'),
('manager', 'Pep', 'Guardiola', '1971-01-18', 2, 'https://photo.url/pep.jpg', '4-3-3'),
('manager', 'Carlo', 'Ancelotti', '1959-06-10', 4, 'https://photo.url/ancelotti.jpg', '4-3-3'),
('manager', 'Xavi', 'Hernández', '1980-01-25', 2, 'https://photo.url/xavi.jpg', '4-3-3'),
('manager', 'Thomas', 'Tuchel', '1973-08-29', 3, 'https://photo.url/tuchel.jpg', '3-4-2-1'),
('manager', 'Luis', 'Enrique', '1970-05-08', 2, 'https://photo.url/luisenrique.jpg', '4-3-3');


-- 10. PERSONS (Referees)

INSERT INTO persons (person_type, first_name, last_name, date_of_birth, nationality_id, photo_url) VALUES
('referee', 'Michael', 'Oliver', '1985-02-20', 1, 'https://photo.url/oliver.jpg'),
('referee', 'Anthony', 'Taylor', '1978-10-20', 1, 'https://photo.url/taylor.jpg'),
('referee', 'Clément', 'Turpin', '1982-05-16', 5, 'https://photo.url/turpin.jpg'),
('referee', 'Daniele', 'Orsato', '1975-11-23', 4, 'https://photo.url/orsato.jpg');

-- 11. CONTRACTS (Players)

INSERT INTO contracts (person_id, team_id, contract_type, start_date, end_date, jersey_number, is_current) VALUES
-- Manchester United
(1, 1, 'player', '2020-01-30', '2026-06-30', 8, TRUE),
(2, 1, 'player', '2016-07-01', '2028-06-30', 10, TRUE),
(3, 1, 'player', '2022-08-22', '2026-06-30', 18, TRUE),

-- Liverpool
(4, 2, 'player', '2017-07-01', '2025-06-30', 11, TRUE),
(5, 2, 'player', '2018-01-01', '2025-06-30', 4, TRUE),
(6, 2, 'player', '2016-07-01', '2025-06-30', 66, TRUE),

-- Arsenal
(7, 3, 'player', '2018-07-01', '2027-06-30', 7, TRUE),
(8, 3, 'player', '2021-08-20', '2028-06-30', 8, TRUE),
(9, 3, 'player', '2020-09-01', '2027-06-30', 6, TRUE),

-- Manchester City
(10, 4, 'player', '2022-07-01', '2027-06-30', 9, TRUE),
(11, 4, 'player', '2015-08-30', '2025-06-30', 17, TRUE),
(12, 4, 'player', '2019-07-01', '2027-06-30', 16, TRUE),

-- Real Madrid
(13, 8, 'player', '2018-07-12', '2027-06-30', 7, TRUE),
(14, 8, 'player', '2023-06-14', '2029-06-30', 5, TRUE),
(15, 8, 'player', '2021-08-31', '2027-06-30', 15, TRUE),

-- Barcelona
(16, 7, 'player', '2022-07-19', '2026-06-30', 9, TRUE),
(17, 7, 'player', '2019-09-02', '2026-06-30', 8, TRUE),
(18, 7, 'player', '2021-08-30', '2026-06-30', 6, TRUE),

-- PSG
(19, 16, 'player', '2017-08-31', '2025-06-30', 7, TRUE),
(20, 16, 'player', '2021-07-06', '2026-06-30', 2, TRUE),

-- Bayern Munich
(21, 10, 'player', '2023-08-12', '2027-06-30', 9, TRUE),
(22, 10, 'player', '2019-07-01', '2026-06-30', 42, TRUE);

-- ============================================
-- 12. CONTRACTS (Managers)
-- ============================================
INSERT INTO contracts (person_id, team_id, contract_type, start_date, end_date, is_current, matches_managed, wins, draws, losses) VALUES
(23, 1, 'manager', '2022-05-16', '2025-06-30', TRUE, 82, 47, 20, 15),
(24, 2, 'manager', '2015-10-08', '2026-06-30', TRUE, 450, 278, 102, 70),
(25, 3, 'manager', '2019-12-20', '2027-06-30', TRUE, 220, 134, 50, 36),
(26, 4, 'manager', '2016-07-01', '2025-06-30', TRUE, 420, 320, 62, 38),
(27, 8, 'manager', '2021-06-01', '2026-06-30', TRUE, 180, 125, 35, 20),
(28, 7, 'manager', '2021-11-08', '2025-06-30', TRUE, 120, 75, 28, 17),
(29, 10, 'manager', '2023-03-24', '2025-06-30', TRUE, 55, 42, 8, 5),
(30, 16, 'manager', '2023-07-04', '2025-06-30', TRUE, 65, 48, 12, 5);


-- 13. MATCHES (Recent and Upcoming)

INSERT INTO matches (season_id, stage_name, matchday, home_team_id, away_team_id, home_score, away_score, match_date, kick_off_time, stadium_id, referee_id, status, attendance, home_formation, away_formation, home_stats, away_stats) VALUES
-- Premier League 2024/25 - Matchday 25 (Recent)
(1, 'Matchday 25', 25, 1, 2, 2, 2, '2025-02-10', '20:00:00', 1, 31, 'finished', 73850, '4-2-3-1', '4-3-3', 
'{"possession": 52, "shots": 14, "shots_on_target": 6, "corners": 7, "fouls": 11, "yellow_cards": 2, "red_cards": 0, "passes": 458, "pass_accuracy": 84}',
'{"possession": 48, "shots": 12, "shots_on_target": 5, "corners": 5, "fouls": 9, "yellow_cards": 1, "red_cards": 0, "passes": 432, "pass_accuracy": 86}'),

(1, 'Matchday 25', 25, 3, 4, 1, 0, '2025-02-09', '16:30:00', 3, 32, 'finished', 60142, '4-3-3', '4-3-3',
'{"possession": 58, "shots": 18, "shots_on_target": 7, "corners": 9, "fouls": 8, "yellow_cards": 1, "red_cards": 0, "passes": 612, "pass_accuracy": 89}',
'{"possession": 42, "shots": 8, "shots_on_target": 3, "corners": 3, "fouls": 12, "yellow_cards": 3, "red_cards": 0, "passes": 398, "pass_accuracy": 82}'),

-- Premier League - Upcoming Matches
(1, 'Matchday 26', 26, 2, 3, NULL, NULL, '2025-02-16', '16:30:00', 2, 31, 'scheduled', NULL, NULL, NULL, NULL, NULL),
(1, 'Matchday 26', 26, 4, 1, NULL, NULL, '2025-02-16', '14:00:00', 4, 32, 'scheduled', NULL, NULL, NULL, NULL, NULL),
(1, 'Matchday 26', 26, 5, 6, NULL, NULL, '2025-02-15', '17:30:00', 5, 33, 'scheduled', NULL, NULL, NULL, NULL, NULL),

-- Champions League 2024/25 - Round of 16
(6, 'Round of 16', 1, 8, 10, NULL, NULL, '2025-02-18', '21:00:00', 8, 33, 'scheduled', NULL, NULL, NULL, NULL, NULL),
(6, 'Round of 16', 1, 4, 16, NULL, NULL, '2025-02-19', '21:00:00', 4, 34, 'scheduled', NULL, NULL, NULL, NULL, NULL),
(6, 'Round of 16', 1, 7, 13, 3, 1, '2025-02-12', '21:00:00', 7, 33, 'finished', 87342, '4-3-3', '4-4-2',
'{"possession": 64, "shots": 22, "shots_on_target": 9, "corners": 11, "fouls": 10, "yellow_cards": 2, "red_cards": 0, "passes": 738, "pass_accuracy": 91}',
'{"possession": 36, "shots": 7, "shots_on_target": 3, "corners": 2, "fouls": 15, "yellow_cards": 4, "red_cards": 0, "passes": 312, "pass_accuracy": 78}');

-- 14. MATCH_PLAYERS (For finished matches)

-- Match 1: Man United 2-2 Liverpool
INSERT INTO match_players (match_id, person_id, team_id, is_starter, position, jersey_number, stats) VALUES
-- Man United starters
(1, 1, 1, TRUE, 'CAM', 8, '{"goals": 1, "assists": 0, "shots": 3, "shots_on_target": 2, "passes": 62, "pass_accuracy": 87, "tackles": 2, "interceptions": 1, "rating": 8.2}'),
(1, 2, 1, TRUE, 'LW', 10, '{"goals": 1, "assists": 0, "shots": 4, "shots_on_target": 2, "passes": 38, "pass_accuracy": 79, "tackles": 1, "interceptions": 0, "rating": 7.8}'),
(1, 3, 1, TRUE, 'CDM', 18, '{"goals": 0, "assists": 1, "shots": 1, "shots_on_target": 0, "passes": 74, "pass_accuracy": 91, "tackles": 5, "interceptions": 3, "rating": 7.5}'),

-- Liverpool starters
(1, 4, 2, TRUE, 'RW', 11, '{"goals": 1, "assists": 1, "shots": 5, "shots_on_target": 3, "passes": 45, "pass_accuracy": 84, "tackles": 0, "interceptions": 1, "rating": 8.5}'),
(1, 5, 2, TRUE, 'CB', 4, '{"goals": 0, "assists": 0, "shots": 0, "shots_on_target": 0, "passes": 82, "pass_accuracy": 93, "tackles": 3, "interceptions": 2, "rating": 7.3}'),
(1, 6, 2, TRUE, 'RB', 66, '{"goals": 0, "assists": 1, "shots": 2, "shots_on_target": 1, "passes": 68, "pass_accuracy": 88, "tackles": 2, "interceptions": 1, "rating": 7.6}');

-- Match 2: Arsenal 1-0 Man City
INSERT INTO match_players (match_id, person_id, team_id, is_starter, position, jersey_number, stats) VALUES
-- Arsenal starters
(2, 7, 3, TRUE, 'RW', 7, '{"goals": 1, "assists": 0, "shots": 4, "shots_on_target": 2, "passes": 41, "pass_accuracy": 85, "tackles": 2, "interceptions": 1, "rating": 8.7}'),
(2, 8, 3, TRUE, 'CAM', 8, '{"goals": 0, "assists": 1, "shots": 3, "shots_on_target": 1, "passes": 78, "pass_accuracy": 92, "tackles": 3, "interceptions": 2, "rating": 8.3}'),
(2, 9, 3, TRUE, 'CB', 6, '{"goals": 0, "assists": 0, "shots": 0, "shots_on_target": 0, "passes": 65, "pass_accuracy": 94, "tackles": 4, "interceptions": 3, "rating": 7.8}'),

-- Man City starters
(2, 10, 4, TRUE, 'ST', 9, '{"goals": 0, "assists": 0, "shots": 3, "shots_on_target": 1, "passes": 22, "pass_accuracy": 78, "tackles": 0, "interceptions": 0, "rating": 6.5}'),
(2, 11, 4, TRUE, 'CAM', 17, '{"goals": 0, "assists": 0, "shots": 2, "shots_on_target": 1, "passes": 72, "pass_accuracy": 88, "tackles": 1, "interceptions": 0, "rating": 7.0}'),
(2, 12, 4, TRUE, 'CDM', 16, '{"goals": 0, "assists": 0, "shots": 1, "shots_on_target": 0, "passes": 95, "pass_accuracy": 93, "tackles": 4, "interceptions": 2, "rating": 7.4}');

-- ============================================
-- 15. MATCH_EVENTS
-- ============================================
-- Match 1: Man United 2-2 Liverpool
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(1, 'goal', 1, 2, 3, 23, 0, 'Right footed shot from the left side of the box'),
(1, 'yellow', 2, 5, NULL, 31, 0, 'Foul on Bruno Fernandes'),
(1, 'goal', 2, 4, 6, 38, 2, 'Assisted cross from Alexander-Arnold'),
(1, 'goal', 2, 4, NULL, 56, 0, 'Solo effort, curled shot into top corner'),
(1, 'yellow', 1, 3, NULL, 64, 0, 'Tactical foul'),
(1, 'goal', 1, 1, NULL, 78, 0, 'Penalty kick after VAR review'),
(1, 'var', 1, NULL, NULL, 77, 0, 'VAR check for penalty');

-- Match 2: Arsenal 1-0 Man City
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(2, 'yellow', 4, 12, NULL, 18, 0, 'Foul on Saka'),
(2, 'goal', 3, 7, 8, 67, 0, 'Header from Ødegaard cross'),
(2, 'yellow', 4, 10, NULL, 72, 0, 'Dissent'),
(2, 'yellow', 4, 11, NULL, 89, 3, 'Time wasting');

-- ============================================
-- 16. STANDINGS (Premier League 2024/25)
-- ============================================
INSERT INTO standings (season_id, team_id, position, played, won, drawn, lost, goals_for, goals_against, points, form) VALUES
(1, 2, 1, 25, 18, 5, 2, 62, 22, 59, 'WWDWW'),
(1, 3, 2, 25, 17, 5, 3, 58, 24, 56, 'WWDWD'),
(1, 4, 3, 25, 17, 4, 4, 61, 28, 55, 'WLWWW'),
(1, 1, 4, 25, 15, 6, 4, 48, 32, 51, 'DWWLW'),
(1, 5, 5, 25, 14, 7, 4, 49, 31, 49, 'WDWWD'),
(1, 6, 6, 25, 13, 5, 7, 45, 35, 44, 'LWDWW');

-- ============================================
-- 17. TRANSFERS (Recent)
-- ============================================
INSERT INTO transfers (person_id, from_team_id, to_team_id, transfer_type, status, fee, fee_currency, transfer_date, window_year, window_type) VALUES
(21, 6, 10, 'permanent', 'official', 100000000.00, 'EUR', '2023-08-12', 2023, 'summer'),
(14, 11, 8, 'permanent', 'official', 103000000.00, 'EUR', '2023-06-14', 2023, 'summer'),
(8, 8, 3, 'permanent', 'official', 40000000.00, 'EUR', '2021-08-20', 2021, 'summer'),
(19, 18, 16, 'permanent', 'rumor', 200000000.00, 'EUR', NULL, 2025, 'summer'),
(3, 8, 1, 'permanent', 'official', 70000000.00, 'EUR', '2022-08-22', 2022, 'summer');

-- ============================================
-- 18. ACHIEVEMENTS
-- ============================================
INSERT INTO achievements (team_id, person_id, achievement_type, title, description, competition_id, season_id, year, position, is_major) VALUES
-- Team achievements
(4, NULL, 'league_title', 'Premier League Champions', 'Manchester City won the Premier League 2023/24 season', 1, 7, 2024, 1, TRUE),
(8, NULL, 'continental_winner', 'UEFA Champions League Winners', 'Real Madrid won their 15th Champions League title', 6, 8, 2024, 1, TRUE),
(2, NULL, 'league_title', 'Premier League Champions', 'Liverpool won the Premier League 2019/20 season', 1, NULL, 2020, 1, TRUE),

-- Player achievements
(NULL, 10, 'golden_boot', 'Premier League Golden Boot', 'Top scorer with 36 goals', 1, 7, 2024, 1, TRUE),
(NULL, 4, 'player_of_season', 'PFA Player of the Year', 'Mohamed Salah named PFA Player of the Year', 1, 7, 2024, 1, TRUE),
(NULL, 14, 'ballon_dor', 'Ballon d''Or', 'Won the Ballon d''Or 2024', NULL, NULL, 2024, 1, TRUE),
(NULL, 21, 'top_scorer', 'Bundesliga Top Scorer', 'Harry Kane scored 36 goals in his debut season', 3, NULL, 2024, 1, FALSE);


-- 19. ARTICLES

INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, match_id) VALUES

('arsenal-man-city-tactical-masterclass', 
'Arsenal''s Tactical Masterclass Tops Manchester City', 
'Arteta outsmarts his former mentor as Arsenal claim vital three points',
'Bukayo Saka''s second-half header secured a crucial 1-0 victory for Arsenal over Manchester City in a top-of-the-table clash.',
'Arsenal delivered a tactical masterclass to defeat Manchester City 1-0 at the Emirates Stadium on Sunday, moving level on points with league leaders Liverpool. Bukayo Saka''s 67th-minute header, from a precise Martin Ødegaard cross, proved to be the difference in a tightly contested match.

Mikel Arteta''s side implemented a disciplined defensive structure that frustrated Pep Guardiola''s men throughout. Gabriel Magalhães was imperious at the heart of defense, making several crucial interceptions and winning key aerial duels.

Manchester City dominated possession with 58% but struggled to create clear-cut chances against Arsenal''s well-organized block. Erling Haaland was kept quiet by the Arsenal defense, managing just three shots with only one on target.

The victory keeps Arsenal''s title hopes alive as they remain in contention for their first Premier League crown since 2004. The result also demonstrates the growing maturity of Arteta''s young squad in high-pressure situations.', 
'match_report',
'{"featured_image": "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/d0a7/live/3746eea0-6601-11ee-a170-333a9999a427.jpg.webp", "gallery": ["https://assets.goal.com/images/v3/blt6aeef859cb3f8e0a/GettyImages-1246452604.jpg", "https://static.standard.co.uk/2022/10/30/14/newFile-1.jpg"]}',
'James Mitchell', 'auth_001', '2025-02-09 22:30:00', 'published', TRUE, FALSE, 15420,
'["Premier League", "Arsenal", "Manchester City", "Match Report", "Tactical Analysis"]',
3, 1, 2),

('man-united-liverpool-thriller', 
'Manchester United and Liverpool Share Points in Thriller',
'Bruno Fernandes penalty earns United a point in classic encounter',
'A pulsating 2-2 draw at Old Trafford saw both sides demonstrate attacking prowess in an entertaining encounter.',
'Manchester United and Liverpool played out an enthralling 2-2 draw at Old Trafford on Sunday evening, with both teams showcasing their attacking quality in a match that lived up to its billing.

Marcus Rashford opened the scoring for United in the 23rd minute with a clinical finish from the left side of the box. Liverpool responded through Mohamed Salah, who equalized just before half-time with a superb assist from Trent Alexander-Arnold.

The Egyptian forward put Liverpool ahead in the 56th minute with a moment of individual brilliance, curling a shot into the top corner from outside the box. However, Bruno Fernandes leveled from the penalty spot in the 78th minute after a VAR review confirmed a foul in the area.

The result keeps both teams in the title race, though Liverpool will feel they missed an opportunity to extend their lead at the top of the table. Jürgen Klopp praised his team''s performance but expressed frustration at conceding late.',
'match_report',
'{"featured_image": "https://i.ytimg.com/vi/bU85SG_hsAA/hq720.jpg", "gallery": ["https://image.url/rashford-goal.jpg", "https://ichef.bbci.co.uk/ace/standard/1024/cpsprodpb/4069/production/_133098461_gettyimages-2146212457.jpg"]}',
'Sarah Thompson', 'auth_002', '2025-02-10 23:15:00', 'published', TRUE, FALSE, 18750,
'["Premier League", "Manchester United", "Liverpool", "Match Report"]',
1, 1, 1),

('barcelona-napoli-ucl-preview',
'Barcelona Face Stern Test Against Napoli in Champions League',
'Catalan giants look to overturn first-leg deficit at Camp Nou',
'Barcelona must overcome a one-goal deficit when they host Napoli in the Champions League Round of 16 second leg.',
'Barcelona face a challenging task as they prepare to host Napoli at Camp Nou in the second leg of their Champions League Round of 16 tie. The Catalan giants trail 3-1 from the first leg and will need to produce a stirring comeback to progress.

Xavi Hernández has called on the home crowd to create a special atmosphere, drawing parallels with the club''s famous remontada against Paris Saint-Germain in 2017. However, the current Barcelona squad faces a different challenge against a well-organized Napoli side.

Robert Lewandowski will be crucial to Barcelona''s hopes, with the Polish striker in excellent form domestically. The midfield duo of Pedri and Gavi will need to control the tempo and create chances for the forwards.

Napoli, meanwhile, will be confident of protecting their advantage. Their defensive organization has been impressive throughout the competition, and they pose a significant threat on the counter-attack.',
'preview',
'{"featured_image": "https://images.actionnetwork.com/blog/2024/03/osmihen.jpg"}',
'David Martinez', 'auth_003', '2025-02-11 14:00:00', 'published', FALSE, FALSE, 8320,
'["Champions League", "Barcelona", "Preview", "European Football"]',
7, 6, NULL),

('haaland-transfer-latest',
'BREAKING: Real Madrid Monitoring Haaland Situation',
'Spanish giants reportedly interested in Manchester City striker',
'Real Madrid are keeping close tabs on Erling Haaland''s situation at Manchester City, with sources suggesting a potential summer move.',
'Real Madrid have emerged as serious contenders to sign Erling Haaland from Manchester City, according to sources close to the Spanish club. The Norwegian striker, who has been in sensational form since joining City, is reportedly on Madrid''s radar for a potential summer transfer.

While Manchester City insist Haaland is not for sale, Real Madrid''s interest signals their intent to bolster their attacking options. The Spanish giants have a history of securing marquee signings and view Haaland as the perfect successor to Karim Benzema.

Sources suggest that any potential deal would likely break transfer records, with City expected to demand a fee in excess of £150 million. Haaland''s current contract runs until 2027, giving City a strong negotiating position.

The 24-year-old has scored 25 goals in 22 Premier League appearances this season and shows no signs of slowing down. His combination of pace, power, and clinical finishing makes him one of the most sought-after players in world football.

Manchester City manager Pep Guardiola dismissed the speculation, stating that Haaland is "very happy" at the club and remains committed to their project.',
'transfer',
'{"featured_image": "https://assets.goal.com/images/v3/bltca666400d267487c/GOAL%20-%20Image%20&%20Crest%20-%20Facebook%20-%202025-02-27T103447.142.png"}',
'Michael Roberts', 'auth_004', '2025-02-12 09:45:00', 'published', FALSE, TRUE, 32150,
'["Transfer News", "Real Madrid", "Manchester City", "Erling Haaland", "Breaking News"]',
4, NULL, NULL);

-- 20. COMMENTS
INSERT INTO comments (article_id, parent_id, user_id, user_name, content, status, likes_count) VALUES
(1, NULL, 'user_123', 'Arsenal_Fan_1886', 'What a performance! Arteta has really turned this team around. COYG!', 'approved', 24),
(1, 1, 'user_456', 'Neutral_Observer', 'Agreed, Arsenal looked really organized. Gabriel was immense at the back.', 'approved', 8),
(1, NULL, 'user_789', 'City_Supporter', 'Fair play to Arsenal but we dominated possession. On another day we win that.', 'approved', 12),
(2, NULL, 'user_234', 'RedDevil99', 'Great result for us! That was classic United vs Liverpool. Could have won it.', 'approved', 18),
(2, NULL, 'user_567', 'LFC_Forever', 'Salah was unplayable today. Should have held on for the win though.', 'approved', 21),
(4, NULL, 'user_890', 'TransferGuru', 'This would be massive if it happens. Madrid always get their man!', 'approved', 35);


-- 21. POLLS

INSERT INTO polls (question, description, poll_type, options, start_date, end_date, status, total_votes, results, match_id, featured) VALUES

('Who will win: Liverpool vs Arsenal?',
'Predict the outcome of the big Premier League clash this weekend',
'single',
'[{"id": "opt1", "text": "Liverpool Win", "votes": 1245}, {"id": "opt2", "text": "Draw", "votes": 432}, {"id": "opt3", "text": "Arsenal Win", "votes": 987}]',
'2025-02-14 10:00:00', '2025-02-16 16:00:00', 'active', 2664,
'{"opt1": 1245, "opt2": 432, "opt3": 987}',
3, TRUE),

('Who will win the Premier League 2024/25?',
'Cast your vote for the eventual champions',
'single',
'[{"id": "opt1", "text": "Liverpool", "votes": 3421}, {"id": "opt2", "text": "Arsenal", "votes": 2876}, {"id": "opt3", "text": "Manchester City", "votes": 2543}, {"id": "opt4", "text": "Other", "votes": 234}]',
'2025-02-01 00:00:00', '2025-05-25 23:59:59', 'active', 9074,
'{"opt1": 3421, "opt2": 2876, "opt3": 2543, "opt4": 234}',
NULL, TRUE),

('Rate Arsenal''s performance vs Manchester City',
'How would you rate the Gunners'' display?',
'rating',
'[{"id": "r1", "text": "1", "votes": 12}, {"id": "r2", "text": "2", "votes": 8}, {"id": "r3", "text": "3", "votes": 23}, {"id": "r4", "text": "4", "votes": 145}, {"id": "r5", "text": "5", "votes": 892}]',
'2025-02-09 22:30:00', '2025-02-16 22:30:00', 'active', 1080,
'{"r1": 12, "r2": 8, "r3": 23, "r4": 145, "r5": 892}',
2, FALSE);

-- 22. POLL_VOTES

INSERT INTO poll_votes (poll_id, user_id, selected_options, ip_hash) VALUES
(1, 'user_123', '["opt1"]', 'hash_abc123'),
(1, 'user_456', '["opt3"]', 'hash_def456'),
(1, 'user_789', '["opt2"]', 'hash_ghi789'),
(2, 'user_234', '["opt2"]', 'hash_jkl012'),
(2, 'user_567', '["opt1"]', 'hash_mno345'),
(3, 'user_890', '["r5"]', 'hash_pqr678');
