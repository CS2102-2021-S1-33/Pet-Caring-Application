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
 *     description: Creates a new user account for EITHER PET_OWNER OR PART_TIME_CARETAKER
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
 *               type: string
 *               example: PET_OWNER
 *             petName:
 *               type: string
 *               example: petName
 *             petSpecialReqs:
 *               type: string
 *               example: Allergic to dust
 *             petCategory:
 *               type: string
 *               example: dog
 *           required:
 *             - username
 *             - email
 *             - name
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
    petName,
    petSpecialReqs,
    petCategory,
  }: {
    username: string;
    password: string;
    email: string;
    name: string;
    userTypes: USER_TYPES;
    petName: string;
    petSpecialReqs: string;
    petCategory: string;
  } = req.body;

  const errors: Array<string> = [];

  if (userTypes == USER_TYPES.FULL_TIME_CARETAKER) {
    return res.status(400).json({
      msg: "Full-time caretaker must be manually added by admin",
    });
  }

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

  if (validCheck && userTypes == USER_TYPES.PET_OWNER) {
    if (!petName && !petSpecialReqs && !petCategory) {
      return res.status(400).json({
        msg: "pet-name, pet-special-reqs and pet-category not found",
      });
    }
    await pool
      .query("CALL add_pet_owner($1, $2, $3, $4, $5, $6, $7)", [
        username,
        email,
        name,
        password,
        petName,
        petSpecialReqs,
        petCategory,
      ])
      .then((result) => 1)
      .catch((err) => errors.push(err));
  } else if (validCheck && userTypes == USER_TYPES.PART_TIME_CARETAKER) {
    await pool
      .query("CALL add_part_time_caretaker($1, $2, $3, $4)", [
        username,
        email,
        name,
        password,
      ])
      .then((result) => 1)
      .catch((err) => errors.push(err));
  }

  if (errors.length > 0) {
    res.status(400);
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
