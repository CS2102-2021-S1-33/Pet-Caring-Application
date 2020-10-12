DROP TABLE IF EXISTS owned_pets;
DROP TABLE IF EXISTS pet_categories;
DROP TABLE IF EXISTS availabilities;
DROP TABLE IF EXISTS verified_caretakers;
DROP VIEW IF EXISTS users;
DROP TABLE IF EXISTS pcs_admins;
DROP TABLE IF EXISTS pet_owners;
DROP TABLE IF EXISTS part_time_caretakers;
DROP TABLE IF EXISTS full_time_caretakers;
DROP TABLE IF EXISTS caretakers;

CREATE TABLE pcs_admins (
    username VARCHAR PRIMARY KEY,
    password VARCHAR NOT NULL
);

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
    ct_username VARCHAR NOT NULL REFERENCES caretakers(username),
    admin_username VARCHAR NOT NULL REFERENCES pcs_admins(username),
    PRIMARY KEY(ct_username, admin_username)
);

CREATE TABLE availabilities (
    ct_username VARCHAR NOT NULL,
    admin_username VARCHAR NOT NULL, 
    availability_start_date VARCHAR,
    availability_end_date VARCHAR,
    PRIMARY KEY (ct_username, admin_username, availability_start_date, availability_end_date),
    FOREIGN KEY (ct_username, admin_username) REFERENCES verified_caretakers(ct_username, admin_username) ON DELETE CASCADE
);

CREATE VIEW users AS (
    SELECT * FROM pet_owners
    UNION
    SELECT * FROM caretakers
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

CREATE OR REPLACE PROCEDURE add_full_time_caretaker(
    username VARCHAR, 
    email VARCHAR,
    name VARCHAR,
    password VARCHAR) AS
'BEGIN
  INSERT INTO caretakers VALUES (username, email, name, password);
  INSERT INTO full_time_caretakers VALUES (username);
END;'
LANGUAGE plpgsql;

INSERT INTO pcs_admins VALUES ('admin', 'password');
INSERT INTO pet_owners VALUES ('sallyPO', 'sally@gmail.com', 'sally chan', 'password');
INSERT INTO pet_categories VALUES ('dog', 'admin', 10);
INSERT INTO owned_pets VALUES ('sallyPO', 'doggy', 'cannot eat sweet things', 'dog');
CALL add_part_time_caretaker('john', 'john@yahoo.com', 'john tan', 'password');
CALL add_full_time_caretaker('micky', 'mick@hotmail.com', 'micky mouse', 'password');
INSERT INTO verified_caretakers VALUES ('micky', 'admin');