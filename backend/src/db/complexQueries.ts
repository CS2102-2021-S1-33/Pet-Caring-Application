//Admin: underperforming ft ct: avg rating for past 90 days is < 2 OR no caretaking jobs for past 90 days (subquery + aggregation)
export const adminCQ = `
  (
    SELECT username
    FROM full_time_caretakers
    EXCEPT
    SELECT caretaker_username
    FROM makes
    WHERE is_successful = TRUE AND CURRENT_DATE - bid_start_period <= 90
  )
  UNION
  SELECT m.caretaker_username
  FROM makes m INNER JOIN full_time_caretakers f ON m.caretaker_username = f.username AND m.is_successful = TRUE AND CURRENT_DATE - m.bid_start_period <= 60
  GROUP BY m.caretaker_username
  HAVING AVG(m.rating) < 2 
`;

//Caretaker: total number of pet-days for this month
export const caretakerCQ = `
  SELECT COALESCE(
  (
    SELECT SUM(m.bid_end_period - m.bid_start_period + 1)
    FROM makes m
    WHERE m.caretaker_username = $1 AND m.is_successful = TRUE AND EXTRACT(MONTH FROM CURRENT_DATE) = EXTRACT(MONTH FROM m.bid_start_period) 
    GROUP BY m.caretaker_username
  ), 0) AS num_pet_day. 
`; //$1: caretaker username

//Pet Owner: Avg caretaking cost of each pet
export const petOwnerCQ = `
  SELECT AVG(m.bid_price), op.pet_name
  FROM makes m INNER JOIN owned_pets op ON m.pet_owner_username = op.username AND m.pet_name = op.pet_name AND op.username = $1 AND m.is_successful = TRUE
  GROUP BY op.pet_name
`; //$1: pet owner username


export const careTaker2CQ=`
  WITH
    ctx AS (SELECT pet_category_name , sum(bid_price) AS total
    FROM makes m INNER JOIN owned_pets o 
      ON m.pet_name = o.pet_name
    where EXTRACT(MONTH FROM bid_start_period) = $1
      AND is_successful = TRUE
    GROUP BY o.pet_category_name)
   
    SELECT vc.username
    FROM verified_caretakers vc
    WHERE NOT EXISTS(
      SELECT 1
      FROM advertise_for_pet_categories ap 
        NATURAL JOIN advertise_availabilities aa
      WHERE ap.username = vc.username
        AND ap.pet_category_name IN (
        SELECT a.pet_category_name
        FROM ctx a , ctx b
        WHERE a.total >= b.total
          AND a.pet_category_name <> b.pet_category_name
        )
      GROUP BY username
      HAVING EXTRACT(MONTH FROM max(availability_start_date)) = $1);
`; //$1 month 
