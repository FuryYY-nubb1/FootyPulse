
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


INSERT INTO users (email, password_hash, name, role) VALUES
('admin@footypulse.com',  '$2b$10$abcdefghijklmnopqrstuv', 'Admin User',   'admin'),
('editor@footypulse.com', '$2b$10$abcdefghijklmnopqrstuv', 'John Editor',  'editor'),
('writer@footypulse.com', '$2b$10$abcdefghijklmnopqrstuv', 'Sarah Writer', 'user'),
('reporter@footypulse.com','$2b$10$abcdefghijklmnopqrstuv','Emma Thompson','editor');


INSERT INTO countries (name, code, flag_url, confederation) VALUES
('England',      'ENG', 'https://flagcdn.com/w320/gb-eng.png', 'UEFA'),      -- 1
('Spain',        'ESP', 'https://flagcdn.com/w320/es.png',     'UEFA'),      -- 2
('Germany',      'GER', 'https://flagcdn.com/w320/de.png',     'UEFA'),      -- 3
('Italy',        'ITA', 'https://flagcdn.com/w320/it.png',     'UEFA'),      -- 4
('France',       'FRA', 'https://flagcdn.com/w320/fr.png',     'UEFA'),      -- 5
('Portugal',     'POR', 'https://flagcdn.com/w320/pt.png',     'UEFA'),      -- 6
('Netherlands',  'NED', 'https://flagcdn.com/w320/nl.png',     'UEFA'),      -- 7
('Belgium',      'BEL', 'https://flagcdn.com/w320/be.png',     'UEFA'),      -- 8
('Brazil',       'BRA', 'https://flagcdn.com/w320/br.png',     'CONMEBOL'),  -- 9
('Argentina',    'ARG', 'https://flagcdn.com/w320/ar.png',     'CONMEBOL'),  -- 10
('Uruguay',      'URU', 'https://flagcdn.com/w320/uy.png',     'CONMEBOL'),  -- 11
('Croatia',      'CRO', 'https://flagcdn.com/w320/hr.png',     'UEFA'),      -- 12
('Poland',       'POL', 'https://flagcdn.com/w320/pl.png',     'UEFA'),      -- 13
('Norway',       'NOR', 'https://flagcdn.com/w320/no.png',     'UEFA'),      -- 14
('Egypt',        'EGY', 'https://flagcdn.com/w320/eg.png',     'CAF'),       -- 15
('Senegal',      'SEN', 'https://flagcdn.com/w320/sn.png',     'CAF'),       -- 16
('South Korea',  'KOR', 'https://flagcdn.com/w320/kr.png',     'AFC'),       -- 17
('Japan',        'JPN', 'https://flagcdn.com/w320/jp.png',     'AFC'),       -- 18
('Morocco',      'MAR', 'https://flagcdn.com/w320/ma.png',     'CAF'),       -- 19
('Colombia',     'COL', 'https://flagcdn.com/w320/co.png',     'CONMEBOL'), -- 20
('Nigeria',      'NGA', 'https://flagcdn.com/w320/ng.png',     'CAF'),       -- 21
('Cameroon',     'CMR', 'https://flagcdn.com/w320/cm.png',     'CAF'),       -- 22
('Scotland',     'SCO', 'https://flagcdn.com/w320/gb-sct.png', 'UEFA'),      -- 23
('Serbia',       'SRB', 'https://flagcdn.com/w320/rs.png',     'UEFA'),      -- 24
('Denmark',      'DEN', 'https://flagcdn.com/w320/dk.png',     'UEFA'),      -- 25
('Austria',      'AUT', 'https://flagcdn.com/w320/at.png',     'UEFA'),      -- 26
('Switzerland',  'SUI', 'https://flagcdn.com/w320/ch.png',     'UEFA'),      -- 27
('Ghana',        'GHA', 'https://flagcdn.com/w320/gh.png',     'CAF'),       -- 28
('Ivory Coast',  'CIV', 'https://flagcdn.com/w320/ci.png',     'CAF'),       -- 29
('Canada',       'CAN', 'https://flagcdn.com/w320/ca.png',     'CONCACAF');  -- 30



INSERT INTO stadiums (name, city, country_id, capacity, opened_year, surface_type) VALUES
-- England (1)
('Old Trafford',              'Manchester', 1, 74140, 1910, 'Grass'),   -- 1
('Anfield',                   'Liverpool',  1, 53394, 1884, 'Grass'),   -- 2
('Emirates Stadium',          'London',     1, 60260, 2006, 'Grass'),   -- 3
('Etihad Stadium',            'Manchester', 1, 53400, 2003, 'Grass'),   -- 4
('Stamford Bridge',           'London',     1, 40341, 1877, 'Grass'),   -- 5
('Tottenham Hotspur Stadium', 'London',     1, 62850, 2019, 'Grass'),   -- 6
-- Spain (2)
('Camp Nou',                  'Barcelona',  2, 99354, 1957, 'Grass'),   -- 7
('Santiago Bernabéu',         'Madrid',     2, 81044, 1947, 'Grass'),   -- 8
('Wanda Metropolitano',       'Madrid',     2, 68456, 2017, 'Grass'),   -- 9
-- Germany (3)
('Allianz Arena',             'Munich',     3, 75000, 2005, 'Grass'),   -- 10
('Signal Iduna Park',         'Dortmund',   3, 81365, 1974, 'Grass'),   -- 11
('Mercedes-Benz Arena',       'Stuttgart',  3, 60449, 2008, 'Grass'),   -- 12
('RheinEnergieStadion',       'Cologne',    3, 50000, 2004, 'Grass'),   -- 13
('Olympiastadion',            'Berlin',     3, 74649, 1936, 'Grass'),   -- 14
-- Italy (4)
('San Siro',                  'Milan',      4, 75923, 1926, 'Grass'),   -- 15
('Stadio Olimpico',           'Rome',       4, 70634, 1953, 'Grass'),   -- 16
('Allianz Stadium',           'Turin',      4, 41507, 2011, 'Grass'),   -- 17
('Stadio Diego Armando Maradona','Naples',  4, 54726, 1959, 'Grass'),   -- 18
-- France (5)
('Parc des Princes',          'Paris',      5, 47929, 1972, 'Grass'),   -- 19
('Groupama Stadium',          'Lyon',       5, 59186, 2016, 'Grass'),   -- 20
('Vélodrome',                 'Marseille',  5, 67394, 1937, 'Grass'),   -- 21
-- Portugal (6)
('Estádio da Luz',            'Lisbon',     6, 64642, 2003, 'Grass'),   -- 22
('Estádio do Dragão',         'Porto',      6, 50033, 2003, 'Grass'),   -- 23
-- Netherlands (7)
('Johan Cruyff Arena',        'Amsterdam',  7, 54990, 1996, 'Grass'),   -- 24
-- Belgium (8)
('Jan Breydel Stadium',       'Bruges',     8, 29042, 1975, 'Grass'),   -- 25
-- Scotland (23)
('Celtic Park',               'Glasgow',    23, 60411, 1892, 'Grass'),  -- 26
-- Austria (26)
('Red Bull Arena',            'Salzburg',   26, 30188, 2003, 'Grass'),  -- 27
-- Switzerland (27)
('St. Jakob-Park',            'Basel',      27, 38512, 2001, 'Grass'),  -- 28
-- Denmark (25)
('Parken Stadium',            'Copenhagen', 25, 38065, 1992, 'Grass'),  -- 29
-- Extra
('Stade Pierre-Mauroy',      'Lille',      5, 50186, 2012, 'Grass');   -- 30



INSERT INTO teams (name, short_name, team_type, country_id, city, stadium_id, founded_year, logo_url, primary_color) VALUES
-- PREMIER LEAGUE (1-6)
('Manchester United',  'Man United', 'club', 1, 'Manchester', 1,  1878, 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg', '#DA291C'),  -- 1
('Liverpool FC',       'Liverpool',  'club', 1, 'Liverpool',  2,  1892, 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', '#C8102E'),               -- 2
('Arsenal FC',         'Arsenal',    'club', 1, 'London',     3,  1886, 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', '#EF0107'),                  -- 3
('Manchester City',    'Man City',   'club', 1, 'Manchester', 4,  1880, 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', '#6CABDD'),    -- 4
('Chelsea FC',         'Chelsea',    'club', 1, 'London',     5,  1905, 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg', '#034694'),                  -- 5
('Tottenham Hotspur',  'Spurs',      'club', 1, 'London',     6,  1882, 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg', '#132257'),          -- 6
-- LA LIGA (7-9)
('FC Barcelona',       'Barcelona',  'club', 2, 'Barcelona',  7,  1899, 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_(crest).svg', '#A50044'),       -- 7
('Real Madrid CF',     'Real Madrid','club', 2, 'Madrid',     8,  1902, 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', '#FFFFFF'),              -- 8
('Atlético Madrid',    'Atlético',   'club', 2, 'Madrid',     9,  1903, 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg', '#CB3524'),  -- 9
-- BUNDESLIGA (10-13)
('Bayern Munich',      'Bayern',     'club', 3, 'Munich',     10, 1900, 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_(2017).svg', '#DC052D'), -- 10
('Borussia Dortmund',  'Dortmund',   'club', 3, 'Dortmund',   11, 1909, 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg', '#FDE100'),             -- 11
('Bayer Leverkusen',   'Leverkusen', 'club', 3, 'Leverkusen', 13, 1904, 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg', '#E32221'),                -- 12
('VfB Stuttgart',      'Stuttgart',  'club', 3, 'Stuttgart',  12, 1893, 'https://upload.wikimedia.org/wikipedia/commons/e/eb/VfB_Stuttgart_1893_Logo.svg', '#E32219'),             -- 13
-- SERIE A (14-18)
('AC Milan',           'Milan',      'club', 4, 'Milan',      15, 1899, 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg', '#FB090B'),      -- 14
('Inter Milan',        'Inter',      'club', 4, 'Milan',      15, 1908, 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg', '#0068A8'), -- 15
('Juventus FC',        'Juventus',   'club', 4, 'Turin',      17, 1897, 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_(black).svg', '#000000'),  -- 16
('SSC Napoli',         'Napoli',     'club', 4, 'Naples',     18, 1926, 'https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Napoli.svg', '#12A0D7'),            -- 17
('AS Roma',            'Roma',       'club', 4, 'Rome',       16, 1927, 'https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_(2017).svg', '#8B0304'),        -- 18
-- LIGUE 1 (19-22)
('Paris Saint-Germain','PSG',        'club', 5, 'Paris',      19, 1970, 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg', '#004170'),   -- 19
('Olympique Lyonnais', 'Lyon',       'club', 5, 'Lyon',       20, 1950, 'https://upload.wikimedia.org/wikipedia/en/a/a3/Olympique_Lyonnais.svg', '#1B4F9B'),         -- 20
('Olympique Marseille','Marseille',  'club', 5, 'Marseille',  21, 1899, 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg', '#2FAEE0'),-- 21
('LOSC Lille',         'Lille',      'club', 5, 'Lille',      30, 1944, 'https://upload.wikimedia.org/wikipedia/en/3/3f/Lille_OSC_2018_logo.svg', '#E2001A'),         -- 22
-- OTHER UCL CLUBS (23-30)
('SL Benfica',         'Benfica',    'club', 6, 'Lisbon',     22, 1904, 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg', '#E30613'),            -- 23
('FC Porto',           'Porto',      'club', 6, 'Porto',      23, 1893, 'https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg', '#003399'),                    -- 24
('Ajax Amsterdam',     'Ajax',       'club', 7, 'Amsterdam',  24, 1900, 'https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg', '#D2122E'),              -- 25
('Club Brugge',        'Brugge',     'club', 8, 'Bruges',     25, 1891, 'https://upload.wikimedia.org/wikipedia/en/d/d0/Club_Brugge_KV_logo.svg', '#0055A4'),        -- 26
('Celtic FC',          'Celtic',     'club', 23,'Glasgow',    26, 1887, 'https://upload.wikimedia.org/wikipedia/en/3/35/Celtic_FC.svg', '#138547'),                   -- 27
('RB Salzburg',        'Salzburg',   'club', 26,'Salzburg',   27, 1933, 'https://upload.wikimedia.org/wikipedia/en/7/77/FC_Red_Bull_Salzburg_logo.svg', '#E2001A'),   -- 28
('FC Copenhagen',      'Copenhagen', 'club', 25,'Copenhagen', 29, 1992, 'https://upload.wikimedia.org/wikipedia/en/9/93/FC_K%C3%B8benhavn.svg', '#006BB6'),          -- 29
('FC Basel',           'Basel',      'club', 27,'Basel',      28, 1893, 'https://upload.wikimedia.org/wikipedia/en/4/49/FC_Basel_logo.svg', '#E30613');               -- 30

-- NATIONAL TEAMS (31-37)
INSERT INTO teams (name, short_name, team_type, country_id, national_team_level, fifa_ranking, logo_url, primary_color) VALUES
('England National Team',   'England',   'national', 1,  'senior_men', 4, 'https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg', '#FFFFFF'),  -- 31
('Spain National Team',     'Spain',     'national', 2,  'senior_men', 8, 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg', '#C60B1E'),    -- 32
('Germany National Team',   'Germany',   'national', 3,  'senior_men', 11,'https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg', '#000000'),  -- 33
('France National Team',    'France',    'national', 5,  'senior_men', 2, 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg', '#0055A4'),   -- 34
('Brazil National Team',    'Brazil',    'national', 9,  'senior_men', 5, 'https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg', '#009739'),   -- 35
('Argentina National Team', 'Argentina', 'national', 10, 'senior_men', 1, 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg', '#74ACDF'), -- 36
('Portugal National Team',  'Portugal',  'national', 6,  'senior_men', 6, 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg', '#FF0000'); -- 37



INSERT INTO competitions (name, short_name, competition_type, country_id, level, season_format, logo_url) VALUES
('Premier League',          'EPL',        'league',        1,    1, 'league',         'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg'),         -- 1
('La Liga',                 'La Liga',    'league',        2,    1, 'league',         'https://upload.wikimedia.org/wikipedia/commons/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg'), -- 2
('Bundesliga',              'Bundesliga', 'league',        3,    1, 'league',         'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_(2017).svg'),      -- 3
('Serie A',                 'Serie A',    'league',        4,    1, 'league',         'https://upload.wikimedia.org/wikipedia/en/a/ab/Serie_A_ENILIVE_logo.svg'),        -- 4
('Ligue 1',                 'Ligue 1',    'league',        5,    1, 'league',         'https://upload.wikimedia.org/wikipedia/commons/7/7b/Logo_Ligue_1_McDonald%27s_2024.svg'), -- 5
('UEFA Champions League',   'UCL',        'international', NULL, 1, 'group_knockout', 'https://upload.wikimedia.org/wikipedia/en/f/f5/UEFA_Champions_League.svg'),       -- 6
('FA Cup',                  'FA Cup',     'cup',           1,    1, 'knockout',       'https://upload.wikimedia.org/wikipedia/en/d/d5/FA_Cup_logo_(2020).svg'),           -- 7
('Copa del Rey',            'Copa del Rey','cup',          2,    1, 'knockout',       'https://upload.wikimedia.org/wikipedia/commons/b/ba/Copa_Del_Rey_Official_Logo.png'), -- 8
('FIFA World Cup',          'World Cup',  'international', NULL, 1, 'group_knockout', 'https://upload.wikimedia.org/wikipedia/en/1/17/2026_FIFA_World_Cup_emblem.svg'),  -- 9
('UEFA Europa League',      'UEL',        'international', NULL, 2, 'group_knockout', 'https://upload.wikimedia.org/wikipedia/commons/1/1b/UEFA_Europa_League_logo_(2024_version).svg'); -- 10


INSERT INTO seasons (competition_id, name, start_date, end_date, is_current, stages) VALUES
-- Current 2024/25
(1, '2024/25', '2024-08-16', '2025-05-25', TRUE, '["Matchday 1","Matchday 2","Matchday 3","Matchday 4","Matchday 5","Matchday 6","Matchday 7","Matchday 8","Matchday 9","Matchday 10","Matchday 11","Matchday 12","Matchday 13","Matchday 14","Matchday 15","Matchday 16","Matchday 17","Matchday 18","Matchday 19","Matchday 20","Matchday 21","Matchday 22","Matchday 23","Matchday 24","Matchday 25","Matchday 26","Matchday 27","Matchday 28","Matchday 29","Matchday 30","Matchday 31","Matchday 32","Matchday 33","Matchday 34","Matchday 35","Matchday 36","Matchday 37","Matchday 38"]'), -- 1 EPL
(2, '2024/25', '2024-08-15', '2025-05-31', TRUE, '["Matchday 1","Matchday 2","Matchday 3","Matchday 4","Matchday 5","Matchday 6","Matchday 7","Matchday 8","Matchday 9","Matchday 10","Matchday 11","Matchday 12","Matchday 13","Matchday 14","Matchday 15","Matchday 16","Matchday 17","Matchday 18","Matchday 19","Matchday 20","Matchday 21","Matchday 22","Matchday 23","Matchday 24","Matchday 25","Matchday 26","Matchday 27","Matchday 28","Matchday 29","Matchday 30","Matchday 31","Matchday 32","Matchday 33","Matchday 34","Matchday 35","Matchday 36","Matchday 37","Matchday 38"]'), -- 2 La Liga
(3, '2024/25', '2024-08-23', '2025-05-17', TRUE, '["Matchday 1","Matchday 2","Matchday 3","Matchday 4","Matchday 5","Matchday 6","Matchday 7","Matchday 8","Matchday 9","Matchday 10","Matchday 11","Matchday 12","Matchday 13","Matchday 14","Matchday 15","Matchday 16","Matchday 17","Matchday 18","Matchday 19","Matchday 20","Matchday 21","Matchday 22","Matchday 23","Matchday 24","Matchday 25","Matchday 26","Matchday 27","Matchday 28","Matchday 29","Matchday 30","Matchday 31","Matchday 32","Matchday 33","Matchday 34"]'), -- 3 Bundesliga
(4, '2024/25', '2024-08-17', '2025-05-25', TRUE, '["Matchday 1","Matchday 2","Matchday 3","Matchday 4","Matchday 5","Matchday 6","Matchday 7","Matchday 8","Matchday 9","Matchday 10","Matchday 11","Matchday 12","Matchday 13","Matchday 14","Matchday 15","Matchday 16","Matchday 17","Matchday 18","Matchday 19","Matchday 20","Matchday 21","Matchday 22","Matchday 23","Matchday 24","Matchday 25","Matchday 26","Matchday 27","Matchday 28","Matchday 29","Matchday 30","Matchday 31","Matchday 32","Matchday 33","Matchday 34","Matchday 35","Matchday 36","Matchday 37","Matchday 38"]'), -- 4 Serie A
(5, '2024/25', '2024-08-16', '2025-05-18', TRUE, '["Matchday 1","Matchday 2","Matchday 3","Matchday 4","Matchday 5","Matchday 6","Matchday 7","Matchday 8","Matchday 9","Matchday 10","Matchday 11","Matchday 12","Matchday 13","Matchday 14","Matchday 15","Matchday 16","Matchday 17","Matchday 18","Matchday 19","Matchday 20","Matchday 21","Matchday 22","Matchday 23","Matchday 24","Matchday 25","Matchday 26","Matchday 27","Matchday 28","Matchday 29","Matchday 30","Matchday 31","Matchday 32","Matchday 33","Matchday 34"]'), -- 5 Ligue 1
(6, '2024/25', '2024-09-17', '2025-05-31', TRUE, '["League Phase","Round of 16","Quarter-finals","Semi-finals","Final"]'), -- 6 UCL
-- Previous 2023/24
(1, '2023/24', '2023-08-11', '2024-05-19', FALSE, '["Matchday 1","Matchday 38"]'),  -- 7
(2, '2023/24', '2023-08-11', '2024-05-26', FALSE, '["Matchday 1","Matchday 38"]'),  -- 8
(3, '2023/24', '2023-08-18', '2024-05-18', FALSE, '["Matchday 1","Matchday 34"]'),  -- 9
(4, '2023/24', '2023-08-19', '2024-05-26', FALSE, '["Matchday 1","Matchday 38"]'),  -- 10
(5, '2023/24', '2023-08-11', '2024-05-19', FALSE, '["Matchday 1","Matchday 34"]'),  -- 11
(6, '2023/24', '2023-09-19', '2024-06-01', FALSE, '["Group Stage","Round of 16","Quarter-finals","Semi-finals","Final"]'); -- 12


-- ── PREMIER LEAGUE PLAYERS ──
INSERT INTO persons (person_type, first_name, last_name, date_of_birth, nationality_id, photo_url, height_cm, preferred_foot, primary_position, market_value) VALUES
-- Manchester United (team 1): persons 1-3
('player', 'Bruno',     'Fernandes',        '1994-09-08', 6,  NULL, 179, 'right', 'CAM', 75000000),  -- 1
('player', 'Marcus',    'Rashford',         '1997-10-31', 1,  NULL, 180, 'right', 'LW',  70000000),  -- 2
('player', 'Casemiro',  'Silva',            '1992-02-23', 9,  NULL, 185, 'right', 'CDM', 30000000),  -- 3
-- Liverpool (team 2): persons 4-6
('player', 'Mohamed',   'Salah',            '1992-06-15', 15, NULL, 175, 'left',  'RW',  80000000),  -- 4
('player', 'Virgil',    'van Dijk',         '1991-07-08', 7,  NULL, 195, 'right', 'CB',  35000000),  -- 5
('player', 'Trent',     'Alexander-Arnold', '1998-10-07', 1,  NULL, 180, 'right', 'RB',  70000000),  -- 6
-- Arsenal (team 3): persons 7-9
('player', 'Bukayo',    'Saka',             '2001-09-05', 1,  NULL, 178, 'left',  'RW', 120000000),  -- 7
('player', 'Martin',    'Ødegaard',         '1998-12-17', 14, NULL, 178, 'left',  'CAM',100000000),  -- 8
('player', 'Gabriel',   'Magalhães',        '1997-12-19', 9,  NULL, 190, 'left',  'CB',  80000000),  -- 9
-- Man City (team 4): persons 10-12
('player', 'Erling',    'Haaland',          '2000-07-21', 14, NULL, 194, 'left',  'ST', 180000000),  -- 10
('player', 'Kevin',     'De Bruyne',        '1991-06-28', 8,  NULL, 181, 'right', 'CAM', 50000000),  -- 11
('player', 'Rodri',     'Hernández',        '1996-06-22', 2,  NULL, 191, 'right', 'CDM',130000000),  -- 12
-- Chelsea (team 5): persons 13-14
('player', 'Cole',      'Palmer',           '2002-05-06', 1,  NULL, 185, 'left',  'CAM',100000000),  -- 13
('player', 'Nicolas',   'Jackson',          '1998-06-20', 16, NULL, 186, 'right', 'ST',  45000000),  -- 14
-- Tottenham (team 6): persons 15-16
('player', 'Son',       'Heung-min',        '1992-07-08', 17, NULL, 183, 'right', 'LW',  55000000),  -- 15
('player', 'James',     'Maddison',         '1996-11-23', 1,  NULL, 175, 'right', 'CAM', 50000000),  -- 16

-- ── LA LIGA PLAYERS ──
-- Barcelona (team 7): persons 17-19
('player', 'Robert',    'Lewandowski',      '1988-08-21', 13, NULL, 185, 'right', 'ST',  15000000),  -- 17
('player', 'Pedri',     'González',         '2002-11-25', 2,  NULL, 174, 'right', 'CM',  80000000),  -- 18
('player', 'Lamine',    'Yamal',            '2007-07-13', 2,  NULL, 180, 'right', 'RW', 150000000),  -- 19
-- Real Madrid (team 8): persons 20-23
('player', 'Vinícius',  'Júnior',           '2000-07-12', 9,  NULL, 176, 'right', 'LW', 150000000),  -- 20
('player', 'Jude',      'Bellingham',       '2003-06-29', 1,  NULL, 186, 'right', 'CAM',150000000),  -- 21
('player', 'Kylian',    'Mbappé',           '1998-12-20', 5,  NULL, 178, 'right', 'ST', 180000000),  -- 22
('player', 'Federico',  'Valverde',         '1998-07-22', 11, NULL, 182, 'right', 'CM', 120000000),  -- 23
-- Atlético Madrid (team 9): persons 24-25
('player', 'Antoine',   'Griezmann',        '1991-03-21', 5,  NULL, 176, 'left',  'ST',  25000000),  -- 24
('player', 'Julián',    'Álvarez',          '2000-01-31', 10, NULL, 170, 'right', 'ST',  80000000),  -- 25

-- ── BUNDESLIGA PLAYERS ──
-- Bayern Munich (team 10): persons 26-28
('player', 'Harry',     'Kane',             '1993-07-28', 1,  NULL, 188, 'right', 'ST', 100000000),  -- 26
('player', 'Jamal',     'Musiala',          '2003-02-26', 3,  NULL, 184, 'right', 'CAM',130000000),  -- 27
('player', 'Joshua',    'Kimmich',          '1995-02-08', 3,  NULL, 177, 'right', 'CDM', 50000000),  -- 28
-- Dortmund (team 11): persons 29-30
('player', 'Serhou',    'Guirassy',         '1996-03-12', 5,  NULL, 187, 'right', 'ST',  50000000),  -- 29
('player', 'Julian',    'Brandt',           '1996-05-02', 3,  NULL, 185, 'right', 'CAM', 32000000),  -- 30
-- Leverkusen (team 12): persons 31-32
('player', 'Florian',   'Wirtz',            '2003-05-03', 3,  NULL, 176, 'right', 'CAM',130000000),  -- 31
('player', 'Granit',    'Xhaka',            '1992-09-27', 27, NULL, 185, 'right', 'CM',  25000000),  -- 32
-- Stuttgart (team 13): person 33
('player', 'Deniz',     'Undav',            '1996-07-19', 3,  NULL, 184, 'right', 'ST',  30000000),  -- 33

-- ── SERIE A PLAYERS ──
-- AC Milan (team 14): persons 34-35
('player', 'Rafael',    'Leão',             '1999-06-10', 6,  NULL, 188, 'left',  'LW',  80000000),  -- 34
('player', 'Christian', 'Pulisic',          '1998-09-18', 30, NULL, 177, 'right', 'RW',  30000000),  -- 35
-- Inter Milan (team 15): persons 36-37
('player', 'Lautaro',   'Martínez',         '1997-08-22', 10, NULL, 174, 'right', 'ST',  95000000),  -- 36
('player', 'Hakan',     'Çalhanoğlu',       '1994-02-08', 3,  NULL, 178, 'right', 'CM',  42000000),  -- 37
-- Juventus (team 16): persons 38-39
('player', 'Dušan',     'Vlahović',         '2000-01-28', 24, NULL, 190, 'left',  'ST',  65000000),  -- 38
('player', 'Kenan',     'Yıldız',           '2005-05-04', 3,  NULL, 186, 'left',  'LW',  50000000),  -- 39
-- Napoli (team 17): persons 40-41
('player', 'Victor',    'Osimhen',          '1998-12-29', 21, NULL, 186, 'right', 'ST',  75000000),  -- 40
('player', 'Khvicha',   'Kvaratskhelia',    '2001-02-12', 5,  NULL, 183, 'left',  'LW',  80000000),  -- 41
-- Roma (team 18): person 42
('player', 'Paulo',     'Dybala',           '1993-11-15', 10, NULL, 177, 'left',  'CAM', 15000000),  -- 42

-- ── LIGUE 1 PLAYERS ──
-- PSG (team 19): persons 43-44
('player', 'Ousmane',   'Dembélé',          '1997-05-15', 5,  NULL, 178, 'both',  'RW',  60000000),  -- 43
('player', 'Achraf',    'Hakimi',           '1998-11-04', 19, NULL, 181, 'right', 'RB',  65000000),  -- 44
-- Lyon (team 20): person 45
('player', 'Alexandre', 'Lacazette',        '1991-05-28', 5,  NULL, 175, 'right', 'ST',  10000000),  -- 45
-- Marseille (team 21): person 46
('player', 'Pierre-Emerick','Aubameyang',   '1989-06-18', 5,  NULL, 187, 'right', 'ST',   8000000),  -- 46
-- Lille (team 22): person 47
('player', 'Jonathan',  'David',            '2000-01-14', 30, NULL, 180, 'right', 'ST',  55000000),  -- 47

-- ── OTHER UCL CLUB PLAYERS ──
-- Benfica (team 23): person 48
('player', 'Ángel',     'Di María',         '1988-02-14', 10, NULL, 180, 'left',  'RW',   5000000),  -- 48
-- Porto (team 24): person 49
('player', 'Mehdi',     'Taremi',           '1992-07-18', 5,  NULL, 187, 'right', 'ST',  30000000),  -- 49
-- Ajax (team 25): person 50
('player', 'Brian',     'Brobbey',          '2002-02-01', 7,  NULL, 180, 'right', 'ST',  30000000),  -- 50
-- Club Brugge (team 26): person 51
('player', 'Hans',      'Vanaken',          '1992-08-24', 8,  NULL, 189, 'right', 'CAM', 10000000),  -- 51
-- Celtic (team 27): person 52
('player', 'Kyogo',     'Furuhashi',        '1995-01-20', 18, NULL, 170, 'right', 'ST',  12000000),  -- 52
-- Salzburg (team 28): person 53
('player', 'Óscar',     'Gloukh',           '2004-04-01', 5,  NULL, 178, 'right', 'CAM', 15000000),  -- 53

-- ── ADDITIONAL STAR PLAYERS (for transfers & articles) ──
('player', 'William',   'Saliba',           '2001-03-24', 5,  NULL, 192, 'right', 'CB', 100000000),  -- 54
('player', 'Declan',    'Rice',             '1999-01-14', 1,  NULL, 185, 'right', 'CDM',100000000),  -- 55
('player', 'Phil',      'Foden',            '2000-05-28', 1,  NULL, 171, 'left',  'LW', 120000000),  -- 56
('player', 'Bernardo',  'Silva',            '1994-08-10', 6,  NULL, 173, 'left',  'RW',  70000000),  -- 57
('player', 'David',     'Raya',             '1995-09-15', 2,  NULL, 183, 'right', 'GK',  35000000),  -- 58
('player', 'Alisson',   'Becker',           '1992-10-02', 9,  NULL, 191, 'right', 'GK',  35000000),  -- 59
('player', 'Ederson',   'Moraes',           '1993-08-17', 9,  NULL, 188, 'left',  'GK',  28000000),  -- 60
('player', 'Gianluigi', 'Donnarumma',       '1999-02-25', 4,  NULL, 196, 'right', 'GK',  40000000),  -- 61
('player', 'Marc-André','ter Stegen',       '1992-04-30', 3,  NULL, 187, 'right', 'GK',  25000000),  -- 62
('player', 'Thibaut',   'Courtois',         '1992-05-11', 8,  NULL, 199, 'left',  'GK',  30000000),  -- 63
('player', 'Ronald',    'Araújo',           '1999-03-07', 11, NULL, 188, 'right', 'CB',  60000000),  -- 64
('player', 'Raphaël',   'Varane',           '1993-04-25', 5,  NULL, 191, 'right', 'CB',   5000000),  -- 65
('player', 'Alejandro', 'Garnacho',         '2004-07-01', 10, NULL, 180, 'left',  'LW',  40000000);  -- 66

-- ── MANAGERS (67-78) ──
INSERT INTO persons (person_type, first_name, last_name, date_of_birth, nationality_id, photo_url) VALUES
('manager', 'Erik',     'ten Hag',      '1970-02-02', 7,  NULL),  -- 67
('manager', 'Arne',     'Slot',         '1978-09-17', 7,  NULL),  -- 68
('manager', 'Mikel',    'Arteta',       '1982-03-26', 2,  NULL),  -- 69
('manager', 'Pep',      'Guardiola',    '1971-01-18', 2,  NULL),  -- 70
('manager', 'Enzo',     'Maresca',      '1980-02-02', 4,  NULL),  -- 71
('manager', 'Ange',     'Postecoglou',  '1965-08-27', 1,  NULL),  -- 72
('manager', 'Hansi',    'Flick',        '1965-02-24', 3,  NULL),  -- 73
('manager', 'Carlo',    'Ancelotti',    '1959-06-10', 4,  NULL),  -- 74
('manager', 'Diego',    'Simeone',      '1970-04-28', 10, NULL),  -- 75
('manager', 'Vincent',  'Kompany',      '1986-04-10', 8,  NULL),  -- 76
('manager', 'Xabi',     'Alonso',       '1981-11-25', 2,  NULL),  -- 77
('manager', 'Luis',     'Enrique',      '1970-05-08', 2,  NULL);  -- 78

-- ── REFEREES (79-84) ──
INSERT INTO persons (person_type, first_name, last_name, date_of_birth, nationality_id, photo_url) VALUES
('referee', 'Michael',  'Oliver',    '1985-02-20', 1,  NULL),  -- 79
('referee', 'Anthony',  'Taylor',    '1978-10-20', 1,  NULL),  -- 80
('referee', 'Clément',  'Turpin',    '1982-05-16', 5,  NULL),  -- 81
('referee', 'Daniele',  'Orsato',    '1975-11-23', 4,  NULL),  -- 82
('referee', 'Slavko',   'Vinčić',    '1979-11-05', 24, NULL),  -- 83
('referee', 'François', 'Letexier',  '1989-05-12', 5,  NULL);  -- 84

-- Player contracts (team assignments)
INSERT INTO contracts (person_id, team_id, contract_type, start_date, end_date, jersey_number, is_current) VALUES
-- Man United (1)
(1,  1, 'player', '2020-01-30', '2026-06-30', 8,  TRUE),
(2,  1, 'player', '2016-07-01', '2028-06-30', 10, TRUE),
(3,  1, 'player', '2022-08-22', '2026-06-30', 18, TRUE),
(66, 1, 'player', '2020-07-01', '2028-06-30', 17, TRUE),
-- Liverpool (2)
(4,  2, 'player', '2017-07-01', '2025-06-30', 11, TRUE),
(5,  2, 'player', '2018-01-01', '2025-06-30', 4,  TRUE),
(6,  2, 'player', '2016-07-01', '2025-06-30', 66, TRUE),
(59, 2, 'player', '2018-07-01', '2027-06-30', 1,  TRUE),
-- Arsenal (3)
(7,  3, 'player', '2018-07-01', '2027-06-30', 7,  TRUE),
(8,  3, 'player', '2021-08-20', '2028-06-30', 8,  TRUE),
(9,  3, 'player', '2020-09-01', '2027-06-30', 6,  TRUE),
(54, 3, 'player', '2022-07-01', '2027-06-30', 2,  TRUE),
(55, 3, 'player', '2023-07-15', '2028-06-30', 41, TRUE),
(58, 3, 'player', '2023-07-01', '2026-06-30', 22, TRUE),
-- Man City (4)
(10, 4, 'player', '2022-07-01', '2027-06-30', 9,  TRUE),
(11, 4, 'player', '2015-08-30', '2025-06-30', 17, TRUE),
(12, 4, 'player', '2019-07-01', '2027-06-30', 16, TRUE),
(56, 4, 'player', '2017-07-01', '2027-06-30', 47, TRUE),
(57, 4, 'player', '2017-08-12', '2025-06-30', 20, TRUE),
(60, 4, 'player', '2017-07-01', '2026-06-30', 31, TRUE),
-- Chelsea (5)
(13, 5, 'player', '2023-09-01', '2033-06-30', 20, TRUE),
(14, 5, 'player', '2023-01-24', '2031-06-30', 15, TRUE),
-- Tottenham (6)
(15, 6, 'player', '2015-08-28', '2025-06-30', 7,  TRUE),
(16, 6, 'player', '2023-06-22', '2028-06-30', 10, TRUE),
-- Barcelona (7)
(17, 7, 'player', '2022-07-19', '2026-06-30', 9,  TRUE),
(18, 7, 'player', '2019-09-02', '2026-06-30', 8,  TRUE),
(19, 7, 'player', '2022-07-01', '2030-06-30', 27, TRUE),
(62, 7, 'player', '2014-07-01', '2025-06-30', 1,  TRUE),
(64, 7, 'player', '2018-07-01', '2026-06-30', 4,  TRUE),
-- Real Madrid (8)
(20, 8, 'player', '2018-07-12', '2027-06-30', 7,  TRUE),
(21, 8, 'player', '2023-06-14', '2029-06-30', 5,  TRUE),
(22, 8, 'player', '2024-07-01', '2029-06-30', 9,  TRUE),
(23, 8, 'player', '2016-08-01', '2027-06-30', 15, TRUE),
(63, 8, 'player', '2014-07-01', '2026-06-30', 1,  TRUE),
-- Atlético Madrid (9)
(24, 9, 'player', '2019-07-01', '2026-06-30', 7,  TRUE),
(25, 9, 'player', '2024-08-13', '2029-06-30', 19, TRUE),
-- Bayern Munich (10)
(26, 10, 'player', '2023-08-12', '2027-06-30', 9,  TRUE),
(27, 10, 'player', '2020-07-01', '2026-06-30', 42, TRUE),
(28, 10, 'player', '2015-07-01', '2025-06-30', 6,  TRUE),
-- Dortmund (11)
(29, 11, 'player', '2023-07-01', '2028-06-30', 9,  TRUE),
(30, 11, 'player', '2019-07-01', '2026-06-30', 10, TRUE),
-- Leverkusen (12)
(31, 12, 'player', '2020-01-01', '2027-06-30', 10, TRUE),
(32, 12, 'player', '2023-07-01', '2027-06-30', 34, TRUE),
-- Stuttgart (13)
(33, 13, 'player', '2023-07-01', '2026-06-30', 18, TRUE),
-- AC Milan (14)
(34, 14, 'player', '2019-07-01', '2028-06-30', 10, TRUE),
(35, 14, 'player', '2023-07-01', '2027-06-30', 11, TRUE),
-- Inter Milan (15)
(36, 15, 'player', '2018-07-01', '2028-06-30', 10, TRUE),
(37, 15, 'player', '2023-07-03', '2027-06-30', 20, TRUE),
-- Juventus (16)
(38, 16, 'player', '2022-01-28', '2026-06-30', 9,  TRUE),
(39, 16, 'player', '2022-07-01', '2029-06-30', 10, TRUE),
-- Napoli (17)
(40, 17, 'player', '2020-07-31', '2025-06-30', 9,  TRUE),
(41, 17, 'player', '2022-07-14', '2027-06-30', 77, TRUE),
-- Roma (18)
(42, 18, 'player', '2022-07-20', '2025-06-30', 21, TRUE),
-- PSG (19)
(43, 19, 'player', '2023-07-01', '2028-06-30', 10, TRUE),
(44, 19, 'player', '2021-07-06', '2026-06-30', 2,  TRUE),
(61, 19, 'player', '2017-07-01', '2026-06-30', 99, TRUE),
-- Lyon (20)
(45, 20, 'player', '2021-07-01', '2025-06-30', 10, TRUE),
-- Marseille (21)
(46, 21, 'player', '2023-07-01', '2025-06-30', 10, TRUE),
-- Lille (22)
(47, 22, 'player', '2018-08-01', '2025-06-30', 9,  TRUE),
-- Benfica (23)
(48, 23, 'player', '2023-07-01', '2025-06-30', 11, TRUE),
-- Porto (24)
(49, 24, 'player', '2020-07-01', '2025-06-30', 9,  TRUE),
-- Ajax (25)
(50, 25, 'player', '2022-07-01', '2027-06-30', 9,  TRUE),
-- Club Brugge (26)
(51, 26, 'player', '2015-07-01', '2026-06-30', 20, TRUE),
-- Celtic (27)
(52, 27, 'player', '2021-07-16', '2026-06-30', 8,  TRUE),
-- Salzburg (28)
(53, 28, 'player', '2023-07-01', '2027-06-30', 10, TRUE);

-- Manager contracts
INSERT INTO contracts (person_id, team_id, contract_type, start_date, end_date, is_current, matches_managed, wins, draws, losses) VALUES
(67, 1,  'manager', '2022-05-16', '2025-06-30', TRUE, 120, 65, 25, 30),
(68, 2,  'manager', '2024-06-01', '2027-06-30', TRUE, 40,  28, 7,  5),
(69, 3,  'manager', '2019-12-20', '2027-06-30', TRUE, 250, 155, 55, 40),
(70, 4,  'manager', '2016-07-01', '2025-06-30', TRUE, 450, 340, 62, 48),
(71, 5,  'manager', '2024-06-01', '2027-06-30', TRUE, 38,  20, 10, 8),
(72, 6,  'manager', '2023-06-12', '2025-06-30', TRUE, 75,  38, 15, 22),
(73, 7,  'manager', '2024-05-14', '2026-06-30', TRUE, 45,  32, 8,  5),
(74, 8,  'manager', '2021-06-01', '2026-06-30', TRUE, 200, 145, 35, 20),
(75, 9,  'manager', '2011-12-23', '2027-06-30', TRUE, 700, 390, 170,140),
(76, 10, 'manager', '2024-05-28', '2027-06-30', TRUE, 42,  28, 8,  6),
(77, 12, 'manager', '2022-06-09', '2026-06-30', TRUE, 110, 78, 22, 10),
(78, 19, 'manager', '2023-07-04', '2025-06-30', TRUE, 85,  60, 15, 10);


INSERT INTO matches (season_id, stage_name, matchday, home_team_id, away_team_id, home_score, away_score, match_date, kick_off_time, stadium_id, referee_id, status, attendance, home_formation, away_formation) VALUES
-- ── PREMIER LEAGUE (season 1) — 10 matches ──
(1, 'Matchday 1',  1,  1,  2,  2, 2, '2024-08-17', '15:00', 1,  79, 'finished', 73869, '4-2-3-1', '4-3-3'),   -- 1: Man Utd 2-2 Liverpool
(1, 'Matchday 1',  1,  3,  6,  2, 0, '2024-08-17', '17:30', 3,  80, 'finished', 60260, '4-3-3',   '4-2-3-1'), -- 2: Arsenal 2-0 Spurs
(1, 'Matchday 5',  5,  3,  4,  1, 0, '2024-09-22', '16:30', 3,  79, 'finished', 60260, '4-3-3',   '4-3-3'),   -- 3: Arsenal 1-0 Man City
(1, 'Matchday 8',  8,  2,  3,  2, 2, '2024-10-27', '16:30', 2,  80, 'finished', 53394, '4-3-3',   '4-3-3'),   -- 4: Liverpool 2-2 Arsenal
(1, 'Matchday 12', 12, 4,  6,  4, 0, '2024-11-23', '15:00', 4,  79, 'finished', 53400, '4-3-3',   '4-2-3-1'), -- 5: Man City 4-0 Spurs
(1, 'Matchday 15', 15, 5,  1,  1, 1, '2024-12-14', '12:30', 5,  80, 'finished', 40341, '4-2-3-1', '4-2-3-1'), -- 6: Chelsea 1-1 Man Utd
(1, 'Matchday 18', 18, 2,  4,  3, 1, '2025-01-04', '17:30', 2,  79, 'finished', 53394, '4-3-3',   '4-3-3'),   -- 7: Liverpool 3-1 Man City
(1, 'Matchday 20', 20, 4,  3,  0, 1, '2025-01-18', '17:30', 4,  80, 'finished', 53400, '4-3-3',   '4-3-3'),   -- 8: Man City 0-1 Arsenal
(1, 'Matchday 25', 25, 3,  2,  1, 1, '2025-02-22', '17:30', 3,  79, 'finished', 60260, '4-3-3',   '4-3-3'),   -- 9: Arsenal 1-1 Liverpool
(1, 'Matchday 28', 28, 6,  5,  3, 2, '2025-03-15', '15:00', 6,  80, 'finished', 62850, '4-2-3-1', '4-2-3-1'), -- 10: Spurs 3-2 Chelsea

-- ── LA LIGA (season 2) — 6 matches ──
(2, 'Matchday 4',  4,  8,  9,  2, 1, '2024-09-14', '21:00', 8,  82, 'finished', 78000, '4-3-3',   '3-5-2'),   -- 11: Real Madrid 2-1 Atlético
(2, 'Matchday 11', 11, 7,  8,  1, 2, '2024-10-26', '21:00', 7,  81, 'finished', 92456, '4-3-3',   '4-3-3'),   -- 12: Barcelona 1-2 Real Madrid (El Clásico)
(2, 'Matchday 18', 18, 8,  7,  3, 3, '2025-01-11', '21:00', 8,  82, 'finished', 80134, '4-3-3',   '4-3-3'),   -- 13: Real Madrid 3-3 Barcelona
(2, 'Matchday 22', 22, 9,  7,  0, 1, '2025-02-08', '18:30', 9,  81, 'finished', 66000, '3-5-2',   '4-3-3'),   -- 14: Atlético 0-1 Barcelona
(2, 'Matchday 25', 25, 7,  9,  3, 1, '2025-03-01', '21:00', 7,  82, 'finished', 90245, '4-3-3',   '3-5-2'),   -- 15: Barcelona 3-1 Atlético
(2, 'Matchday 28', 28, 9,  8,  1, 1, '2025-03-22', '21:00', 9,  81, 'finished', 68000, '3-5-2',   '4-3-3'),   -- 16: Atlético 1-1 Real Madrid

-- ── BUNDESLIGA (season 3) — 5 matches ──
(3, 'Matchday 3',  3,  10, 12, 1, 1, '2024-09-14', '18:30', 10, 83, 'finished', 75000, '4-2-3-1', '3-4-3'),   -- 17: Bayern 1-1 Leverkusen
(3, 'Matchday 9',  9,  11, 10, 1, 3, '2024-11-02', '18:30', 11, 84, 'finished', 81365, '4-2-3-1', '4-2-3-1'), -- 18: Dortmund 1-3 Bayern
(3, 'Matchday 14', 14, 12, 11, 2, 0, '2024-12-14', '15:30', 13, 83, 'finished', 30000, '3-4-3',   '4-2-3-1'), -- 19: Leverkusen 2-0 Dortmund
(3, 'Matchday 20', 20, 10, 13, 4, 0, '2025-02-01', '15:30', 10, 84, 'finished', 75000, '4-2-3-1', '4-4-2'),   -- 20: Bayern 4-0 Stuttgart
(3, 'Matchday 25', 25, 13, 12, 1, 2, '2025-03-15', '15:30', 12, 83, 'finished', 60000, '4-4-2',   '3-4-3'),   -- 21: Stuttgart 1-2 Leverkusen

-- ── SERIE A (season 4) — 5 matches ──
(4, 'Matchday 5',  5,  14, 15, 1, 2, '2024-09-22', '20:45', 15, 82, 'finished', 75000, '4-2-3-1', '3-5-2'),   -- 22: Milan 1-2 Inter (Derby della Madonnina)
(4, 'Matchday 10', 10, 15, 16, 1, 0, '2024-10-27', '20:45', 15, 84, 'finished', 75000, '3-5-2',   '4-3-3'),   -- 23: Inter 1-0 Juventus
(4, 'Matchday 15', 15, 17, 14, 2, 1, '2024-12-01', '20:45', 18, 82, 'finished', 54000, '4-3-3',   '4-2-3-1'), -- 24: Napoli 2-1 Milan
(4, 'Matchday 22', 22, 16, 17, 0, 0, '2025-01-25', '20:45', 17, 84, 'finished', 41000, '4-3-3',   '4-3-3'),   -- 25: Juventus 0-0 Napoli
(4, 'Matchday 28', 28, 15, 14, 3, 0, '2025-03-16', '20:45', 15, 82, 'finished', 75000, '3-5-2',   '4-2-3-1'), -- 26: Inter 3-0 Milan

-- ── LIGUE 1 (season 5) — 4 matches ──
(5, 'Matchday 6',  6,  19, 21, 3, 0, '2024-09-28', '21:00', 19, 81, 'finished', 47000, '4-3-3',   '3-4-3'),   -- 27: PSG 3-0 Marseille (Le Classique)
(5, 'Matchday 14', 14, 21, 22, 2, 1, '2024-12-07', '21:00', 21, 84, 'finished', 60000, '3-4-3',   '4-3-3'),   -- 28: Marseille 2-1 Lille
(5, 'Matchday 20', 20, 22, 19, 1, 3, '2025-01-18', '21:00', 30, 81, 'finished', 50000, '4-3-3',   '4-3-3'),   -- 29: Lille 1-3 PSG
(5, 'Matchday 26', 26, 19, 20, 4, 1, '2025-03-08', '21:00', 19, 84, 'finished', 47929, '4-3-3',   '4-2-3-1'), -- 30: PSG 4-1 Lyon

-- ── UCL (season 6) — 6 matches ──
(6, 'League Phase', NULL, 8,  12, 3, 1, '2024-10-01', '21:00', 8,  81, 'finished', 78000, '4-3-3',   '3-4-3'),  -- 31: Real Madrid 3-1 Leverkusen (UCL)
(6, 'League Phase', NULL, 15, 7,  1, 0, '2024-10-23', '21:00', 15, 83, 'finished', 75000, '3-5-2',   '4-3-3'),  -- 32: Inter 1-0 Barcelona (UCL)
(6, 'League Phase', NULL, 3,  19, 2, 0, '2024-11-06', '21:00', 3,  84, 'finished', 60260, '4-3-3',   '4-3-3'),  -- 33: Arsenal 2-0 PSG (UCL)
(6, 'League Phase', NULL, 10, 23, 5, 1, '2024-11-27', '21:00', 10, 81, 'finished', 75000, '4-2-3-1', '4-4-2'),  -- 34: Bayern 5-1 Benfica (UCL)
(6, 'League Phase', NULL, 2,  8,  2, 0, '2024-12-10', '21:00', 2,  83, 'finished', 53394, '4-3-3',   '4-3-3'),  -- 35: Liverpool 2-0 Real Madrid (UCL)
(6, 'Round of 16',  NULL, 3,  10, 1, 0, '2025-03-11', '21:00', 3,  84, 'finished', 60260, '4-3-3',   '4-2-3-1'); -- 36: Arsenal 1-0 Bayern (UCL R16)



-- Match 1: Man Utd 2-2 Liverpool
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(1, 'goal',   1, 2,  3,    23, 0, 'Rashford finishes after Casemiro through ball'),
(1, 'yellow', 2, 5,  NULL, 31, 0, 'Foul on Bruno Fernandes'),
(1, 'goal',   2, 4,  6,    38, 0, 'Salah heads in Alexander-Arnold cross'),
(1, 'goal',   2, 4,  NULL, 56, 0, 'Solo run, curled into top corner'),
(1, 'yellow', 1, 3,  NULL, 64, 0, 'Tactical foul'),
(1, 'goal',   1, 1,  NULL, 78, 0, 'Penalty after VAR review');

-- Match 2: Arsenal 2-0 Spurs
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(2, 'goal',   3, 7,  8,    34, 0, 'Saka volleys in Ødegaard cross'),
(2, 'yellow', 6, 16, NULL, 52, 0, 'Late tackle on Rice'),
(2, 'goal',   3, 9,  NULL, 71, 0, 'Gabriel header from corner');

-- Match 3: Arsenal 1-0 Man City
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(3, 'yellow', 4, 12, NULL, 18, 0, 'Foul on Saka'),
(3, 'goal',   3, 7,  8,    67, 0, 'Header from Ødegaard cross'),
(3, 'yellow', 4, 10, NULL, 72, 0, 'Dissent');

-- Match 4: Liverpool 2-2 Arsenal
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(4, 'goal',   3, 7,  55,   12, 0, 'Saka tap-in from Rice pass'),
(4, 'goal',   2, 4,  6,    35, 0, 'Salah curler from the edge of the box'),
(4, 'goal',   3, 54, NULL, 58, 0, 'Saliba header from corner'),
(4, 'goal',   2, 4,  NULL, 82, 0, 'Salah penalty after Saliba handball');

-- Match 5: Man City 4-0 Spurs
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(5, 'goal',   4, 10, 11,   15, 0, 'Haaland header from De Bruyne cross'),
(5, 'goal',   4, 56, 10,   28, 0, 'Foden finishes Haaland layoff'),
(5, 'goal',   4, 10, 56,   55, 0, 'Haaland tap-in from Foden pass'),
(5, 'goal',   4, 10, NULL, 78, 0, 'Haaland penalty — hat trick');

-- Match 7: Liverpool 3-1 Man City
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(7, 'goal',   2, 4,  6,    8,  0, 'Salah breakaway goal'),
(7, 'goal',   2, 4,  NULL, 33, 0, 'Salah free-kick curler'),
(7, 'goal',   4, 56, 11,   52, 0, 'Foden pulls one back'),
(7, 'goal',   2, 6,  4,    88, 0, 'Alexander-Arnold thunderbolt from 25 yards');

-- Match 8: Man City 0-1 Arsenal
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(8, 'goal',   3, 55, 8,    63, 0, 'Rice low shot from Ødegaard through ball'),
(8, 'yellow', 4, 12, NULL, 75, 0, 'Rodri foul on Saka'),
(8, 'yellow', 3, 9,  NULL, 89, 3, 'Gabriel time wasting');

-- Match 11: Real Madrid 2-1 Atlético
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(11, 'goal',   8, 22, 20,   22, 0, 'Mbappé finishes Vinícius cross'),
(11, 'goal',   9, 25, 24,   45, 1, 'Álvarez equalizer just before half-time'),
(11, 'goal',   8, 21, 23,   76, 0, 'Bellingham winner from Valverde pass');

-- Match 12: Barcelona 1-2 Real Madrid (El Clásico)
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(12, 'goal',   8, 20, 22,   18, 0, 'Vinícius Jr solo dribble and finish'),
(12, 'goal',   7, 19, 18,   55, 0, 'Yamal equalizer on Pedri assist'),
(12, 'yellow', 8, 23, NULL, 68, 0, 'Valverde tactical foul'),
(12, 'goal',   8, 21, 20,   84, 0, 'Bellingham header for the winner');

-- Match 13: Real Madrid 3-3 Barcelona
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(13, 'goal',   7, 17, 19,   11, 0, 'Lewandowski penalty after Yamal fouled'),
(13, 'goal',   8, 22, 21,   25, 0, 'Mbappé finishes Bellingham cross'),
(13, 'goal',   7, 19, NULL, 38, 0, 'Yamal solo goal from the right'),
(13, 'goal',   8, 20, 22,   52, 0, 'Vinícius Jr tap-in'),
(13, 'goal',   7, 18, 17,   67, 0, 'Pedri volley'),
(13, 'goal',   8, 21, NULL, 89, 0, 'Bellingham free-kick equalizer');

-- Match 17: Bayern 1-1 Leverkusen
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(17, 'goal',   10, 26, 27,  33, 0, 'Kane header from Musiala cross'),
(17, 'goal',   12, 31, 32,  78, 0, 'Wirtz equalizer from Xhaka pass');

-- Match 18: Dortmund 1-3 Bayern
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(18, 'goal',   10, 26, NULL, 15, 0, 'Kane penalty'),
(18, 'goal',   11, 29, 30,  42, 0, 'Guirassy equalizer from Brandt assist'),
(18, 'goal',   10, 27, 28,  61, 0, 'Musiala after Kimmich through ball'),
(18, 'goal',   10, 26, 27,  80, 0, 'Kane seals it from Musiala pass');

-- Match 22: Milan 1-2 Inter (Derby)
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(22, 'goal',   15, 36, 37,  20, 0, 'Martínez heads in Çalhanoğlu free kick'),
(22, 'goal',   14, 34, 35,  45, 0, 'Leão finishes Pulisic cross'),
(22, 'goal',   15, 36, NULL, 72, 0, 'Martínez penalty winner');

-- Match 24: Napoli 2-1 Milan
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(24, 'goal',   17, 41, 40,  22, 0, 'Kvaratskhelia finishes Osimhen pass'),
(24, 'goal',   14, 35, 34,  55, 0, 'Pulisic equalizer from Leão cross'),
(24, 'goal',   17, 40, NULL, 88, 0, 'Osimhen late header winner');

-- Match 26: Inter 3-0 Milan
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(26, 'goal',   15, 36, NULL, 12, 0, 'Martínez low shot from edge of box'),
(26, 'goal',   15, 37, 36,  45, 0, 'Çalhanoğlu free kick into top corner'),
(26, 'goal',   15, 36, NULL, 71, 0, 'Martínez completes brace from counter');

-- Match 27: PSG 3-0 Marseille
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(27, 'goal',   19, 43, 44,  18, 0, 'Dembélé finishes Hakimi cross'),
(27, 'goal',   19, 43, NULL, 52, 0, 'Dembélé curler from edge of box'),
(27, 'goal',   19, 44, 43,  75, 0, 'Hakimi arrives late in box');

-- Match 30: PSG 4-1 Lyon
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(30, 'goal',   19, 43, NULL, 10, 0, 'Dembélé solo goal'),
(30, 'goal',   20, 45, NULL, 25, 0, 'Lacazette pulls one back'),
(30, 'goal',   19, 43, 44,  48, 0, 'Dembélé hat-trick from Hakimi cross'),
(30, 'goal',   19, 44, NULL, 65, 0, 'Hakimi curler'),
(30, 'goal',   19, 43, NULL, 80, 0, 'Dembélé makes it four from the penalty spot');

-- UCL Match 31: Real Madrid 3-1 Leverkusen
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(31, 'goal',   8,  22, 20,  15, 0, 'Mbappé finishes Vinícius through ball'),
(31, 'goal',   12, 31, NULL, 35, 0, 'Wirtz long-range stunner'),
(31, 'goal',   8,  21, 23,  62, 0, 'Bellingham header from Valverde cross'),
(31, 'goal',   8,  20, 22,  78, 0, 'Vinícius Jr seals it');

-- UCL Match 33: Arsenal 2-0 PSG
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(33, 'goal',   3, 7,  8,    41, 0, 'Saka finishes Ødegaard through ball'),
(33, 'goal',   3, 55, NULL, 72, 0, 'Rice long-range strike');

-- UCL Match 34: Bayern 5-1 Benfica
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(34, 'goal',   10, 26, 27,   8,  0, 'Kane tap-in from Musiala'),
(34, 'goal',   10, 26, NULL, 22, 0, 'Kane penalty'),
(34, 'goal',   23, 48, NULL, 35, 0, 'Di María free kick'),
(34, 'goal',   10, 27, 28,  55, 0, 'Musiala curler'),
(34, 'goal',   10, 26, NULL, 68, 0, 'Kane hat-trick header'),
(34, 'goal',   10, 27, 26,  82, 0, 'Musiala volleys Kane knockdown');

-- UCL Match 35: Liverpool 2-0 Real Madrid
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(35, 'goal',   2, 4,  6,    28, 0, 'Salah converts Alexander-Arnold cross'),
(35, 'goal',   2, 4,  NULL, 73, 0, 'Salah penalty after Courtois foul');

-- UCL Match 36: Arsenal 1-0 Bayern (R16)
INSERT INTO match_events (match_id, event_type, team_id, person_id, related_person_id, minute, added_time, description) VALUES
(36, 'goal',   3, 7,  55,   56, 0, 'Saka scores after Rice cross-field pass');
-- ╔══════════════════════════════════════════════════════════╗
-- ║  11. STANDINGS — All 6 league tables (end of March)     ║
-- ╚══════════════════════════════════════════════════════════╝

-- Premier League (season 1) — top 6
INSERT INTO standings (season_id, team_id, position, played, won, drawn, lost, goals_for, goals_against, points, form) VALUES
(1, 2,  1, 29, 21, 5,  3, 68, 26, 68, 'WWDWW'),
(1, 3,  2, 29, 20, 6,  3, 62, 24, 66, 'WDWWW'),
(1, 4,  3, 29, 19, 4,  6, 64, 32, 61, 'WLWWL'),
(1, 5,  4, 29, 16, 7,  6, 52, 34, 55, 'DWWDW'),
(1, 1,  5, 29, 15, 7,  7, 51, 38, 52, 'LWDWW'),
(1, 6,  6, 29, 13, 5, 11, 52, 48, 44, 'WLLWL');

-- La Liga (season 2) — top 3
INSERT INTO standings (season_id, team_id, position, played, won, drawn, lost, goals_for, goals_against, points, form) VALUES
(2, 7,  1, 29, 22, 4,  3, 75, 28, 70, 'WWWDW'),
(2, 8,  2, 29, 21, 5,  3, 72, 25, 68, 'WDWWW'),
(2, 9,  3, 29, 17, 8,  4, 52, 28, 59, 'DLDWW');

-- Bundesliga (season 3) — top 4
INSERT INTO standings (season_id, team_id, position, played, won, drawn, lost, goals_for, goals_against, points, form) VALUES
(3, 10, 1, 26, 19, 4,  3, 68, 22, 61, 'WWWDW'),
(3, 12, 2, 26, 18, 5,  3, 62, 25, 59, 'WDWWW'),
(3, 11, 3, 26, 15, 4,  7, 55, 38, 49, 'LWWDL'),
(3, 13, 4, 26, 14, 5,  7, 50, 32, 47, 'WLWDW');

-- Serie A (season 4) — top 5
INSERT INTO standings (season_id, team_id, position, played, won, drawn, lost, goals_for, goals_against, points, form) VALUES
(4, 15, 1, 29, 22, 5,  2, 65, 18, 71, 'WWWDW'),
(4, 17, 2, 29, 20, 4,  5, 58, 25, 64, 'WDWWL'),
(4, 16, 3, 29, 16, 10, 3, 42, 20, 58, 'DDDWW'),
(4, 14, 4, 29, 15, 6,  8, 48, 35, 51, 'LWWDL'),
(4, 18, 5, 29, 13, 7,  9, 45, 38, 46, 'DLWWL');

-- Ligue 1 (season 5) — top 4
INSERT INTO standings (season_id, team_id, position, played, won, drawn, lost, goals_for, goals_against, points, form) VALUES
(5, 19, 1, 27, 22, 3,  2, 70, 18, 69, 'WWWWW'),
(5, 21, 2, 27, 16, 5,  6, 48, 30, 53, 'WDWLW'),
(5, 22, 3, 27, 15, 6,  6, 45, 28, 51, 'DWWDL'),
(5, 20, 4, 27, 13, 5,  9, 42, 35, 44, 'LWWDL');


INSERT INTO transfers (person_id, from_team_id, to_team_id, transfer_type, status, fee, fee_currency, transfer_date, window_year, window_type) VALUES
-- Historical confirmed
(4,  18, 2,  'permanent', 'official', 42000000.00,  'EUR', '2017-06-22', 2017, 'summer'),  -- Salah: Roma→Liverpool
(5,  NULL,2, 'permanent', 'official', 84700000.00,  'EUR', '2018-01-01', 2018, 'winter'),  -- Van Dijk→Liverpool
(3,  8,  1,  'permanent', 'official', 70600000.00,  'EUR', '2022-08-22', 2022, 'summer'),  -- Casemiro: RM→ManUtd
(10, 11, 4,  'permanent', 'official', 60000000.00,  'EUR', '2022-07-01', 2022, 'summer'),  -- Haaland: BVB→City
(8,  8,  3,  'permanent', 'official', 40000000.00,  'EUR', '2021-08-20', 2021, 'summer'),  -- Ødegaard: RM→Arsenal
(21, 11, 8,  'permanent', 'official', 103000000.00, 'EUR', '2023-06-14', 2023, 'summer'),  -- Bellingham: BVB→RM
(26, 6,  10, 'permanent', 'official', 100000000.00, 'EUR', '2023-08-12', 2023, 'summer'),  -- Kane: Spurs→Bayern
(17, 10, 7,  'permanent', 'official', 45000000.00,  'EUR', '2022-07-19', 2022, 'summer'),  -- Lewandowski: Bayern→Barca
(20, NULL,8, 'youth',     'official', 45000000.00,  'EUR', '2018-07-12', 2018, 'summer'),  -- Vinícius→RM
(22, 19, 8,  'free',      'official', 0.00,         'EUR', '2024-07-01', 2024, 'summer'),  -- Mbappé: PSG→RM
(44, 15, 19, 'permanent', 'official', 66000000.00,  'EUR', '2021-07-06', 2021, 'summer'),  -- Hakimi: Inter→PSG
(25, 4,  9,  'permanent', 'official', 75000000.00,  'EUR', '2024-08-13', 2024, 'summer'),  -- J.Álvarez: City→Atlético
(55, NULL,3, 'permanent', 'official', 105000000.00, 'EUR', '2023-07-15', 2023, 'summer'),  -- Rice→Arsenal
(13, 4,  5,  'permanent', 'official', 42500000.00,  'EUR', '2023-09-01', 2023, 'summer'),  -- Palmer: City→Chelsea
(32, 3,  12, 'permanent', 'official', 25000000.00,  'EUR', '2023-07-01', 2023, 'summer'),  -- Xhaka: Arsenal→Leverkusen
(47, NULL,22,'permanent', 'official', 10000000.00,  'EUR', '2018-08-01', 2018, 'summer'),  -- J.David→Lille
(34, NULL,14,'permanent', 'official', 20000000.00,  'EUR', '2019-08-01', 2019, 'summer'),  -- Leão→Milan
(36, NULL,15,'permanent', 'official', 25000000.00,  'EUR', '2018-07-01', 2018, 'summer'),  -- L.Martínez→Inter

-- 2025 Winter Window
(2,  1,  11, 'loan',      'official', 0.00,         'EUR', '2025-01-15', 2025, 'winter'),  -- Rashford: ManUtd→BVB (loan)
(64, 7,  5,  'loan',      'agreed',   0.00,         'EUR', '2025-01-28', 2025, 'winter'),  -- Araújo: Barca→Chelsea (loan)

-- 2025 Summer Rumors / Negotiating
(6,  2,  8,  'free',      'rumor',       0.00,         'EUR', NULL, 2025, 'summer'),  -- TAA→Real Madrid
(4,  2,  19, 'free',      'rumor',       0.00,         'EUR', NULL, 2025, 'summer'),  -- Salah→PSG
(10, 4,  8,  'permanent', 'rumor',       200000000.00, 'EUR', NULL, 2025, 'summer'),  -- Haaland→RM
(27, 10, 4,  'permanent', 'negotiating', 120000000.00, 'EUR', NULL, 2025, 'summer'),  -- Musiala→City
(11, 4,  7,  'permanent', 'rumor',       30000000.00,  'EUR', NULL, 2025, 'summer'),  -- De Bruyne→Barca
(12, 4,  7,  'permanent', 'rumor',       80000000.00,  'EUR', NULL, 2025, 'summer'),  -- Rodri→Barca
(31, 12, 8,  'permanent', 'rumor',       150000000.00, 'EUR', NULL, 2025, 'summer'),  -- Wirtz→RM
(47, 22, 3,  'permanent', 'negotiating', 35000000.00,  'EUR', NULL, 2025, 'summer'),  -- J.David→Arsenal
(23, 8,  1,  'permanent', 'rumor',       90000000.00,  'EUR', NULL, 2025, 'summer');


INSERT INTO achievements (team_id, person_id, achievement_type, title, description, competition_id, season_id, year, month, position, stats, is_major) VALUES
-- 2023/24 League titles
(4,    NULL, 'league_title',      'Premier League Champions 2023/24',     'Manchester City win a record 4th consecutive title',          1, 7,  2024, 5, 1, '{"points": 91}', TRUE),
(8,    NULL, 'league_title',      'La Liga Champions 2023/24',            'Real Madrid clinch the 36th league title',                    2, 8,  2024, 5, 1, '{"points": 87}', TRUE),
(12,   NULL, 'league_title',      'Bundesliga Champions 2023/24',         'Bayer Leverkusen win first-ever league title unbeaten',       3, 9,  2024, 5, 1, '{"points": 90}', TRUE),
(15,   NULL, 'league_title',      'Serie A Champions 2023/24',            'Inter Milan dominate the Italian league',                     4, 10, 2024, 5, 1, '{"points": 94}', TRUE),
(19,   NULL, 'league_title',      'Ligue 1 Champions 2023/24',            'PSG claim 12th Ligue 1 title',                               5, 11, 2024, 5, 1, '{"points": 85}', TRUE),
-- UCL 2023/24
(8,    NULL, 'continental_winner', 'UEFA Champions League Winners 2023/24','Real Madrid win their 15th UCL in Wembley',                  6, 12, 2024, 6, 1, NULL, TRUE),
(11,   NULL, 'continental_finalist','UCL Finalists 2023/24',               'Dortmund reach the UCL final for the first time since 2013', 6, 12, 2024, 6, 2, NULL, TRUE),

-- Individual awards 2024
(NULL, 20, 'ballon_dor',         'Ballon d''Or 2024',                     'Vinícius Jr wins the 2024 Ballon d''Or',                     NULL, NULL, 2024, 10, 1, NULL, TRUE),
(NULL, 12, 'ballon_dor',         'Ballon d''Or Runner-Up 2024',           'Rodri finishes second in Ballon d''Or voting',               NULL, NULL, 2024, 10, 2, NULL, FALSE),
(NULL, 21, 'player_of_season',   'La Liga Player of the Season 2023/24', 'Bellingham dominates in first Madrid season',                 2, 8,  2024, NULL, 1, '{"goals": 23, "assists": 13}', TRUE),
(NULL, 31, 'player_of_season',   'Bundesliga Player of the Season 2023/24','Wirtz leads Leverkusen to historic unbeaten title',         3, 9,  2024, NULL, 1, '{"goals": 18, "assists": 20}', TRUE),
(NULL, 36, 'player_of_season',   'Serie A Player of the Season 2023/24',  'Lautaro Martínez top scorer as Inter dominate',              4, 10, 2024, NULL, 1, '{"goals": 24, "assists": 7}',  TRUE),

-- 2024/25 Monthly awards
(NULL, 4,  'player_of_month',    'EPL Player of the Month — Sept 2024',  'Salah: 6 goals, 4 assists in September',                     1, 1, 2024, 9, 1, '{"goals": 6, "assists": 4}', FALSE),
(NULL, 10, 'player_of_month',    'EPL Player of the Month — Nov 2024',   'Haaland: 8 goals in November',                               1, 1, 2024, 11, 1, '{"goals": 8}', FALSE),
(NULL, 19, 'player_of_month',    'La Liga Player of the Month — Oct 2024','Yamal: 5 goals, 3 assists',                                 2, 2, 2024, 10, 1, '{"goals": 5, "assists": 3}', FALSE),
(NULL, 26, 'player_of_month',    'Bundesliga Player of the Month — Dec 2024','Kane: 7 goals in December',                              3, 3, 2024, 12, 1, '{"goals": 7}', FALSE),

-- Top scorers 2024/25 (current)
(NULL, 4,  'top_scorer',         'EPL Top Scorer 2024/25 (Current)',      'Salah leads the EPL Golden Boot race',                       1, 1, 2025, NULL, 1, '{"goals": 21}', FALSE),
(NULL, 10, 'top_scorer',         'EPL Top Scorer Runner-Up 2024/25',      'Haaland second in EPL scoring',                              1, 1, 2025, NULL, 2, '{"goals": 19}', FALSE),
(NULL, 22, 'top_scorer',         'La Liga Top Scorer 2024/25 (Current)',  'Mbappé leads La Liga scorers',                               2, 2, 2025, NULL, 1, '{"goals": 20}', FALSE),
(NULL, 26, 'top_scorer',         'Bundesliga Top Scorer 2024/25 (Current)','Kane leads Bundesliga scoring again',                       3, 3, 2025, NULL, 1, '{"goals": 24}', FALSE),
(NULL, 36, 'top_scorer',         'Serie A Top Scorer 2024/25 (Current)',  'Martínez leads Serie A scoring',                              4, 4, 2025, NULL, 1, '{"goals": 18}', FALSE),
(NULL, 43, 'top_scorer',         'Ligue 1 Top Scorer 2024/25 (Current)', 'Dembélé leads Ligue 1 scoring',                               5, 5, 2025, NULL, 1, '{"goals": 16}', FALSE),

-- Golden Boots 2023/24
(NULL, 13, 'golden_boot',        'EPL Golden Boot 2023/24',               'Palmer wins first EPL Golden Boot with 22 goals',            1, 7, 2024, 5, 1, '{"goals": 22}', TRUE),
(NULL, 26, 'golden_boot',        'Bundesliga Top Scorer 2023/24',         'Kane''s record-breaking debut season: 36 goals',             3, 9, 2024, 5, 1, '{"goals": 36}', TRUE);


-- Article 1: Match Report — Man Utd vs Liverpool
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id, match_id) VALUES
('salah-double-sinks-united-opening-day-2024',
 'Salah''s Stunning Double Rescues Point for Liverpool at Old Trafford',
 'Egyptian King strikes twice as opening day thriller ends 2-2',
 'Mohamed Salah scored twice to earn Liverpool a 2-2 draw at Manchester United on an electrifying opening day.',
 'Old Trafford played host to an unforgettable opening day clash as Liverpool came from behind twice to salvage a 2-2 draw against Manchester United. Marcus Rashford opened the scoring on 23 minutes before Mohamed Salah equalized twice to deny United all three points.

The result sets the tone for what promises to be a fiercely competitive Premier League season, with both sides showing clear strengths and vulnerabilities in equal measure. Arne Slot''s first competitive match in charge of Liverpool was a baptism by fire in one of English football''s greatest rivalries.

Salah, who continues to defy time at 32, was the standout performer. His first goal was a trademark near-post header, while the second was a moment of individual brilliance — picking up the ball, cutting inside, and curling a shot beyond the despairing reach of the goalkeeper.

Bruno Fernandes converted a late penalty to rescue a point for United, but it was Liverpool who left feeling the more satisfied. The draw leaves both clubs in the middle of the early table but sets up a fascinating battle for the top four.',
 'match_report',
 '{"featured_image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"}',
 'James Anderson', 'auth_001', '2024-08-17 22:30:00', 'published', TRUE, FALSE, 92100,
 '["Premier League", "Liverpool", "Manchester United", "Mohamed Salah", "Opening Day"]',
 2, 1, 4, 1);

-- Article 2: Transfer — Mbappé
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('mbappe-officially-joins-real-madrid-2024',
 'Kylian Mbappé Officially Unveiled as Real Madrid''s New No.9',
 'Years-long transfer saga ends as Frenchman arrives at the Bernabéu',
 'Real Madrid have officially presented Kylian Mbappé following his free transfer from PSG.',
 'Real Madrid have brought one of football''s most prolonged transfer sagas to a close by officially unveiling Kylian Mbappé as their newest galáctico. The French superstar, presented before 80,000 adoring fans at the Santiago Bernabéu, will wear the iconic number 9 shirt.

Mbappé''s arrival on a free transfer from Paris Saint-Germain represents perhaps the most significant signing in football since Cristiano Ronaldo joined Madrid in 2009. Despite no transfer fee, the financial package is monumental, with wages and bonuses estimated at over €150 million across the length of his five-year contract.

Club president Florentino Pérez hailed the signing as the realization of a long-held ambition. The 25-year-old, who scored 256 goals in 308 appearances for PSG, joins a squad already boasting Vinícius Jr, Jude Bellingham, and Federico Valverde.

Manager Carlo Ancelotti will now face the enviable challenge of integrating Mbappé into an attack that already scored over 100 goals last season. Most analysts expect a front three of Vinícius, Mbappé, and Bellingham, with Rodrygo providing competition from the bench.

The signing cements Real Madrid''s position as the most ambitious club in world football and raises expectations for a Champions League defense in 2024/25.',
 'transfer',
 '{"featured_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800"}',
 'Sarah Mitchell', 'auth_002', '2024-07-16 14:00:00', 'published', TRUE, TRUE, 215000,
 '["Transfer News", "Real Madrid", "Kylian Mbappé", "La Liga", "Breaking"]',
 8, 2, 22);

-- Article 3: El Clásico
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, match_id) VALUES
('el-clasico-real-madrid-edge-barcelona-oct-2024',
 'El Clásico Thriller: Bellingham''s Late Header Seals Dramatic Madrid Win',
 'Real Madrid come from behind to beat Barcelona 2-1 at Camp Nou',
 'Jude Bellingham scored a dramatic 84th-minute winner as Real Madrid defeated Barcelona 2-1 in a pulsating El Clásico.',
 'Real Madrid produced a stunning second-half fightback to defeat Barcelona 2-1 in the first El Clásico of the 2024/25 La Liga season, with Jude Bellingham scoring a dramatic late winner at Camp Nou.

Vinícius Jr opened the scoring for the visitors with a solo goal of breathtaking quality, dancing past two defenders before slotting home on 18 minutes. Barcelona equalized through teenager Lamine Yamal, whose composed finish on 55 minutes confirmed his status as one of the most exciting young players in world football.

The match appeared destined for a draw until Bellingham rose magnificently to head home a Vinícius cross with just six minutes remaining. The Englishman''s celebration — a knee slide to the corner flag — will be replayed for years to come.

The result gives Real Madrid a crucial advantage in the title race and extends their remarkable record in El Clásico under Carlo Ancelotti. For Barcelona and Hansi Flick, the defeat represents a setback but not a fatal blow, with much of the season still to play.

Yamal, at just 17, was the silver lining for Barcelona, showing once again that they have one of the most talented academy graduates in the history of the sport.',
 'match_report',
 '{"featured_image": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800"}',
 'Emma Thompson', 'auth_003', '2024-10-26 23:00:00', 'published', TRUE, FALSE, 175300,
 '["El Clásico", "Real Madrid", "Barcelona", "La Liga", "Jude Bellingham", "Vinícius Jr"]',
 8, 2, 12);

-- Article 4: Arsenal title push
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id) VALUES
('arsenal-title-contenders-analysis-2025',
 'Third Time Lucky? Why Arsenal Are the Real Deal This Season',
 'Arteta''s side combine defensive steel with creative flair in title push',
 'After two years of near-misses, Arsenal''s consistency this season suggests they finally have what it takes to dethrone Liverpool.',
 'For two consecutive seasons, Arsenal have finished as the Premier League''s bridesmaids. First, they were overhauled by Manchester City''s relentless consistency. Then, they fell short despite amassing enough points to win the league in most other years. This time, something feels different.

The numbers tell a compelling story. Arsenal have the best defensive record in the league, conceding just 24 goals in 29 matches. William Saliba and Gabriel form the most dominant centre-back pairing in English football, while David Raya has been outstanding in goal.

Going forward, Bukayo Saka has elevated his game to another level. The 23-year-old has 14 goals and 11 assists in the league, playing with the confidence and decisiveness of a seasoned veteran. Martin Ødegaard continues to orchestrate play with creative intelligence, and Declan Rice provides the perfect blend of defensive protection and progressive carrying.

What separates this Arsenal side from previous iterations is their ability to win ugly. The 1-0 victories at the Etihad and at Anfield demonstrate a maturity and resilience that was sometimes lacking in previous campaigns.

Manager Mikel Arteta deserves immense credit for building a squad that can compete on multiple fronts. With the Champions League quarter-finals also on the horizon, this could be a historic season for the club. The question is no longer whether Arsenal are title contenders — it is whether they can sustain their form over the final stretch.',
 'feature',
 '{"featured_image": "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800"}',
 'James Anderson', 'auth_001', '2025-03-18 10:00:00', 'published', TRUE, FALSE, 62400,
 '["Feature", "Arsenal", "Premier League", "Title Race", "Mikel Arteta"]',
 3, 1);

-- Article 5: Kane Bundesliga record
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('kane-bundesliga-scoring-machine-2025',
 'Harry Kane Is Rewriting Bundesliga History at Bayern Munich',
 'England captain on track to break single-season goal record',
 'Harry Kane''s 24 Bundesliga goals in 26 games have Bayern Munich fans dreaming of a historic individual season.',
 'When Harry Kane left Tottenham Hotspur for Bayern Munich in the summer of 2023, sceptics questioned whether the England captain could maintain his prolific scoring rate in a new league. Those doubts have been emphatically silenced.

Kane has scored 24 goals in 26 Bundesliga appearances this season, putting him on course to surpass his own record of 36 league goals set in his debut campaign. His consistency has been remarkable — he has scored in 18 of those 26 matches and has gone no more than two games without finding the net.

The 31-year-old''s partnership with Jamal Musiala has been one of the stories of the European season. Musiala''s creative brilliance and Kane''s predatory finishing complement each other perfectly, and their combined numbers (42 goals, 22 assists) are the most productive partnership in Europe''s top five leagues.

Manager Vincent Kompany has built the team around Kane''s strengths, using his exceptional link-up play and ability to drop deep as the foundation of Bayern''s attacking approach. The results speak for themselves: Bayern lead the Bundesliga and are through to the Champions League quarter-finals.

For Kane, who waited his entire career for major trophies, this could finally be the season that delivers silverware to match his individual excellence.',
 'feature',
 '{"featured_image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800"}',
 'Sarah Mitchell', 'auth_002', '2025-03-08 11:00:00', 'published', FALSE, FALSE, 38200,
 '["Feature", "Bayern Munich", "Harry Kane", "Bundesliga", "Top Scorer"]',
 10, 3, 26);

-- Article 6: Inter dominance
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('inter-milan-serie-a-dominance-2025',
 'Inter Milan''s Iron Grip on Serie A Shows No Signs of Loosening',
 'Defending champions march towards back-to-back titles',
 'Inter Milan sit top of Serie A with the meanest defense in Europe''s top five leagues, conceding just 18 goals in 29 matches.',
 'Inter Milan are making a compelling case for being the most complete team in European football this season. Simone Inzaghi''s side sit comfortably atop the Serie A table with a seven-point cushion, and their defensive record is nothing short of extraordinary.

Just 18 goals conceded in 29 league matches is the best in Europe''s top five leagues. The 3-5-2 system, now in its third season under Inzaghi, has been refined to near perfection, with every player knowing their role intimately.

Lautaro Martínez continues to lead the line with distinction, his 18 league goals making him the front-runner for the Capocannoniere. The Argentine''s all-round game has improved dramatically — his pressing, link-up play, and movement off the ball are now as impressive as his finishing.

Hakan Çalhanoğlu has been the metronome in midfield, dictating the tempo of matches with his range of passing and adding goals from set pieces and long-range strikes. His transformation from a talented but inconsistent player at Milan into a world-class regista at Inter is one of Italian football''s most compelling stories.

With Napoli and Juventus unable to sustain a serious challenge, the question is not whether Inter will win the league but by how far. A second consecutive Scudetto would confirm this as one of the great Inter sides.',
 'feature',
 '{"featured_image": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"}',
 'Emma Thompson', 'auth_003', '2025-03-20 09:00:00', 'published', FALSE, FALSE, 28900,
 '["Feature", "Inter Milan", "Serie A", "Lautaro Martínez", "Defending Champions"]',
 15, 4, 36);

-- Article 7: Yamal wonderkid
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('lamine-yamal-barcelona-wonderkid-2025',
 'Lamine Yamal: The 17-Year-Old Who Has Barcelona Dreaming Again',
 'Spain''s teenage sensation breaks records and expectations',
 'At 17, Lamine Yamal is already one of the most important players at FC Barcelona, and his potential appears limitless.',
 'In a sport that has always celebrated precocious talent, Lamine Yamal stands apart. The Barcelona forward, who turned 17 in July, has already achieved more than most footballers manage in an entire career.

His numbers this season are staggering: 12 goals and 10 assists in La Liga, making him the youngest player ever to reach double figures in both categories in a single top-flight season. More impressively, these contributions have come in the biggest matches — including a goal in El Clásico and a decisive assist in the Champions League.

What makes Yamal special is not just his end product but the manner in which he plays. There is a preternatural calmness to his game, a maturity that belies his age. He makes decisions in fractions of seconds that experienced professionals often get wrong, and he does so with a smile that suggests he is simply enjoying the game.

Manager Hansi Flick has handed Yamal enormous responsibility, making him a guaranteed starter in a Barcelona team competing on three fronts. The teenager has responded with performances that have drawn comparisons to a young Lionel Messi — comparisons that, remarkably, do not feel entirely hyperbolic.

Barcelona lead La Liga, and Yamal is the principal reason. His ability to change games with a moment of inspiration makes him the most exciting talent to emerge from La Masia since the generation that produced Messi, Xavi, and Iniesta.',
 'feature',
 '{"featured_image": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800"}',
 'Sarah Mitchell', 'auth_002', '2025-02-25 10:00:00', 'published', TRUE, FALSE, 98500,
 '["Feature", "Barcelona", "Lamine Yamal", "La Liga", "Wonderkid"]',
 7, 2, 19);

-- Article 8: Liverpool 3-1 Man City
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, match_id) VALUES
('liverpool-dominate-city-title-statement-2025',
 'Liverpool Destroy Manchester City 3-1 in Premier League Title Statement',
 'Salah brace and Alexander-Arnold screamer send Anfield into raptures',
 'Liverpool produced a performance of the highest quality to beat Manchester City 3-1 at Anfield in what could prove to be a title-defining result.',
 'If there was a single match that defined the 2024/25 Premier League title race, this may well be it. Liverpool dismantled Manchester City with a performance that was as ruthless as it was brilliant, winning 3-1 at Anfield to open up a seven-point lead at the top of the table.

Mohamed Salah was at the heart of everything good about Liverpool. His opening goal after just eight minutes, a breakaway counter-attack finished with clinical precision, set the tone for the evening. His second, a free-kick that bent over the wall and into the top corner, was the goal of the season.

Phil Foden pulled one back for City just after the break to give the visitors hope, but Trent Alexander-Arnold extinguished any thoughts of a comeback with a thunderous strike from 25 yards in the 88th minute that nearly broke the net.

The defeat extends City''s troubling run of form — they have now lost six of their last ten Premier League matches, a collapse that was unthinkable during the Guardiola era. Without the injured Rodri, City''s midfield has lacked its usual control and composure.

For Arne Slot, the victory validates his approach in his debut season. Liverpool look like champions-elect, and performances like this will be very difficult for any rival to overcome.',
 'match_report',
 '{"featured_image": "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800"}',
 'James Anderson', 'auth_001', '2025-01-04 22:30:00', 'published', TRUE, FALSE, 84200,
 '["Premier League", "Liverpool", "Manchester City", "Mohamed Salah", "Title Race"]',
 2, 1, 7);

-- Article 9: Transfer rumor — Haaland
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, person_id) VALUES
('haaland-real-madrid-200m-release-clause-2025',
 'Real Madrid Exploring Erling Haaland''s €200M Release Clause',
 'Spanish giants eye Norwegian superstar as ultimate galáctico signing',
 'Real Madrid are reportedly investigating the possibility of triggering Erling Haaland''s release clause at Manchester City.',
 'Reports from Spain suggest that Real Madrid are seriously exploring the possibility of signing Manchester City striker Erling Haaland, with the Norwegian''s release clause of approximately €200 million reportedly becoming active this summer.

The clause, which was inserted into the contract Haaland signed when joining City from Borussia Dortmund in 2022, would allow the striker to move for a fixed fee regardless of City''s wishes. It represents the most significant release clause activation since Neymar''s world-record move from Barcelona to PSG in 2017.

Real Madrid''s interest comes despite having signed Kylian Mbappé just last summer. The Spanish club''s ambition appears to be the creation of an attack featuring both Mbappé and Haaland — a prospect that has excited fans and terrified rivals in equal measure.

The financial implications are enormous. Beyond the release clause itself, Haaland''s wages would likely exceed €30 million per year, making the total package one of the most expensive in football history.

Manchester City are understood to be aware of the situation and have attempted to negotiate a clause removal in exchange for improved terms. However, Haaland''s representatives have so far resisted any modifications to the existing agreement.

Pep Guardiola addressed the speculation with characteristic directness, stating that Haaland is committed to City. But the lure of Real Madrid has proven irresistible for many of the game''s greatest players.',
 'transfer',
 '{"featured_image": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800"}',
 'Michael Roberts', 'auth_004', '2025-03-12 09:45:00', 'published', FALSE, TRUE, 68700,
 '["Transfer News", "Real Madrid", "Manchester City", "Erling Haaland", "Release Clause"]',
 4, 10);

-- Article 10: Leverkusen invincibles
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id) VALUES
('leverkusen-wirtz-xhaka-contenders-2025',
 'Bayer Leverkusen: From Invincibles to Champions League Dark Horses',
 'Xabi Alonso''s side maintain their remarkable standards',
 'Last season''s unbeaten Bundesliga champions continue to compete at the highest level under Xabi Alonso.',
 'A year ago, Bayer Leverkusen were the story of European football — an unbeaten Bundesliga season that captured the imagination of the sporting world. The question heading into 2024/25 was whether Xabi Alonso''s team could maintain those standards. The answer, so far, is a resounding yes.

Leverkusen sit second in the Bundesliga, just two points behind Bayern Munich, and have reached the Champions League quarter-finals. Florian Wirtz remains the creative heartbeat of the team, his 14 goals and 15 assists across all competitions confirming his status as one of the best young players in world football.

Granit Xhaka, the experienced Swiss midfielder signed from Arsenal, continues to provide the discipline and leadership that allows the more creative players to flourish. His reading of the game and distribution from deep are essential to Alonso''s possession-based style.

The partnership between Wirtz and Xhaka has become one of the most effective in European football, combining youth and experience, flair and pragmatism. It embodies the balance that Alonso has achieved throughout his squad.

With Bayern Munich as the only team ahead of them, and the Champions League presenting an opportunity for a deep run, Leverkusen remain very much in the conversation as one of Europe''s elite sides.',
 'feature',
 '{"featured_image": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800"}',
 'Emma Thompson', 'auth_003', '2025-03-22 10:00:00', 'published', FALSE, FALSE, 22100,
 '["Feature", "Bayer Leverkusen", "Bundesliga", "Florian Wirtz", "Xabi Alonso"]',
 12, 3);

-- Article 11: UCL Preview
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, competition_id) VALUES
('ucl-quarter-final-preview-2025',
 'Champions League Quarter-Finals: The Four Ties That Will Define European Football',
 'Arsenal-Bayern, Liverpool-Inter and more in a star-studded last eight',
 'The Champions League quarter-final draw has produced four blockbuster ties featuring the best clubs on the continent.',
 'The road to the Champions League final in Munich narrows further this week as eight of Europe''s elite clubs prepare for quarter-final combat. Here is your comprehensive preview of every tie.

Arsenal vs Bayern Munich is a clash of two teams in outstanding form. Arsenal eliminated Bayern''s German rivals Dortmund in the last round, while Bayern put five past Benfica. The first leg at the Emirates saw Arsenal win 1-0 through a Saka goal — can they hold on in Munich?

Liverpool vs Inter Milan is a repeat of their 2022 knockout round meeting. Liverpool''s attacking prowess against Inter''s defensive brilliance promises a tactical chess match of the highest order. Arne Slot against Simone Inzaghi is a fascinating managerial duel.

Real Madrid vs Barcelona promises the ultimate El Clásico on the biggest stage. Having met three times already in La Liga this season (with Real winning once, drawing twice), the two sides know each other inside out. Mbappé against Yamal will captivate the world.

PSG vs Manchester City rounds out the quartet. Pep Guardiola returns to face the club that ended his Champions League dream in 2021, while PSG look to prove they can go deep in Europe without Mbappé.

These four ties represent the pinnacle of club football. Whoever emerges will rightly consider themselves among the finest teams on the planet.',
 'preview',
 '{"featured_image": "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800"}',
 'James Anderson', 'auth_001', '2025-03-24 12:00:00', 'published', TRUE, FALSE, 51200,
 '["Champions League", "UCL", "Quarter-Finals", "Preview", "Arsenal", "Bayern Munich", "Liverpool", "Real Madrid"]',
 6);

-- Article 12: PSG dominance
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('psg-dembele-post-mbappe-era-2025',
 'Ousmane Dembélé Steps Into the Spotlight as PSG''s New Talisman',
 'French winger thriving in the post-Mbappé era at the Parc des Princes',
 'Ousmane Dembélé has emerged as PSG''s most important player with 16 Ligue 1 goals this season.',
 'When Kylian Mbappé departed for Real Madrid last summer, many predicted a decline for Paris Saint-Germain. Instead, Luis Enrique has orchestrated a seamless transition, with Ousmane Dembélé emerging as the team''s most dangerous attacking threat.

Dembélé has scored 16 Ligue 1 goals this season — already a career-best in league competition — and has added 9 assists. His direct, high-tempo dribbling style has become the focal point of PSG''s attack, and defenders across Ligue 1 have struggled to contain him.

The 27-year-old, whose career has been marked by injuries and unfulfilled potential at Barcelona, appears to have finally found the consistency that his talent always promised. Working under Luis Enrique, who managed him briefly at Barcelona, has clearly been beneficial.

PSG lead Ligue 1 by a commanding 16 points and are through to the Champions League quarter-finals, where they face Manchester City. For Dembélé, it is an opportunity to announce himself on the biggest stage as a truly elite player.',
 'feature',
 '{"featured_image": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800"}',
 'Sarah Mitchell', 'auth_002', '2025-03-10 11:00:00', 'published', FALSE, FALSE, 19800,
 '["Feature", "PSG", "Ligue 1", "Ousmane Dembélé", "Kylian Mbappé"]',
 19, 5, 43);

-- Article 13: Rashford loan
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, person_id) VALUES
('rashford-dortmund-loan-fresh-start-2025',
 'Marcus Rashford Completes Loan Move to Borussia Dortmund',
 'England forward seeks redemption in the Bundesliga',
 'Manchester United have confirmed that Marcus Rashford has joined Borussia Dortmund on loan for the remainder of the season.',
 'Marcus Rashford has completed a loan move from Manchester United to Borussia Dortmund until the end of the 2024/25 season. The 27-year-old England international, who fell out of favor at Old Trafford, will hope to revive his career in the Bundesliga.

Rashford made 171 goals in 401 appearances for United across all competitions but saw his playing time reduced significantly this season under Erik ten Hag. The move to Dortmund offers him the chance to play regular football and potentially earn a recall to the England squad.

Dortmund sporting director Sebastian Kehl expressed his satisfaction with the signing, describing Rashford as a player of immense talent who can make an immediate impact. The German club beat competition from several Premier League rivals and AC Milan to secure the deal.

The loan includes an option for Dortmund to make the deal permanent at the end of the season for a fee reportedly in the region of €35 million.',
 'transfer',
 '{"featured_image": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800"}',
 'Michael Roberts', 'auth_004', '2025-01-16 16:00:00', 'published', FALSE, TRUE, 42800,
 '["Transfer News", "Manchester United", "Borussia Dortmund", "Marcus Rashford", "Loan"]',
 1, 2);

-- Article 14: Salah contract
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, person_id) VALUES
('salah-contract-saga-liverpool-march-2025',
 'Mohamed Salah''s Liverpool Future Hangs in the Balance',
 'Contract talks stall as free agency looms for the Egyptian King',
 'Mohamed Salah leads the Premier League scoring charts but his contract expires in June with no agreement in sight.',
 'Liverpool face the very real prospect of losing Mohamed Salah on a free transfer this summer, with negotiations over a contract extension having reached an impasse. The Egyptian forward, who turns 33 in June, continues to perform at an extraordinary level while his future remains clouded in uncertainty.

Salah has 21 Premier League goals this season, leading the scoring charts and driving Liverpool''s title challenge. His importance to the team cannot be overstated — he has been directly involved in 40% of Liverpool''s league goals this campaign.

The sticking points are believed to be the length of any new deal and the wage structure. Salah wants a multi-year contract reflecting his output, while Liverpool''s policy of offering shorter deals to players over 30 has created friction. Several clubs, including PSG and various Saudi Pro League teams, are monitoring the situation closely.

Manager Arne Slot has handled the situation with diplomacy, praising Salah''s professionalism while acknowledging the decision is between the player and the club. Regardless of how it ends, Salah''s legacy at Liverpool is secure — 214 goals in 352 appearances puts him among the greatest players in the club''s storied history.',
 'news',
 '{"featured_image": "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800"}',
 'James Anderson', 'auth_001', '2025-03-15 08:30:00', 'published', TRUE, FALSE, 72100,
 '["News", "Liverpool", "Mohamed Salah", "Contract", "Free Agent", "Premier League"]',
 2, 4);

-- Article 15: Cole Palmer breakout
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('cole-palmer-chelsea-star-season-2025',
 'Cold Palmer: How Chelsea''s Quiet Assassin Became England''s Best',
 'The former City academy product continues his meteoric rise',
 'Cole Palmer''s 14 Premier League goals have been the driving force behind Chelsea''s push for Champions League qualification.',
 'There is a wonderful paradox about Cole Palmer. He plays with an almost disinterested calm, as if the occasion means nothing to him, and yet his end product suggests the opposite — that he cares deeply and has an almost preternatural understanding of when and where to strike.

The Chelsea forward has 14 Premier League goals and 10 assists this season, building on last year''s breakthrough campaign that earned him the PFA Young Player of the Year award. His combination of creativity, finishing ability, and composure under pressure has made him virtually undroppable.

What''s remarkable about Palmer''s game is its efficiency. He rarely misses chances, rarely gives the ball away in dangerous areas, and rarely makes the wrong decision. For a player still only 22, this level of consistent decision-making is extraordinarily rare.

Manager Enzo Maresca has built his Chelsea team around Palmer''s qualities, allowing him the freedom to drift between the lines and create from whatever position he finds himself in. The results speak for themselves — Chelsea sit fourth and Palmer is the primary reason.

For England, Palmer represents an embarrassment of riches in attacking midfield. Alongside Bellingham, Saka, and Foden, the Three Lions possess a generation of talent that could dominate international football for the next decade.',
 'feature',
 '{"featured_image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"}',
 'Sarah Mitchell', 'auth_002', '2025-02-28 10:00:00', 'published', FALSE, FALSE, 44600,
 '["Feature", "Chelsea", "Cole Palmer", "Premier League", "England"]',
 5, 1, 13);

-- Article 16: UCL Liverpool vs Real Madrid
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, match_id) VALUES
('liverpool-stun-real-madrid-ucl-2024',
 'Liverpool Stun Real Madrid 2-0 in Champions League Masterclass',
 'Salah double condemns holders to first European defeat of the season',
 'Mohamed Salah scored twice as Liverpool defeated defending champions Real Madrid 2-0 at Anfield in the Champions League.',
 'On a night that evoked memories of Liverpool''s greatest European occasions, Mohamed Salah delivered a performance for the ages to condemn Real Madrid to their first Champions League defeat of the season.

Anfield was at its atmospheric best as Liverpool controlled the game from the first whistle. Salah opened the scoring midway through the first half, converting a Trent Alexander-Arnold cross with the clinical precision that has defined his Liverpool career. His second, a penalty won and converted after Thibaut Courtois fouled Luis Díaz, secured a famous victory.

For Real Madrid and Carlo Ancelotti, it was a chastening evening. The combination of Mbappé, Vinícius Jr, and Bellingham — so devastating in La Liga — was largely neutralized by Liverpool''s disciplined pressing and Virgil van Dijk''s commanding defensive display.

The result means Liverpool top the Champions League league phase table with a perfect record, virtually guaranteeing them a seeded place in the knockout rounds. Real Madrid, despite the defeat, remain well placed to qualify but now face a tougher potential draw.',
 'match_report',
 '{"featured_image": "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800"}',
 'Emma Thompson', 'auth_003', '2024-12-10 23:15:00', 'published', TRUE, FALSE, 112800,
 '["Champions League", "Liverpool", "Real Madrid", "Mohamed Salah", "UCL"]',
 2, 6, 35);

-- Article 17: Transfer — TAA to Real Madrid
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, person_id) VALUES
('alexander-arnold-real-madrid-talks-2025',
 'Trent Alexander-Arnold in Advanced Talks with Real Madrid',
 'Liverpool right-back set to leave Anfield as free agent',
 'Trent Alexander-Arnold is reportedly in advanced discussions with Real Madrid over a free transfer move this summer.',
 'Trent Alexander-Arnold is reportedly in advanced discussions with Real Madrid over a free transfer when his Liverpool contract expires at the end of this season, leaving Anfield fans devastated at the prospect of losing their homegrown star.

The 26-year-old''s contract situation has been the subject of intense speculation all season. Liverpool have tabled multiple extension offers, but Alexander-Arnold has so far declined to commit his future to the club. Real Madrid have been working to capitalize on the uncertainty since January.

The England international, who has revolutionized the right-back position with his extraordinary passing range and creativity, is seen by Carlo Ancelotti as the ideal addition to his midfield — a role Alexander-Arnold has increasingly occupied this season under Arne Slot.

Liverpool manager Slot has refused to give up hope, stating the club will continue efforts to retain their academy graduate until the very last moment. However, the pull of Real Madrid has historically been difficult for any player to resist.

If the move materializes, it will represent one of the most significant free transfer departures in Premier League history and a devastating blow to Liverpool''s ambitions of sustained success under Slot.',
 'transfer',
 '{"featured_image": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"}',
 'Michael Roberts', 'auth_004', '2025-03-01 11:20:00', 'published', TRUE, FALSE, 87300,
 '["Transfer News", "Liverpool", "Real Madrid", "Trent Alexander-Arnold", "Free Transfer"]',
 2, 6);

-- Article 18: Rodri injury
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, person_id) VALUES
('rodri-acl-injury-man-city-impact-2024',
 'The Rodri Effect: How One Injury Has Derailed Manchester City''s Season',
 'Ballon d''Or contender faces months out as City''s form collapses',
 'Manchester City''s title defense has been severely impacted by Rodri''s ACL injury, with the team winning just 58% of matches without him.',
 'When Rodri collapsed clutching his knee during Manchester City''s match against Arsenal in September, the repercussions were felt far beyond that single fixture. The Spanish midfielder''s torn ACL has proven to be the pivotal moment of the Premier League season.

In the 17 league matches since Rodri''s injury, City have won just 10, drawn 3, and lost 4 — a rate of 1.94 points per game that would translate to roughly 74 points over a full season. Before his injury, City were averaging 2.5 points per game.

The numbers only tell part of the story. Without Rodri''s ability to control tempo, City have looked vulnerable in transitions and uncertain in possession. The team that won four consecutive Premier League titles has been unrecognizable at times.

Pep Guardiola has tried various solutions — Mateo Kovačić, Bernardo Silva, and even John Stones have all been deployed in Rodri''s role — but none have been able to replicate his unique combination of defensive awareness, positional discipline, and progressive passing.

The Ballon d''Or voter who selected Rodri in 2024 now looks increasingly prescient. He is not just the best midfielder in the world — he is the player around whom the greatest domestic dynasty in English football history was built.',
 'breaking',
 '{"featured_image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"}',
 'James Anderson', 'auth_001', '2024-11-15 19:45:00', 'published', FALSE, TRUE, 76300,
 '["Breaking News", "Manchester City", "Rodri", "Injury", "Premier League", "ACL"]',
 4, 12);

-- Article 19: Musiala transfer saga
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, person_id) VALUES
('musiala-transfer-city-real-madrid-2025',
 'Jamal Musiala: The €120M Man at the Centre of Europe''s Biggest Transfer Battle',
 'Manchester City and Real Madrid compete for Bayern Munich''s crown jewel',
 'Bayern Munich''s Jamal Musiala is the most sought-after player in European football with both City and Real Madrid preparing bids.',
 'The battle for Jamal Musiala''s signature has become the defining transfer story of the 2024/25 season. The Bayern Munich midfielder, still just 22, is the subject of intense interest from both Manchester City and Real Madrid, with neither club willing to back down.

City see Musiala as the ideal long-term successor to Kevin De Bruyne, whose form and fitness have declined in recent seasons. Real Madrid, never ones to miss out on a generational talent, view him as the final piece of their midfield puzzle alongside Bellingham and Valverde.

Bayern Munich are understandably desperate to keep their most valuable asset. The German club have offered Musiala a bumper contract extension reportedly worth €20 million per year, which would make him the highest-paid player in Bundesliga history. So far, the player has not signed.

The situation is complicated by Musiala''s contract, which runs until 2026, giving Bayern limited leverage. If no extension is agreed this summer, the club face the unpalatable choice of selling at a premium or risking losing him for a fraction of his value in 12 months.

With 18 goals and 14 assists across all competitions this season, Musiala continues to demonstrate why he is worth every penny of the €120 million price tag that Bayern have reportedly set.',
 'transfer',
 '{"featured_image": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800"}',
 'Sarah Mitchell', 'auth_002', '2025-03-25 14:30:00', 'published', FALSE, TRUE, 55400,
 '["Transfer News", "Bayern Munich", "Manchester City", "Real Madrid", "Jamal Musiala"]',
 10, 27);

-- Article 20: Season awards prediction
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, competition_id) VALUES
('premier-league-awards-predictions-2025',
 'Premier League End-of-Season Awards: Our Predictions',
 'Salah, Saka, Slot, and Palmer lead the contenders',
 'With the business end of the season upon us, we predict the winners of every major Premier League award.',
 'As the 2024/25 Premier League season enters its decisive final stretch, the contenders for the end-of-season awards are becoming clear. Here are our predictions across every category.

Player of the Season: Mohamed Salah. The Egyptian has been magnificent in what could be his final campaign at Anfield. His 21 goals and 12 assists have been the foundation of Liverpool''s title challenge, and his big-game performances — notably against City and Real Madrid — elevate him above the competition.

Young Player of the Season: Cole Palmer. The Chelsea forward has been remarkably consistent, and at 22, he represents the future of English football. Bukayo Saka and Lamine Yamal (were he in the Premier League) would be worthy winners, but Palmer''s numbers are difficult to argue against.

Manager of the Season: Arne Slot. To arrive at Liverpool and immediately mount a title challenge, while also reaching the Champions League quarter-finals, is an achievement of the highest order. The Dutchman has seamlessly continued the work of Jürgen Klopp while adding his own tactical innovations.

Golden Boot: Mohamed Salah. With 21 goals and a three-goal advantage over Erling Haaland, Salah is the favourite. Haaland will push him all the way, but Salah''s penalty-taking duties give him an edge.

Golden Glove: David Raya. Arsenal''s goalkeeper has kept 15 clean sheets, a league-best figure that reflects the Gunners'' outstanding defensive organization.',
 'opinion',
 '{"featured_image": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800"}',
 'Emma Thompson', 'auth_003', '2025-03-28 09:00:00', 'published', FALSE, FALSE, 31500,
 '["Opinion", "Premier League", "Awards", "Mohamed Salah", "Cole Palmer", "Arne Slot"]',
 1);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  15. COMMENTS (across articles)                          ║
-- ╚══════════════════════════════════════════════════════════╝
INSERT INTO comments (article_id, parent_id, user_id, user_name, content, status, likes_count) VALUES
-- Article 1
(1,  NULL, 'user_101', 'RedDevil99',     'Gutting we couldn''t hold on. Salah is just unplayable when he''s in that mood.', 'approved', 32),
(1,  1,    'user_102', 'AnfieldRoar',    'Should have been 3-1 honestly. Ref bailed you out with that pen.', 'approved', 14),
(1,  NULL, 'user_103', 'NeutralFan',     'What an opening day! This season is going to be incredible.', 'approved', 45),
-- Article 2
(2,  NULL, 'user_104', 'MadridFanatic',  'FINALLY! Welcome to the greatest club in history, Kylian!', 'approved', 234),
(2,  NULL, 'user_105', 'PSGUltra',       'Merci pour tout, Kylian. You gave us some unforgettable moments.', 'approved', 87),
(2,  NULL, 'user_106', 'LFC_Forever',    'That Madrid attack is terrifying. Vinícius, Mbappé, Bellingham...', 'approved', 56),
-- Article 3
(3,  NULL, 'user_107', 'BernabeuDreams', 'BELLINGHAM AT THE DEATH! El Clásico never disappoints!', 'approved', 178),
(3,  NULL, 'user_108', 'CulerForLife',   'Yamal is the future. One bad result doesn''t change that.', 'approved', 92),
(3,  3,    'user_109', 'NeutralFan',     'Both goals were world class. Best rivalry in football.', 'approved', 43),
-- Article 7
(7,  NULL, 'user_110', 'CulerForLife',   'Yamal at 17 is doing things Messi didn''t do until 19. Generational.', 'approved', 189),
(7,  NULL, 'user_111', 'MadridFanatic',  'Good player but comparing him to Messi is premature.', 'approved', 65),
-- Article 8
(8,  NULL, 'user_112', 'KopEnd',         'WHAT A PERFORMANCE! Slot ball is elite! 3-1 against City at Anfield!', 'approved', 112),
(8,  NULL, 'user_113', 'BlueMoonRising', 'We miss Rodri so much. Different team without him.', 'approved', 78),
(8,  12,   'user_114', 'Gooner4Life',    'Don''t worry City fans, we''ll take care of the title for you', 'approved', 95),
-- Article 9
(9,  NULL, 'user_115', 'TransferGuru',   'Haaland and Mbappé at Madrid? Football is cooked.', 'approved', 156),
(9,  NULL, 'user_116', 'CityTilIDie',    'Release clause doesn''t mean he wants to leave. He loves Manchester.', 'approved', 44),
-- Article 11
(11, NULL, 'user_117', 'UCLFanatic',     'Arsenal vs Bayern and Real Madrid vs Barca in UCL QFs?! Peak football.', 'approved', 201),
-- Article 14
(14, NULL, 'user_118', 'AnfieldRoar',    'Just pay the man. He''s the best in the world right now. Whatever it takes.', 'approved', 143),
(14, NULL, 'user_119', 'FootballFan2025','32 is the new 28 for elite players. Give him 3 years.', 'approved', 67),
-- Article 16
(16, NULL, 'user_120', 'KopEnd',         'ANFIELD DOES IT AGAIN! European nights at Anfield hit different!', 'approved', 198),
(16, NULL, 'user_121', 'BernabeuDreams', 'Fair play Liverpool. We''ll be back. We always come back.', 'approved', 74),
-- Article 17
(17, NULL, 'user_122', 'KopEnd',         'Please no. Trent IS Liverpool. Don''t let him leave like this.', 'approved', 167),
(17, NULL, 'user_123', 'MadridFanatic',  'Best right-back in the world at the best club. Simple.', 'approved', 89);


INSERT INTO polls (question, description, poll_type, options, start_date, end_date, status, total_votes, results, competition_id, featured) VALUES
('Who will win the 2024/25 Premier League?',
 'The title race is heating up. Cast your vote!',
 'single',
 '[{"id": "opt1", "text": "Liverpool", "team_id": 2}, {"id": "opt2", "text": "Arsenal", "team_id": 3}, {"id": "opt3", "text": "Manchester City", "team_id": 4}, {"id": "opt4", "text": "Other"}]',
 '2025-03-01', '2025-05-25', 'active', 12840,
 '{"opt1": 5200, "opt2": 4800, "opt3": 2100, "opt4": 740}',
 1, TRUE),

('Who is the Premier League Player of the Season?',
 'Vote for the standout performer of 2024/25',
 'single',
 '[{"id": "opt1", "text": "Mohamed Salah"}, {"id": "opt2", "text": "Bukayo Saka"}, {"id": "opt3", "text": "Erling Haaland"}, {"id": "opt4", "text": "Cole Palmer"}]',
 '2025-03-15', '2025-05-20', 'active', 8950,
 '{"opt1": 3800, "opt2": 2400, "opt3": 1500, "opt4": 1250}',
 1, TRUE),

('Who will win the 2024/25 Champions League?',
 'Eight teams remain. Who lifts the trophy in Munich?',
 'single',
 '[{"id": "opt1", "text": "Real Madrid", "team_id": 8}, {"id": "opt2", "text": "Arsenal", "team_id": 3}, {"id": "opt3", "text": "Liverpool", "team_id": 2}, {"id": "opt4", "text": "Barcelona", "team_id": 7}]',
 '2025-03-10', '2025-05-31', 'active', 15200,
 '{"opt1": 5500, "opt2": 3200, "opt3": 3800, "opt4": 2700}',
 6, TRUE),

('Best El Clásico performance this season?',
 'Three matches, three thrillers. Which was the best?',
 'single',
 '[{"id": "opt1", "text": "Barca 1-2 Real Madrid (Oct)"}, {"id": "opt2", "text": "Real Madrid 3-3 Barca (Jan)"}, {"id": "opt3", "text": "Barca 3-1 Atlético (Mar)"}]',
 '2025-03-22', '2025-04-15', 'active', 6780,
 '{"opt1": 2800, "opt2": 3200, "opt3": 780}',
 2, FALSE),

('Biggest summer transfer target?',
 'Which potential move excites you most?',
 'single',
 '[{"id": "opt1", "text": "Haaland to Real Madrid"}, {"id": "opt2", "text": "Musiala to Man City"}, {"id": "opt3", "text": "Wirtz to Real Madrid"}, {"id": "opt4", "text": "Jonathan David to Arsenal"}]',
 '2025-03-20', '2025-06-30', 'active', 9400,
 '{"opt1": 4100, "opt2": 2800, "opt3": 1700, "opt4": 800}',
 NULL, TRUE);


INSERT INTO poll_votes (poll_id, user_id, selected_options, ip_hash) VALUES
(1, 'user_101', '["opt2"]', 'hash_aaa'),
(1, 'user_102', '["opt1"]', 'hash_bbb'),
(1, 'user_103', '["opt1"]', 'hash_ccc'),
(1, 'user_104', '["opt3"]', 'hash_ddd'),
(2, 'user_101', '["opt1"]', 'hash_eee'),
(2, 'user_105', '["opt2"]', 'hash_fff'),
(3, 'user_106', '["opt1"]', 'hash_ggg'),
(3, 'user_107', '["opt3"]', 'hash_hhh'),
(3, 'user_108', '["opt4"]', 'hash_iii'),
(4, 'user_109', '["opt2"]', 'hash_jjj'),
(5, 'user_110', '["opt1"]', 'hash_kkk'),
(5, 'user_111', '["opt2"]', 'hash_lll');



