-- match info audit er jonno

CREATE TABLE IF NOT EXISTS match_audit (
    audit_id    SERIAL PRIMARY KEY,
    action      VARCHAR(10) NOT NULL,              
    match_id    INT,
    season_id   INT,
    home_team_id INT,
    away_team_id INT,
    home_score  SMALLINT,
    away_score  SMALLINT,
    status      VARCHAR(12),
    changed_by  VARCHAR(100),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_values  JSONB,                             
    new_values  JSONB                              
);



CREATE OR REPLACE FUNCTION fn_audit_match()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.home_team_id = NEW.away_team_id THEN
            RAISE EXCEPTION 'Home team and away team cannot be the same (team_id: %)', NEW.home_team_id
                USING ERRCODE = 'P0010';
        END IF;

        IF NEW.home_score IS NOT NULL AND NEW.home_score < 0 THEN
            RAISE EXCEPTION 'Home score cannot be negative' USING ERRCODE = 'P0011';
        END IF;
        IF NEW.away_score IS NOT NULL AND NEW.away_score < 0 THEN
            RAISE EXCEPTION 'Away score cannot be negative' USING ERRCODE = 'P0012';
        END IF;
        IF NEW.match_date > CURRENT_DATE + INTERVAL '1 year' THEN
            RAISE EXCEPTION 'Match date cannot be more than 1 year in the future' USING ERRCODE = 'P0013';
        END IF;
    END IF;

    -- ── Logging to shadow table ──
    IF TG_OP = 'INSERT' THEN
        INSERT INTO match_audit (action, match_id, season_id, home_team_id, away_team_id,home_score, away_score, status, new_values)
        VALUES ('INSERT', NEW.match_id, NEW.season_id, NEW.home_team_id, NEW.away_team_id,
        NEW.home_score, NEW.away_score, NEW.status,
        row_to_json(NEW)::JSONB);
        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO match_audit (action, match_id, season_id, home_team_id, away_team_id,
         home_score, away_score, status, old_values, new_values)
        VALUES ('UPDATE', NEW.match_id, NEW.season_id, NEW.home_team_id, NEW.away_team_id,NEW.home_score, NEW.away_score, NEW.status,row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB);
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO match_audit (action, match_id, season_id, home_team_id, away_team_id,home_score, away_score, status, old_values)
        VALUES ('DELETE', OLD.match_id, OLD.season_id, OLD.home_team_id, OLD.away_team_id,
                OLD.home_score, OLD.away_score, OLD.status,
                row_to_json(OLD)::JSONB);
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS trg_audit_match ON matches;

CREATE TRIGGER trg_audit_match
AFTER INSERT OR UPDATE OR DELETE ON matches
FOR EACH ROW
EXECUTE FUNCTION fn_audit_match();


-- function geting league stats for a seaosnn

CREATE OR REPLACE FUNCTION fn_get_league_stats(p_season_id INT)
RETURNS TABLE (
    season_name         VARCHAR,
    competition_name    VARCHAR,
    total_matches       BIGINT,
    finished_matches    BIGINT,
    total_goals         BIGINT,
    avg_goals_per_match NUMERIC,
    home_wins           BIGINT,
    away_wins           BIGINT,
    draws               BIGINT,
    home_win_pct        NUMERIC,
    away_win_pct        NUMERIC,
    draw_pct            NUMERIC,
    biggest_home_win    TEXT,
    biggest_away_win    TEXT,
    highest_scoring     TEXT,
    most_goals_team_name VARCHAR,
    most_goals_team_total BIGINT,
    most_wins_team_name  VARCHAR,
    most_wins_team_total BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH match_data AS (
        SELECT m.*,
               ht.name AS home_name, ht.short_name AS home_short,
               at2.name AS away_name, at2.short_name AS away_short
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.team_id
        JOIN teams at2 ON m.away_team_id = at2.team_id
        WHERE m.season_id = p_season_id
    ),
    finished AS (
        SELECT * FROM match_data WHERE status = 'finished'
    ),
    result_counts AS (
        SELECT
            COUNT(*) AS total_fin,
            SUM(COALESCE(home_score, 0) + COALESCE(away_score, 0)) AS total_g,
            COUNT(*) FILTER (WHERE home_score > away_score) AS hw,
            COUNT(*) FILTER (WHERE away_score > home_score) AS aw,
            COUNT(*) FILTER (WHERE home_score = away_score) AS dr
        FROM finished
    ),
    biggest_home AS (
        SELECT home_name || ' ' || home_score || '-' || away_score || ' ' || away_name AS result
        FROM finished
        WHERE home_score > away_score
        ORDER BY (home_score - away_score) DESC, home_score DESC
        LIMIT 1
    ),
    biggest_away AS (
        SELECT home_name || ' ' || home_score || '-' || away_score || ' ' || away_name AS result
        FROM finished
        WHERE away_score > home_score
        ORDER BY (away_score - home_score) DESC, away_score DESC
        LIMIT 1
    ),
    highest AS (
        SELECT home_name || ' ' || home_score || '-' || away_score || ' ' || away_name AS result
        FROM finished
        ORDER BY (home_score + away_score) DESC
        LIMIT 1
    ),
    team_goals AS (
        SELECT t.name AS tname, SUM(g) AS total_g
        FROM (
            SELECT home_team_id AS tid, COALESCE(home_score, 0) AS g FROM finished
            UNION ALL
            SELECT away_team_id AS tid, COALESCE(away_score, 0) AS g FROM finished
        ) sub
        JOIN teams t ON sub.tid = t.team_id
        GROUP BY t.name
        ORDER BY total_g DESC
        LIMIT 1
    ),
    team_wins AS (
        SELECT t.name AS tname, COUNT(*) AS total_w
        FROM (
            SELECT home_team_id AS tid FROM finished WHERE home_score > away_score
            UNION ALL
            SELECT away_team_id AS tid FROM finished WHERE away_score > home_score
        ) sub
        JOIN teams t ON sub.tid = t.team_id
        GROUP BY t.name
        ORDER BY total_w DESC
        LIMIT 1
    ),
    season_info AS (
        SELECT s.name AS sname, comp.name AS cname
        FROM seasons s
        JOIN competitions comp ON s.competition_id = comp.competition_id
        WHERE s.season_id = p_season_id
    )
    SELECT
        si.sname::VARCHAR,
        si.cname::VARCHAR,
        (SELECT COUNT(*) FROM match_data)::BIGINT,
        rc.total_fin::BIGINT,
        COALESCE(rc.total_g, 0)::BIGINT,
        CASE WHEN rc.total_fin > 0
             THEN ROUND(rc.total_g::NUMERIC / rc.total_fin, 2)
             ELSE 0 END,
        rc.hw::BIGINT,
        rc.aw::BIGINT,
        rc.dr::BIGINT,
        CASE WHEN rc.total_fin > 0
             THEN ROUND(rc.hw::NUMERIC / rc.total_fin * 100, 1)
             ELSE 0 END,
        CASE WHEN rc.total_fin > 0
             THEN ROUND(rc.aw::NUMERIC / rc.total_fin * 100, 1)
             ELSE 0 END,
        CASE WHEN rc.total_fin > 0
             THEN ROUND(rc.dr::NUMERIC / rc.total_fin * 100, 1)
             ELSE 0 END,
        COALESCE((SELECT result FROM biggest_home), 'N/A')::TEXT,
        COALESCE((SELECT result FROM biggest_away), 'N/A')::TEXT,
        COALESCE((SELECT result FROM highest), 'N/A')::TEXT,
        COALESCE((SELECT tname FROM team_goals), 'N/A')::VARCHAR,
        COALESCE((SELECT total_g FROM team_goals), 0)::BIGINT,
        COALESCE((SELECT tname FROM team_wins), 'N/A')::VARCHAR,
        COALESCE((SELECT total_w FROM team_wins), 0)::BIGINT
    FROM season_info si, result_counts rc;
END;
$$ LANGUAGE plpgsql;

-- procedure for getting the match resut of a new match event

CREATE OR REPLACE PROCEDURE sp_record_match_result(
    p_match_id    INT,
    p_home_score  SMALLINT,
    p_away_score  SMALLINT,
    p_attendance  INT DEFAULT NULL,
    p_home_formation VARCHAR(10) DEFAULT NULL,
    p_away_formation VARCHAR(10) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_season_id     INT;
    v_home_team_id  INT;
    v_away_team_id  INT;
    v_current_status VARCHAR(12);
    v_home_manager_contract INT;
    v_away_manager_contract INT;
BEGIN
    -- first we are checking the validation for the matchhh
    SELECT season_id, home_team_id, away_team_id, status
    INTO v_season_id, v_home_team_id, v_away_team_id, v_current_status
    FROM matches WHERE match_id = p_match_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Match not found (match_id: %)', p_match_id USING ERRCODE = 'P0020';
    END IF;

    IF v_current_status = 'finished' THEN
        RAISE EXCEPTION 'Match already finished (match_id: %)', p_match_id USING ERRCODE = 'P0021';
    END IF;

    IF v_current_status = 'cancelled' THEN
        RAISE EXCEPTION 'Cannot record result for cancelled match' USING ERRCODE = 'P0022';
    END IF;

    -- Update the match with final score
    UPDATE matches
    SET home_score = p_home_score,
        away_score = p_away_score,
        status = 'finished',
        attendance = COALESCE(p_attendance, attendance),
        home_formation = COALESCE(p_home_formation, home_formation),
        away_formation = COALESCE(p_away_formation, away_formation)
    WHERE match_id = p_match_id;

    --- ebar standing updation

    -- home teamm
    IF p_home_score > p_away_score THEN
        -- home team wins
        UPDATE standings
        SET played = played + 1, won = won + 1,
            goals_for = goals_for + p_home_score,
            goals_against = goals_against + p_away_score,
            points = points + 3
        WHERE season_id = v_season_id AND team_id = v_home_team_id;
    ELSIF p_home_score = p_away_score THEN
        -- deaw
        UPDATE standings
        SET played = played + 1, drawn = drawn + 1,
            goals_for = goals_for + p_home_score,
            goals_against = goals_against + p_away_score,
            points = points + 1
        WHERE season_id = v_season_id AND team_id = v_home_team_id;
    ELSE
        -- home team  loss
        UPDATE standings
        SET played = played + 1, lost = lost + 1,
            goals_for = goals_for + p_home_score,
            goals_against = goals_against + p_away_score
        WHERE season_id = v_season_id AND team_id = v_home_team_id;
    END IF;

    -- same for awayyy
    IF p_away_score > p_home_score THEN
        -- Away win
        UPDATE standings
        SET played = played + 1, won = won + 1,
            goals_for = goals_for + p_away_score,
            goals_against = goals_against + p_home_score,
            points = points + 3
        WHERE season_id = v_season_id AND team_id = v_away_team_id;
    ELSIF p_away_score = p_home_score THEN
        -- Draw
        UPDATE standings
        SET played = played + 1, drawn = drawn + 1,
            goals_for = goals_for + p_away_score,
            goals_against = goals_against + p_home_score,
            points = points + 1
        WHERE season_id = v_season_id AND team_id = v_away_team_id;
    ELSE
        -- Away loss
        UPDATE standings
        SET played = played + 1, lost = lost + 1,
            goals_for = goals_for + p_away_score,
            goals_against = goals_against + p_home_score
        WHERE season_id = v_season_id AND team_id = v_away_team_id;
    END IF;

    SELECT contract_id INTO v_home_manager_contract
    FROM contracts
    WHERE team_id = v_home_team_id AND contract_type = 'manager' AND is_current = true
    LIMIT 1;

    IF v_home_manager_contract IS NOT NULL THEN
        UPDATE contracts
        SET matches_managed = matches_managed + 1,
            wins = wins + CASE WHEN p_home_score > p_away_score THEN 1 ELSE 0 END,
            draws = draws + CASE WHEN p_home_score = p_away_score THEN 1 ELSE 0 END,
            losses = losses + CASE WHEN p_home_score < p_away_score THEN 1 ELSE 0 END
        WHERE contract_id = v_home_manager_contract;
    END IF;

    -- Find current manager contract for away team
    SELECT contract_id INTO v_away_manager_contract
    FROM contracts
    WHERE team_id = v_away_team_id AND contract_type = 'manager' AND is_current = true
    LIMIT 1;

    IF v_away_manager_contract IS NOT NULL THEN
        UPDATE contracts
        SET matches_managed = matches_managed + 1,
            wins = wins + CASE WHEN p_away_score > p_home_score THEN 1 ELSE 0 END,
            draws = draws + CASE WHEN p_away_score = p_home_score THEN 1 ELSE 0 END,
            losses = losses + CASE WHEN p_away_score < p_home_score THEN 1 ELSE 0 END
        WHERE contract_id = v_away_manager_contract;
    END IF;
END;
$$;


-- get team for the last 5 matches heh..

CREATE OR REPLACE FUNCTION fn_get_team_form(p_team_id INT, p_limit INT DEFAULT 5)
RETURNS TABLE (
    match_id        INT,
    match_date      DATE,
    opponent_name   VARCHAR,
    home_or_away    TEXT,
    goals_for       SMALLINT,
    goals_against   SMALLINT,
    result          CHAR(1)         -- 'W', 'D', 'L'
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.match_id,
        m.match_date,
        CASE
            WHEN m.home_team_id = p_team_id THEN at2.name
            ELSE ht.name
        END::VARCHAR AS opponent_name,
        CASE
            WHEN m.home_team_id = p_team_id THEN 'home'
            ELSE 'away'
        END AS home_or_away,
        CASE
            WHEN m.home_team_id = p_team_id THEN m.home_score
            ELSE m.away_score
        END AS goals_for,
        CASE
            WHEN m.home_team_id = p_team_id THEN m.away_score
            ELSE m.home_score
        END AS goals_against,
        CASE
            WHEN m.home_team_id = p_team_id AND m.home_score > m.away_score THEN 'W'
            WHEN m.away_team_id = p_team_id AND m.away_score > m.home_score THEN 'W'
            WHEN m.home_score = m.away_score THEN 'D'
            ELSE 'L'
        END::CHAR(1) AS result
    FROM matches m
    JOIN teams ht ON m.home_team_id = ht.team_id
    JOIN teams at2 ON m.away_team_id = at2.team_id
    WHERE (m.home_team_id = p_team_id OR m.away_team_id = p_team_id)
      AND m.status = 'finished'
    ORDER BY m.match_date DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;