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

-- now sallyPO has a dog and a cat pet
CALL add_pet('sallyPO', 'testName', 'special', 'cat');
/*
-- should NOT insert as 'bird' does not exist as a pet category
CALL add_pet_owner('nick', 'nick@gmail.com', 'nick choo', 'password', 'birdy', 'likes something', 'bird'); 
 */


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
CALL advertise_availability('john', '2020-08-01', 'dog', 11); 
/*
-- should not insert not test pet_category
CALL advertise_availability('john','2020-08-01', 'test', 20); 

-- should NOT insert as daily_price < base_price
CALL advertise_availability('john', '2020-08-01', 'dog', 9); 

-- should NOT insert as 'random' is not a username of a verified caretaker
CALL advertise_availability('random','2020-08-01', 'cat', 10); 

SELECT * FROM advertise_availabilities; -- should have 2 entries 
SELECT * FROM advertise_for_pet_categories; -- should have 2 entries */


-- ======================

-- ======================
-- TEST CASES FOR make_bid

-- should insert
CALL make_bid('sallyPO', 'petName', '2020-08-01', '2020-08-10', 'john', 12,'CASH', 'PET_OWNER_DELIVERS'); 
/*
-- should NOT insert as bid_price < daily_price
CALL make_bid('sallyPO', 'petName', '2020-08-01', '2020-08-10', 'john', 9, 'CASH', 'PET_OWNER_DELIVERS'); 

-- should NOT insert as john did not advertise to take care of 'cat' pet category
CALL make_bid('sallyPO', 'testName', '2020-08-01', '2020-08-10', 'john', 10, 'CREDIT', 'COLLECT_BY_CARETAKER');

-- should NOT insert as bid period is not subset of availability period
CALL make_bid('sallyPO', 'petName', '2020-08-01', '2020-08-25', 'john',  10, 'CREDIT', 'PET_DELIVERY_SERVICE'); 

SELECT count(*) FROM makes; --Should only have 1 entry */

/*
-- ======================

-- ======================
-- TEST CASES FOR insert_review

SELECT * FROM advertise_for_pet_categories;
UPDATE makes set is_successful = TRUE 
    WHERE pet_owner_username = 'sallyPO' 
        AND caretaker_username = 'john'
        AND bid_start_period = date('2020-08-01')
        AND bid_end_period = date('2020-08-10');

CALL insert_review('sallyPO', 'petName', '2020-08-01', '2020-08-10', 'john', 2, 'TEST');
SELECT * FROM advertise_for_pet_categories; */

-- ======================

-- ======================
-- TEST CASES FOR check_leave() 
/*
-- 2 x 150 days EXACT
INSERT into pcs_user VALUES ('Kat', 'Kat@hotmail.com', 'Kat Low', 'password');
INSERT into caretakers VALUES ('Kat');
INSERT into full_time_caretakers VALUES ('Kat');
INSERT into verified_caretakers VALUES ('Kat','admin','2020-01-01');
INSERT into advertise_availabilities VALUES ('Kat', '2020-01-01', '2020-05-30');
INSERT into advertise_availabilities VALUES ('Kat', '2020-05-30', '2020-10-27');
INSERT into apply_leaves(username, leave_start_date, leave_end_date) VALUES ('Kat', '2020-10-28', '2020-10-29');
SELECT * FROM apply_leaves; -- verify that Kat has applied for leave

CALL approve_leave('Kat', 'admin', '2020-10-28','2020-10-29');
SELECT count(*) FROM approved_apply_leaves; --verify that the leave has been approved; 
SELECT * from advertise_availabilities;

--Only 1 x 150 days but still have enough time to do another 150 days  
INSERT into pcs_user VALUES ('Ben', 'Ben@hotmail.com', 'Ben Lao', 'password');
INSERT into caretakers VALUES ('Ben');
INSERT into full_time_caretakers VALUES ('Ben');
INSERT into verified_caretakers VALUES ('Ben','admin','2020-01-01');
INSERT into advertise_availabilities VALUES('Ben', '2020-01-01', '2020-05-30'); 
INSERT into advertise_for_pet_categories VALUES('Ben', '2020-01-01','dog', 10);
INSERT into apply_leaves VALUES ('Ben', '2020-06-01', '2020-06-02');
SELECT * FROM apply_leaves; -- verify that ben has applied for leave
CALL approve_leave('Ben','admin', '2020-06-01', '2020-06-02');
SELECT count(*) as num_approved from approved_apply_leaves; -- 2 records;
SELECT * from advertise_availabilities;


-- Doesn`t meet 2 x 150 days 
-- Have 1 but have bid during period 
INSERT into pcs_user VALUES ('James', 'James@hotmail.com', 'James Ho', 'password');
INSERT into caretakers VALUES ('James');
INSERT into full_time_caretakers VALUES ('James');
INSERT into verified_caretakers VALUES ('James','admin','2020-01-01');
INSERT into advertise_availabilities VALUES('James', '2020-01-01', '2020-05-30');
INSERT into advertise_availabilities VALUES ('James', '2020-05-31');
INSERT into advertise_for_pet_categories VALUES('James', '2020-05-31','cat', 10);

CALL make_bid('sallyPO', 'testName', '2020-06-01', '2020-06-10', 'James', 15, 'CASH', 'PET_OWNER_DELIVERS'); 
SELECT pet_owner_username, pet_name, bid_start_period, bid_end_period , caretaker_username, is_successful from makes; -- verify that there is a new bid created and that its already set to true 
INSERT into apply_leaves VALUES ('James','2020-05-31', '2020-06-15');
SELECT * from apply_leaves -- verify that james did not apply for leave  */

-- ======================

-- ======================
-- TEST CASES FOR complext query careTaker2CQ
/*
INSERT into pcs_user VALUES ('James', 'James@hotmail.com', 'James Ho', 'password');
INSERT into caretakers VALUES ('James');
INSERT into full_time_caretakers VALUES ('James');
INSERT into verified_caretakers VALUES ('James','admin','2020-01-01');
INSERT into advertise_availabilities VALUES ('James', '2020-06-01');
INSERT into advertise_for_pet_categories VALUES('James', '2020-06-01','cat', 12);
INSERT into advertise_for_pet_categories VALUES('James', '2020-06-01', 'dog', 14);

CALL make_bid('sallyPO', 'testName', '2020-06-01', '2020-06-10', 'James', 15, 'CASH', 'PET_OWNER_DELIVERS');
CALL make_bid('sallyPO', 'petName', '2020-06-02', '2020-06-10', 'James', 15, 'CASH', 'PET_OWNER_DELIVERS'); 
*/

/*
INSERT INTO pet_owners VALUES ('sallyPO', 'sally@gmail.com', 'sally chan', 'password');
INSERT INTO pet_categories VALUES ('dog', 'admin', 10);
INSERT INTO owned_pets VALUES ('sallyPO', 'doggy', 'cannot eat sweet things', 'dog');
CALL add_part_time_caretaker('john', 'john@yahoo.com', 'john tan', 'password');
CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password');
INSERT INTO verified_caretakers VALUES ('micky', 'admin');
*/
-- ======================
