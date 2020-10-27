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
-- User
-- ISA is with covering constraint 
CREATE TABLE pcs_user (
  username VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ======================

-- ======================
-- PET OWNERS AND PETS
CREATE TABLE pet_owners (
  username VARCHAR PRIMARY KEY,
  FOREIGN KEY (username) REFERENCES pcs_user(username) 
);

-- pet_categories should not have is_deleted field 
-- what happens if the admins wants to update the price for a category?
-- do we do an update or ???? 
CREATE TABLE pet_categories (
  pet_category_name VARCHAR PRIMARY KEY,
  set_by VARCHAR NOT NULL REFERENCES pcs_admins(username),
  base_price INTEGER NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- pet_owner_username has to be not null due pet => Own = Pet Owner 
CREATE TABLE owned_pets (
  pet_owner_username VARCHAR NOT NULL REFERENCES pet_owners(username),
  pet_name VARCHAR,
  special_requirements VARCHAR,
  pet_category_name VARCHAR NOT NULL REFERENCES pet_categories(pet_category_name),
  is_deleted BOOLEAN DEFAULT FALSE,
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
    INSERT INTO pcs_user VALUES (username, email, name, password);
    INSERT INTO owned_pets VALUES (username, po_pet_name, po_special_requirements, po_pet_category_name);
  END;'
LANGUAGE plpgsql;
-- ======================

-- ======================
-- CARETAKERS AND LEAVES (FULL-TIME ONLY)
CREATE TABLE caretakers (
  username VARCHAR PRIMARY KEY,
  FOREIGN KEY (username) REFERENCES pcs_user(username)
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
    INSERT INTO pcs_user VALUES (username, email, name, password);
    INSERT INTO caretakers VALUES (username); 
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
    -- From project brief (Full time care taker is treated as avaliable until they apply leave) 
    -- We have a problem here 
    SELECT start_availability_date + INTERVAL '1 year' INTO end_availability_date;
    INSERT INTO pcs_user VALUES (username, email, name, password);
    INSERT INTO caretakers VALUES (username);
    INSERT INTO full_time_caretakers VALUES (username);
    INSERT INTO verified_caretakers VALUES (username, admin_username);
    INSERT INTO advertise_availabilities VALUES (username, start_availability_date, end_availability_date);
    -- We should`t be inserting into advertise_for_pet_categories
    -- Reason is that we have to check that the daily price cannot be lower than the pet_category price set by admin 
    INSERT INTO advertise_for_pet_categories VALUES (username, start_availability_date, end_availability_date , ct_pet_category_name, daily_price);
  
    END IF;
  END;
  $$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE delete_user(username_to_be_deleted VARCHAR) AS
  $$
  BEGIN
    UPDATE pcs_user SET is_deleted=TRUE WHERE username=username_to_be_deleted; 
    -- We have to remove from verified careTakers since if user is deleted
    -- it is no longer verified to take up jobs. 
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
  is_deleted BOOLEAN DEFAULT FALSE,
  -- I would not recommend primary key to be avaliability_end_date 
  PRIMARY KEY (ct_username, availability_start_date, availability_end_date),
  -- Do we really need on DELETE CASCADE since we are not doing any deleting 
  FOREIGN KEY (ct_username) REFERENCES verified_caretakers(ct_username) ON DELETE CASCADE
);

CREATE TABLE advertise_for_pet_categories (
  ct_username VARCHAR,
  availability_start_date DATE,
  availability_end_date DATE,
  pet_category_name VARCHAR, 
  daily_price INTEGER NOT NULL, 
  -- Refer to comments in advertise_availabilities and in add_full_time_caretaker
  PRIMARY KEY (ct_username, availability_start_date, availability_end_date, pet_category_name),
  -- Likewise ^ 
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
     
    -- checks if daily_price >= base_price for given pet category
    IF EXISTS (
      SELECT *
      FROM pet_categories pc 
      WHERE ct_pet_category_name = pc.pet_category_name AND pc.base_price <= daily_price) THEN
  
      -- checks if there already exists the same availability slot for this caretaker, if yes then just add additional pet category
      -- TODO will have to update this after discussion about availability_end_date
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
  poUsername VARCHAR,
  poPetName VARCHAR,
  bidStartPeriod VARCHAR,
  bidEndPeriod VARCHAR,
  ctUsername VARCHAR,
  availabilityStartDate VARCHAR,
  availabilityEndDate VARCHAR,
  bidPrice INTEGER) AS
  $$
  DECLARE bid_pet_category VARCHAR; 
  BEGIN
    IF (date(bidStartPeriod) >= date(availabilityStartDate) AND date(bidEndPeriod) <= date(availabilityEndDate)) THEN
      -- determine pet category
      SELECT op.pet_category_name INTO bid_pet_category
      FROM owned_pets op
      WHERE op.pet_name = poPetName AND op.pet_owner_username = poUsername;
  
      -- check whether bid_price >= daily_price AND does not conflict with existing caretaker jobs
      -- TODO update after dicussion if its based on advertise_for_pet_categories daily price 
            -- or pet_categories table daily price 
            -- this check of bid_price should only affect full-time care taker 
            -- if the care taker choosen is full-time , the bid is marked successful immediately 
      -- Good cases:
      -- newBidStart newBidEnd oldBidStart oldBidEnd
      -- oldBidStart oldBidEnd newBidStart newBidEnd
      IF EXISTS (
        SELECT *
        FROM advertise_for_pet_categories a 
        WHERE bid_pet_category = a.pet_category_name AND bidPrice >= a.daily_price) AND NOT EXISTS (
        SELECT 1 FROM makes m 
        WHERE m.ct_username=ctUsername AND m.is_successful=TRUE AND NOT (m.bid_start_period - date(bidEndPeriod) > 0 OR date(bidStartPeriod) - m.bid_end_period > 0)
        ) THEN
  
        INSERT INTO bid_period VALUES (date(bidStartPeriod), date(bidEndPeriod));
        INSERT INTO makes VALUES (poUsername, poPetName, date(bidStartPeriod), date(bidEndPeriod), ctUsername, date(availabilityStartDate), date(availabilityEndDate), bidPrice);
  
      END IF;
    END IF;
  END;
  $$
LANGUAGE plpgsql;

-- TODO include constraint that part time care taker 
-- cannot take care of more than 2 pets unless they have a good rating.
-- cannot have more than 5 pet regardless of rating 
-- choose_bid should be only for part time 

-- Sets Bid as successful, checks caretaker is actually available
CREATE OR REPLACE PROCEDURE choose_bid(
  poUsername VARCHAR,
  poPetName VARCHAR,
  bidStartPeriod VARCHAR,
  bidEndPeriod VARCHAR,
  ctUsername VARCHAR,
  availabilityStartDate VARCHAR,
  availabilityEndDate VARCHAR,
  paymentMtd VARCHAR,
  petTransferMtd VARCHAR
  ) AS
  $$
  -- Good cases:
  -- newBidStart newBidEnd oldBidStart oldBidEnd
  -- oldBidStart oldBidEnd newBidStart newBidEnd
  BEGIN
    IF NOT EXISTS (
      SELECT * FROM makes m 
      WHERE m.ct_username=ctUsername AND m.is_successful=TRUE AND m.bid_start_period - date(bidEndPeriod) < 0 AND date(bidStartPeriod) - m.bid_end_period < 0
    ) THEN 
      UPDATE makes SET is_successful=TRUE, payment_method=paymentMtd, transfer_method=petTransferMtd 
      WHERE pet_owner_username=poUsername AND pet_name=poPetName AND bid_start_period=date(bidStartPeriod) AND bid_end_period=date(bidEndPeriod) 
      AND ct_username=ctUsername AND availability_start_date=date(availabilityStartDate) AND availability_end_date=date(availabilityEndDate);
    END IF;
  
  END;
  $$
LANGUAGE plpgsql;

-- TODO have a procedure to check 
-- that care taker works for a minimum of 2 x 150 consecutive days a year. 
-- Before the leave application can be made. 


-- TODO when inserting a review , have a procedure to update 
-- the daily price of the care taker since the price increases with the rating. 

-- TODO a view for Full-time care taker salary 
-- TODO a view for part time care taker salary

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
--CALL advertise_availability('john', DATE '2020-12-01', DATE '2020-12-20', 'test', 20); -- should insert
--CALL advertise_availability('john', DATE '2020-12-01', DATE '2020-12-20', 'dog', 9); -- should NOT insert as daily_price < base_price
--CALL advertise_availability('john', DATE '2020-12-01', DATE '2020-12-20', 'cat', 10); -- should NOT insert as 'cat' does not exist as a pet category
--CALL advertise_availability('random', DATE '2020-12-01', DATE '2020-12-20', 'cat', 10); -- should NOT insert as 'random' is not a username of a verified caretaker

CALL make_bid('sallyPO', 'petName', '2020-12-01', '2020-12-10', 'john', '2020-12-01', '2020-12-20', 10); -- should insert
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
