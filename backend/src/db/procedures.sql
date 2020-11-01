-- ======================
-- INDENTATION: ALWAYS 2 SPACES!!
-- ======================

-- ======================
-- PET OWNERS AND PETS
-- enforces total participation in (Pet owner == Own <== Pet) 
CREATE OR REPLACE PROCEDURE add_pet_owner(
  _username VARCHAR, 
  email VARCHAR,
  name VARCHAR,
  password VARCHAR,
  pet_name VARCHAR,
  special_requirements VARCHAR,
  pet_category_name VARCHAR) AS
  $$
  DECLARE pcn VARCHAR;
  BEGIN
    SELECT pet_category_name INTO pcn;
    IF NOT EXISTS (
      SELECT 1
      FROM pet_categories pc
      WHERE pc.pet_category_name = pcn
    ) THEN RETURN; END IF;
    IF NOT EXISTS (
        SELECT 1 
        FROM pcs_user pcs
        WHERE pcs.username = _username
    ) THEN 
        INSERT INTO pcs_user VALUES (_username, email, name, password);
    END IF;
    INSERT INTO pet_owners VALUES (_username);
    INSERT INTO owned_pets VALUES (_username, pet_name, special_requirements, pcn);
  END;
  $$
LANGUAGE plpgsql;

-- Might be useful if we are allowing the user to enter their category name
-- Delete if not required (put in for testing)
CREATE OR REPLACE PROCEDURE add_pet (
  username VARCHAR,
  pet_name VARCHAR,
  special_requirements VARCHAR,
  pet_cat VARCHAR) AS 
  $$ 
    BEGIN 
      IF NOT EXISTS (
        SELECT 1
        FROM pet_categories pc
        WHERE pc.pet_category_name = pet_cat
     ) THEN RETURN; 
     ELSE
        INSERT INTO owned_pets VALUES (username, pet_name, special_requirements,pet_cat);
     END IF;
     END
  $$
LANGUAGE plpgsql;
-- ======================

-- ======================
-- CARETAKERS AND LEAVES (FULL-TIME ONLY)
CREATE OR REPLACE PROCEDURE add_part_time_caretaker(
  _username VARCHAR, 
  email VARCHAR,
  name VARCHAR,
  password VARCHAR) AS
  $$
  BEGIN
    IF NOT EXISTS ( 
        SELECT 1 
        FROM pcs_user pcs
        WHERE pcs.username = _username
    ) THEN 
        INSERT INTO pcs_user VALUES (_username, email, name, password);
    END IF;
    INSERT INTO caretakers VALUES (_username); 
    INSERT INTO part_time_caretakers VALUES (_username);
  END;
  $$
LANGUAGE plpgsql;

-- THIS WILL NOT BE CALLED, FULL-TIME CARETAKERS WILL BE ADDED ON THE BACKEND MANUALLY BY PCS_ADMIN
-- AS SUCH, FULL-TIME CARETAKERS THAT ARE IN THE TABLE ARE ALREADY VERIFIED
CREATE OR REPLACE PROCEDURE add_full_time_caretaker(
  _username VARCHAR, 
  email VARCHAR,
  name VARCHAR,
  password VARCHAR,
  admin_username VARCHAR,
  pet_category_name VARCHAR,
  daily_price INTEGER) AS
  $$
  DECLARE start_availability_date DATE;
  DECLARE pcn VARCHAR;
  BEGIN
    SELECT pet_category_name INTO pcn;
    -- checks if daily_price > base_price for given pet category
    IF EXISTS (
      SELECT *
      FROM pet_categories pc 
      WHERE pc.pet_category_name = pcn AND pc.base_price <= daily_price) THEN
  
    SELECT CURRENT_DATE INTO start_availability_date;
    IF NOT EXISTS (
        SELECT 1 
        FROM pcs_user pcs
        WHERE pcs.username = _username
    ) THEN 
        INSERT INTO pcs_user VALUES (_username, email, name, password);
    END IF;
    INSERT INTO caretakers VALUES (_username);
    INSERT INTO full_time_caretakers VALUES (_username);
    INSERT INTO verified_caretakers VALUES (_username, admin_username, CURRENT_DATE);
    INSERT INTO advertise_availabilities VALUES (_username, start_availability_date);
    INSERT INTO advertise_for_pet_categories VALUES (_username, start_availability_date, pet_category_name, daily_price); 
    END IF;
  END;
  $$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE delete_user(username_to_be_deleted VARCHAR) AS
  $$
  BEGIN
    UPDATE pcs_user SET is_deleted = TRUE WHERE username = username_to_be_deleted;
    DELETE FROM verified_caretakers WHERE username = username_to_be_deleted;

    -- soft delete other entries
    UPDATE owned_pets SET is_deleted = TRUE where username = username_to_be_deleted;
    UPDATE advertise_availabilities SET is_deleted = TRUE where username = username_to_be_deleted;
  END;
  $$
LANGUAGE plpgsql;

-- ======================

-- ======================
-- ADVERTISE AVAILABILITIES AND BIDS 
CREATE OR REPLACE PROCEDURE advertise_availability(
  username VARCHAR,
  availability_start_date VARCHAR,
  pet_category_name VARCHAR, 
  daily_price INTEGER) AS
  $$
  DECLARE u VARCHAR;
  DECLARE pcn VARCHAR;
  DECLARE asd DATE;
  DECLARE aed DATE;
  BEGIN
    SELECT username INTO u; 
    SELECT date(availability_start_date) INTO asd; 
    SELECT pet_category_name INTO pcn;

    IF NOT EXISTS (
      SELECT 1
      FROM pet_categories pc
      WHERE pc.pet_category_name = pcn 
        AND pc.base_price < daily_price 
    ) THEN RETURN; END IF;

      -- checks if there already exists the same availability slot for this caretaker, if yes then just add additional pet category
      -- TODO will have to update this after discussion about availability_end_date

    IF NOT EXISTS (
      SELECT *
      FROM advertise_availabilities aa
      WHERE aa.username = u 
        AND aa.availability_start_date = asd 
    ) THEN
        INSERT INTO advertise_availabilities VALUES (u, asd);
    END IF;
    INSERT INTO advertise_for_pet_categories VALUES (u, asd, pet_category_name, daily_price);
  END;
  $$
LANGUAGE plpgsql;

-- INSERTS into Bid first, then insert into Makes
CREATE OR REPLACE PROCEDURE make_bid(
  pet_owner_username VARCHAR,
  pet_name VARCHAR,
  bid_start_period VARCHAR,
  bid_end_period VARCHAR,
  caretaker_username VARCHAR,
  bid_price INTEGER, 
  payment_method VARCHAR,
  transfer_method VARCHAR) AS
  $$
  DECLARE bid_pet_category VARCHAR; 
  DECLARE pn VARCHAR; 
  DECLARE cu VARCHAR; 
  DECLARE bsp DATE; 
  DECLARE bep DATE; 
  DECLARE asd DATE; 
  DECLARE aed DATE; 
  DECLARE pm VARCHAR;
  DECLARE tm VARCHAR;
  BEGIN
    SELECT pet_name INTO pn;
    SELECT caretaker_username INTO cu;
    SELECT date(bid_start_period) INTO bsp;
    SELECT date(bid_end_period) INTO bep;
    SELECT payment_method INTO pm;
    SELECT transfer_method INTO tm;

    SELECT MAX(availability_start_date) into asd
      FROM advertise_availabilities
      WHERE username = caretaker_username 
      GROUP BY username;

    SELECT COALESCE(availability_end_date, '1/1/1900') into aed
      FROM advertise_availabilities
      WHERE username = caretaker_username
        AND availability_start_date = asd;

    IF (bsp >= asd AND ( aed = '1/1/1900' or bep <= aed)) THEN
      -- determine pet category
      SELECT op.pet_category_name INTO bid_pet_category
      FROM owned_pets op
      WHERE op.pet_name = pn AND op.username = pet_owner_username;
  
      -- check whether bid_price >= daily_price AND does not conflict with existing caretaker jobs
            -- TODO update after discussion if its based on advertise_for_pet_categories daily price 
            -- or pet_categories table daily price 
            -- this check of bid_price should only affect full-time care taker 
            -- if the care taker choosen is full-time , the bid is marked successful immediately 
      -- Good cases:
      -- newBidStart newBidEnd oldBidStart oldBidEnd
      -- oldBidStart oldBidEnd newBidStart newBidEnd
      IF EXISTS (
        SELECT *
        FROM advertise_for_pet_categories a 
        WHERE a.pet_category_name = bid_pet_category 
            AND bid_price >= a.daily_price) 
        AND NOT EXISTS (
            SELECT 1 FROM makes m 
            WHERE m.caretaker_username = cu 
                AND m.is_successful = TRUE 
                AND NOT (m.bid_start_period > bep OR m.bid_end_period < bsp)
        ) THEN
  
        INSERT INTO bid_period VALUES (bsp, bep);
        INSERT INTO makes VALUES (pet_owner_username, pet_name, bsp, bep, caretaker_username, asd, bid_price, FALSE, pm, tm);
  
      END IF;
    END IF;
  END;
  $$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE choose_bid(
  _pet_owner_username VARCHAR,
  _pet_name VARCHAR,
  _bid_start_period VARCHAR,
  _bid_end_period VARCHAR,
  _caretaker_username VARCHAR,
  _availability_start_date VARCHAR,
  _availability_end_date VARCHAR
  ) AS
  $$
  DECLARE pou VARCHAR;
  DECLARE pn VARCHAR;
  DECLARE bsp DATE;
  DECLARE bep DATE;
  DECLARE cu VARCHAR;
  DECLARE asd DATE;
  DECLARE aed DATE;
  BEGIN
    SELECT _pet_owner_username INTO pou;
    SELECT _pet_name INTO pn;
    SELECT date(_bid_start_period) INTO bsp;
    SELECT date(_bid_end_period) INTO bep;
    SELECT _caretaker_username INTO cu;
    SELECT date(_availability_start_date) INTO asd;
    SELECT date(_availability_end_date) INTO aed;

    IF NOT EXISTS (
      SELECT * FROM makes m 
      WHERE m.caretaker_username = cu 
        AND m.is_successful = TRUE 
        AND NOT (m.bid_start_period <> bep OR m.bid_end_period <> bsp)
    ) THEN 
      UPDATE makes SET is_successful = TRUE 
        WHERE pet_owner_username = pou 
            AND pet_name = pn 
            AND bid_start_period = bsp 
            AND bid_end_period = bep 
            AND caretaker_username = cu 
            AND availability_start_date = asd 
            AND availability_end_date = aed;
    END IF;
  
  END;
  $$
LANGUAGE plpgsql;

-- TODO have a procedure to check 
-- that care taker works for a minimum of 2 x 150 consecutive days a year. 
-- Before the leave application can be made. 

CREATE OR REPLACE PROCEDURE insert_review( 
  _pet_owner_username VARCHAR,
  _pet_name VARCHAR,
  _bid_start_period VARCHAR,
  _bid_end_period VARCHAR,
  _caretaker_username VARCHAR,
  _rating INTEGER,
  _review VARCHAR
) AS 
  $$ 
    DECLARE before NUMERIC;
    DECLARE after NUMERIC;
    DECLARE category VARCHAR;
    DECLARE asd DATE;
    DECLARE aed DATE;
    DECLARE ra INTEGER;
    DECLARE re VARCHAR;
    BEGIN
        SELECT _rating into ra;
        SELECT _review into re;
        SELECT COALESCE(AVG(rating), 0) INTO before 
          FROM makes m 
          WHERE m.caretaker_username = caretaker_username;
        
        UPDATE makes SET rating = ra , review = re
          WHERE is_successful = TRUE
            AND pet_name = _pet_name
            AND date(bid_start_period) = date(_bid_start_period)
            AND date(bid_end_period) = date(_bid_end_period)
            AND caretaker_username = _caretaker_username;

        SELECT AVG(rating) into after
        FROM makes m 
        WHERE m.caretaker_username = caretaker_username;

        -- We can change the numbers later 
        if (after - before >= 0.1) THEN 
            SELECT pet_category_name into category
            FROM owned_pets
            WHERE pet_name = _pet_name
              AND username = _pet_owner_username;
            
            SELECT into asd, aed  MAX(availability_start_date) , MAX(availability_end_date)
            FROM advertise_availabilities
            WHERE username = _caretaker_username 
            GROUP BY username;

            -- Likewise here 
            UPDATE advertise_for_pet_categories SET daily_price = daily_price * 1.2
                WHERE username = _caretaker_username
                AND date(availability_start_date) = date(asd)
                AND date(availability_end_date) = date(aed)
                AND pet_category_name = category;
        END IF;

    END;
  $$
LANGUAGE plpgsql; 
