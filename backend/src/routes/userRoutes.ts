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
 *         description: userTypes can be PET_OWNER, PART_TIME_CARETAKER, FULL_TIME_CARETAKER
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
 * /api/user/user-details:
 *   get:
 *     description: Gets ALL user details
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get user details OK
 *       400:
 *         description: Bad request
 */
userRoutes.get("/user-details", authMiddleware, async (req, res) => {
  const { username } = req.user as any;
  await pool
    .query(
      `SELECT u.username, u.email, u.name, 
        EXISTS (SELECT * FROM pet_owners po WHERE po.username = $1) AS is_pet_owner,
        EXISTS (SELECT * FROM part_time_caretakers ptc WHERE ptc.username = $1) AS is_pt_caretaker, 
        EXISTS (SELECT * FROM full_time_caretakers ftc WHERE ftc.username = $1) AS is_ft_caretaker 
      FROM users u WHERE u.username=$1`,
      [username]
    )
    .then((result) => res.json({ result: result.rows[0] }))
    .catch((err) => res.status(400).json({ msg: "An error has occured" }));
});

/**
 * @swagger
 *
 * /api/user/verify-pt-caretaker:
 *   post:
 *     description: Verifies a part-time caretaker so that he can advertise his availability and accept bids from pet owners
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
 *             ct_username:
 *               type: string
 *               example: john2
 *           required:
 *             - ct_username
 *     responses:
 *       200:
 *         description: Verify pt-caretaker OK
 *       400:
 *         description: Bad request
 */
userRoutes.post("/verify-pt-caretaker", authMiddleware, async (req, res) => {
  const { username } = req.user as any; // admin username
  const { ct_username }: { ct_username: string } = req.body;
  await pool
    .query("INSERT INTO verified_caretakers VALUES ($1, $2)", [
      ct_username,
      username,
    ])
    .then((result) => res.json({ result: result.rows }))
    .catch((err) => res.status(400).json({ msg: "An error has occured", err }));
});

export default userRoutes;
