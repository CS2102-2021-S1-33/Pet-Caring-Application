CREATE OR REPLACE FUNCTION check_advertise_availability() RETURNS TRIGGER AS
  $$
  BEGIN
    -- check if pet category exists, and if it exists check whether daily_price > base_price
    IF NOT EXISTS (
      SELECT 1
      FROM pet_categories pc
      WHERE pc.pet_category_name = NEW.pet_category_name AND pc.base_price < NEW.daily_price 
    ) THEN RETURN NULL; END IF;

    RETURN NEW;

  END;
  $$
LANGUAGE plpgsql;

CREATE TRIGGER advertise_availability_insert_trigger BEFORE INSERT ON advertise_for_pet_categories
FOR EACH ROW EXECUTE PROCEDURE check_advertise_availability();

CREATE OR REPLACE FUNCTION check_make_bid() RETURNS TRIGGER AS
  $$
  BEGIN
    -- check bidPeriod is subset of availability period
    IF NOT (date(NEW.bid_start_period) >= date(NEW.availability_start_date) AND date(NEW.bid_end_period) <= date(NEW.availability_end_date)) THEN
    RETURN NULL; END IF;

    -- checks if caretaker actually advertised that he is able to care for this pet category and if the bid_price > daily_price 
    IF NOT EXISTS (
      SELECT 1
      FROM advertise_for_pet_categories a
      WHERE a.availability_start_date = NEW.availability_start_date AND a.availability_end_date = NEW.availability_end_date
      AND a.pet_category_name = (
        SELECT op.pet_category_name
        FROM owned_pets op
        WHERE op.username = NEW.pet_owner_username AND op.pet_name = NEW.pet_name
      ) AND a.daily_price < NEW.bid_price
    ) THEN RETURN NULL; END IF;

    -- checks if there is a conflicting caretaking job from bid_start_period to bid_end_period
    -- newBidStart newBidEnd oldBidStart oldBidEnd
    -- oldBidStart oldBidEnd newBidStart newBidEnd
    IF EXISTS (
      SELECT 1
      FROM makes m
      WHERE m.is_successful = TRUE AND m.caretaker_username = NEW.caretaker_username
      AND NOT (m.bid_start_period > NEW.bid_end_period OR m.bid_end_period < NEW.bid_start_period) 
    ) THEN RETURN NULL; END IF;

    -- checks if its full-time caretaker since ft ct will auto-accept any valid bids
    IF EXISTS (
      SELECT 1
      FROM full_time_caretakers f
      WHERE f.username = NEW.caretaker_username
    ) THEN NEW.is_successful = TRUE; NEW.payment_method = 'CREDIT_CARD'; NEW.transfer_method = 'TRANSFER_THROUGH_PCS_BUILDING'; END IF;

    RETURN NEW;

  END;
  $$
LANGUAGE plpgsql;

CREATE TRIGGER makes_insert_trigger BEFORE INSERT ON makes
FOR EACH ROW EXECUTE PROCEDURE check_make_bid();

CREATE OR REPLACE FUNCTION check_150_working_days() RETURNS TRIGGER AS
  $$
  BEGIN
    -- check if worked for 150 working days based on previous leaves. If no previously approved leaves, then take verified date as day 1 of work.
    IF (NEW.leave_start_date - (SELECT COALESCE ((SELECT MAX(leave_end_date) FROM apply_leaves al WHERE al.is_successful = TRUE AND al.username = NEW.username), 
    (SELECT verified_date FROM verified_caretakers vc WHERE vc.username = NEW.username))) >= 150) THEN
   
      RETURN NEW; END IF;
    RETURN NULL;
  END;
  $$
LANGUAGE plpgsql;

CREATE TRIGGER apply_leaves_insert_trigger BEFORE INSERT ON apply_leaves
FOR EACH ROW EXECUTE PROCEDURE check_150_working_days();

UPDATE verified_caretakers SET verified_date = '2019-01-02';
INSERT INTO apply_leaves VALUES ('micky', 'admin', '2020-10-02', '2020-10-25');