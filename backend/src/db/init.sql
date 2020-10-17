-- ======================
-- TODO: FORMAT INDENTATION OMG THIS FILE IS A MESS -- RAY
-- ======================

-- ======================
-- RESET ALL schemas in public
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
-- ======================

-- ======================
-- ADMIN
CREATE TABLE pcs_admins (
    username VARCHAR PRIMARY KEY,
    password VARCHAR NOT NULL
);
-- ======================

-- ======================
-- PET OWNERS AND PETS
CREATE TABLE pet_owners (
    username VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE pet_categories (
    pet_category_name VARCHAR PRIMARY KEY,
    set_by VARCHAR NOT NULL REFERENCES pcs_admins(username),
    base_price INTEGER NOT NULL
);

CREATE TABLE owned_pets (
    pet_owner_username VARCHAR REFERENCES pet_owners(username) ON DELETE CASCADE,
    pet_name VARCHAR,
    special_requirements VARCHAR,
    pet_category_name VARCHAR NOT NULL REFERENCES pet_categories(pet_category_name),
    PRIMARY KEY(pet_owner_username, pet_name)
);

-- enforces total participation in (Pet owner == Own <== Pet) 
CREATE OR REPLACE PROCEDURE add_pet_owner(
    username VARCHAR, 
    email VARCHAR,
    name VARCHAR,
    password VARCHAR,
    po_pet_name VARCHAR,
    po_special_requirements VARCHAR,
    po_pet_category_name VARCHAR) AS
'BEGIN
  IF NOT EXISTS (
      SELECT 1
      FROM pet_categories pc
      WHERE pc.pet_category_name = po_pet_category_name
  ) THEN RETURN; END IF;
  INSERT INTO pet_owners VALUES (username, email, name, password);
  INSERT INTO owned_pets VALUES (username, po_pet_name, po_special_requirements, po_pet_category_name);
END;'
LANGUAGE plpgsql;
-- ======================

-- ======================
-- CARETAKERS AND LEAVES (FULL-TIME ONLY)
CREATE TABLE caretakers (
    username VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE part_time_caretakers (
    username VARCHAR PRIMARY KEY REFERENCES caretakers(username)
);

CREATE TABLE full_time_caretakers (
    username VARCHAR PRIMARY KEY REFERENCES caretakers(username)
);

CREATE TABLE verified_caretakers (
    ct_username VARCHAR PRIMARY KEY REFERENCES caretakers(username),
    admin_username VARCHAR NOT NULL REFERENCES pcs_admins(username)
);

CREATE TABLE apply_leaves (
    ct_username VARCHAR, 
    admin_username VARCHAR, 
    leave_start_date DATE,
    leave_end_date DATE,
    is_successful BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ct_username) REFERENCES full_time_caretakers(username) ON DELETE CASCADE,
    FOREIGN KEY (admin_username) REFERENCES pcs_admins(username), 
    PRIMARY KEY (ct_username, leave_start_date, leave_end_date, admin_username)
);

CREATE OR REPLACE PROCEDURE add_part_time_caretaker(
    username VARCHAR, 
    email VARCHAR,
    name VARCHAR,
    password VARCHAR) AS
'BEGIN
  INSERT INTO caretakers VALUES (username, email, name, password);
  INSERT INTO part_time_caretakers VALUES (username);
END;'
LANGUAGE plpgsql;

-- THIS WILL NOT BE CALLED, FULL-TIME CARETAKERS WILL BE ADDED ON THE BACKEND MANUALLY BY PCS_ADMIN
-- AS SUCH, FULL-TIME CARETAKERS THAT ARE IN THE TABLE ARE ALREADY VERIFIED
CREATE OR REPLACE PROCEDURE add_full_time_caretaker(
    username VARCHAR, 
    email VARCHAR,
    name VARCHAR,
    password VARCHAR,
    admin_username VARCHAR,
    ct_pet_category_name VARCHAR,
    daily_price INTEGER) AS
$$
DECLARE start_availability_date DATE;
DECLARE end_availability_date DATE;
BEGIN
  -- checks if daily_price > base_price for given pet category
  IF EXISTS (
    SELECT *
    FROM pet_categories pc 
    WHERE ct_pet_category_name = pc.pet_category_name AND pc.base_price <= daily_price) THEN

  SELECT CURRENT_DATE INTO start_availability_date;
  SELECT start_availability_date + INTERVAL '1 year' INTO end_availability_date;
  INSERT INTO caretakers VALUES (username, email, name, password);
  INSERT INTO full_time_caretakers VALUES (username);
  INSERT INTO verified_caretakers VALUES (username, admin_username);
  INSERT INTO advertise_availabilities VALUES (username, start_availability_date, end_availability_date);
  INSERT INTO advertise_for_pet_categories VALUES (username, start_availability_date, end_availability_date, ct_pet_category_name, daily_price);

  END IF;
END;
$$
LANGUAGE plpgsql;
-- ======================

-- ======================
-- ADVERTISE AVAILABILITIES AND BIDS 
CREATE TABLE advertise_availabilities (
    ct_username VARCHAR,
    availability_start_date DATE,
    availability_end_date DATE,
    PRIMARY KEY (ct_username, availability_start_date, availability_end_date),
    FOREIGN KEY (ct_username) REFERENCES verified_caretakers(ct_username) ON DELETE CASCADE
);

CREATE TABLE advertise_for_pet_categories (
    ct_username VARCHAR,
    availability_start_date DATE,
    availability_end_date DATE,
    pet_category_name VARCHAR, 
    daily_price INTEGER NOT NULL, 
    PRIMARY KEY (ct_username, availability_start_date, availability_end_date, pet_category_name),
    FOREIGN KEY (ct_username, availability_start_date, availability_end_date) REFERENCES advertise_availabilities(ct_username, availability_start_date, availability_end_date),
    FOREIGN KEY (pet_category_name) REFERENCES pet_categories(pet_category_name) 
);

CREATE TABLE bid_period (
    bid_start_period DATE, 
    bid_end_period DATE, 
    PRIMARY KEY (bid_start_period, bid_end_period)
);

CREATE TABLE makes (
    pet_owner_username VARCHAR,
    pet_name VARCHAR,
    bid_start_period DATE, 
    bid_end_period DATE,
    ct_username VARCHAR,
    availability_start_date DATE,
    availability_end_date DATE,
    bid_price INTEGER NOT NULL,
    is_successful BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR,
    transfer_method VARCHAR,
    rating INTEGER,
    review VARCHAR,
    FOREIGN KEY (pet_owner_username, pet_name) REFERENCES owned_pets(pet_owner_username, pet_name),
    FOREIGN KEY (bid_start_period, bid_end_period) REFERENCES bid_period(bid_start_period, bid_end_period),
    FOREIGN KEY (ct_username, availability_start_date, availability_end_date) REFERENCES advertise_availabilities(ct_username, availability_start_date, availability_end_date),
    PRIMARY KEY (pet_owner_username, pet_name, bid_start_period, bid_end_period, ct_username, availability_start_date, availability_end_date)
);

-- enforces total participation in (Advertises == For -- Pet_categories)
CREATE OR REPLACE PROCEDURE advertise_availability(
    ct_ct_username VARCHAR,
    ct_availability_start_date DATE,
    ct_availability_end_date DATE,
    ct_pet_category_name VARCHAR, 
    daily_price INTEGER) AS
$$
BEGIN
   
  -- checks if daily_price > base_price for given pet category
  IF EXISTS (
    SELECT *
    FROM pet_categories pc 
    WHERE ct_pet_category_name = pc.pet_category_name AND pc.base_price <= daily_price) THEN

    -- checks if there already exists the same availability slot for this caretaker, if yes then just add additional pet category
    IF EXISTS (
      SELECT *
      FROM advertise_availabilities aa
      WHERE aa.ct_username = ct_ct_username 
      AND aa.availability_start_date = ct_availability_start_date 
      AND aa.availability_end_date = ct_availability_end_date
    ) THEN

      INSERT INTO advertise_for_pet_categories VALUES (ct_ct_username, ct_availability_start_date, ct_availability_end_date, ct_pet_category_name, daily_price);

    ELSE

      INSERT INTO advertise_availabilities VALUES (ct_ct_username, ct_availability_start_date, ct_availability_end_date);
      INSERT INTO advertise_for_pet_categories VALUES (ct_ct_username, ct_availability_start_date, ct_availability_end_date, ct_pet_category_name, daily_price);

    END IF;
  END IF;
END;
$$
LANGUAGE plpgsql;

-- INSERTS into Bid first, then insert into Makes
CREATE OR REPLACE PROCEDURE make_bid(
  po_username VARCHAR,
  po_pet_name VARCHAR,
  bid_start_period DATE, 
  bid_end_period DATE,
  ct_username VARCHAR,
  availability_start_date DATE,
  availability_end_date DATE,
  bid_price INTEGER) AS
$$
DECLARE bid_pet_category VARCHAR; 
BEGIN
  IF (bid_start_period >= availability_start_date AND bid_end_period <= availability_end_date) THEN
    -- determine pet category
    SELECT op.pet_category_name INTO bid_pet_category
    FROM owned_pets op
    WHERE op.pet_name = po_pet_name AND op.pet_owner_username = po_username;

    -- check whether bid_price >= daily_price
    IF EXISTS (
      SELECT *
      FROM advertise_for_pet_categories a 
      WHERE bid_pet_category = a.pet_category_name AND bid_price >= a.daily_price) THEN

    INSERT INTO bid_period VALUES (bid_start_period, bid_end_period);
    INSERT INTO makes VALUES (po_username, po_pet_name, bid_start_period, bid_end_period, ct_username, availability_start_date, availability_end_date, bid_price);

    END IF;
  END IF;
END;
$$
LANGUAGE plpgsql;
-- ======================

-- ======================
-- USEFUL VIEWS
CREATE VIEW users AS (
    SELECT * FROM pet_owners
    UNION
    SELECT * FROM caretakers
);
-- ======================

-- ======================
-- SAMPLE DATA (FOR TESTING)
INSERT INTO pcs_admins VALUES ('admin', 'password');
INSERT INTO pet_categories VALUES ('dog', 'admin', 10);
INSERT INTO pet_categories VALUES ('test', 'admin', 10);

CALL add_part_time_caretaker('john', 'john@yahoo.com', 'john tan', 'password');
INSERT INTO verified_caretakers VALUES ('john', 'admin'); -- verify John as a PT-CT

CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password', 'admin', 'dog', 10); -- should insert
--CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password', 'admin', 'dog', 9); -- should NOT insert as daily_price < base_price
--CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password', 'admin', 'cat', 10); -- should NOT insert as 'cat' does not exist as a pet category

CALL add_pet_owner('sallyPO', 'sally@gmail.com', 'sally chan', 'password', 'petName', 'likes something', 'dog'); -- should insert 
--CALL add_pet_owner('sallyPO', 'sally@gmail.com', 'sally chan', 'password', 'petName', 'likes something', 'cat'); -- should NOT insert as 'cat' does not exist as a pet category

INSERT INTO owned_pets VALUES ('sallyPO', 'testName', 'special', 'test'); -- now sallyPO has a dog and a test pet

CALL advertise_availability('john', DATE '2020-12-01', DATE '2020-12-20', 'dog', 10); -- should insert
CALL advertise_availability('john', DATE '2020-12-01', DATE '2020-12-20', 'test', 20); -- should insert
--CALL advertise_availability('john', DATE '2020-12-01', DATE '2020-12-20', 'dog', 9); -- should NOT insert as daily_price < base_price
--CALL advertise_availability('john', DATE '2020-12-01', DATE '2020-12-20', 'cat', 10); -- should NOT insert as 'cat' does not exist as a pet category
--CALL advertise_availability('random', DATE '2020-12-01', DATE '2020-12-20', 'cat', 10); -- should NOT insert as 'random' is not a username of a verified caretaker

--CALL make_bid('sallyPO', 'petName', DATE '2020-12-01', DATE '2020-12-10', 'john', DATE '2020-12-01', DATE '2020-12-20', 10); -- should insert
--CALL make_bid('sallyPO', 'petName', DATE '2020-12-01', DATE '2020-12-10', 'john', DATE '2020-12-01', DATE '2020-12-20', 9); -- should NOT insert as bid_price < daily_price
--CALL make_bid('sallyPO', 'testName', DATE '2020-12-01', DATE '2020-12-10', 'john', DATE '2020-12-01', DATE '2020-12-20', 10); -- should NOT insert as john did not advertise to take care of 'test' pet category
--CALL make_bid('sallyPO', 'petName', DATE '2020-11-01', DATE '2020-12-25', 'john', DATE '2020-12-01', DATE '2020-12-20', 10); -- should NOT insert as bid period is not subset of availability period

/*
INSERT INTO pet_owners VALUES ('sallyPO', 'sally@gmail.com', 'sally chan', 'password');
INSERT INTO pet_categories VALUES ('dog', 'admin', 10);
INSERT INTO owned_pets VALUES ('sallyPO', 'doggy', 'cannot eat sweet things', 'dog');
CALL add_part_time_caretaker('john', 'john@yahoo.com', 'john tan', 'password');
CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password');
INSERT INTO verified_caretakers VALUES ('micky', 'admin');
*/
-- ======================