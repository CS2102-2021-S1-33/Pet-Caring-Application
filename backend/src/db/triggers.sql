CREATE OR REPLACE FUNCTION check_advertise_availability() RETURNS TRIGGER AS
  $$
  BEGIN
    -- check if pet category exists
    -- and if it exists check whether daily_price > base_price
    IF EXISTS (
      SELECT 1
      FROM pet_categories pc
      WHERE pc.pet_category_name = NEW.pet_category_name 
        AND NEW.daily_price >= pc.base_price 
    ) THEN RETURN NEW; END IF;

    RETURN NULL;

  END;
  $$
LANGUAGE plpgsql;

CREATE TRIGGER advertise_availability_insert_trigger 
BEFORE INSERT ON advertise_for_pet_categories
FOR EACH ROW EXECUTE PROCEDURE check_advertise_availability();

CREATE OR REPLACE FUNCTION check_make_bid() RETURNS TRIGGER AS
  $$
  BEGIN
    -- check if caretaker is full time 
    -- then if the price is at least above the base price 
    -- and num pets caring during that period < 5
    IF (EXISTS (
      SELECT 1
      FROM full_time_caretakers f
      WHERE f.username = NEW.caretaker_username
    ) AND (
      SELECT COUNT(*) 
      FROM makes m 
      WHERE m.caretaker_username = NEW.caretaker_username AND is_successful = TRUE 
        AND m.bid_start_period <= NEW.bid_end_period AND m.bid_end_period <= NEW.bid_start_period) < 5)
      AND NOT EXISTS ( 
         SELECT 1 
        FROM advertise_for_pet_categories NATURAL JOIN pet_categories 
          WHERE NEW.bid_price < daily_price AND NEW.bid_price < base_price
    ) THEN NEW.is_successful = TRUE; 
    END IF;
    RETURN NEW;

  END;
  $$
LANGUAGE plpgsql;

CREATE TRIGGER makes_insert_trigger BEFORE INSERT ON makes
FOR EACH ROW EXECUTE PROCEDURE check_make_bid();

-- ONLY FOR PART TIME CARE TAKERS 
-- if avg rating >= 4, then can take care of up to 5 pets
-- else, can only take care of up to 2 pets
CREATE OR REPLACE FUNCTION check_choose_bid() RETURNS TRIGGER AS
  $$
  DECLARE rating NUMERIC;
  DECLARE cur_job NUMERIC;
  BEGIN
    SELECT AVG(rating) 
      FROM makes m 
      WHERE m.caretaker_username = NEW.caretaker_username into rating;

    SELECT COUNT(*) 
      FROM makes m 
      WHERE m.caretaker_username = NEW.caretaker_username AND is_successful = TRUE 
        AND m.bid_start_period <= NEW.bid_end_period 
        AND m.bid_end_period <= NEW.bid_start_period into cur_job;

    IF ( rating >= 4) 
        THEN IF ( cur_job < 5) THEN RETURN NEW;
      END IF;
    ELSE 
      IF (cur_job < 2) THEN RETURN NEW;
      END IF;
    END IF;
    RETURN NULL;
  END;
  $$
LANGUAGE plpgsql;

CREATE TRIGGER makes_choose_bid_update_trigger BEFORE UPDATE OF is_successful ON makes
FOR EACH ROW EXECUTE PROCEDURE check_choose_bid();


CREATE OR REPLACE FUNCTION check_leave() RETURNS TRIGGER AS 
  $$
  DECLARE curYear VARCHAR;
  DECLARE accPeriod NUMERIC;
  DECLARE lastDay DATE;
  BEGIN 
    SELECT date_part('year', CURRENT_DATE) into curYear;
    SELECT (date_trunc('MONTH', CURRENT_DATE) + INTERVAL '2 MONTH - 1 day') into lastDay;
    SELECT COUNT(*)
        FROM ( 
            SELECT COALESCE(availability_end_date,CURRENT_DATE) - availability_start_date as wDay 
            FROM advertise_availabilities 
            WHERE username = 'micky') as wDayTable 
        WHERE wDay >= 150 into accPeriod;

    -- Check if the FT has worked 2 x 150
    if (accPeriod >= 2) THEN
        RETURN NEW;
    ELSE 
      -- Check if the FT still has the possibility of working 2 x 150 if leave is made
      IF ( accperiod + ((lastday - new.leave_end_date) % 150) >= 2) THEN 
        -- Now we check if the FT has any bid for that period of leave , if have cannot apply leave 
        IF NOT EXISTS (
            SELECT 1
            FROM makes
            WHERE is_successful = TRUE
              AND caretaker_username = NEW.username
              AND bid_start_period >= NEW.leave_start_date
              AND bid_end_period <= NEW.leave_end_date
        ) THEN RETURN NEW;
        END IF;
      END IF; 
    END IF;
    RETURN NULL;
  END;
  $$
LANGUAGE plpgsql;

CREATE TRIGGER leave_insert_trigger BEFORE INSERT ON apply_leaves
FOR EACH ROW EXECUTE PROCEDURE check_leave();
