-- ============================================================================
-- FOOTYPULSE — Article & Competition Migration
-- ============================================================================
-- Adds: shadow tables, triggers, functions, procedures for articles & competitions
-- Run this AFTER schema.sql and match_leagues.sql
--
-- COVERS:
--   3. Explicit Transaction Control  → used in articleModel.js, competitionModel.js
--   4. Trigger                       → trg_audit_article (logs article DML to shadow table)
--                                    → trg_validate_competition (validates competition DML)
--   5. Function                      → fn_get_article_stats (article analytics per competition/team)
--                                    → fn_get_competition_overview (full competition summary)
--   6. Procedure                     → sp_publish_article (multi-step article publish workflow)
--                                    → sp_setup_competition_season (create season + standings)
--   7. Complex Queries               → demonstrated in controller endpoints
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  1. SHADOW TABLE — Audit log for article changes                       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS article_audit (
    audit_id     SERIAL PRIMARY KEY,
    action       VARCHAR(10) NOT NULL,              -- 'INSERT', 'UPDATE', 'DELETE'
    article_id   INT,
    slug         VARCHAR(300),
    title        VARCHAR(250),
    status       VARCHAR(10),
    author_name  VARCHAR(100),
    author_id    VARCHAR(50),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_values   JSONB,                             -- previous row data (UPDATE/DELETE)
    new_values   JSONB                              -- new row data (INSERT/UPDATE)
);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  2. TRIGGER — trg_audit_article                                        ║
-- ║     Validates articles before INSERT/UPDATE and logs all changes        ║
-- ║     to the article_audit shadow table.                                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION fn_audit_article()
RETURNS TRIGGER AS $$
BEGIN
    -- ── Data validation BEFORE insert/update ──
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Validate: title cannot be empty
        IF NEW.title IS NULL OR TRIM(NEW.title) = '' THEN
            RAISE EXCEPTION 'Article title cannot be empty' USING ERRCODE = 'P0030';
        END IF;

        -- Validate: content cannot be empty
        IF NEW.content IS NULL OR TRIM(NEW.content) = '' THEN
            RAISE EXCEPTION 'Article content cannot be empty' USING ERRCODE = 'P0031';
        END IF;

        -- Validate: published articles must have a published_at timestamp
        IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
            NEW.published_at := CURRENT_TIMESTAMP;
        END IF;

        -- Validate: view_count cannot be negative
        IF NEW.view_count < 0 THEN
            RAISE EXCEPTION 'Article view_count cannot be negative' USING ERRCODE = 'P0032';
        END IF;
    END IF;

    -- ── Logging to shadow table ──
    IF TG_OP = 'INSERT' THEN
        INSERT INTO article_audit (action, article_id, slug, title, status, author_name, author_id, new_values)
        VALUES ('INSERT', NEW.article_id, NEW.slug, NEW.title, NEW.status, NEW.author_name, NEW.author_id,
                json_build_object(
                    'article_id', NEW.article_id, 'slug', NEW.slug, 'title', NEW.title,
                    'article_type', NEW.article_type, 'status', NEW.status,
                    'is_featured', NEW.is_featured, 'is_breaking', NEW.is_breaking,
                    'team_id', NEW.team_id, 'competition_id', NEW.competition_id
                )::JSONB);
        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO article_audit (action, article_id, slug, title, status, author_name, author_id, old_values, new_values)
        VALUES ('UPDATE', NEW.article_id, NEW.slug, NEW.title, NEW.status, NEW.author_name, NEW.author_id,
                json_build_object(
                    'title', OLD.title, 'status', OLD.status, 'is_featured', OLD.is_featured,
                    'is_breaking', OLD.is_breaking, 'view_count', OLD.view_count
                )::JSONB,
                json_build_object(
                    'title', NEW.title, 'status', NEW.status, 'is_featured', NEW.is_featured,
                    'is_breaking', NEW.is_breaking, 'view_count', NEW.view_count
                )::JSONB);
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO article_audit (action, article_id, slug, title, status, author_name, author_id, old_values)
        VALUES ('DELETE', OLD.article_id, OLD.slug, OLD.title, OLD.status, OLD.author_name, OLD.author_id,
                json_build_object(
                    'article_id', OLD.article_id, 'slug', OLD.slug, 'title', OLD.title,
                    'article_type', OLD.article_type, 'status', OLD.status
                )::JSONB);
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_article ON articles;

CREATE TRIGGER trg_audit_article
AFTER INSERT OR UPDATE OR DELETE ON articles
FOR EACH ROW
EXECUTE FUNCTION fn_audit_article();


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  3. TRIGGER — trg_validate_competition                                 ║
-- ║     Validates competition data before INSERT/UPDATE and logs changes    ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS competition_audit (
    audit_id       SERIAL PRIMARY KEY,
    action         VARCHAR(10) NOT NULL,
    competition_id INT,
    name           VARCHAR(150),
    competition_type VARCHAR(25),
    performed_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_values     JSONB,
    new_values     JSONB
);

CREATE OR REPLACE FUNCTION fn_audit_competition()
RETURNS TRIGGER AS $$
BEGIN
    -- ── Data validation ──
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Validate: name cannot be empty
        IF NEW.name IS NULL OR TRIM(NEW.name) = '' THEN
            RAISE EXCEPTION 'Competition name cannot be empty' USING ERRCODE = 'P0040';
        END IF;

        -- Validate: international competitions should not have a country
        IF NEW.competition_type = 'international' AND NEW.country_id IS NOT NULL THEN
            -- Auto-fix: set country_id to NULL for international competitions
            NEW.country_id := NULL;
        END IF;
    END IF;

    -- ── Logging to shadow table ──
    IF TG_OP = 'INSERT' THEN
        INSERT INTO competition_audit (action, competition_id, name, competition_type, new_values)
        VALUES ('INSERT', NEW.competition_id, NEW.name, NEW.competition_type,
                row_to_json(NEW)::JSONB);
        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO competition_audit (action, competition_id, name, competition_type, old_values, new_values)
        VALUES ('UPDATE', NEW.competition_id, NEW.name, NEW.competition_type,
                row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB);
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO competition_audit (action, competition_id, name, competition_type, old_values)
        VALUES ('DELETE', OLD.competition_id, OLD.name, OLD.competition_type,
                row_to_json(OLD)::JSONB);
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_competition ON competitions;

CREATE TRIGGER trg_audit_competition
AFTER INSERT OR UPDATE OR DELETE ON competitions
FOR EACH ROW
EXECUTE FUNCTION fn_audit_competition();


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  4. FUNCTION — fn_get_article_stats                                    ║
-- ║     Returns computed article statistics:                               ║
-- ║     total articles, total views, avg views, by type breakdown,         ║
-- ║     most viewed article, top author, articles per competition          ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION fn_get_article_stats(
    p_competition_id INT DEFAULT NULL,
    p_team_id INT DEFAULT NULL
)
RETURNS TABLE (
    total_articles      BIGINT,
    published_articles  BIGINT,
    total_views         BIGINT,
    avg_views           NUMERIC,
    total_comments      BIGINT,
    avg_comments        NUMERIC,
    news_count          BIGINT,
    match_report_count  BIGINT,
    transfer_count      BIGINT,
    feature_count       BIGINT,
    opinion_count       BIGINT,
    interview_count     BIGINT,
    most_viewed_title   VARCHAR,
    most_viewed_views   INT,
    top_author_name     VARCHAR,
    top_author_articles BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered AS (
        SELECT a.*
        FROM articles a
        WHERE a.status = 'published'
          AND (p_competition_id IS NULL OR a.competition_id = p_competition_id)
          AND (p_team_id IS NULL OR a.team_id = p_team_id)
    ),
    counts AS (
        SELECT
            COUNT(*) AS total_a,
            COUNT(*) FILTER (WHERE status = 'published') AS pub_a,
            COALESCE(SUM(view_count), 0) AS total_v,
            CASE WHEN COUNT(*) > 0
                 THEN ROUND(SUM(view_count)::NUMERIC / COUNT(*), 1)
                 ELSE 0 END AS avg_v,
            COALESCE(SUM(comment_count), 0) AS total_c,
            CASE WHEN COUNT(*) > 0
                 THEN ROUND(SUM(comment_count)::NUMERIC / COUNT(*), 1)
                 ELSE 0 END AS avg_c,
            COUNT(*) FILTER (WHERE article_type = 'news') AS n_count,
            COUNT(*) FILTER (WHERE article_type = 'match_report') AS mr_count,
            COUNT(*) FILTER (WHERE article_type = 'transfer') AS t_count,
            COUNT(*) FILTER (WHERE article_type = 'feature') AS f_count,
            COUNT(*) FILTER (WHERE article_type = 'opinion') AS o_count,
            COUNT(*) FILTER (WHERE article_type = 'interview') AS i_count
        FROM filtered
    ),
    most_viewed AS (
        SELECT title, view_count
        FROM filtered
        ORDER BY view_count DESC
        LIMIT 1
    ),
    top_author AS (
        SELECT author_name, COUNT(*) AS article_count
        FROM filtered
        GROUP BY author_name
        ORDER BY article_count DESC
        LIMIT 1
    )
    SELECT
        c.total_a,
        c.pub_a,
        c.total_v,
        c.avg_v,
        c.total_c,
        c.avg_c,
        c.n_count,
        c.mr_count,
        c.t_count,
        c.f_count,
        c.o_count,
        c.i_count,
        COALESCE(mv.title, 'N/A')::VARCHAR,
        COALESCE(mv.view_count, 0),
        COALESCE(ta.author_name, 'N/A')::VARCHAR,
        COALESCE(ta.article_count, 0)::BIGINT
    FROM counts c
    LEFT JOIN most_viewed mv ON true
    LEFT JOIN top_author ta ON true;
END;
$$ LANGUAGE plpgsql;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  5. FUNCTION — fn_get_competition_overview                             ║
-- ║     Returns a comprehensive overview of a competition:                 ║
-- ║     total seasons, total teams, total matches, current season info,    ║
-- ║     article count, top scoring team                                    ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION fn_get_competition_overview(p_competition_id INT)
RETURNS TABLE (
    competition_name     VARCHAR,
    competition_type     VARCHAR,
    country_name         VARCHAR,
    total_seasons        BIGINT,
    current_season_name  VARCHAR,
    current_season_id    INT,
    total_teams_current  BIGINT,
    total_matches_current BIGINT,
    finished_matches     BIGINT,
    total_goals          BIGINT,
    total_articles       BIGINT,
    leader_team_name     VARCHAR,
    leader_points        SMALLINT
) AS $$
BEGIN
    RETURN QUERY
    WITH comp_info AS (
        SELECT comp.name AS cname, comp.competition_type AS ctype,
               COALESCE(c.name, 'International') AS country
        FROM competitions comp
        LEFT JOIN countries c ON comp.country_id = c.country_id
        WHERE comp.competition_id = p_competition_id
    ),
    season_data AS (
        SELECT COUNT(*) AS total_s,
               MAX(CASE WHEN is_current THEN name END)::VARCHAR AS curr_name,
               MAX(CASE WHEN is_current THEN season_id END) AS curr_id
        FROM seasons WHERE competition_id = p_competition_id
    ),
    current_teams AS (
        SELECT COUNT(DISTINCT st.team_id) AS team_count
        FROM standings st
        JOIN seasons s ON st.season_id = s.season_id
        WHERE s.competition_id = p_competition_id AND s.is_current = true
    ),
    current_matches AS (
        SELECT COUNT(*) AS total_m,
               COUNT(*) FILTER (WHERE m.status = 'finished') AS fin_m,
               COALESCE(SUM(COALESCE(m.home_score, 0) + COALESCE(m.away_score, 0))
                   FILTER (WHERE m.status = 'finished'), 0) AS total_g
        FROM matches m
        JOIN seasons s ON m.season_id = s.season_id
        WHERE s.competition_id = p_competition_id AND s.is_current = true
    ),
    article_count AS (
        SELECT COUNT(*) AS art_count
        FROM articles
        WHERE competition_id = p_competition_id AND status = 'published'
    ),
    leader AS (
        SELECT t.name AS tname, st.points
        FROM standings st
        JOIN teams t ON st.team_id = t.team_id
        JOIN seasons s ON st.season_id = s.season_id
        WHERE s.competition_id = p_competition_id AND s.is_current = true
        ORDER BY st.points DESC, (st.goals_for - st.goals_against) DESC
        LIMIT 1
    )
    SELECT
        ci.cname::VARCHAR,
        ci.ctype::VARCHAR,
        ci.country::VARCHAR,
        sd.total_s,
        COALESCE(sd.curr_name, 'N/A')::VARCHAR,
        sd.curr_id,
        ct.team_count,
        cm.total_m,
        cm.fin_m,
        cm.total_g,
        ac.art_count,
        COALESCE(l.tname, 'N/A')::VARCHAR,
        COALESCE(l.points, 0)::SMALLINT
    FROM comp_info ci, season_data sd, current_teams ct,
         current_matches cm, article_count ac
    LEFT JOIN leader l ON true;
END;
$$ LANGUAGE plpgsql;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  6. PROCEDURE — sp_publish_article                                     ║
-- ║     Multi-step workflow that:                                          ║
-- ║       Step 1: Validates the article exists and is in draft status      ║
-- ║       Step 2: Updates article status to 'published', sets timestamp    ║
-- ║       Step 3: If is_breaking, un-break all other breaking articles     ║
-- ║       Step 4: If is_featured, limit featured articles to max 5         ║
-- ║     All within one transaction — committed by the caller.              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE OR REPLACE PROCEDURE sp_publish_article(
    p_article_id  INT,
    p_is_featured BOOLEAN DEFAULT FALSE,
    p_is_breaking BOOLEAN DEFAULT FALSE
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_status VARCHAR(10);
    v_featured_count INT;
BEGIN
    -- Step 1: Validate article exists
    SELECT status INTO v_current_status
    FROM articles WHERE article_id = p_article_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Article not found (article_id: %)', p_article_id USING ERRCODE = 'P0050';
    END IF;

    IF v_current_status = 'published' THEN
        RAISE EXCEPTION 'Article is already published' USING ERRCODE = 'P0051';
    END IF;

    IF v_current_status = 'archived' THEN
        RAISE EXCEPTION 'Cannot publish an archived article. Unarchive it first.' USING ERRCODE = 'P0052';
    END IF;

    -- Step 2: Update article to published
    UPDATE articles
    SET status = 'published',
        published_at = CURRENT_TIMESTAMP,
        is_featured = p_is_featured,
        is_breaking = p_is_breaking
    WHERE article_id = p_article_id;

    -- Step 3: If this is a breaking article, un-break all other breaking articles
    -- (only one article should be "breaking" at a time)
    IF p_is_breaking THEN
        UPDATE articles
        SET is_breaking = FALSE
        WHERE article_id != p_article_id AND is_breaking = TRUE;
    END IF;

    -- Step 4: If featured, ensure max 5 featured articles
    -- Un-feature the oldest featured article if limit exceeded
    IF p_is_featured THEN
        SELECT COUNT(*) INTO v_featured_count
        FROM articles WHERE is_featured = TRUE AND status = 'published';

        IF v_featured_count > 5 THEN
            UPDATE articles
            SET is_featured = FALSE
            WHERE article_id = (
                SELECT article_id FROM articles
                WHERE is_featured = TRUE AND status = 'published'
                  AND article_id != p_article_id
                ORDER BY published_at ASC
                LIMIT 1
            );
        END IF;
    END IF;

    -- Transaction is committed by the caller (explicit COMMIT in application code)
END;
$$;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  7. PROCEDURE — sp_setup_competition_season                            ║
-- ║     Multi-step workflow that:                                          ║
-- ║       Step 1: Creates a new season for the competition                 ║
-- ║       Step 2: Sets all other seasons for this competition to non-current║
-- ║       Step 3: Creates initial standings rows for all provided teams    ║
-- ║     All within one transaction — committed by the caller.              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE OR REPLACE PROCEDURE sp_setup_competition_season(
    p_competition_id INT,
    p_season_name    VARCHAR(20),
    p_start_date     DATE,
    p_end_date       DATE,
    p_team_ids       INT[],
    p_group_name     VARCHAR(10) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_season_id INT;
    v_comp_exists   BOOLEAN;
    v_i             INT;
BEGIN
    -- Step 1: Validate competition exists
    SELECT EXISTS(SELECT 1 FROM competitions WHERE competition_id = p_competition_id)
    INTO v_comp_exists;

    IF NOT v_comp_exists THEN
        RAISE EXCEPTION 'Competition not found (competition_id: %)', p_competition_id
            USING ERRCODE = 'P0060';
    END IF;

    -- Step 2: Mark all existing seasons for this competition as non-current
    UPDATE seasons
    SET is_current = FALSE
    WHERE competition_id = p_competition_id AND is_current = TRUE;

    -- Step 3: Create the new season
    INSERT INTO seasons (competition_id, name, start_date, end_date, is_current)
    VALUES (p_competition_id, p_season_name, p_start_date, p_end_date, TRUE)
    RETURNING season_id INTO v_new_season_id;

    -- Step 4: Create initial standings for each team
    IF p_team_ids IS NOT NULL AND array_length(p_team_ids, 1) > 0 THEN
        FOR v_i IN 1 .. array_length(p_team_ids, 1)
        LOOP
            INSERT INTO standings (season_id, group_name, team_id, position,
                                   played, won, drawn, lost, goals_for, goals_against, points)
            VALUES (v_new_season_id, p_group_name, p_team_ids[v_i], v_i,
                    0, 0, 0, 0, 0, 0, 0)
            ON CONFLICT (season_id, group_name, team_id) DO NOTHING;
        END LOOP;
    END IF;

    -- Transaction is committed by the caller (explicit COMMIT in application code)
END;
$$;