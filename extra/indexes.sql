
-- Run after schema.sql: npm run db:indexes

CREATE INDEX IF NOT EXISTS idx_matches_season ON matches(season_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_home_team ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team ON matches(away_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

CREATE INDEX IF NOT EXISTS idx_match_events_match ON match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_match_events_type ON match_events(event_type);
CREATE INDEX IF NOT EXISTS idx_match_players_match ON match_players(match_id);

CREATE INDEX IF NOT EXISTS idx_standings_season ON standings(season_id);
CREATE INDEX IF NOT EXISTS idx_contracts_person ON contracts(person_id);
CREATE INDEX IF NOT EXISTS idx_contracts_team ON contracts(team_id);
CREATE INDEX IF NOT EXISTS idx_contracts_current ON contracts(is_current);

CREATE INDEX IF NOT EXISTS idx_transfers_person ON transfers(person_id);
CREATE INDEX IF NOT EXISTS idx_transfers_date ON transfers(transfer_date);

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_team ON articles(team_id);

CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_teams_country ON teams(country_id);
CREATE INDEX IF NOT EXISTS idx_persons_nationality ON persons(nationality_id);
CREATE INDEX IF NOT EXISTS idx_persons_type ON persons(person_type);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
