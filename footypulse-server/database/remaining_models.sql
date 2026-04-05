
CREATE TABLE IF NOT EXISTS transfer_audit (
    audit_id      SERIAL PRIMARY KEY,
    action        VARCHAR(10) NOT NULL,
    transfer_id   INT,
    person_id     INT,
    from_team_id  INT,
    to_team_id    INT,
    fee           DECIMAL(12,2),
    transfer_type VARCHAR(15),
    status        VARCHAR(12),
    performed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_values    JSONB,
    new_values    JSONB
);

CREATE OR REPLACE FUNCTION fn_audit_transfer()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.from_team_id IS NOT NULL AND NEW.from_team_id = NEW.to_team_id THEN
            RAISE EXCEPTION 'Cannot transfer a player to the same team (team_id: %)', NEW.to_team_id
                USING ERRCODE = 'P0070';
        END IF;
        IF NEW.fee IS NOT NULL AND NEW.fee < 0 THEN
            RAISE EXCEPTION 'Transfer fee cannot be negative' USING ERRCODE = 'P0071';
        END IF;
    END IF;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO transfer_audit (action, transfer_id, person_id, from_team_id, to_team_id, fee, transfer_type, status, new_values)
        VALUES ('INSERT', NEW.transfer_id, NEW.person_id, NEW.from_team_id, NEW.to_team_id, NEW.fee, NEW.transfer_type, NEW.status, row_to_json(NEW)::JSONB);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO transfer_audit (action, transfer_id, person_id, from_team_id, to_team_id, fee, transfer_type, status, old_values, new_values)
        VALUES ('UPDATE', NEW.transfer_id, NEW.person_id, NEW.from_team_id, NEW.to_team_id, NEW.fee, NEW.transfer_type, NEW.status, row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO transfer_audit (action, transfer_id, person_id, from_team_id, to_team_id, fee, transfer_type, status, old_values)
        VALUES ('DELETE', OLD.transfer_id, OLD.person_id, OLD.from_team_id, OLD.to_team_id, OLD.fee, OLD.transfer_type, OLD.status, row_to_json(OLD)::JSONB);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_transfer ON transfers;
CREATE TRIGGER trg_audit_transfer
AFTER INSERT OR UPDATE OR DELETE ON transfers
FOR EACH ROW EXECUTE FUNCTION fn_audit_transfer();


-- to execute a transder......

CREATE OR REPLACE PROCEDURE sp_execute_transfer(
    p_person_id      INT,
    p_from_team_id   INT,
    p_to_team_id     INT,
    p_transfer_type  VARCHAR(15),
    p_fee            DECIMAL(12,2) DEFAULT NULL,
    p_transfer_date  DATE DEFAULT CURRENT_DATE,
    p_window_year    SMALLINT DEFAULT NULL,
    p_window_type    VARCHAR(6) DEFAULT NULL,
    p_jersey_number  SMALLINT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_person_exists BOOLEAN;
    v_new_transfer_id INT;
BEGIN
    --person exists
    SELECT EXISTS(SELECT 1 FROM persons WHERE person_id = p_person_id) INTO v_person_exists;
    IF NOT v_person_exists THEN
        RAISE EXCEPTION 'Person not found (person_id: %)', p_person_id USING ERRCODE = 'P0072';
    END IF;

    -- thenn transfer record
    INSERT INTO transfers (person_id, from_team_id, to_team_id, transfer_type, status, fee, fee_currency, transfer_date, window_year, window_type)
    VALUES (p_person_id, p_from_team_id, p_to_team_id, p_transfer_type, 'official', p_fee, 'EUR', p_transfer_date, p_window_year, p_window_type)
    RETURNING transfer_id INTO v_new_transfer_id;
    --ending current contract at the old club
    IF p_from_team_id IS NOT NULL THEN
        UPDATE contracts
        SET is_current = FALSE, end_date = p_transfer_date
        WHERE person_id = p_person_id AND team_id = p_from_team_id AND is_current = TRUE;
    END IF;
    -- new contract at the destination club
    IF p_transfer_type = 'loan' THEN
        INSERT INTO contracts (person_id, team_id, contract_type, start_date, is_current, parent_club_id, jersey_number)
        VALUES (p_person_id, p_to_team_id, 'loan', p_transfer_date, TRUE, p_from_team_id, p_jersey_number);
    ELSE
        INSERT INTO contracts (person_id, team_id, contract_type, start_date, is_current, jersey_number)
        VALUES (p_person_id, p_to_team_id, 'player', p_transfer_date, TRUE, p_jersey_number);
    END IF;
END;
$$;

-- to get the transfer stats...total arrivals, departures, net spend per team......
CREATE OR REPLACE FUNCTION fn_get_transfer_stats(
    p_window_year SMALLINT DEFAULT NULL,
    p_window_type VARCHAR(6) DEFAULT NULL
)
RETURNS TABLE (
    team_id        INT,
    team_name      VARCHAR,
    team_logo      VARCHAR,
    arrivals       BIGINT,
    departures     BIGINT,
    spent          NUMERIC,
    received       NUMERIC,
    net_spend      NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH arrivals AS (
        SELECT tr.to_team_id AS tid, COUNT(*) AS cnt, COALESCE(SUM(tr.fee), 0) AS total
        FROM transfers tr
        WHERE tr.status = 'official'
          AND (p_window_year IS NULL OR tr.window_year = p_window_year)
          AND (p_window_type IS NULL OR tr.window_type = p_window_type)
        GROUP BY tr.to_team_id
    ),
    departures AS (
        SELECT tr.from_team_id AS tid, COUNT(*) AS cnt, COALESCE(SUM(tr.fee), 0) AS total
        FROM transfers tr
        WHERE tr.status = 'official' AND tr.from_team_id IS NOT NULL
          AND (p_window_year IS NULL OR tr.window_year = p_window_year)
          AND (p_window_type IS NULL OR tr.window_type = p_window_type)
        GROUP BY tr.from_team_id
    )
    SELECT t.team_id, t.name::VARCHAR, t.logo_url::VARCHAR,
           COALESCE(a.cnt, 0)::BIGINT,
           COALESCE(d.cnt, 0)::BIGINT,
           COALESCE(a.total, 0)::NUMERIC,
           COALESCE(d.total, 0)::NUMERIC,
           (COALESCE(a.total, 0) - COALESCE(d.total, 0))::NUMERIC AS net_spend
    FROM teams t
    LEFT JOIN arrivals a ON t.team_id = a.tid
    LEFT JOIN departures d ON t.team_id = d.tid
    WHERE COALESCE(a.cnt, 0) > 0 OR COALESCE(d.cnt, 0) > 0
    ORDER BY net_spend DESC;
END;
$$ LANGUAGE plpgsql;

-- jdi multiple overlapping contract thake..then validate

CREATE OR REPLACE FUNCTION fn_validate_contract()
RETURNS TRIGGER AS $$
DECLARE
    v_existing INT;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- If setting a contract as current, check for existing active contracts
        -- of the same type for this person at the same team
        IF NEW.is_current = TRUE THEN
            SELECT COUNT(*) INTO v_existing
            FROM contracts
            WHERE person_id = NEW.person_id
              AND team_id = NEW.team_id
              AND contract_type = NEW.contract_type
              AND is_current = TRUE
              AND contract_id != COALESCE(NEW.contract_id, 0);
            IF v_existing > 0 THEN
                RAISE EXCEPTION 'Person already has an active % contract at this team (person_id: %, team_id: %)',
                    NEW.contract_type, NEW.person_id, NEW.team_id
                    USING ERRCODE = 'P0080';
            END IF;
        END IF;

        IF NEW.start_date IS NULL THEN
            RAISE EXCEPTION 'Contract start_date is required' USING ERRCODE = 'P0081';
        END IF;

        -- Validate: end_date must be after start_date if provided
        IF NEW.end_date IS NOT NULL AND NEW.end_date <= NEW.start_date THEN
            RAISE EXCEPTION 'Contract end_date must be after start_date' USING ERRCODE = 'P0082';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_contract ON contracts;
CREATE TRIGGER trg_validate_contract
BEFORE INSERT OR UPDATE ON contracts
FOR EACH ROW EXECUTE FUNCTION fn_validate_contract();


-- for getting the career of a player...

CREATE OR REPLACE FUNCTION fn_get_player_career_stats(p_person_id INT)
RETURNS TABLE (
    person_name     VARCHAR,
    person_type     VARCHAR,
    total_appearances BIGINT,
    starts           BIGINT,
    sub_appearances  BIGINT,
    goals            BIGINT,
    assists          BIGINT,
    penalties        BIGINT,
    yellow_cards     BIGINT,
    red_cards        BIGINT,
    minutes_played   BIGINT,
    teams_played_for BIGINT,
    competitions     BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH appearances AS (
        SELECT mp.match_id, mp.is_starter, mp.minute_in, mp.minute_out, mp.team_id,
               m.season_id
        FROM match_players mp
        JOIN matches m ON mp.match_id = m.match_id
        WHERE mp.person_id = p_person_id AND m.status = 'finished'
    ),
    events AS (
        SELECT me.event_type, me.match_id
        FROM match_events me
        JOIN matches m ON me.match_id = m.match_id
        WHERE me.person_id = p_person_id AND m.status = 'finished'
    ),
    assist_events AS (
        SELECT me.match_id
        FROM match_events me
        JOIN matches m ON me.match_id = m.match_id
        WHERE me.related_person_id = p_person_id
          AND me.event_type IN ('goal', 'penalty')
          AND m.status = 'finished'
    ),
    person_info AS (
        SELECT display_name, person_type FROM persons WHERE person_id = p_person_id
    )
    SELECT
        pi.display_name::VARCHAR,
        pi.person_type::VARCHAR,
        COUNT(DISTINCT a.match_id)::BIGINT,
        COUNT(DISTINCT a.match_id) FILTER (WHERE a.is_starter)::BIGINT,
        COUNT(DISTINCT a.match_id) FILTER (WHERE NOT a.is_starter)::BIGINT,
        (SELECT COUNT(*) FROM events WHERE event_type = 'goal')::BIGINT,
        (SELECT COUNT(*) FROM assist_events)::BIGINT,
        (SELECT COUNT(*) FROM events WHERE event_type = 'penalty')::BIGINT,
        (SELECT COUNT(*) FROM events WHERE event_type = 'yellow')::BIGINT,
        (SELECT COUNT(*) FROM events WHERE event_type IN ('red', 'second_yellow'))::BIGINT,
        COALESCE(SUM(COALESCE(a.minute_out, 90) - COALESCE(a.minute_in, 0)), 0)::BIGINT,
        COUNT(DISTINCT a.team_id)::BIGINT,
        (SELECT COUNT(DISTINCT s.competition_id)
         FROM appearances a2
         JOIN seasons s ON a2.season_id = s.season_id)::BIGINT
    FROM person_info pi
    LEFT JOIN appearances a ON true
    GROUP BY pi.display_name, pi.person_type;
END;
$$ LANGUAGE plpgsql;