-- ============================================================
-- FOOTYPULSE — EXPANDED TRANSFER HISTORY & NEWS ARTICLES
-- ============================================================
-- PURPOSE: Add more realistic transfer records and news articles
--          to the existing seed data.
--
-- HOW TO USE:
--   Option A: Append to your existing seed.sql (replace sections 17 & 19)
--   Option B: Run standalone AFTER seed.sql:
--             node database/runExtraSeed.js
--
-- IMPORTANT: This file references person_id, team_id, and
--            competition_id values from the existing seed.sql.
--            Make sure seed.sql has been run first.
-- ============================================================

-- ┌─────────────────────────────────────────────────────────┐
-- │  REFERENCE: Existing IDs from seed.sql                  │
-- │                                                         │
-- │  TEAMS (club):                                          │
-- │    1  = Manchester United    10 = Bayern Munich          │
-- │    2  = Liverpool FC         11 = Borussia Dortmund      │
-- │    3  = Arsenal FC           12 = AC Milan               │
-- │    4  = Manchester City      13 = Inter Milan            │
-- │    5  = Chelsea FC           14 = Juventus FC            │
-- │    6  = Tottenham Hotspur    15 = AS Roma                │
-- │    7  = FC Barcelona         16 = PSG                    │
-- │    8  = Real Madrid CF       17 = SL Benfica             │
-- │    9  = Atlético Madrid      18 = FC Porto               │
-- │                              19 = Ajax Amsterdam         │
-- │                                                         │
-- │  PERSONS (players 1-22, managers 23-30, refs 31-34):    │
-- │    1  = Bruno Fernandes      12 = Rodri                  │
-- │    2  = Marcus Rashford      13 = Vinícius Jr            │
-- │    3  = Casemiro             14 = Jude Bellingham        │
-- │    4  = Mohamed Salah        15 = Federico Valverde      │
-- │    5  = Virgil van Dijk      16 = Robert Lewandowski     │
-- │    6  = Trent Alexander-Arnold 17 = Pedri                │
-- │    7  = Bukayo Saka          18 = Ronald Araújo          │
-- │    8  = Martin Ødegaard      19 = Kylian Mbappé          │
-- │    9  = Gabriel Magalhães    20 = Achraf Hakimi           │
-- │   10  = Erling Haaland       21 = Harry Kane             │
-- │   11  = Kevin De Bruyne      22 = Jamal Musiala          │
-- │                                                         │
-- │  COMPETITIONS:                                           │
-- │    1  = Premier League        6 = UCL                    │
-- │    2  = La Liga               7 = FA Cup                 │
-- │    3  = Bundesliga            8 = Copa del Rey           │
-- │    4  = Serie A               9 = FIFA World Cup         │
-- │    5  = Ligue 1              10 = UEFA Europa League     │
-- └─────────────────────────────────────────────────────────┘


-- ============================================================
-- STEP 1: DELETE EXISTING TRANSFERS (to replace with expanded set)
-- ============================================================
DELETE FROM transfers;
ALTER SEQUENCE transfers_transfer_id_seq RESTART WITH 1;


-- ============================================================
-- STEP 2: EXPANDED TRANSFERS (25 records)
-- ============================================================
-- Covers historical moves + current window rumors/deals

INSERT INTO transfers (person_id, from_team_id, to_team_id, transfer_type, status, fee, fee_currency, transfer_date, window_year, window_type) VALUES

-- ── Historical confirmed transfers ──────────────────────────
-- Salah: Roma → Liverpool (2017)
(4, 15, 2, 'permanent', 'official', 42000000.00, 'EUR', '2017-06-22', 2017, 'summer'),
-- Virgil van Dijk: (external) → Liverpool (2018) — from_team NULL = came from outside seeded clubs
(5, NULL, 2, 'permanent', 'official', 84700000.00, 'EUR', '2018-01-01', 2018, 'winter'),
-- Casemiro: Real Madrid → Man United (2022)
(3, 8, 1, 'permanent', 'official', 70600000.00, 'EUR', '2022-08-22', 2022, 'summer'),
-- Haaland: Dortmund → Man City (2022)
(10, 11, 4, 'permanent', 'official', 60000000.00, 'EUR', '2022-07-01', 2022, 'summer'),
-- Ødegaard: Real Madrid → Arsenal (2021)
(8, 8, 3, 'permanent', 'official', 40000000.00, 'EUR', '2021-08-20', 2021, 'summer'),
-- Bellingham: Dortmund → Real Madrid (2023)
(14, 11, 8, 'permanent', 'official', 103000000.00, 'EUR', '2023-06-14', 2023, 'summer'),
-- Kane: Tottenham → Bayern Munich (2023)
(21, 6, 10, 'permanent', 'official', 100000000.00, 'EUR', '2023-08-12', 2023, 'summer'),
-- Lewandowski: Bayern Munich → Barcelona (2022)
(16, 10, 7, 'permanent', 'official', 45000000.00, 'EUR', '2022-07-19', 2022, 'summer'),
-- Vinícius Jr: (youth) → Real Madrid (2018)
(13, NULL, 8, 'youth', 'official', 45000000.00, 'EUR', '2018-07-12', 2018, 'summer'),
-- Pedri: (external) → Barcelona (2020)
(17, NULL, 7, 'permanent', 'official', 5000000.00, 'EUR', '2020-08-20', 2020, 'summer'),
-- Hakimi: Real Madrid → Inter Milan (loan, 2020)
(20, 8, 13, 'loan', 'official', 0.00, 'EUR', '2020-09-03', 2020, 'summer'),
-- Hakimi: Inter Milan → PSG (2021)
(20, 13, 16, 'permanent', 'official', 66000000.00, 'EUR', '2021-07-06', 2021, 'summer'),
-- Gabriel: (external) → Arsenal (2020)
(9, NULL, 3, 'permanent', 'official', 26000000.00, 'EUR', '2020-09-01', 2020, 'summer'),
-- Musiala: Chelsea youth → Bayern Munich (2019)
(22, 5, 10, 'youth', 'official', 0.00, 'EUR', '2019-07-01', 2019, 'summer'),
-- Saka: Arsenal academy (youth promotion, from_team = to_team is fine for internal)
(7, NULL, 3, 'youth', 'official', 0.00, 'EUR', '2018-07-01', 2018, 'summer'),

-- ── 2024/25 Winter Window ──────────────────────────────────
-- Rashford: Man United → (loan to Dortmund)
(2, 1, 11, 'loan', 'official', 0.00, 'EUR', '2025-01-15', 2025, 'winter'),
-- De Bruyne: Man City → (loan to Al-Ittihad is outside seeded teams, use NULL for to_team? No — to_team NOT NULL)
-- Instead: De Bruyne rumor to Barcelona
(11, 4, 7, 'permanent', 'rumor', 30000000.00, 'EUR', NULL, 2025, 'summer'),

-- ── 2025 Summer Window Rumors & Agreed ─────────────────────
-- Mbappé: PSG → Real Madrid (the mega move)
(19, 16, 8, 'free', 'official', 0.00, 'EUR', '2024-07-01', 2024, 'summer'),
-- Alexander-Arnold: Liverpool → Real Madrid (rumored)
(6, 2, 8, 'free', 'rumor', 0.00, 'EUR', NULL, 2025, 'summer'),
-- Salah: Liverpool → (rumored to PSG)
(4, 2, 16, 'free', 'rumor', 0.00, 'EUR', NULL, 2025, 'summer'),
-- Haaland: Man City → Real Madrid (rumored mega deal)
(10, 4, 8, 'permanent', 'rumor', 200000000.00, 'EUR', NULL, 2025, 'summer'),
-- Rodri: Man City → Barcelona (rumor)
(12, 4, 7, 'permanent', 'rumor', 80000000.00, 'EUR', NULL, 2025, 'summer'),
-- Musiala: Bayern → Man City (negotiating)
(22, 10, 4, 'permanent', 'negotiating', 120000000.00, 'EUR', NULL, 2025, 'summer'),
-- Araújo: Barcelona → Chelsea (agreed)
(18, 7, 5, 'loan', 'agreed', 0.00, 'EUR', NULL, 2025, 'winter'),
-- Valverde: Real Madrid → Man United (rumor)
(15, 8, 1, 'permanent', 'rumor', 90000000.00, 'EUR', NULL, 2025, 'summer');


-- ============================================================
-- STEP 3: DELETE EXISTING ARTICLES (to replace with expanded set)
-- ============================================================
DELETE FROM comments;
DELETE FROM articles;
ALTER SEQUENCE articles_article_id_seq RESTART WITH 1;
ALTER SEQUENCE comments_comment_id_seq RESTART WITH 1;


-- ============================================================
-- STEP 4: EXPANDED ARTICLES (15 articles across types)
-- ============================================================

-- Article 1: Match Report
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id, match_id) VALUES
('salah-double-sinks-united-2024',
 'Salah''s Stunning Double Sinks Manchester United in Thriller',
 'Liverpool edge past rivals in a pulsating 2-2 draw at Old Trafford',
 'Mohamed Salah was at his devastating best as Liverpool fought back twice to earn a 2-2 draw at Old Trafford.',
 'Old Trafford witnessed another classic chapter in one of English football''s greatest rivalries as Liverpool came from behind twice to draw 2-2 with Manchester United.

Marcus Rashford opened the scoring in the 23rd minute with a slick finish from the left side of the box, assisted by a deft through ball from Casemiro. Liverpool responded before half-time through Mohamed Salah, who latched onto a sublime cross from Trent Alexander-Arnold to level the scores.

Salah struck again in the 56th minute with a moment of individual brilliance — picking up the ball 30 yards from goal, drifting past two defenders, and curling an unstoppable shot into the top corner. Bruno Fernandes rescued a point for the hosts from the penalty spot in the 78th minute after a VAR review confirmed a foul inside the area.

The result leaves both sides in the top four but means neither could claim bragging rights. Liverpool manager Jürgen Klopp praised Salah''s "world-class performance" while Erik ten Hag highlighted his team''s resilience in fighting back.

The draw keeps Liverpool one point clear of Manchester United in the Premier League standings, with both clubs in a fierce battle for Champions League qualification.',
 'match_report',
 '{"featured_image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"}',
 'James Anderson', 'auth_001', '2025-02-15 22:30:00', 'published', TRUE, FALSE, 45200,
 '["Premier League", "Liverpool", "Manchester United", "Mohamed Salah", "Match Report"]',
 2, 1, 4, 1);

-- Article 2: Transfer News — Mbappé to Real Madrid
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('mbappe-real-madrid-official-2024',
 'Kylian Mbappé Officially Joins Real Madrid on Free Transfer',
 'The most anticipated transfer in football history is finally complete',
 'Real Madrid have confirmed the signing of Kylian Mbappé from Paris Saint-Germain on a free transfer, ending years of speculation.',
 'Real Madrid have officially announced the signing of Kylian Mbappé from Paris Saint-Germain on a free transfer, bringing an end to one of football''s longest-running transfer sagas.

The French superstar, who had been linked with the Spanish giants for the better part of five years, will wear the famous white shirt starting from the 2024/25 season. Mbappé''s contract with PSG expired at the end of June, allowing him to move without a transfer fee.

Despite no transfer fee being involved, the total financial package is estimated to be enormous, with reports suggesting Mbappé will earn upwards of €15 million per year in wages alone, plus a substantial signing bonus.

Real Madrid president Florentino Pérez described the deal as "a dream come true for the club and the player." Mbappé himself spoke of his desire to "write history" at the Santiago Bernabéu.

The 25-year-old scored 256 goals in 308 appearances for PSG across all competitions, winning six Ligue 1 titles and reaching the Champions League final in 2020.

His arrival pairs him alongside Vinícius Jr and Jude Bellingham in what many are already calling the most fearsome attacking trio in world football.',
 'transfer',
 '{"featured_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800"}',
 'Sarah Mitchell', 'auth_002', '2024-07-01 14:00:00', 'published', TRUE, TRUE, 128500,
 '["Transfer News", "Real Madrid", "PSG", "Kylian Mbappé", "Breaking News", "La Liga"]',
 8, 2, 19);

-- Article 3: Transfer Rumor — Haaland to Real Madrid
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('real-madrid-haaland-200m-bid-2025',
 'Real Madrid Prepare Record-Breaking €200M Bid for Erling Haaland',
 'Spanish giants aim to unite the world''s best attacking duo',
 'Real Madrid have emerged as serious contenders for Manchester City striker Erling Haaland with a potential world-record bid.',
 'Real Madrid have emerged as serious contenders to sign Erling Haaland from Manchester City, according to sources close to the Spanish club. The Norwegian striker, who has been in sensational form since joining City, is reportedly on Madrid''s radar for a potential summer transfer.

While Manchester City insist Haaland is not for sale, Real Madrid''s interest signals their intent to create the most devastating attack in football history. Having already signed Kylian Mbappé last summer, the addition of Haaland would give Carlo Ancelotti an embarrassment of riches.

Sources suggest that any potential deal would likely shatter the existing transfer record, with City expected to demand a fee in excess of €200 million. Haaland''s current contract runs until 2027, giving City a strong negotiating position, though a release clause reportedly activates in 2025.

The 24-year-old has scored 25 goals in 22 Premier League appearances this season and shows no signs of slowing down. His combination of pace, power, and clinical finishing makes him one of the most sought-after players in world football.

Manchester City manager Pep Guardiola dismissed the speculation, stating that Haaland is "very happy" at the club and remains committed to their project. However, the lure of Real Madrid has historically proven difficult for players to resist.',
 'transfer',
 '{"featured_image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800"}',
 'Michael Roberts', 'auth_004', '2025-02-12 09:45:00', 'published', FALSE, TRUE, 32150,
 '["Transfer News", "Real Madrid", "Manchester City", "Erling Haaland", "Breaking News"]',
 4, 1, 10);

-- Article 4: Transfer Rumor — Alexander-Arnold to Real Madrid
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('alexander-arnold-real-madrid-free-2025',
 'Trent Alexander-Arnold in Advanced Talks with Real Madrid',
 'Liverpool defender set to leave Anfield as a free agent this summer',
 'Trent Alexander-Arnold is reportedly in advanced discussions with Real Madrid over a free transfer move when his Liverpool contract expires.',
 'Trent Alexander-Arnold is reportedly in advanced talks with Real Madrid ahead of a potential free transfer this summer, leaving Liverpool fans devastated at the prospect of losing their homegrown star.

The 26-year-old right-back, whose contract expires at the end of the current season, has been locked in negotiations with Liverpool over an extension but has so far failed to reach an agreement. Real Madrid have moved aggressively to capitalize on the situation.

Liverpool manager Arne Slot addressed the media about the situation, acknowledging the speculation but insisting the club "will fight until the very end" to keep Alexander-Arnold. The England international has been a pivotal figure at Anfield since breaking into the first team in 2016.

Alexander-Arnold''s unique playing style — essentially operating as a midfielder from the right-back position — has attracted the attention of Carlo Ancelotti, who sees him as a transformational signing for Real Madrid''s midfield.

If the move goes through, it would mark one of the most significant departures from Liverpool in recent memory, comparable to the losses of Steven Gerrard and Fernando Torres. The Reds are reportedly already scouting replacements.',
 'transfer',
 '{"featured_image": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"}',
 'James Anderson', 'auth_001', '2025-03-01 11:20:00', 'published', TRUE, FALSE, 67300,
 '["Transfer News", "Liverpool", "Real Madrid", "Trent Alexander-Arnold", "Free Transfer"]',
 2, 1, 6);

-- Article 5: Match Report — Arsenal vs Man City
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id, match_id) VALUES
('arsenal-edge-city-title-race-2025',
 'Arsenal Edge Past Manchester City in Crucial Title Showdown',
 'Saka''s second-half header the difference as Gunners move top',
 'Arsenal defeated Manchester City 1-0 at the Emirates to move to the top of the Premier League table.',
 'Arsenal moved to the top of the Premier League table with a hard-fought 1-0 victory over Manchester City at the Emirates Stadium in a match that could prove decisive in the title race.

Bukayo Saka scored the only goal of the game in the 67th minute, rising highest to meet a pinpoint Martin Ødegaard cross with a powerful header that left Ederson rooted to the spot. It was a moment of pure quality in an otherwise tightly contested affair.

Mikel Arteta''s side defended with incredible discipline throughout, with Gabriel Magalhães putting in a masterclass at centre-back. The Brazilian won every aerial duel and made several crucial interceptions to keep City''s star-studded attack at bay.

Pep Guardiola''s men dominated possession as expected but struggled to break down Arsenal''s well-organized defensive structure. Erling Haaland had a quiet afternoon by his lofty standards, managing just one shot on target all game.

The victory gives Arsenal a two-point lead at the top of the table with eight games remaining. More importantly, it sends a powerful message that this Arsenal side has the mental fortitude to win the big matches.

Arteta praised his players'' "incredible mentality" and warned that there is still much work to do in the title race.',
 'match_report',
 '{"featured_image": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800"}',
 'Emma Thompson', 'auth_003', '2025-02-22 20:15:00', 'published', TRUE, FALSE, 56800,
 '["Premier League", "Arsenal", "Manchester City", "Bukayo Saka", "Title Race", "Match Report"]',
 3, 1, 7, 2);

-- Article 6: Feature — Bellingham''s Rise
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('bellingham-rise-real-madrid-2025',
 'The Jude Bellingham Effect: How England''s Star Transformed Real Madrid',
 'From Birmingham City to the Bernabéu — the meteoric rise of Jude Bellingham',
 'Jude Bellingham has exceeded all expectations since arriving at Real Madrid, establishing himself as one of the best players in the world.',
 'When Jude Bellingham arrived at Real Madrid from Borussia Dortmund for a fee that could reach €133 million, expectations were sky-high. Remarkably, the young Englishman has not only met them — he has surpassed them.

In his first season at the Santiago Bernabéu, Bellingham scored 23 goals and provided 13 assists across all competitions, numbers that would be impressive for a striker, let alone a midfielder. His ability to arrive in the box at the perfect moment earned him the nickname "Mr. Clutch" among Madrid fans.

The journey from Birmingham City to the pinnacle of world football reads like a Hollywood script. Bellingham made his senior debut at just 16 years old, becoming the youngest player to represent Birmingham in a competitive match. By 17, he had completed a €25 million move to Borussia Dortmund.

In Germany, Bellingham matured into a complete midfielder. He captained Dortmund to the Champions League final in 2023, drawing the attention of every major club in Europe. But Real Madrid, with their storied tradition of signing the world''s best, won the race.

What sets Bellingham apart is his versatility. He can play as a number 10, a box-to-box midfielder, or even a deep-lying playmaker. His football intelligence is remarkable for someone his age, and his physical attributes — pace, strength, stamina — make him a nightmare for opponents.

As Real Madrid push for yet another Champions League title, Bellingham is the heartbeat of the team, the player who makes everything tick.',
 'feature',
 '{"featured_image": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800"}',
 'Sarah Mitchell', 'auth_002', '2025-02-18 10:00:00', 'published', TRUE, FALSE, 41200,
 '["Feature", "Real Madrid", "Jude Bellingham", "La Liga", "England"]',
 8, 2, 14);

-- Article 7: Transfer — Rashford Loan
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('rashford-dortmund-loan-2025',
 'Marcus Rashford Completes Loan Move to Borussia Dortmund',
 'England forward seeks fresh start in the Bundesliga',
 'Manchester United have confirmed that Marcus Rashford has joined Borussia Dortmund on loan for the remainder of the season.',
 'Marcus Rashford has completed a loan move from Manchester United to Borussia Dortmund until the end of the 2024/25 season, bringing an end to weeks of speculation about the England international''s future.

The 27-year-old fell out of favor under manager Erik ten Hag earlier this season and was left out of several matchday squads. His departure was seen as inevitable once the January transfer window opened.

Dortmund sporting director Sebastian Kehl expressed delight at the signing, calling Rashford "a player of enormous quality who can make a real difference for us." The German club beat competition from several Premier League clubs and AC Milan to secure the deal.

Rashford, who has spent his entire career at Old Trafford, scored 131 goals in 401 appearances for United. He will wear the number 27 shirt at Signal Iduna Park.

The loan deal includes an option to buy, though the fee would need to be agreed separately. United are reportedly open to a permanent departure if Rashford impresses in Germany.',
 'transfer',
 '{"featured_image": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800"}',
 'Michael Roberts', 'auth_004', '2025-01-16 16:00:00', 'published', FALSE, TRUE, 38900,
 '["Transfer News", "Manchester United", "Borussia Dortmund", "Marcus Rashford", "Loan"]',
 1, 1, 2);

-- Article 8: News — Salah Contract Saga
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('salah-contract-saga-liverpool-2025',
 'Mohamed Salah''s Liverpool Future Hangs in the Balance',
 'Egyptian King''s contract expires in June with no agreement in sight',
 'Mohamed Salah''s future at Liverpool remains uncertain as contract negotiations continue to stall with just months left on his current deal.',
 'Liverpool face the very real prospect of losing Mohamed Salah on a free transfer this summer, with negotiations over a new contract having stalled in recent weeks.

The Egyptian forward, who turns 33 in June, has been one of the most prolific goalscorers in Premier League history since arriving from Roma in 2017. His record of 214 goals in 352 appearances for Liverpool makes him one of the club''s all-time greats.

The impasse is believed to center around the length and financial terms of any new deal. Salah reportedly wants a multi-year contract with wages reflecting his status as one of the world''s best players, while Liverpool''s policy of offering shorter deals to players over 30 has created friction.

Several clubs are monitoring the situation, with PSG, Al-Hilal, and Inter Miami all reportedly interested. Salah has previously expressed his desire to stay at Liverpool but hinted at frustration with the pace of negotiations.

Arne Slot addressed the situation diplomatically, saying he "hopes" Salah will remain but acknowledged the decision is ultimately between the player and the club. Meanwhile, Salah continues to perform at an elite level, leading the Premier League scoring charts with 19 goals.

The clock is ticking for Liverpool to resolve one of the most significant contract situations in their recent history.',
 'news',
 '{"featured_image": "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800"}',
 'James Anderson', 'auth_001', '2025-03-10 08:30:00', 'published', TRUE, FALSE, 52100,
 '["News", "Liverpool", "Mohamed Salah", "Contract", "Premier League", "Free Agent"]',
 2, 1, 4);

-- Article 9: Preview — UCL Quarterfinals
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id) VALUES
('ucl-quarterfinals-preview-2025',
 'Champions League Quarter-Finals: Everything You Need to Know',
 'Real Madrid, Arsenal, Barcelona and Bayern Munich headline the last eight',
 'The Champions League quarter-final draw has produced mouth-watering ties as Europe''s elite prepare to battle for continental glory.',
 'The UEFA Champions League quarter-final draw has delivered a feast of footballing drama, with four blockbuster ties set to captivate audiences worldwide.

The standout fixture sees Arsenal pitted against Real Madrid in a repeat of their memorable encounters from previous rounds. The Gunners will look to prove they belong among Europe''s elite, while Madrid seek their record-extending 16th European Cup.

Barcelona face Bayern Munich in another heavyweight clash, with Robert Lewandowski set to face his former club. The Polish striker left Bayern for the Catalan giants in 2022 and will be desperate to knock out the team where he scored 344 goals.

Liverpool have been drawn against Inter Milan in a tie that evokes memories of the 2022 Champions League knockout rounds. The Reds will be buoyed by their strong domestic form but face a formidable Italian opponent.

Manchester City take on Juventus in the remaining tie, with Pep Guardiola''s men looking to bounce back from a disappointing league campaign by making another deep run in Europe.

All four ties promise tactical battles of the highest order, with some of the world''s best managers going head to head. The first legs are scheduled for early April.',
 'preview',
 '{"featured_image": "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800"}',
 'Emma Thompson', 'auth_003', '2025-03-15 12:00:00', 'published', TRUE, FALSE, 29800,
 '["Champions League", "UCL", "Quarter-Finals", "Preview", "Arsenal", "Real Madrid", "Barcelona", "Bayern Munich"]',
 NULL, 6);

-- Article 10: Transfer — Musiala Negotiations
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('musiala-man-city-120m-2025',
 'Manchester City Open Talks to Sign Jamal Musiala for €120M',
 'Citizens identify Bayern Munich star as De Bruyne''s long-term successor',
 'Manchester City have entered negotiations with Bayern Munich over a potential €120 million move for Jamal Musiala.',
 'Manchester City have opened negotiations with Bayern Munich over the transfer of Jamal Musiala, with sources indicating the Premier League club is willing to pay up to €120 million for the German international.

The 22-year-old has established himself as one of the most exciting young talents in world football, combining elegant dribbling with incisive passing and an eye for goal. City view him as the ideal long-term successor to Kevin De Bruyne, whose contract situation remains unresolved.

Bayern Munich are reluctant to sell but have not closed the door entirely, with the Bavarian club reportedly needing to balance their books following a significant summer spending spree. Musiala''s contract runs until 2026, giving Bayern limited time to negotiate before the player can begin talking to other clubs.

City''s interest in Musiala signals their intent to plan for the future despite continued success in the present. Pep Guardiola has long admired the former Chelsea academy product, having first noticed his talent during Bayern''s Champions League encounters with City.

If the deal goes through, it would represent one of the largest transfers in football history and would further cement the Premier League''s status as the destination of choice for the world''s best players.',
 'transfer',
 '{"featured_image": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800"}',
 'Michael Roberts', 'auth_004', '2025-03-18 14:30:00', 'published', FALSE, TRUE, 24600,
 '["Transfer News", "Manchester City", "Bayern Munich", "Jamal Musiala", "Negotiation"]',
 4, 1, 22);

-- Article 11: Opinion — Best XI
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id) VALUES
('premier-league-team-of-season-2025',
 'Premier League Team of the Season So Far',
 'Salah, Saka, and Haaland lead a star-studded lineup',
 'With the business end of the season approaching, we pick the best XI from the Premier League campaign so far.',
 'As the Premier League enters its final stretch, the individual performances across the campaign have been nothing short of spectacular. Here is our team of the season so far.

In goal, David Raya of Arsenal gets the nod for his consistency and his ability to play out from the back. His save percentage is the best in the league, and he has kept more clean sheets than any other goalkeeper.

The back four features Trent Alexander-Arnold, whose assists from right-back continue to break records, alongside William Saliba and Virgil van Dijk as an imperious centre-back pairing, and Gabriel at left centre-back for his dominant aerial presence.

Midfield is perhaps the most competitive area. Martin Ødegaard makes the cut for his creative genius, alongside Rodri for his metronome-like control and Bruno Fernandes for his relentless energy and goal contributions.

The front three picks itself: Bukayo Saka on the right, Erling Haaland through the middle, and Mohamed Salah on the left. Between them, they have contributed to over 60 goals this season.

It has been a season of exceptional quality, and choosing just eleven players from the wealth of talent on display was an enormously difficult task.',
 'opinion',
 '{"featured_image": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800"}',
 'James Anderson', 'auth_001', '2025-03-20 09:00:00', 'published', FALSE, FALSE, 18400,
 '["Opinion", "Premier League", "Team of the Season", "Best XI"]',
 NULL, 1);

-- Article 12: Breaking News — Injury Update
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('rodri-injury-update-man-city-2025',
 'Rodri Faces Extended Absence After ACL Surgery',
 'Manchester City midfielder expected to miss remainder of the season',
 'Manchester City midfielder Rodri has undergone successful ACL surgery and is expected to miss the remainder of the 2024/25 season.',
 'Manchester City have confirmed that midfielder Rodri has undergone successful surgery on a torn anterior cruciate ligament in his right knee and is expected to miss the remainder of the 2024/25 season.

The Ballon d''Or winner suffered the injury during City''s Premier League clash with Arsenal in September and has been sidelined since. The Spaniard''s absence has been keenly felt, with City dropping points at a rate not seen during the Guardiola era.

Pep Guardiola revealed that the rehabilitation timeline is approximately nine months, meaning Rodri could return for the early stages of the 2025/26 season. "We miss him every day," Guardiola said. "He is the best midfielder in the world and you cannot replace a player like that."

City''s form without Rodri has been a major talking point this season. The team has won just 58% of matches without him, compared to 82% with him in the side over the past three seasons.

The injury has also fueled speculation about City''s summer transfer plans, with reports suggesting they will target a world-class midfielder to provide cover. Barcelona''s Pedri and Benfica''s João Neves have both been linked.',
 'breaking',
 '{"featured_image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"}',
 'Sarah Mitchell', 'auth_002', '2025-01-05 19:45:00', 'published', FALSE, TRUE, 43700,
 '["Breaking News", "Manchester City", "Rodri", "Injury", "ACL", "Premier League"]',
 4, 1, 12);

-- Article 13: Interview — Arteta
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id) VALUES
('arteta-interview-title-belief-2025',
 'Mikel Arteta: "This Squad Believes It Can Win Everything"',
 'Arsenal manager opens up about title ambitions and the team''s growth',
 'In an exclusive interview, Arsenal manager Mikel Arteta discusses his squad''s mentality and their push for a first Premier League title in over 20 years.',
 'In a rare sit-down interview at Arsenal''s London Colney training ground, Mikel Arteta spoke with a quiet intensity about his team''s quest to end a title drought that stretches back to the 2003/04 Invincibles season.

"Two years ago, we were close. Last year, even closer. The pain of those near-misses has forged something in this group," Arteta said, leaning forward. "There is a belief in this dressing room that I have not seen before."

The Spaniard was keen to deflect attention away from himself, instead praising the collective spirit of his squad. "It is not about me. It is about Bukayo staying after training to work on his weaker foot. It is about Gabriel studying opponents on his day off. These small things add up to something big."

When asked about specific rivals, Arteta was diplomatic but firm. "Liverpool and Manchester City are exceptional teams with exceptional managers. But we do not fear anyone. We respect, yes, but fear? No."

The conversation turned to the summer transfer window, and Arteta hinted that Arsenal would be active. "We have identified areas where we can improve. The board is supportive. If opportunities arise that fit our model, we will act decisively."

As we wrapped up, Arteta offered a final thought that encapsulated his philosophy: "The process is important, but the process must end with trophies. We are ready."',
 'interview',
 '{"featured_image": "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800"}',
 'Emma Thompson', 'auth_003', '2025-03-05 10:00:00', 'published', FALSE, FALSE, 21500,
 '["Interview", "Arsenal", "Mikel Arteta", "Premier League", "Title Race"]',
 3, 1);

-- Article 14: Transfer — Araújo to Chelsea
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('araujo-chelsea-loan-2025',
 'Barcelona Agree to Loan Ronald Araújo to Chelsea',
 'Uruguayan defender heads to Stamford Bridge as Blues bolster backline',
 'FC Barcelona have agreed to loan defender Ronald Araújo to Chelsea for the remainder of the 2024/25 season.',
 'Chelsea have reached an agreement with FC Barcelona for the loan signing of centre-back Ronald Araújo until the end of the current season, subject to medical and personal terms.

The 25-year-old Uruguayan international has been seeking regular first-team football after falling down the pecking order at Camp Nou under manager Hansi Flick. Araújo started just eight La Liga matches this season, a far cry from the ever-present role he held in previous campaigns.

Chelsea manager Enzo Maresca identified defensive reinforcement as a priority this January, and Araújo fits the bill perfectly. The defender is known for his pace, aerial dominance, and aggressive tackling — qualities that suit the physical demands of the Premier League.

The loan does not include a buy option, with Barcelona keen to retain the long-term services of a player they consider part of their future. However, a strong showing at Chelsea could complicate any plans to reintegrate him into the squad.

Araújo becomes Chelsea''s second January signing and is expected to slot straight into the starting lineup alongside Wesley Fofana.',
 'transfer',
 '{"featured_image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800"}',
 'Michael Roberts', 'auth_004', '2025-01-28 17:00:00', 'published', FALSE, FALSE, 19800,
 '["Transfer News", "Chelsea", "Barcelona", "Ronald Araújo", "Loan", "January Window"]',
 5, 1, 18);

-- Article 15: News — De Bruyne future
INSERT INTO articles (slug, title, subtitle, excerpt, content, article_type, media, author_name, author_id, published_at, status, is_featured, is_breaking, view_count, tags, team_id, competition_id, person_id) VALUES
('de-bruyne-future-man-city-2025',
 'Kevin De Bruyne Linked with Barcelona as City Contract Winds Down',
 'Belgian maestro weighing options ahead of contract expiry',
 'Kevin De Bruyne''s future at Manchester City is increasingly uncertain as his contract enters its final year with interest from Barcelona.',
 'Kevin De Bruyne''s future at Manchester City has become the subject of intense speculation, with reports emerging that FC Barcelona have expressed strong interest in the Belgian playmaker.

The 33-year-old''s contract at the Etihad Stadium expires in June 2026, meaning this summer represents the last opportunity for City to command a significant transfer fee. De Bruyne has not yet committed to an extension, and his camp has reportedly held preliminary discussions with Barcelona.

De Bruyne has been one of the defining players of the Premier League era, recording 105 assists and 68 goals in 277 league appearances for City. His vision, passing range, and ability to produce match-winning moments have made him one of the greatest midfielders in the competition''s history.

However, recurring injuries over the past two seasons have raised questions about his long-term future at the highest level. De Bruyne himself has not ruled out a move, having previously spoken about the appeal of experiencing a different league.

Barcelona are rebuilding under Flick and see De Bruyne as a short-term solution to provide experience and creativity in midfield. The Catalan club''s financial situation would require a creative deal structure, possibly involving performance-based payments.

City, meanwhile, have begun planning for life after De Bruyne, with Jamal Musiala and several other young midfielders on their radar.',
 'news',
 '{"featured_image": "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800"}',
 'Sarah Mitchell', 'auth_002', '2025-03-22 13:00:00', 'published', FALSE, FALSE, 27300,
 '["News", "Manchester City", "Barcelona", "Kevin De Bruyne", "Transfer Rumor"]',
 4, 1, 11);


-- ============================================================
-- STEP 5: COMMENTS ON NEW ARTICLES
-- ============================================================
INSERT INTO comments (article_id, parent_id, user_id, user_name, content, status, likes_count) VALUES
-- Comments on Article 1 (Salah double)
(1, NULL, 'user_123', 'Arsenal_Fan_1886', 'What a performance! Salah is just unstoppable when he''s in that mood.', 'approved', 24),
(1, 1, 'user_456', 'Neutral_Observer', 'Agreed, that second goal was absolutely world class. Top 3 in the league.', 'approved', 8),
(1, NULL, 'user_789', 'City_Supporter', 'Fair play to both teams but we dominated possession. On another day we win that.', 'approved', 12),

-- Comments on Article 2 (Mbappé)
(2, NULL, 'user_234', 'MadridFanatic', 'FINALLY! Welcome to the greatest club in the world, Kylian!', 'approved', 156),
(2, NULL, 'user_567', 'LFC_Forever', 'Scary attack Madrid have now. Vinícius, Mbappé, Bellingham... unreal.', 'approved', 87),
(2, NULL, 'user_890', 'PSGUltra', 'Gutted. Merci for everything, Kylian. You gave us some unforgettable moments.', 'approved', 63),

-- Comments on Article 3 (Haaland rumor)
(3, NULL, 'user_111', 'TransferGuru', 'This would be absolutely insane. Madrid collecting players like Pokémon cards.', 'approved', 42),
(3, NULL, 'user_222', 'CityTilIDie', 'Not happening. Release clause or not, Haaland loves Manchester.', 'approved', 31),

-- Comments on Article 4 (TAA)
(4, NULL, 'user_333', 'KopEnd', 'Please no. Trent IS Liverpool. He can''t leave like this.', 'approved', 89),
(4, NULL, 'user_444', 'BernabeuDreams', 'Best right-back in the world coming to the best club. Makes sense.', 'approved', 54),

-- Comments on Article 5 (Arsenal vs City)
(5, NULL, 'user_555', 'Gooner4Life', 'THIS IS OUR YEAR! That Gabriel performance was immense!', 'approved', 67),
(5, NULL, 'user_666', 'BlueMoonRising', 'We''ll be back stronger. Missing Rodri is killing us.', 'approved', 28),

-- Comments on Article 7 (Rashford loan)
(7, NULL, 'user_777', 'RedDevil99', 'Sad to see him go but it''s for the best. Hope he smashes it at Dortmund.', 'approved', 44),
(7, NULL, 'user_888', 'BVBFan', 'Welcome to the Yellow Wall, Marcus! Dortmund loves English talent.', 'approved', 36),

-- Comments on Article 8 (Salah contract)
(8, NULL, 'user_999', 'AnfieldRoar', 'Just pay the man. He''s our best player. Whatever it takes.', 'approved', 102),
(8, NULL, 'user_112', 'FootballFan2025', 'He deserves the wages but Liverpool are right to be cautious at his age.', 'approved', 45);


-- ============================================================
-- DONE!
-- ============================================================
-- After running this, you should have:
--   • 25 transfers (historical + current rumors)
--   • 15 articles (match reports, transfers, features, etc.)
--   • 17 comments across the articles
-- ============================================================
