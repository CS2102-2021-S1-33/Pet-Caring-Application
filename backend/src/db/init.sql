CREATE TABLE pcs_admin (
    username VARCHAR PRIMARY KEY,
    password VARCHAR NOT NULL
);

CREATE TABLE pet_owners (
    username VARCHAR PRIMARY KEY,
    password VARCHAR NOT NULL
);

CREATE TABLE part_time_caretakers (
    username VARCHAR PRIMARY KEY,
    password VARCHAR NOT NULL
);

CREATE TABLE full_time_caretakers (
    username VARCHAR PRIMARY KEY,
    password VARCHAR NOT NULL
);

CREATE VIEW users AS (
    SELECT * FROM pet_owners
    UNION
    SELECT * FROM part_time_caretakers
    UNION
    SELECT * FROM full_time_caretakers
);

INSERT INTO pcs_admin VALUES ('admin', 'password');
INSERT INTO pet_owners VALUES ('sally', 'password');
INSERT INTO part_time_caretakers VALUES ('john', 'password');
INSERT INTO full_time_caretakers VALUES ('micky', 'password');