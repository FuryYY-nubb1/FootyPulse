

CREATE TABLE IF NOT EXISTS poll_vote_audit (
    audit_id SERIAL PRIMARY KEY,
    action VARCHAR(10) NOT NULL,          -- 'INSERT' or 'DELETE'
    vote_id INT,
    poll_id INT,
    user_id VARCHAR(50),
    selected_options JSONB,
    ip_hash VARCHAR(64),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE OR REPLACE FUNCTION fn_audit_poll_vote()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO poll_vote_audit (action, vote_id, poll_id, user_id, selected_options, ip_hash)
        VALUES ('INSERT', NEW.vote_id, NEW.poll_id, NEW.user_id, NEW.selected_options, NEW.ip_hash);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO poll_vote_audit (action, vote_id, poll_id, user_id, selected_options, ip_hash)
        VALUES ('DELETE', OLD.vote_id, OLD.poll_id, OLD.user_id, OLD.selected_options, OLD.ip_hash);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_poll_vote ON poll_votes;

CREATE TRIGGER trg_audit_poll_vote
AFTER INSERT OR DELETE ON poll_votes
FOR EACH ROW
EXECUTE FUNCTION fn_audit_poll_vote();

-- to get the poll stats...total votes, votes per option, percentage... 

CREATE OR REPLACE FUNCTION fn_get_poll_stats(p_poll_id INT)
RETURNS TABLE (
    poll_id INT,
    question VARCHAR(300),
    total_votes INT,
    option_id INT,
    option_text TEXT,
    option_votes INT,
    vote_percent NUMERIC(5,2)
) AS $$
DECLARE
    v_total INT;
BEGIN
    -- Get total votes for the poll
    SELECT COALESCE(p.total_votes, 0) INTO v_total
    FROM polls p WHERE p.poll_id = p_poll_id;

    RETURN QUERY
    SELECT
        p.poll_id,
        p.question,
        COALESCE(p.total_votes, 0)::INT AS total_votes,
        (opt->>'id')::INT AS option_id,
        (opt->>'text')::TEXT AS option_text,
        COALESCE((opt->>'votes')::INT, 0) AS option_votes,
        CASE
            WHEN v_total > 0 THEN ROUND(COALESCE((opt->>'votes')::INT, 0)::NUMERIC / v_total * 100, 2)
            ELSE 0.00
        END AS vote_percent
    FROM polls p,
         jsonb_array_elements(p.options) AS opt
    WHERE p.poll_id = p_poll_id;
END;
$$ LANGUAGE plpgsql;


-- jokhn vote cast hbee--

CREATE OR REPLACE PROCEDURE sp_cast_poll_vote(
    p_poll_id INT,
    p_user_id VARCHAR(50),
    p_selected_options JSONB,
    p_ip_hash VARCHAR(64) DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_poll_status VARCHAR(10);
    v_end_date TIMESTAMP;
    v_existing INT;
    v_options JSONB;
    v_opt JSONB;
    v_idx INT;
    v_sel INT;
    v_updated_options JSONB;
BEGIN
    SELECT status, end_date, options
    INTO v_poll_status, v_end_date, v_options
    FROM polls WHERE poll_id = p_poll_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Poll not found' USING ERRCODE = 'P0002';
    END IF;

    IF v_poll_status != 'active' THEN
        RAISE EXCEPTION 'Poll is not active' USING ERRCODE = 'P0003';
    END IF;

    IF v_end_date IS NOT NULL AND v_end_date < NOW() THEN
        RAISE EXCEPTION 'Poll has expired' USING ERRCODE = 'P0004';
    END IF;

    SELECT COUNT(*) INTO v_existing
    FROM poll_votes WHERE poll_id = p_poll_id AND user_id = p_user_id;

    IF v_existing > 0 THEN
        RAISE EXCEPTION 'User has already voted on this poll' USING ERRCODE = 'P0005';
    END IF;

    INSERT INTO poll_votes (poll_id, user_id, selected_options, ip_hash)
    VALUES (p_poll_id, p_user_id, p_selected_options, p_ip_hash);

    v_updated_options := v_options;
    FOR v_idx IN 0 .. jsonb_array_length(v_options) - 1
    LOOP
        v_opt := v_options -> v_idx;
        FOR v_sel IN SELECT value::INT FROM jsonb_array_elements_text(p_selected_options)
        LOOP
            IF (v_opt ->> 'id')::INT = v_sel THEN
                v_updated_options := jsonb_set(
                    v_updated_options,
                    ARRAY[v_idx::TEXT, 'votes'],
                    to_jsonb(COALESCE((v_opt ->> 'votes')::INT, 0) + 1)
                );
            END IF;
        END LOOP;
    END LOOP;

    UPDATE polls
    SET options = v_updated_options,
        total_votes = total_votes + 1
    WHERE poll_id = p_poll_id;

END;
$$;