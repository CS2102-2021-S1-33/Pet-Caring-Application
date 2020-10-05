DROP TABLE IF EXISTS owned_pets;
DROP TABLE IF EXISTS pet_categories;
DROP TABLE IF EXISTS pcs_admins;
DROP TABLE IF EXISTS pet_owners;
DROP TABLE IF EXISTS part_time_caretakers;
DROP TABLE IF EXISTS full_time_caretakers;

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

CREATE TABLE part_time_caretakers (
    username VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE full_time_caretakers (
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

CREATE VIEW users AS (
    SELECT * FROM pet_owners
    UNION
    SELECT * FROM part_time_caretakers
    UNION
    SELECT * FROM full_time_caretakers
);

INSERT INTO pcs_admins VALUES ('admin', 'password');
INSERT INTO pet_owners VALUES ('sallyPO', 'sally@gmail.com', 'sally chan', 'password');
INSERT INTO pet_categories VALUES ('dog', 'admin', 10);
INSERT INTO owned_pets VALUES ('sallyPO', 'doggy', 'cannot eat sweet things', 'dog');
INSERT INTO part_time_caretakers VALUES ('john', 'john@yahoo.com', 'john tan', 'password');
INSERT INTO full_time_caretakers VALUES ('micky', 'mick@hotmail.com', 'micky mouse', 'password');