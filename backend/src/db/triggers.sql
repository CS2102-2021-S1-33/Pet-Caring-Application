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

    -- checks if its full-time caretaker since ft ct will auto-accept any valid bids and num pets caring during that period < 5
    IF (EXISTS (
      SELECT 1
      FROM full_time_caretakers f
      WHERE f.username = NEW.caretaker_username
    ) AND (
      SELECT COUNT(*) 
      FROM makes m 
      WHERE m.caretaker_username = NEW.caretaker_username 
        AND is_successful = TRUE 
        AND NOT (m.bid_start_period > NEW.bid_end_period OR m.bid_end_period < NEW.bid_start_period)) < 5) THEN

        NEW.is_successful = TRUE; NEW.payment_method = 'CREDIT_CARD'; NEW.transfer_method = 'TRANSFER_THROUGH_PCS_BUILDING'; END IF;

    RETURN NEW;

  END;
  $$
LANGUAGE plpgsql;

CREATE TRIGGER makes_insert_trigger BEFORE INSERT ON makes
FOR EACH ROW EXECUTE PROCEDURE check_make_bid();

-- if avg rating >= 4, then can take care of up to 5 pets
-- else, can only take care of up to 2 pets
CREATE OR REPLACE FUNCTION check_choose_bid() RETURNS TRIGGER AS
  $$
  BEGIN
    -- check if pet category exists, and if it exists check whether daily_price > base_price
    IF ((SELECT AVG(rating) FROM makes m WHERE m.caretaker_username = NEW.caretaker_username) >= 4) THEN
      IF ((SELECT COUNT(*) 
      FROM makes m 
      WHERE m.caretaker_username = NEW.caretaker_username 
        AND is_successful = TRUE 
        AND NOT (m.bid_start_period > NEW.bid_end_period OR m.bid_end_period < NEW.bid_start_period)) < 5) THEN
      
      RETURN NEW;
      END IF;
    ELSE 
      IF ((SELECT COUNT(*) 
      FROM makes m 
      WHERE m.caretaker_username = NEW.caretaker_username 
        AND is_successful = TRUE 
        AND NOT (m.bid_start_period > NEW.bid_end_period OR m.bid_end_period < NEW.bid_start_period)) < 5) THEN
      
      RETURN NEW;
      END IF;
    END IF;

    RETURN NULL;
  END;
  $$
LANGUAGE plpgsql;

CREATE TRIGGER makes_choose_bid_update_trigger BEFORE UPDATE OF is_successful ON makes
FOR EACH ROW EXECUTE PROCEDURE check_choose_bid();
