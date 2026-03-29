-- ============================================================
-- FOOTYPULSE — MATCH PLAYERS SEED DATA
-- ============================================================
-- Populates match_players for all 36 matches in full-season-seed.sql
-- 3 key players per team per match (6 per match, 216 total)
--
-- USAGE: node database/runMatchPlayers.js
--
-- PERSON ID REFERENCE:
--   Man Utd(1):  1=Bruno, 2=Rashford, 3=Casemiro, 66=Garnacho
--   Liverpool(2): 4=Salah, 5=Van Dijk, 6=TAA, 59=Alisson
--   Arsenal(3):  7=Saka, 8=Ødegaard, 9=Gabriel, 54=Saliba, 55=Rice, 58=Raya
--   Man City(4): 10=Haaland, 11=De Bruyne, 12=Rodri, 56=Foden, 57=B.Silva, 60=Ederson
--   Chelsea(5):  13=Palmer, 14=Jackson
--   Spurs(6):    15=Son, 16=Maddison
--   Barca(7):    17=Lewandowski, 18=Pedri, 19=Yamal, 62=Ter Stegen, 64=Araújo
--   Real Madrid(8): 20=Vinícius, 21=Bellingham, 22=Mbappé, 23=Valverde, 63=Courtois
--   Atlético(9): 24=Griezmann, 25=J.Álvarez
--   Bayern(10):  26=Kane, 27=Musiala, 28=Kimmich
--   Dortmund(11):29=Guirassy, 30=Brandt
--   Leverkusen(12):31=Wirtz, 32=Xhaka
--   Stuttgart(13):33=Undav
--   Milan(14):   34=Leão, 35=Pulisic
--   Inter(15):   36=L.Martínez, 37=Çalhanoğlu
--   Juventus(16):38=Vlahović, 39=Yıldız
--   Napoli(17):  40=Osimhen, 41=Kvaratskhelia
--   Roma(18):    42=Dybala
--   PSG(19):     43=Dembélé, 44=Hakimi, 61=Donnarumma
--   Lyon(20):    45=Lacazette
--   Marseille(21):46=Aubameyang
--   Lille(22):   47=J.David
--   Benfica(23): 48=Di María
-- ============================================================

INSERT INTO match_players (match_id, person_id, team_id, is_starter, position, jersey_number, stats) VALUES

-- ═══════════════════════════════════════════
-- MATCH 1: Man Utd 2-2 Liverpool (EPL MD1)
-- ═══════════════════════════════════════════
-- Man Utd
(1, 1,  1, TRUE, 'CAM', 8,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":62,"pass_accuracy":87,"tackles":2,"interceptions":1,"rating":7.8}'),
(1, 2,  1, TRUE, 'LW',  10, '{"goals":1,"assists":0,"shots":4,"shots_on_target":2,"passes":38,"pass_accuracy":79,"tackles":1,"interceptions":0,"rating":7.5}'),
(1, 3,  1, TRUE, 'CDM', 18, '{"goals":0,"assists":1,"shots":1,"shots_on_target":0,"passes":74,"pass_accuracy":91,"tackles":5,"interceptions":3,"rating":7.2}'),
-- Liverpool
(1, 4,  2, TRUE, 'RW',  11, '{"goals":2,"assists":0,"shots":5,"shots_on_target":3,"passes":45,"pass_accuracy":84,"tackles":0,"interceptions":1,"rating":9.2}'),
(1, 5,  2, TRUE, 'CB',  4,  '{"goals":0,"assists":0,"shots":0,"shots_on_target":0,"passes":82,"pass_accuracy":93,"tackles":3,"interceptions":2,"rating":7.0}'),
(1, 6,  2, TRUE, 'RB',  66, '{"goals":0,"assists":1,"shots":2,"shots_on_target":1,"passes":68,"pass_accuracy":88,"tackles":2,"interceptions":1,"rating":7.6}'),

-- ═══════════════════════════════════════════
-- MATCH 2: Arsenal 2-0 Spurs (EPL MD1)
-- ═══════════════════════════════════════════
-- Arsenal
(2, 7,  3, TRUE, 'RW',  7,  '{"goals":1,"assists":0,"shots":4,"shots_on_target":2,"passes":41,"pass_accuracy":85,"tackles":2,"interceptions":1,"rating":8.5}'),
(2, 8,  3, TRUE, 'CAM', 8,  '{"goals":0,"assists":1,"shots":3,"shots_on_target":1,"passes":78,"pass_accuracy":92,"tackles":3,"interceptions":2,"rating":8.0}'),
(2, 9,  3, TRUE, 'CB',  6,  '{"goals":1,"assists":0,"shots":1,"shots_on_target":1,"passes":65,"pass_accuracy":94,"tackles":4,"interceptions":3,"rating":8.3}'),
-- Spurs
(2, 15, 6, TRUE, 'LW',  7,  '{"goals":0,"assists":0,"shots":3,"shots_on_target":1,"passes":35,"pass_accuracy":80,"tackles":1,"interceptions":0,"rating":6.2}'),
(2, 16, 6, TRUE, 'CAM', 10, '{"goals":0,"assists":0,"shots":2,"shots_on_target":0,"passes":52,"pass_accuracy":82,"tackles":1,"interceptions":1,"rating":5.8}'),
(2, 55, 3, TRUE, 'CDM', 41, '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":72,"pass_accuracy":90,"tackles":6,"interceptions":4,"rating":7.8}'),

-- ═══════════════════════════════════════════
-- MATCH 3: Arsenal 1-0 Man City (EPL MD5)
-- ═══════════════════════════════════════════
-- Arsenal
(3, 7,  3, TRUE, 'RW',  7,  '{"goals":1,"assists":0,"shots":4,"shots_on_target":2,"passes":38,"pass_accuracy":83,"tackles":2,"interceptions":1,"rating":8.7}'),
(3, 8,  3, TRUE, 'CAM', 8,  '{"goals":0,"assists":1,"shots":2,"shots_on_target":1,"passes":76,"pass_accuracy":91,"tackles":3,"interceptions":2,"rating":8.2}'),
(3, 54, 3, TRUE, 'CB',  2,  '{"goals":0,"assists":0,"shots":0,"shots_on_target":0,"passes":68,"pass_accuracy":95,"tackles":5,"interceptions":4,"rating":8.0}'),
-- Man City
(3, 10, 4, TRUE, 'ST',  9,  '{"goals":0,"assists":0,"shots":3,"shots_on_target":1,"passes":22,"pass_accuracy":78,"tackles":0,"interceptions":0,"rating":6.0}'),
(3, 12, 4, TRUE, 'CDM', 16, '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":95,"pass_accuracy":93,"tackles":4,"interceptions":2,"rating":7.0}'),
(3, 11, 4, TRUE, 'CAM', 17, '{"goals":0,"assists":0,"shots":2,"shots_on_target":1,"passes":72,"pass_accuracy":88,"tackles":1,"interceptions":0,"rating":6.5}'),

-- ═══════════════════════════════════════════
-- MATCH 4: Liverpool 2-2 Arsenal (EPL MD8)
-- ═══════════════════════════════════════════
(4, 4,  2, TRUE, 'RW',  11, '{"goals":2,"assists":0,"shots":6,"shots_on_target":4,"passes":40,"pass_accuracy":82,"tackles":1,"interceptions":0,"rating":9.0}'),
(4, 5,  2, TRUE, 'CB',  4,  '{"goals":0,"assists":0,"shots":0,"shots_on_target":0,"passes":78,"pass_accuracy":92,"tackles":4,"interceptions":3,"rating":7.5}'),
(4, 6,  2, TRUE, 'RB',  66, '{"goals":0,"assists":1,"shots":1,"shots_on_target":0,"passes":65,"pass_accuracy":86,"tackles":2,"interceptions":2,"rating":7.3}'),
(4, 7,  3, TRUE, 'RW',  7,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":42,"pass_accuracy":84,"tackles":1,"interceptions":1,"rating":8.0}'),
(4, 54, 3, TRUE, 'CB',  2,  '{"goals":1,"assists":0,"shots":2,"shots_on_target":1,"passes":70,"pass_accuracy":93,"tackles":3,"interceptions":2,"rating":7.5}'),
(4, 55, 3, TRUE, 'CDM', 41, '{"goals":0,"assists":1,"shots":0,"shots_on_target":0,"passes":68,"pass_accuracy":89,"tackles":5,"interceptions":3,"rating":7.2}'),

-- ═══════════════════════════════════════════
-- MATCH 5: Man City 4-0 Spurs (EPL MD12)
-- ═══════════════════════════════════════════
(5, 10, 4, TRUE, 'ST',  9,  '{"goals":3,"assists":0,"shots":7,"shots_on_target":5,"passes":18,"pass_accuracy":72,"tackles":0,"interceptions":0,"rating":10.0}'),
(5, 11, 4, TRUE, 'CAM', 17, '{"goals":0,"assists":1,"shots":2,"shots_on_target":1,"passes":82,"pass_accuracy":92,"tackles":1,"interceptions":1,"rating":8.5}'),
(5, 56, 4, TRUE, 'LW',  47, '{"goals":1,"assists":1,"shots":3,"shots_on_target":2,"passes":55,"pass_accuracy":87,"tackles":2,"interceptions":0,"rating":8.8}'),
(5, 15, 6, TRUE, 'LW',  7,  '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":30,"pass_accuracy":75,"tackles":1,"interceptions":0,"rating":5.0}'),
(5, 16, 6, TRUE, 'CAM', 10, '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":40,"pass_accuracy":78,"tackles":0,"interceptions":1,"rating":4.8}'),

-- ═══════════════════════════════════════════
-- MATCH 6: Chelsea 1-1 Man Utd (EPL MD15)
-- ═══════════════════════════════════════════
(6, 13, 5, TRUE, 'CAM', 20, '{"goals":1,"assists":0,"shots":4,"shots_on_target":2,"passes":55,"pass_accuracy":86,"tackles":1,"interceptions":1,"rating":7.8}'),
(6, 14, 5, TRUE, 'ST',  15, '{"goals":0,"assists":0,"shots":2,"shots_on_target":1,"passes":22,"pass_accuracy":74,"tackles":0,"interceptions":0,"rating":6.2}'),
(6, 1,  1, TRUE, 'CAM', 8,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":1,"passes":58,"pass_accuracy":85,"tackles":2,"interceptions":1,"rating":7.5}'),
(6, 3,  1, TRUE, 'CDM', 18, '{"goals":0,"assists":0,"shots":0,"shots_on_target":0,"passes":70,"pass_accuracy":90,"tackles":4,"interceptions":3,"rating":7.0}'),
(6, 66, 1, TRUE, 'LW',  17, '{"goals":0,"assists":1,"shots":2,"shots_on_target":1,"passes":30,"pass_accuracy":78,"tackles":1,"interceptions":0,"rating":6.8}'),

-- ═══════════════════════════════════════════
-- MATCH 7: Liverpool 3-1 Man City (EPL MD18)
-- ═══════════════════════════════════════════
(7, 4,  2, TRUE, 'RW',  11, '{"goals":2,"assists":0,"shots":5,"shots_on_target":4,"passes":38,"pass_accuracy":80,"tackles":0,"interceptions":0,"rating":9.5}'),
(7, 6,  2, TRUE, 'RB',  66, '{"goals":1,"assists":1,"shots":2,"shots_on_target":2,"passes":62,"pass_accuracy":87,"tackles":3,"interceptions":1,"rating":9.0}'),
(7, 59, 2, TRUE, 'GK',  1,  '{"goals":0,"assists":0,"saves":5,"clean_sheets":0,"passes":28,"pass_accuracy":82,"rating":7.5}'),
(7, 56, 4, TRUE, 'LW',  47, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":50,"pass_accuracy":85,"tackles":1,"interceptions":0,"rating":7.0}'),
(7, 11, 4, TRUE, 'CAM', 17, '{"goals":0,"assists":1,"shots":1,"shots_on_target":0,"passes":68,"pass_accuracy":86,"tackles":0,"interceptions":1,"rating":6.5}'),
(7, 60, 4, TRUE, 'GK',  31, '{"goals":0,"assists":0,"saves":3,"clean_sheets":0,"passes":32,"pass_accuracy":78,"rating":5.8}'),

-- ═══════════════════════════════════════════
-- MATCH 8: Man City 0-1 Arsenal (EPL MD20)
-- ═══════════════════════════════════════════
(8, 55, 3, TRUE, 'CDM', 41, '{"goals":1,"assists":0,"shots":2,"shots_on_target":1,"passes":65,"pass_accuracy":88,"tackles":6,"interceptions":4,"rating":8.8}'),
(8, 8,  3, TRUE, 'CAM', 8,  '{"goals":0,"assists":1,"shots":1,"shots_on_target":0,"passes":72,"pass_accuracy":90,"tackles":2,"interceptions":1,"rating":8.0}'),
(8, 9,  3, TRUE, 'CB',  6,  '{"goals":0,"assists":0,"shots":0,"shots_on_target":0,"passes":62,"pass_accuracy":93,"tackles":5,"interceptions":3,"rating":7.8}'),
(8, 10, 4, TRUE, 'ST',  9,  '{"goals":0,"assists":0,"shots":4,"shots_on_target":1,"passes":15,"pass_accuracy":70,"tackles":0,"interceptions":0,"rating":5.5}'),
(8, 12, 4, TRUE, 'CDM', 16, '{"goals":0,"assists":0,"shots":0,"shots_on_target":0,"passes":88,"pass_accuracy":91,"tackles":3,"interceptions":2,"rating":6.8}'),
(8, 57, 4, TRUE, 'RW',  20, '{"goals":0,"assists":0,"shots":2,"shots_on_target":0,"passes":60,"pass_accuracy":84,"tackles":1,"interceptions":1,"rating":6.2}'),

-- ═══════════════════════════════════════════
-- MATCH 9: Arsenal 1-1 Liverpool (EPL MD25)
-- ═══════════════════════════════════════════
(9, 7,  3, TRUE, 'RW',  7,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":40,"pass_accuracy":83,"tackles":2,"interceptions":1,"rating":7.8}'),
(9, 58, 3, TRUE, 'GK',  22, '{"goals":0,"assists":0,"saves":4,"clean_sheets":0,"passes":25,"pass_accuracy":80,"rating":7.5}'),
(9, 54, 3, TRUE, 'CB',  2,  '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":72,"pass_accuracy":94,"tackles":4,"interceptions":3,"rating":7.8}'),
(9, 4,  2, TRUE, 'RW',  11, '{"goals":1,"assists":0,"shots":4,"shots_on_target":2,"passes":35,"pass_accuracy":81,"tackles":0,"interceptions":0,"rating":7.8}'),
(9, 5,  2, TRUE, 'CB',  4,  '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":80,"pass_accuracy":93,"tackles":3,"interceptions":4,"rating":7.5}'),
(9, 59, 2, TRUE, 'GK',  1,  '{"goals":0,"assists":0,"saves":3,"clean_sheets":0,"passes":22,"pass_accuracy":78,"rating":7.2}'),

-- ═══════════════════════════════════════════
-- MATCH 10: Spurs 3-2 Chelsea (EPL MD28)
-- ═══════════════════════════════════════════
(10, 15, 6, TRUE, 'LW',  7,  '{"goals":2,"assists":0,"shots":5,"shots_on_target":3,"passes":32,"pass_accuracy":79,"tackles":1,"interceptions":0,"rating":9.0}'),
(10, 16, 6, TRUE, 'CAM', 10, '{"goals":1,"assists":1,"shots":3,"shots_on_target":2,"passes":58,"pass_accuracy":86,"tackles":2,"interceptions":1,"rating":8.5}'),
(10, 13, 5, TRUE, 'CAM', 20, '{"goals":1,"assists":1,"shots":4,"shots_on_target":3,"passes":52,"pass_accuracy":84,"tackles":1,"interceptions":0,"rating":8.0}'),
(10, 14, 5, TRUE, 'ST',  15, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":20,"pass_accuracy":72,"tackles":0,"interceptions":0,"rating":7.2}'),

-- ═══════════════════════════════════════════
-- MATCH 11: Real Madrid 2-1 Atlético (La Liga MD4)
-- ═══════════════════════════════════════════
(11, 22, 8, TRUE, 'ST',  9,  '{"goals":1,"assists":0,"shots":4,"shots_on_target":3,"passes":28,"pass_accuracy":80,"tackles":0,"interceptions":0,"rating":8.5}'),
(11, 20, 8, TRUE, 'LW',  7,  '{"goals":0,"assists":1,"shots":3,"shots_on_target":1,"passes":35,"pass_accuracy":82,"tackles":1,"interceptions":0,"rating":7.8}'),
(11, 21, 8, TRUE, 'CAM', 5,  '{"goals":1,"assists":0,"shots":2,"shots_on_target":1,"passes":62,"pass_accuracy":88,"tackles":3,"interceptions":2,"rating":8.8}'),
(11, 25, 9, TRUE, 'ST',  19, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":25,"pass_accuracy":76,"tackles":1,"interceptions":0,"rating":7.5}'),
(11, 24, 9, TRUE, 'ST',  7,  '{"goals":0,"assists":1,"shots":2,"shots_on_target":1,"passes":40,"pass_accuracy":82,"tackles":2,"interceptions":1,"rating":7.0}'),

-- ═══════════════════════════════════════════
-- MATCH 12: Barcelona 1-2 Real Madrid (El Clásico MD11)
-- ═══════════════════════════════════════════
(12, 20, 8, TRUE, 'LW',  7,  '{"goals":1,"assists":1,"shots":4,"shots_on_target":3,"passes":32,"pass_accuracy":81,"tackles":1,"interceptions":0,"rating":9.2}'),
(12, 21, 8, TRUE, 'CAM', 5,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":55,"pass_accuracy":86,"tackles":2,"interceptions":1,"rating":8.8}'),
(12, 23, 8, TRUE, 'CM',  15, '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":68,"pass_accuracy":90,"tackles":4,"interceptions":3,"rating":7.5}'),
(12, 19, 7, TRUE, 'RW',  27, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":38,"pass_accuracy":83,"tackles":1,"interceptions":0,"rating":8.0}'),
(12, 18, 7, TRUE, 'CM',  8,  '{"goals":0,"assists":1,"shots":2,"shots_on_target":0,"passes":72,"pass_accuracy":91,"tackles":3,"interceptions":2,"rating":7.5}'),
(12, 17, 7, TRUE, 'ST',  9,  '{"goals":0,"assists":0,"shots":2,"shots_on_target":1,"passes":20,"pass_accuracy":75,"tackles":0,"interceptions":0,"rating":6.0}'),

-- ═══════════════════════════════════════════
-- MATCH 13: Real Madrid 3-3 Barcelona (La Liga MD18)
-- ═══════════════════════════════════════════
(13, 22, 8, TRUE, 'ST',  9,  '{"goals":1,"assists":1,"shots":4,"shots_on_target":3,"passes":25,"pass_accuracy":78,"tackles":0,"interceptions":0,"rating":8.5}'),
(13, 20, 8, TRUE, 'LW',  7,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":30,"pass_accuracy":80,"tackles":1,"interceptions":0,"rating":8.0}'),
(13, 21, 8, TRUE, 'CAM', 5,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":58,"pass_accuracy":87,"tackles":2,"interceptions":1,"rating":8.8}'),
(13, 17, 7, TRUE, 'ST',  9,  '{"goals":1,"assists":0,"shots":2,"shots_on_target":1,"passes":18,"pass_accuracy":72,"tackles":0,"interceptions":0,"rating":7.5}'),
(13, 19, 7, TRUE, 'RW',  27, '{"goals":1,"assists":1,"shots":4,"shots_on_target":3,"passes":35,"pass_accuracy":82,"tackles":1,"interceptions":0,"rating":9.0}'),
(13, 18, 7, TRUE, 'CM',  8,  '{"goals":1,"assists":0,"shots":2,"shots_on_target":2,"passes":70,"pass_accuracy":90,"tackles":3,"interceptions":2,"rating":8.5}'),

-- ═══════════════════════════════════════════
-- MATCH 14: Atlético 0-1 Barcelona (La Liga MD22)
-- ═══════════════════════════════════════════
(14, 25, 9, TRUE, 'ST',  19, '{"goals":0,"assists":0,"shots":2,"shots_on_target":0,"passes":22,"pass_accuracy":74,"tackles":1,"interceptions":0,"rating":5.5}'),
(14, 24, 9, TRUE, 'ST',  7,  '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":35,"pass_accuracy":80,"tackles":2,"interceptions":1,"rating":5.8}'),
(14, 17, 7, TRUE, 'ST',  9,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":15,"pass_accuracy":70,"tackles":0,"interceptions":0,"rating":7.8}'),
(14, 19, 7, TRUE, 'RW',  27, '{"goals":0,"assists":1,"shots":2,"shots_on_target":1,"passes":40,"pass_accuracy":85,"tackles":1,"interceptions":1,"rating":7.5}'),

-- ═══════════════════════════════════════════
-- MATCH 15: Barcelona 3-1 Atlético (La Liga MD25)
-- ═══════════════════════════════════════════
(15, 17, 7, TRUE, 'ST',  9,  '{"goals":1,"assists":1,"shots":4,"shots_on_target":3,"passes":22,"pass_accuracy":78,"tackles":0,"interceptions":0,"rating":8.5}'),
(15, 19, 7, TRUE, 'RW',  27, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":38,"pass_accuracy":84,"tackles":1,"interceptions":0,"rating":8.2}'),
(15, 18, 7, TRUE, 'CM',  8,  '{"goals":1,"assists":1,"shots":2,"shots_on_target":2,"passes":75,"pass_accuracy":92,"tackles":2,"interceptions":2,"rating":8.8}'),
(15, 25, 9, TRUE, 'ST',  19, '{"goals":1,"assists":0,"shots":2,"shots_on_target":1,"passes":20,"pass_accuracy":72,"tackles":0,"interceptions":0,"rating":6.8}'),
(15, 24, 9, TRUE, 'ST',  7,  '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":32,"pass_accuracy":78,"tackles":1,"interceptions":1,"rating":5.5}'),

-- ═══════════════════════════════════════════
-- MATCH 16: Atlético 1-1 Real Madrid (La Liga MD28)
-- ═══════════════════════════════════════════
(16, 25, 9, TRUE, 'ST',  19, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":18,"pass_accuracy":75,"tackles":1,"interceptions":0,"rating":7.5}'),
(16, 24, 9, TRUE, 'ST',  7,  '{"goals":0,"assists":1,"shots":1,"shots_on_target":0,"passes":38,"pass_accuracy":82,"tackles":2,"interceptions":1,"rating":7.0}'),
(16, 22, 8, TRUE, 'ST',  9,  '{"goals":1,"assists":0,"shots":4,"shots_on_target":2,"passes":22,"pass_accuracy":76,"tackles":0,"interceptions":0,"rating":7.5}'),
(16, 21, 8, TRUE, 'CAM', 5,  '{"goals":0,"assists":0,"shots":2,"shots_on_target":1,"passes":60,"pass_accuracy":88,"tackles":3,"interceptions":2,"rating":7.0}'),
(16, 23, 8, TRUE, 'CM',  15, '{"goals":0,"assists":1,"shots":1,"shots_on_target":0,"passes":72,"pass_accuracy":91,"tackles":5,"interceptions":3,"rating":7.2}'),

-- ═══════════════════════════════════════════
-- MATCH 17: Bayern 1-1 Leverkusen (Bundesliga MD3)
-- ═══════════════════════════════════════════
(17, 26, 10, TRUE, 'ST',  9,  '{"goals":1,"assists":0,"shots":4,"shots_on_target":2,"passes":20,"pass_accuracy":75,"tackles":0,"interceptions":0,"rating":7.8}'),
(17, 27, 10, TRUE, 'CAM', 42, '{"goals":0,"assists":1,"shots":2,"shots_on_target":1,"passes":62,"pass_accuracy":88,"tackles":2,"interceptions":1,"rating":7.5}'),
(17, 28, 10, TRUE, 'CDM', 6,  '{"goals":0,"assists":0,"shots":0,"shots_on_target":0,"passes":85,"pass_accuracy":93,"tackles":5,"interceptions":3,"rating":7.2}'),
(17, 31, 12, TRUE, 'CAM', 10, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":55,"pass_accuracy":86,"tackles":1,"interceptions":1,"rating":8.0}'),
(17, 32, 12, TRUE, 'CM',  34, '{"goals":0,"assists":1,"shots":1,"shots_on_target":0,"passes":78,"pass_accuracy":91,"tackles":4,"interceptions":3,"rating":7.5}'),

-- ═══════════════════════════════════════════
-- MATCH 18: Dortmund 1-3 Bayern (Bundesliga MD9)
-- ═══════════════════════════════════════════
(18, 29, 11, TRUE, 'ST',  9,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":18,"pass_accuracy":72,"tackles":0,"interceptions":0,"rating":7.2}'),
(18, 30, 11, TRUE, 'CAM', 10, '{"goals":0,"assists":1,"shots":2,"shots_on_target":0,"passes":50,"pass_accuracy":82,"tackles":1,"interceptions":1,"rating":6.8}'),
(18, 26, 10, TRUE, 'ST',  9,  '{"goals":2,"assists":0,"shots":5,"shots_on_target":4,"passes":15,"pass_accuracy":70,"tackles":0,"interceptions":0,"rating":9.2}'),
(18, 27, 10, TRUE, 'CAM', 42, '{"goals":1,"assists":1,"shots":3,"shots_on_target":2,"passes":58,"pass_accuracy":87,"tackles":2,"interceptions":1,"rating":8.8}'),
(18, 28, 10, TRUE, 'CDM', 6,  '{"goals":0,"assists":1,"shots":0,"shots_on_target":0,"passes":82,"pass_accuracy":92,"tackles":4,"interceptions":3,"rating":7.5}'),

-- ═══════════════════════════════════════════
-- MATCH 19: Leverkusen 2-0 Dortmund (Bundesliga MD14)
-- ═══════════════════════════════════════════
(19, 31, 12, TRUE, 'CAM', 10, '{"goals":1,"assists":1,"shots":4,"shots_on_target":3,"passes":60,"pass_accuracy":88,"tackles":2,"interceptions":1,"rating":9.0}'),
(19, 32, 12, TRUE, 'CM',  34, '{"goals":1,"assists":0,"shots":2,"shots_on_target":1,"passes":80,"pass_accuracy":92,"tackles":5,"interceptions":4,"rating":8.2}'),
(19, 29, 11, TRUE, 'ST',  9,  '{"goals":0,"assists":0,"shots":2,"shots_on_target":0,"passes":15,"pass_accuracy":68,"tackles":0,"interceptions":0,"rating":5.5}'),
(19, 30, 11, TRUE, 'CAM', 10, '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":45,"pass_accuracy":80,"tackles":1,"interceptions":1,"rating":5.8}'),

-- ═══════════════════════════════════════════
-- MATCH 20: Bayern 4-0 Stuttgart (Bundesliga MD20)
-- ═══════════════════════════════════════════
(20, 26, 10, TRUE, 'ST',  9,  '{"goals":2,"assists":1,"shots":6,"shots_on_target":4,"passes":22,"pass_accuracy":78,"tackles":0,"interceptions":0,"rating":9.5}'),
(20, 27, 10, TRUE, 'CAM', 42, '{"goals":1,"assists":1,"shots":3,"shots_on_target":2,"passes":65,"pass_accuracy":90,"tackles":2,"interceptions":1,"rating":8.8}'),
(20, 28, 10, TRUE, 'CDM', 6,  '{"goals":1,"assists":0,"shots":1,"shots_on_target":1,"passes":88,"pass_accuracy":94,"tackles":3,"interceptions":2,"rating":8.0}'),
(20, 33, 13, TRUE, 'ST',  18, '{"goals":0,"assists":0,"shots":2,"shots_on_target":0,"passes":20,"pass_accuracy":70,"tackles":1,"interceptions":0,"rating":5.0}'),

-- ═══════════════════════════════════════════
-- MATCH 21: Stuttgart 1-2 Leverkusen (Bundesliga MD25)
-- ═══════════════════════════════════════════
(21, 33, 13, TRUE, 'ST',  18, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":18,"pass_accuracy":72,"tackles":0,"interceptions":0,"rating":7.2}'),
(21, 31, 12, TRUE, 'CAM', 10, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":55,"pass_accuracy":86,"tackles":1,"interceptions":1,"rating":8.0}'),
(21, 32, 12, TRUE, 'CM',  34, '{"goals":1,"assists":1,"shots":2,"shots_on_target":1,"passes":72,"pass_accuracy":90,"tackles":4,"interceptions":3,"rating":8.2}'),

-- ═══════════════════════════════════════════
-- MATCH 22: Milan 1-2 Inter (Serie A MD5)
-- ═══════════════════════════════════════════
(22, 34, 14, TRUE, 'LW',  10, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":35,"pass_accuracy":80,"tackles":1,"interceptions":0,"rating":7.5}'),
(22, 35, 14, TRUE, 'RW',  11, '{"goals":0,"assists":1,"shots":2,"shots_on_target":1,"passes":40,"pass_accuracy":82,"tackles":2,"interceptions":1,"rating":7.0}'),
(22, 36, 15, TRUE, 'ST',  10, '{"goals":2,"assists":0,"shots":5,"shots_on_target":3,"passes":22,"pass_accuracy":75,"tackles":0,"interceptions":0,"rating":9.0}'),
(22, 37, 15, TRUE, 'CM',  20, '{"goals":0,"assists":1,"shots":1,"shots_on_target":1,"passes":68,"pass_accuracy":89,"tackles":3,"interceptions":2,"rating":7.8}'),

-- ═══════════════════════════════════════════
-- MATCH 23: Inter 1-0 Juventus (Serie A MD10)
-- ═══════════════════════════════════════════
(23, 36, 15, TRUE, 'ST',  10, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":20,"pass_accuracy":74,"tackles":0,"interceptions":0,"rating":7.8}'),
(23, 37, 15, TRUE, 'CM',  20, '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":72,"pass_accuracy":91,"tackles":4,"interceptions":3,"rating":7.5}'),
(23, 38, 16, TRUE, 'ST',  9,  '{"goals":0,"assists":0,"shots":3,"shots_on_target":1,"passes":18,"pass_accuracy":70,"tackles":0,"interceptions":0,"rating":5.8}'),
(23, 39, 16, TRUE, 'LW',  10, '{"goals":0,"assists":0,"shots":2,"shots_on_target":0,"passes":35,"pass_accuracy":78,"tackles":1,"interceptions":1,"rating":5.5}'),

-- ═══════════════════════════════════════════
-- MATCH 24: Napoli 2-1 Milan (Serie A MD15)
-- ═══════════════════════════════════════════
(24, 41, 17, TRUE, 'LW',  77, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":38,"pass_accuracy":82,"tackles":2,"interceptions":1,"rating":8.2}'),
(24, 40, 17, TRUE, 'ST',  9,  '{"goals":1,"assists":1,"shots":4,"shots_on_target":3,"passes":15,"pass_accuracy":72,"tackles":0,"interceptions":0,"rating":8.5}'),
(24, 35, 14, TRUE, 'RW',  11, '{"goals":1,"assists":0,"shots":2,"shots_on_target":1,"passes":42,"pass_accuracy":84,"tackles":1,"interceptions":0,"rating":7.0}'),
(24, 34, 14, TRUE, 'LW',  10, '{"goals":0,"assists":1,"shots":2,"shots_on_target":1,"passes":30,"pass_accuracy":78,"tackles":1,"interceptions":0,"rating":6.8}'),

-- ═══════════════════════════════════════════
-- MATCH 25: Juventus 0-0 Napoli (Serie A MD22)
-- ═══════════════════════════════════════════
(25, 38, 16, TRUE, 'ST',  9,  '{"goals":0,"assists":0,"shots":2,"shots_on_target":0,"passes":15,"pass_accuracy":68,"tackles":0,"interceptions":0,"rating":5.5}'),
(25, 39, 16, TRUE, 'LW',  10, '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":32,"pass_accuracy":80,"tackles":1,"interceptions":1,"rating":5.8}'),
(25, 40, 17, TRUE, 'ST',  9,  '{"goals":0,"assists":0,"shots":3,"shots_on_target":1,"passes":12,"pass_accuracy":65,"tackles":0,"interceptions":0,"rating":5.5}'),
(25, 41, 17, TRUE, 'LW',  77, '{"goals":0,"assists":0,"shots":2,"shots_on_target":0,"passes":35,"pass_accuracy":80,"tackles":2,"interceptions":1,"rating":6.0}'),

-- ═══════════════════════════════════════════
-- MATCH 26: Inter 3-0 Milan (Serie A MD28)
-- ═══════════════════════════════════════════
(26, 36, 15, TRUE, 'ST',  10, '{"goals":2,"assists":0,"shots":5,"shots_on_target":4,"passes":18,"pass_accuracy":74,"tackles":0,"interceptions":0,"rating":9.5}'),
(26, 37, 15, TRUE, 'CM',  20, '{"goals":1,"assists":1,"shots":2,"shots_on_target":2,"passes":70,"pass_accuracy":90,"tackles":3,"interceptions":2,"rating":8.8}'),
(26, 34, 14, TRUE, 'LW',  10, '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":28,"pass_accuracy":75,"tackles":0,"interceptions":0,"rating":4.8}'),
(26, 35, 14, TRUE, 'RW',  11, '{"goals":0,"assists":0,"shots":2,"shots_on_target":0,"passes":35,"pass_accuracy":78,"tackles":1,"interceptions":0,"rating":5.0}'),

-- ═══════════════════════════════════════════
-- MATCH 27: PSG 3-0 Marseille (Ligue 1 MD6)
-- ═══════════════════════════════════════════
(27, 43, 19, TRUE, 'RW',  10, '{"goals":2,"assists":0,"shots":5,"shots_on_target":4,"passes":42,"pass_accuracy":85,"tackles":1,"interceptions":0,"rating":9.2}'),
(27, 44, 19, TRUE, 'RB',  2,  '{"goals":1,"assists":1,"shots":2,"shots_on_target":1,"passes":55,"pass_accuracy":88,"tackles":3,"interceptions":2,"rating":8.5}'),
(27, 46, 21, TRUE, 'ST',  10, '{"goals":0,"assists":0,"shots":2,"shots_on_target":0,"passes":18,"pass_accuracy":68,"tackles":0,"interceptions":0,"rating":5.0}'),

-- ═══════════════════════════════════════════
-- MATCH 28: Marseille 2-1 Lille (Ligue 1 MD14)
-- ═══════════════════════════════════════════
(28, 46, 21, TRUE, 'ST',  10, '{"goals":2,"assists":0,"shots":4,"shots_on_target":3,"passes":15,"pass_accuracy":72,"tackles":0,"interceptions":0,"rating":8.5}'),
(28, 47, 22, TRUE, 'ST',  9,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":22,"pass_accuracy":76,"tackles":1,"interceptions":0,"rating":7.5}'),

-- ═══════════════════════════════════════════
-- MATCH 29: Lille 1-3 PSG (Ligue 1 MD20)
-- ═══════════════════════════════════════════
(29, 47, 22, TRUE, 'ST',  9,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":20,"pass_accuracy":74,"tackles":1,"interceptions":0,"rating":7.0}'),
(29, 43, 19, TRUE, 'RW',  10, '{"goals":2,"assists":0,"shots":4,"shots_on_target":3,"passes":40,"pass_accuracy":84,"tackles":1,"interceptions":0,"rating":8.8}'),
(29, 44, 19, TRUE, 'RB',  2,  '{"goals":1,"assists":1,"shots":2,"shots_on_target":1,"passes":52,"pass_accuracy":87,"tackles":3,"interceptions":2,"rating":8.2}'),

-- ═══════════════════════════════════════════
-- MATCH 30: PSG 4-1 Lyon (Ligue 1 MD26)
-- ═══════════════════════════════════════════
(30, 43, 19, TRUE, 'RW',  10, '{"goals":3,"assists":0,"shots":6,"shots_on_target":5,"passes":38,"pass_accuracy":83,"tackles":1,"interceptions":0,"rating":10.0}'),
(30, 44, 19, TRUE, 'RB',  2,  '{"goals":1,"assists":1,"shots":2,"shots_on_target":2,"passes":50,"pass_accuracy":86,"tackles":4,"interceptions":2,"rating":8.5}'),
(30, 45, 20, TRUE, 'ST',  10, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":20,"pass_accuracy":72,"tackles":0,"interceptions":0,"rating":7.0}'),

-- ═══════════════════════════════════════════
-- MATCH 31: Real Madrid 3-1 Leverkusen (UCL)
-- ═══════════════════════════════════════════
(31, 22, 8, TRUE, 'ST',  9,  '{"goals":1,"assists":0,"shots":4,"shots_on_target":3,"passes":25,"pass_accuracy":80,"tackles":0,"interceptions":0,"rating":8.2}'),
(31, 20, 8, TRUE, 'LW',  7,  '{"goals":1,"assists":1,"shots":3,"shots_on_target":2,"passes":35,"pass_accuracy":82,"tackles":1,"interceptions":0,"rating":8.5}'),
(31, 21, 8, TRUE, 'CAM', 5,  '{"goals":1,"assists":0,"shots":2,"shots_on_target":1,"passes":60,"pass_accuracy":89,"tackles":3,"interceptions":2,"rating":8.0}'),
(31, 31, 12, TRUE, 'CAM', 10, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":50,"pass_accuracy":84,"tackles":1,"interceptions":1,"rating":7.5}'),
(31, 32, 12, TRUE, 'CM',  34, '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":65,"pass_accuracy":88,"tackles":3,"interceptions":2,"rating":6.5}'),

-- ═══════════════════════════════════════════
-- MATCH 32: Inter 1-0 Barcelona (UCL)
-- ═══════════════════════════════════════════
(32, 36, 15, TRUE, 'ST',  10, '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":18,"pass_accuracy":72,"tackles":0,"interceptions":0,"rating":7.8}'),
(32, 37, 15, TRUE, 'CM',  20, '{"goals":0,"assists":0,"shots":0,"shots_on_target":0,"passes":72,"pass_accuracy":91,"tackles":5,"interceptions":4,"rating":7.5}'),
(32, 17, 7, TRUE, 'ST',  9,  '{"goals":0,"assists":0,"shots":2,"shots_on_target":0,"passes":15,"pass_accuracy":68,"tackles":0,"interceptions":0,"rating":5.2}'),
(32, 19, 7, TRUE, 'RW',  27, '{"goals":0,"assists":0,"shots":3,"shots_on_target":1,"passes":35,"pass_accuracy":80,"tackles":1,"interceptions":0,"rating":6.0}'),

-- ═══════════════════════════════════════════
-- MATCH 33: Arsenal 2-0 PSG (UCL)
-- ═══════════════════════════════════════════
(33, 7,  3, TRUE, 'RW',  7,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":40,"pass_accuracy":84,"tackles":2,"interceptions":1,"rating":8.5}'),
(33, 55, 3, TRUE, 'CDM', 41, '{"goals":1,"assists":0,"shots":2,"shots_on_target":1,"passes":65,"pass_accuracy":89,"tackles":5,"interceptions":3,"rating":8.8}'),
(33, 8,  3, TRUE, 'CAM', 8,  '{"goals":0,"assists":1,"shots":1,"shots_on_target":0,"passes":72,"pass_accuracy":91,"tackles":2,"interceptions":2,"rating":7.8}'),
(33, 43, 19, TRUE, 'RW',  10, '{"goals":0,"assists":0,"shots":3,"shots_on_target":1,"passes":38,"pass_accuracy":80,"tackles":1,"interceptions":0,"rating":6.0}'),
(33, 44, 19, TRUE, 'RB',  2,  '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":48,"pass_accuracy":85,"tackles":3,"interceptions":2,"rating":6.5}'),

-- ═══════════════════════════════════════════
-- MATCH 34: Bayern 5-1 Benfica (UCL)
-- ═══════════════════════════════════════════
(34, 26, 10, TRUE, 'ST',  9,  '{"goals":3,"assists":0,"shots":6,"shots_on_target":5,"passes":18,"pass_accuracy":75,"tackles":0,"interceptions":0,"rating":10.0}'),
(34, 27, 10, TRUE, 'CAM', 42, '{"goals":2,"assists":1,"shots":4,"shots_on_target":3,"passes":62,"pass_accuracy":89,"tackles":2,"interceptions":1,"rating":9.5}'),
(34, 28, 10, TRUE, 'CDM', 6,  '{"goals":0,"assists":1,"shots":0,"shots_on_target":0,"passes":85,"pass_accuracy":94,"tackles":4,"interceptions":3,"rating":8.0}'),
(34, 48, 23, TRUE, 'RW',  11, '{"goals":1,"assists":0,"shots":2,"shots_on_target":1,"passes":30,"pass_accuracy":78,"tackles":0,"interceptions":0,"rating":6.8}'),

-- ═══════════════════════════════════════════
-- MATCH 35: Liverpool 2-0 Real Madrid (UCL)
-- ═══════════════════════════════════════════
(35, 4,  2, TRUE, 'RW',  11, '{"goals":2,"assists":0,"shots":5,"shots_on_target":3,"passes":38,"pass_accuracy":82,"tackles":0,"interceptions":0,"rating":9.5}'),
(35, 6,  2, TRUE, 'RB',  66, '{"goals":0,"assists":1,"shots":1,"shots_on_target":0,"passes":65,"pass_accuracy":88,"tackles":3,"interceptions":2,"rating":8.0}'),
(35, 5,  2, TRUE, 'CB',  4,  '{"goals":0,"assists":0,"shots":0,"shots_on_target":0,"passes":82,"pass_accuracy":94,"tackles":5,"interceptions":4,"rating":8.5}'),
(35, 22, 8, TRUE, 'ST',  9,  '{"goals":0,"assists":0,"shots":3,"shots_on_target":0,"passes":20,"pass_accuracy":72,"tackles":0,"interceptions":0,"rating":5.0}'),
(35, 20, 8, TRUE, 'LW',  7,  '{"goals":0,"assists":0,"shots":2,"shots_on_target":1,"passes":28,"pass_accuracy":78,"tackles":1,"interceptions":0,"rating":5.5}'),
(35, 63, 8, TRUE, 'GK',  1,  '{"goals":0,"assists":0,"saves":3,"clean_sheets":0,"passes":25,"pass_accuracy":75,"rating":5.8}'),

-- ═══════════════════════════════════════════
-- MATCH 36: Arsenal 1-0 Bayern (UCL R16)
-- ═══════════════════════════════════════════
(36, 7,  3, TRUE, 'RW',  7,  '{"goals":1,"assists":0,"shots":3,"shots_on_target":2,"passes":38,"pass_accuracy":83,"tackles":2,"interceptions":1,"rating":8.5}'),
(36, 55, 3, TRUE, 'CDM', 41, '{"goals":0,"assists":1,"shots":1,"shots_on_target":0,"passes":68,"pass_accuracy":90,"tackles":6,"interceptions":4,"rating":8.2}'),
(36, 58, 3, TRUE, 'GK',  22, '{"goals":0,"assists":0,"saves":6,"clean_sheets":1,"passes":22,"pass_accuracy":78,"rating":8.8}'),
(36, 26, 10, TRUE, 'ST',  9,  '{"goals":0,"assists":0,"shots":4,"shots_on_target":2,"passes":15,"pass_accuracy":68,"tackles":0,"interceptions":0,"rating":6.0}'),
(36, 27, 10, TRUE, 'CAM', 42, '{"goals":0,"assists":0,"shots":2,"shots_on_target":1,"passes":55,"pass_accuracy":85,"tackles":1,"interceptions":1,"rating":6.5}'),
(36, 28, 10, TRUE, 'CDM', 6,  '{"goals":0,"assists":0,"shots":1,"shots_on_target":0,"passes":78,"pass_accuracy":91,"tackles":4,"interceptions":2,"rating":6.8}');
