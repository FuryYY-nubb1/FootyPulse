
-- FOOTYPULSE DATABASE SCHEMA
-- Run this in your Neon DB SQL editor or via: npm run db:schema

-- Users table (for authentication - not in original schema but needed for auth)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. countries
CREATE TABLE IF NOT EXISTS countries (
    country_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code CHAR(3) NOT NULL UNIQUE,
    flag_url VARCHAR(255),
    confederation VARCHAR(20) CHECK (confederation IN ('UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'))
);

-- 2. stadiums
CREATE TABLE IF NOT EXISTS stadiums (
    stadium_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100),
    country_id INT NOT NULL REFERENCES countries(country_id),
    capacity INT,
    opened_year INT,
    surface_type VARCHAR(50)
);

-- 3. teams
CREATE TABLE IF NOT EXISTS teams (
    team_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    short_name VARCHAR(50),
    team_type VARCHAR(10) NOT NULL CHECK (team_type IN ('club', 'national')),
    country_id INT NOT NULL REFERENCES countries(country_id),
    city VARCHAR(100),
    stadium_id INT REFERENCES stadiums(stadium_id),
    founded_year INT,
    logo_url VARCHAR(255),
    primary_color VARCHAR(7),
    national_team_level VARCHAR(15) CHECK (national_team_level IN ('senior_men', 'senior_women', 'u21', 'u19', 'u17')),
    fifa_ranking INT,
    CONSTRAINT chk_national_level CHECK (
        (team_type = 'national' AND national_team_level IS NOT NULL) OR
        (team_type = 'club' AND national_team_level IS NULL)
    )
);

-- 4. competitions
CREATE TABLE IF NOT EXISTS competitions (
    competition_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    short_name VARCHAR(30),
    competition_type VARCHAR(25) NOT NULL CHECK (competition_type IN ('league', 'cup', 'international')),
    country_id INT REFERENCES countries(country_id),
    level INT DEFAULT 1,
    season_format VARCHAR(20) CHECK (season_format IN ('league', 'knockout', 'group_knockout')),
    logo_url VARCHAR(255)
);

-- 5. seasons
CREATE TABLE IF NOT EXISTS seasons (
    season_id SERIAL PRIMARY KEY,
    competition_id INT NOT NULL REFERENCES competitions(competition_id),
    name VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    stages JSONB DEFAULT '[]',
    UNIQUE(competition_id, name)
);

-- 6. persons
CREATE TABLE IF NOT EXISTS persons (
    person_id SERIAL PRIMARY KEY,
    person_type VARCHAR(10) NOT NULL CHECK (person_type IN ('player', 'manager', 'referee')),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    date_of_birth DATE,
    nationality_id INT REFERENCES countries(country_id),
    photo_url VARCHAR(255),
    height_cm INT,
    preferred_foot VARCHAR(5) CHECK (preferred_foot IN ('left', 'right', 'both')),
    primary_position VARCHAR(3) CHECK (primary_position IN ('GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST')),
    market_value DECIMAL(12,2),
    preferred_formation VARCHAR(10)
);

-- 7. contracts
CREATE TABLE IF NOT EXISTS contracts (
    contract_id SERIAL PRIMARY KEY,
    person_id INT NOT NULL REFERENCES persons(person_id),
    team_id INT NOT NULL REFERENCES teams(team_id),
    contract_type VARCHAR(10) NOT NULL CHECK (contract_type IN ('player', 'manager', 'loan')),
    start_date DATE NOT NULL,
    end_date DATE,
    jersey_number SMALLINT,
    is_current BOOLEAN DEFAULT FALSE,
    parent_club_id INT REFERENCES teams(team_id),
    matches_managed INT DEFAULT 0,
    wins INT DEFAULT 0,
    draws INT DEFAULT 0,
    losses INT DEFAULT 0,
    CONSTRAINT chk_loan CHECK (
        (contract_type = 'loan' AND parent_club_id IS NOT NULL) OR
        (contract_type != 'loan' AND parent_club_id IS NULL)
    )
);

-- 8. matches
CREATE TABLE IF NOT EXISTS matches (
    match_id SERIAL PRIMARY KEY,
    season_id INT NOT NULL REFERENCES seasons(season_id),
    stage_name VARCHAR(50),
    group_name VARCHAR(10),
    matchday INT,
    home_team_id INT NOT NULL REFERENCES teams(team_id),
    away_team_id INT NOT NULL REFERENCES teams(team_id),
    home_score SMALLINT,
    away_score SMALLINT,
    home_penalties SMALLINT,
    away_penalties SMALLINT,
    match_date DATE NOT NULL,
    kick_off_time TIME,
    stadium_id INT REFERENCES stadiums(stadium_id),
    referee_id INT REFERENCES persons(person_id),
    status VARCHAR(12) NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'live', 'finished', 'postponed', 'cancelled')),
    attendance INT,
    home_formation VARCHAR(10),
    away_formation VARCHAR(10),
    home_stats JSONB,
    away_stats JSONB,
    CONSTRAINT chk_different_teams CHECK (home_team_id != away_team_id)
);

-- 9. match_players
CREATE TABLE IF NOT EXISTS match_players (
    match_player_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL REFERENCES matches(match_id) ON DELETE CASCADE,
    person_id INT NOT NULL REFERENCES persons(person_id),
    team_id INT NOT NULL REFERENCES teams(team_id),
    is_starter BOOLEAN NOT NULL DEFAULT FALSE,
    position VARCHAR(3),
    jersey_number SMALLINT,
    minute_in SMALLINT,
    minute_out SMALLINT,
    stats JSONB,
    UNIQUE(match_id, person_id)
);

-- 10. match_events
CREATE TABLE IF NOT EXISTS match_events (
    event_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL REFERENCES matches(match_id) ON DELETE CASCADE,
    event_type VARCHAR(15) NOT NULL
        CHECK (event_type IN ('goal', 'own_goal', 'penalty', 'penalty_miss',
                              'yellow', 'red', 'second_yellow', 'var', 'sub')),
    team_id INT NOT NULL REFERENCES teams(team_id),
    person_id INT REFERENCES persons(person_id),
    related_person_id INT REFERENCES persons(person_id),
    minute SMALLINT NOT NULL,
    added_time SMALLINT,
    description VARCHAR(200)
);

-- 11. standings
CREATE TABLE IF NOT EXISTS standings (
    standing_id SERIAL PRIMARY KEY,
    season_id INT NOT NULL REFERENCES seasons(season_id),
    group_name VARCHAR(10),
    team_id INT NOT NULL REFERENCES teams(team_id),
    position SMALLINT NOT NULL,
    played SMALLINT DEFAULT 0,
    won SMALLINT DEFAULT 0,
    drawn SMALLINT DEFAULT 0,
    lost SMALLINT DEFAULT 0,
    goals_for SMALLINT DEFAULT 0,
    goals_against SMALLINT DEFAULT 0,
    goal_difference SMALLINT GENERATED ALWAYS AS (goals_for - goals_against) STORED,
    points SMALLINT DEFAULT 0,
    form VARCHAR(5),
    UNIQUE(season_id, group_name, team_id)
);

-- 12. transfers
CREATE TABLE IF NOT EXISTS transfers (
    transfer_id SERIAL PRIMARY KEY,
    person_id INT NOT NULL REFERENCES persons(person_id),
    from_team_id INT REFERENCES teams(team_id),
    to_team_id INT NOT NULL REFERENCES teams(team_id),
    transfer_type VARCHAR(15) NOT NULL
        CHECK (transfer_type IN ('permanent', 'loan', 'loan_return', 'free', 'youth')),
    status VARCHAR(12) NOT NULL DEFAULT 'official'
        CHECK (status IN ('rumor', 'negotiating', 'agreed', 'official', 'cancelled')),
    fee DECIMAL(12,2),
    fee_currency CHAR(3) DEFAULT 'EUR',
    transfer_date DATE,
    window_year SMALLINT,
    window_type VARCHAR(6) CHECK (window_type IN ('summer', 'winter'))
);

-- 13. achievements
CREATE TABLE IF NOT EXISTS achievements (
    achievement_id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(team_id),
    person_id INT REFERENCES persons(person_id),
    achievement_type VARCHAR(20) NOT NULL
        CHECK (achievement_type IN (
            'league_title', 'cup_winner', 'cup_finalist',
            'continental_winner', 'continental_finalist',
            'supercup', 'world_club', 'promotion', 'shield',
            'golden_boot', 'golden_ball', 'golden_glove',
            'player_of_season', 'player_of_month', 'player_of_week',
            'young_player', 'top_scorer', 'top_assists',
            'ballon_dor', 'fifa_best', 'puskas',
            'manager_of_season', 'manager_of_month',
            'record', 'milestone', 'hall_of_fame'
        )),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    competition_id INT REFERENCES competitions(competition_id),
    season_id INT REFERENCES seasons(season_id),
    year SMALLINT NOT NULL,
    month SMALLINT,
    position SMALLINT DEFAULT 1,
    stats JSONB,
    image_url VARCHAR(255),
    is_major BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_recipient CHECK (
        (team_id IS NOT NULL AND person_id IS NULL) OR
        (team_id IS NULL AND person_id IS NOT NULL)
    )
);

-- 14. articles
CREATE TABLE IF NOT EXISTS articles (
    article_id SERIAL PRIMARY KEY,
    slug VARCHAR(300) NOT NULL UNIQUE,
    title VARCHAR(250) NOT NULL,
    subtitle VARCHAR(400),
    excerpt VARCHAR(500),
    content TEXT NOT NULL,
    article_type VARCHAR(15) NOT NULL DEFAULT 'news'
        CHECK (article_type IN ('news', 'match_report', 'transfer', 'feature',
                                'opinion', 'interview', 'preview', 'breaking')),
    media JSONB DEFAULT '{}',
    author_name VARCHAR(100) NOT NULL,
    author_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    status VARCHAR(10) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_breaking BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    tags JSONB DEFAULT '[]',
    team_id INT REFERENCES teams(team_id),
    competition_id INT REFERENCES competitions(competition_id),
    person_id INT REFERENCES persons(person_id),
    match_id INT REFERENCES matches(match_id),
    meta_description VARCHAR(160)
);

-- 15. comments
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    parent_id INT REFERENCES comments(comment_id) ON DELETE CASCADE,
    user_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(80) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'approved'
        CHECK (status IN ('pending', 'approved', 'flagged', 'deleted')),
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. polls
CREATE TABLE IF NOT EXISTS polls (
    poll_id SERIAL PRIMARY KEY,
    question VARCHAR(300) NOT NULL,
    description TEXT,
    poll_type VARCHAR(15) NOT NULL DEFAULT 'single'
        CHECK (poll_type IN ('single', 'multiple', 'rating', 'prediction')),
    options JSONB NOT NULL,
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(10) NOT NULL DEFAULT 'active'
        CHECK (status IN ('draft', 'active', 'closed', 'archived')),
    total_votes INT DEFAULT 0,
    results JSONB DEFAULT '{}',
    team_id INT REFERENCES teams(team_id),
    competition_id INT REFERENCES competitions(competition_id),
    person_id INT REFERENCES persons(person_id),
    match_id INT REFERENCES matches(match_id),
    article_id INT REFERENCES articles(article_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    featured BOOLEAN DEFAULT FALSE
);

-- 17. poll_votes
CREATE TABLE IF NOT EXISTS poll_votes (
    vote_id SERIAL PRIMARY KEY,
    poll_id INT NOT NULL REFERENCES polls(poll_id) ON DELETE CASCADE,
    user_id VARCHAR(50) NOT NULL,
    selected_options JSONB NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_hash VARCHAR(64),
    UNIQUE(poll_id, user_id)
);
