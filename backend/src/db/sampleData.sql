-- SAMPLE DATA (FOR TESTING)
INSERT INTO pcs_admins VALUES ('admin', 'password');
INSERT INTO pet_categories VALUES ('dog', 'admin', 10);
INSERT INTO pet_categories VALUES ('test', 'admin', 10);

CALL add_part_time_caretaker('john', 'john@yahoo.com', 'john tan', 'password');
INSERT INTO verified_caretakers VALUES ('john', 'admin', CURRENT_DATE); -- verify John as a PT-CT

CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password', 'admin', 'dog', 10); -- should insert
--CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password', 'admin', 'dog', 9); -- should NOT insert as daily_price < base_price
--CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password', 'admin', 'cat', 10); -- should NOT insert as 'cat' does not exist as a pet category

CALL add_pet_owner('sallyPO', 'sally@gmail.com', 'sally chan', 'password', 'petName', 'likes something', 'dog'); -- should insert 
--CALL add_pet_owner('sallyPO', 'sally@gmail.com', 'sally chan', 'password', 'petName', 'likes something', 'cat'); -- should NOT insert as 'cat' does not exist as a pet category

INSERT INTO owned_pets VALUES ('sallyPO', 'testName', 'special', 'test'); -- now sallyPO has a dog and a test pet

CALL advertise_availability('john', '2020-12-01', '2020-12-20', 'dog', 11); -- should insert
--CALL advertise_availability('john', DATE '2020-12-01', DATE '2020-12-20', 'test', 20); -- should insert
--CALL advertise_availability('john', DATE '2020-12-01', DATE '2020-12-20', 'dog', 9); -- should NOT insert as daily_price < base_price
--CALL advertise_availability('john', DATE '2020-12-01', DATE '2020-12-20', 'cat', 10); -- should NOT insert as 'cat' does not exist as a pet category
--CALL advertise_availability('random', DATE '2020-12-01', DATE '2020-12-20', 'cat', 10); -- should NOT insert as 'random' is not a username of a verified caretaker

CALL make_bid('sallyPO', 'petName', '2020-12-01', '2020-12-10', 'john', '2020-12-01', '2020-12-20', 12); -- should insert
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