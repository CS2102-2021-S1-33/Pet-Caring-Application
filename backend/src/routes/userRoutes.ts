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
 * /user/create-account:
 *   post:
 *     description: Creates a new user account
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *             userTypes:
 *               type: array
 *               items:
 *                 type: string
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
    userTypes,
  }: {
    username: string;
    password: string;
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
      .query("INSERT INTO pet_owners VALUES ($1, $2)", [username, password])
      .then((res) => 1)
      .catch((err) => errors.push(err));
  }

  if (validCheck && userTypes.includes(USER_TYPES.PART_TIME_CARETAKER)) {
    await pool
      .query("INSERT INTO part_time_caretakers VALUES ($1, $2)", [
        username,
        password,
      ])
      .then((res) => 1)
      .catch((err) => errors.push(err));
  }

  if (validCheck && userTypes.includes(USER_TYPES.FULL_TIME_CARETAKER)) {
    await pool
      .query("INSERT INTO full_time_caretakers VALUES ($1, $2)", [
        username,
        password,
      ])
      .then((res) => 1)
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

export default userRoutes;
