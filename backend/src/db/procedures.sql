-- ======================
-- INDENTATION: ALWAYS 2 SPACES!!
-- ======================

-- ======================
-- PET OWNERS AND PETS
-- enforces total participation in (Pet owner == Own <== Pet) 
CREATE OR REPLACE PROCEDURE add_pet_owner(
  username VARCHAR, 
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

    INSERT INTO pet_owners VALUES (username, email, name, password);
    INSERT INTO owned_pets VALUES (username, pet_name, special_requirements, pcn);
  END;
  $$
LANGUAGE plpgsql;

-- ======================

-- ======================
-- CARETAKERS AND LEAVES (FULL-TIME ONLY)
CREATE OR REPLACE PROCEDURE add_part_time_caretaker(
  username VARCHAR, 
  email VARCHAR,
  name VARCHAR,
  password VARCHAR) AS
  $$
  BEGIN
    INSERT INTO caretakers VALUES (username, email, name, password);
    INSERT INTO part_time_caretakers VALUES (username);
  END;
  $$
LANGUAGE plpgsql;

-- THIS WILL NOT BE CALLED, FULL-TIME CARETAKERS WILL BE ADDED ON THE BACKEND MANUALLY BY PCS_ADMIN
-- AS SUCH, FULL-TIME CARETAKERS THAT ARE IN THE TABLE ARE ALREADY VERIFIED
CREATE OR REPLACE PROCEDURE add_full_time_caretaker(
  username VARCHAR, 
  email VARCHAR,
  name VARCHAR,
  password VARCHAR,
  admin_username VARCHAR,
  pet_category_name VARCHAR,
  daily_price INTEGER) AS
  $$
  DECLARE start_availability_date DATE;
  DECLARE end_availability_date DATE;
  DECLARE pcn VARCHAR;
  BEGIN
    SELECT pet_category_name INTO pcn;
    -- checks if daily_price > base_price for given pet category
    IF EXISTS (
      SELECT *
      FROM pet_categories pc 
      WHERE pc.pet_category_name = pcn AND pc.base_price <= daily_price) THEN
  
    SELECT CURRENT_DATE INTO start_availability_date;
    SELECT start_availability_date + INTERVAL '1 year' INTO end_availability_date;
    INSERT INTO caretakers VALUES (username, email, name, password);
    INSERT INTO full_time_caretakers VALUES (username);
    INSERT INTO verified_caretakers VALUES (username, admin_username, CURRENT_DATE);
    INSERT INTO advertise_availabilities VALUES (username, start_availability_date, end_availability_date);
    INSERT INTO advertise_for_pet_categories VALUES (username, start_availability_date, end_availability_date, pet_category_name, daily_price);
  
    END IF;
  END;
  $$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE delete_user(username_to_be_deleted VARCHAR) AS
  $$
  BEGIN
    UPDATE caretakers SET is_deleted = TRUE WHERE username = username_to_be_deleted; 
    UPDATE pet_owners SET is_deleted = TRUE WHERE username = username_to_be_deleted; 

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
  availability_end_date VARCHAR,
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
    SELECT date(availability_end_date) INTO aed; 
    SELECT pet_category_name INTO pcn;

    IF NOT EXISTS (
      SELECT 1
      FROM pet_categories pc
      WHERE pc.pet_category_name = pcn AND pc.base_price < daily_price 
    ) THEN RETURN; END IF;

      -- checks if there already exists the same availability slot for this caretaker, if yes then just add additional pet category
    IF EXISTS (
      SELECT *
      FROM advertise_availabilities aa
      WHERE aa.username = u 
      AND aa.availability_start_date = asd 
      AND aa.availability_end_date = aed
    ) THEN
  
      INSERT INTO advertise_for_pet_categories VALUES (u, asd, aed, pet_category_name, daily_price);
  
    ELSE
  
      INSERT INTO advertise_availabilities VALUES (u, asd, aed);
      INSERT INTO advertise_for_pet_categories VALUES (u, asd, aed, pet_category_name, daily_price);
    
    END IF;
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
  availability_start_date VARCHAR,
  availability_end_date VARCHAR,
  bid_price INTEGER) AS
  $$
  DECLARE bid_pet_category VARCHAR; 
  DECLARE pn VARCHAR; 
  DECLARE cu VARCHAR; 
  DECLARE bsp DATE; 
  DECLARE bep DATE; 
  DECLARE asd DATE; 
  DECLARE aed DATE; 
  BEGIN
    SELECT pet_name INTO pn;
    SELECT caretaker_username INTO cu;
    SELECT date(bid_start_period) INTO bsp;
    SELECT date(bid_end_period) INTO bep;
    SELECT date(availability_start_date) INTO asd;
    SELECT date(availability_end_date) INTO aed;

    IF (bsp >= asd AND bep <= aed) THEN
      -- determine pet category
      SELECT op.pet_category_name INTO bid_pet_category
      FROM owned_pets op
      WHERE op.pet_name = pn AND op.username = pet_owner_username;
  
      -- check whether bid_price >= daily_price AND does not conflict with existing caretaker jobs
      -- Good cases:
      -- newBidStart newBidEnd oldBidStart oldBidEnd
      -- oldBidStart oldBidEnd newBidStart newBidEnd
      IF EXISTS (
        SELECT *
        FROM advertise_for_pet_categories a 
        WHERE a.pet_category_name = bid_pet_category AND bid_price >= a.daily_price) AND NOT EXISTS (
        SELECT 1 FROM makes m 
        WHERE m.caretaker_username = cu AND m.is_successful=TRUE AND NOT (m.bid_start_period > bep OR m.bid_end_period < bsp)
        ) THEN
  
        INSERT INTO bid_period VALUES (bsp, bep);
        INSERT INTO makes VALUES (pet_owner_username, pet_name, bsp, bep, caretaker_username, asd, aed, bid_price);
  
      END IF;
    END IF;
  END;
  $$
LANGUAGE plpgsql;

-- Sets Bid as successful, checks caretaker is actually available
CREATE OR REPLACE PROCEDURE choose_bid(
  pet_owner_username VARCHAR,
  pet_name VARCHAR,
  bid_start_period VARCHAR,
  bid_end_period VARCHAR,
  caretaker_username VARCHAR,
  availability_start_date VARCHAR,
  availability_end_date VARCHAR,
  payment_method VARCHAR,
  transfer_method VARCHAR
  ) AS
  $$
  DECLARE pou VARCHAR;
  DECLARE pn VARCHAR;
  DECLARE bsp DATE;
  DECLARE bep DATE;
  DECLARE cu VARCHAR;
  DECLARE asd DATE;
  DECLARE aed DATE;
  DECLARE pm VARCHAR;
  DECLARE tm VARCHAR;
  BEGIN
    SELECT pet_owner_username INTO pou;
    SELECT pet_name INTO pn;
    SELECT date(bid_start_period) INTO bsp;
    SELECT date(bid_end_period) INTO bep;
    SELECT caretaker_username INTO cu;
    SELECT date(availability_start_date) INTO asd;
    SELECT date(availability_end_date) INTO aed;
    SELECT payment_method INTO pm;
    SELECT transfer_method INTO tm;

    IF NOT EXISTS (
      SELECT * FROM makes m 
      WHERE m.caretaker_username = cu AND m.is_successful = TRUE AND NOT (m.bid_start_period > bep OR m.bid_end_period < bsp)
    ) THEN 
      UPDATE makes SET is_successful = TRUE, payment_method = pm, transfer_method = tm 
      WHERE pet_owner_username = pou AND pet_name = pn AND bid_start_period = bsp AND bid_end_period = bep 
      AND caretaker_username = cu AND availability_start_date = asd AND availability_end_date = aed;
    END IF;
  
  END;
  $$
LANGUAGE plpgsql;
