import express from "express";
import pool from "../db/init";
import authMiddleware from "../middlewares/authMiddleware";

const userRoutes = express.Router();

enum USER_TYPES {
  PET_OWNER = "PET_OWNER",
  PART_TIME_CARETAKER = "PART_TIME_CARETAKER",
  FULL_TIME_CARETAKER = "FULL_TIME_CARETAKER",
}

/**
 * @swagger
 *
 * /api/user/create-account:
 *   post:
 *     description: Creates a new user account
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: userTypes can take in PET_OWNER, PART_TIME_CARETAKER, FULL_TIME_CARETAKER
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: test
 *             email:
 *               type: string
 *               example: test@test.com
 *             name:
 *               type: string
 *               example: testname
 *             password:
 *               type: string
 *               example: password
 *             userTypes:
 *               type: array
 *               items:
 *                 type: string
 *               example: [PET_OWNER, PART_TIME_CARETAKER]
 *           required:
 *             - username
 *             - password
 *             - userTypes
 *     responses:
 *       200:
 *         description: Create account OK
 *       400:
 *         description: Bad request
 */
userRoutes.post("/create-account", async (req, res) => {
  const {
    username,
    password,
    email,
    name,
    userTypes,
  }: {
    username: string;
    password: string;
    email: string;
    name: string;
    userTypes: Array<USER_TYPES>;
  } = req.body;

  const errors: Array<string> = [];

  await pool
    .query("SELECT COUNT(*) FROM users WHERE username=$1", [username])
    .then((res) => {
      if (parseInt(res.rows[0]["count"]) > 0) {
        errors.push("A user already exists with that username");
      }
    })
    .catch((err) =>
      errors.push("An error has occured when querying users table")
    );

  let validCheck = errors.length == 0;

  if (validCheck && userTypes.includes(USER_TYPES.PET_OWNER)) {
    await pool
      .query("INSERT INTO pet_owners VALUES ($1, $2, $3, $4)", [
        username,
        email,
        name,
        password,
      ])
      .then((result) => 1)
      .catch((err) => errors.push(err));
  }

  if (validCheck && userTypes.includes(USER_TYPES.PART_TIME_CARETAKER)) {
    await pool
      .query("INSERT INTO part_time_caretakers VALUES ($1, $2, $3, $4)", [
        username,
        email,
        name,
        password,
      ])
      .then((result) => 1)
      .catch((err) => errors.push(err));
  }

  if (validCheck && userTypes.includes(USER_TYPES.FULL_TIME_CARETAKER)) {
    await pool
      .query("INSERT INTO full_time_caretakers VALUES ($1, $2, $3, $4)", [
        username,
        email,
        name,
        password,
      ])
      .then((result) => 1)
      .catch((err) => errors.push(err));
  }

  res.json({
    msg:
      errors.length > 0
        ? "An error has occurred"
        : "Successfully created account for new user",
    errors,
  });
});

/**
 * @swagger
 *
 * /api/user/{username}:
 *   get:
 *     description: Gets ALL user details
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Get user details OK
 *       400:
 *         description: Bad request
 */
userRoutes.get("/:username", async (req, res) => {
  const username: string = req.params.username;
  pool
    .query(
      `
    SELECT 
      u.username, 
      u.email, 
      u.name, 
      o.pet_name, 
      o.special_requirements, 
      o.pet_category_name, 
      p.set_by, 
      p.base_price
    FROM users u LEFT OUTER JOIN owned_pets o ON u.username = o.pet_owner_username 
      LEFT OUTER JOIN pet_categories p ON o.pet_category_name = p.pet_category_name
    WHERE u.username=$1`,
      [username]
    )
    .then((result) => res.json({ result: result.rows }))
    .catch((err) => res.status(400).json({ msg: "An error has occured" }));
});

export default userRoutes;
