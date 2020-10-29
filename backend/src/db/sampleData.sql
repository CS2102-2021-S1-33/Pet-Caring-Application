-- SAMPLE DATA (FOR TESTING)
INSERT INTO pcs_admins VALUES ('admin', 'password');
INSERT INTO pet_categories VALUES ('dog', 'admin', 10);
INSERT INTO pet_categories VALUES ('cat', 'admin', 10);

CALL add_part_time_caretaker('john', 'john@yahoo.com', 'john tan', 'password');
INSERT INTO verified_caretakers VALUES ('john', 'admin', CURRENT_DATE); -- verify John as a PT-CT


-- ======================

-- ======================
-- TEST CASES FOR add_full_time_caretaker

-- should insert
CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password', 'admin', 'dog', 10);
/*
-- should NOT insert as daily_price < base_price
CALL add_full_time_caretaker('mike', 'mike@hotmail.com', 'mike tan', 'password', 'admin', 'dog', 9);

-- should NOT insert as 'cat' does not exist as a pet category
CALL add_full_time_caretaker('james', 'jamese@hotmail.com', 'james po', 'password', 'admin', 'cat', 10);

SELECT * FROM full_time_caretakers; -- should only have 1 entry */

-- ======================

-- ======================
-- TEST CASES FOR add_pet_owner

-- should insert 
CALL add_pet_owner('sallyPO', 'sally@gmail.com', 'sally chan', 'password', 'petName', 'likes something', 'dog'); 
/*
-- should NOT insert as 'bird' does not exist as a pet category
CALL add_pet_owner('nick', 'nick@gmail.com', 'nick choo', 'password', 'birdy', 'likes something', 'bird'); 

-- now sallyPO has a dog and a cat pet
CALL add_pet('sallyPO', 'testName', 'special', 'cat'); */


-- ======================

-- ======================
-- TEST CASES FOR delete_user
/*

CALL add_pet_owner('victor', 'victor@gamil.com', 'victor tay', 'password', 'doggy', 'likes running' , 'dog');
CALL add_part_time_caretaker('victor', 'mike@hotmail.com' , 'victor tay', 'password');
INSERT into verified_caretakers VALUES ('victor','admin', CURRENT_DATE);
CALL advertise_availability('victor', '2020-12-01','2020-12-20', 'dog', 11);
SELECT * FROM verified_caretakers;
CALL delete_user('victor');
SELECT * FROM pcs_user;
SELECT * FROM verified_caretakers;
SELECT * from owned_pets;

*/


-- ======================

-- ======================
-- TEST CASES FOR advertise_availability

-- should insert
CALL advertise_availability('john', '2020-12-01', '2020-12-20', 'dog', 11); 
/*
-- should not insert not test pet_category
CALL advertise_availability('john','2020-12-01','2020-12-20', 'test', 20); 

-- should NOT insert as daily_price < base_price
CALL advertise_availability('john', '2020-12-01', '2020-12-20', 'dog', 9); 

-- should NOT insert as 'random' is not a username of a verified caretaker
CALL advertise_availability('random','2020-12-01', '2020-12-20', 'cat', 10); 

SELECT * FROM advertise_availabilities; -- should have 2 entries 
SELECT * FROM advertise_for_pet_categories; -- should have 2 entries */


-- ======================

-- ======================
-- TEST CASES FOR make_bid

-- should insert
CALL make_bid('sallyPO', 'petName', '2020-12-01', '2020-12-10', 'john', 12,'CASH', 'PET_OWNER_DELIVERS'); 
/*
-- should NOT insert as bid_price < daily_price
CALL make_bid('sallyPO', 'petName', '2020-12-01', '2020-12-10', 'john', 9, 'CASH', 'PET_OWNER_DELIVERS'); 

-- should NOT insert as john did not advertise to take care of 'cat' pet category
CALL make_bid('sallyPO', 'testName', '2020-12-01', '2020-12-10', 'john', 10, 'CREDIT', 'COLLECT_BY_CARETAKER');

-- should NOT insert as bid period is not subset of availability period
CALL make_bid('sallyPO', 'petName', '2020-11-01', '2020-12-25', 'john',  10, 'CREDIT', 'PET_DELIVERY_SERVICE'); 

SELECT count(*) FROM makes; --Should only have 1 entry */

/*
-- ======================

-- ======================
-- TEST CASES FOR insert_review

SELECT * FROM advertise_for_pet_categories;
UPDATE makes set is_successful = TRUE 
    WHERE pet_owner_username = 'sallyPO' 
        AND caretaker_username = 'john'
        AND bid_start_period = date('2020-12-01')
        AND bid_end_period = date('2020-12-10');

CALL insert_review('sallyPO', 'petName', '2020-12-01', '2020-12-10', 'john', 2, 'TEST');
SELECT * FROM advertise_for_pet_categories; */


/*
INSERT INTO pet_owners VALUES ('sallyPO', 'sally@gmail.com', 'sally chan', 'password');
INSERT INTO pet_categories VALUES ('dog', 'admin', 10);
INSERT INTO owned_pets VALUES ('sallyPO', 'doggy', 'cannot eat sweet things', 'dog');
CALL add_part_time_caretaker('john', 'john@yahoo.com', 'john tan', 'password');
CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password');
INSERT INTO verified_caretakers VALUES ('micky', 'admin');
*/
-- ======================
