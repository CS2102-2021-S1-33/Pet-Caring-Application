-- ======================
-- INDENTATION: ALWAYS 2 SPACES!!
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
  password VARCHAR NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE pet_categories (
  pet_category_name VARCHAR PRIMARY KEY,
  set_by VARCHAR NOT NULL REFERENCES pcs_admins(username),
  base_price INTEGER NOT NULL CHECK (base_price > 0),
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE owned_pets (
  username VARCHAR REFERENCES pet_owners(username),
  pet_name VARCHAR,
  special_requirements VARCHAR,
  pet_category_name VARCHAR NOT NULL REFERENCES pet_categories(pet_category_name),
  is_deleted BOOLEAN DEFAULT FALSE,
  PRIMARY KEY(username, pet_name)
);
-- ======================

-- ======================
-- CARETAKERS AND LEAVES (FULL-TIME ONLY)
CREATE TABLE caretakers (
  username VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE part_time_caretakers (
  username VARCHAR PRIMARY KEY REFERENCES caretakers(username)
);

CREATE TABLE full_time_caretakers (
  username VARCHAR PRIMARY KEY REFERENCES caretakers(username)
);

CREATE TABLE verified_caretakers (
  username VARCHAR PRIMARY KEY REFERENCES caretakers(username),
  admin_username VARCHAR NOT NULL REFERENCES pcs_admins(username)
);

CREATE TABLE apply_leaves (
  username VARCHAR, 
  admin_username VARCHAR, 
  leave_start_date DATE,
  leave_end_date DATE,
  is_successful BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (username) REFERENCES full_time_caretakers(username),
  FOREIGN KEY (admin_username) REFERENCES pcs_admins(username), 
  PRIMARY KEY (username, leave_start_date, leave_end_date, admin_username)
);
-- ======================

-- ======================
-- ADVERTISE AVAILABILITIES AND BIDS 
CREATE TABLE advertise_availabilities (
  username VARCHAR,
  availability_start_date DATE,
  availability_end_date DATE,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (username) REFERENCES verified_caretakers(username), 
  PRIMARY KEY (username, availability_start_date, availability_end_date)
);

CREATE TABLE advertise_for_pet_categories (
  username VARCHAR,
  availability_start_date DATE,
  availability_end_date DATE,
  pet_category_name VARCHAR, 
  daily_price INTEGER NOT NULL CHECK (daily_price > 0), 
  FOREIGN KEY (username, availability_start_date, availability_end_date) REFERENCES advertise_availabilities(username, availability_start_date, availability_end_date),
  FOREIGN KEY (pet_category_name) REFERENCES pet_categories(pet_category_name),
  PRIMARY KEY (username, availability_start_date, availability_end_date, pet_category_name)
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
  caretaker_username VARCHAR,
  availability_start_date DATE,
  availability_end_date DATE,
  bid_price INTEGER NOT NULL,
  is_successful BOOLEAN DEFAULT FALSE,
  payment_method VARCHAR,
  transfer_method VARCHAR,
  rating INTEGER,
  review VARCHAR,
  FOREIGN KEY (pet_owner_username, pet_name) REFERENCES owned_pets(username, pet_name),
  FOREIGN KEY (bid_start_period, bid_end_period) REFERENCES bid_period(bid_start_period, bid_end_period),
  FOREIGN KEY (caretaker_username, availability_start_date, availability_end_date) REFERENCES advertise_availabilities(username, availability_start_date, availability_end_date),
  PRIMARY KEY (pet_owner_username, pet_name, bid_start_period, bid_end_period, caretaker_username, availability_start_date, availability_end_date)
);
-- ======================

-- ======================
-- USEFUL VIEWS
CREATE VIEW users AS (
  SELECT *, 'PET_OWNER' AS user_type FROM pet_owners
  UNION ALL
  SELECT *, 'PART_TIME_CARETAKER' AS user_type FROM part_time_caretakers NATURAL JOIN caretakers
  UNION ALL
  SELECT *, 'FULL_TIME_CARETAKER' AS user_type FROM full_time_caretakers NATURAL JOIN caretakers
);
