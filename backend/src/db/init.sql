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

-- enforces each pet owner must own at least 1 pet
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
    availability_start_date VARCHAR,
    availability_end_date VARCHAR,
    PRIMARY KEY (ct_username, availability_start_date, availability_end_date),
    FOREIGN KEY (ct_username) REFERENCES verified_caretakers(ct_username) ON DELETE CASCADE
);

CREATE TABLE advertise_for_pet_categories (
    ct_username VARCHAR,
    availability_start_date VARCHAR,
    availability_end_date VARCHAR,
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
    availability_start_date VARCHAR,
    availability_end_date VARCHAR,
    bid_price INTEGER NOT NULL,
    is_successful BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR,
    transfer_method VARCHAR,
    rating INTEGER,
    review VARCHAR,
    PRIMARY KEY (pet_owner_username, pet_name, bid_start_period, bid_end_period, ct_username, availability_start_date, availability_end_date)
);
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
--CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password', 'admin', 'dog', 9); -- should not insert
--CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password', 'admin', 'cat', 10); -- should not insert
CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password', 'admin', 'dog', 10); -- should insert
CALL add_pet_owner('sallyPO', 'sally@gmail.com', 'sally chan', 'password', 'petName', 'likes something', 'dog'); -- should insert
--CALL add_pet_owner('sallyPO', 'sally@gmail.com', 'sally chan', 'password', 'petName', 'likes something', 'cat'); -- should not insert
/*
INSERT INTO pet_owners VALUES ('sallyPO', 'sally@gmail.com', 'sally chan', 'password');
INSERT INTO pet_categories VALUES ('dog', 'admin', 10);
INSERT INTO owned_pets VALUES ('sallyPO', 'doggy', 'cannot eat sweet things', 'dog');
CALL add_part_time_caretaker('john', 'john@yahoo.com', 'john tan', 'password');
CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password');
INSERT INTO verified_caretakers VALUES ('micky', 'admin');
*/
-- ======================