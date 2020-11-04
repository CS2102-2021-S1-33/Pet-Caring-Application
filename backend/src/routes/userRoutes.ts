import express from "express";
import { adminCQ, caretakerCQ, petOwnerCQ } from "../db/complexQueries";
import pool from "../db/init";
import {
  generateResponseJson,
  generateDefaultErrorJson,
  generateDefaultSuccessJson,
} from "../helpers/generateResponseJson";
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
 *     description: Creates a new user account for EITHER PET_OWNER OR PART_TIME_CARETAKER. If PET_OWNER, need to provide details of 1 pet.
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: userTypes can be PET_OWNER or PART_TIME_CARETAKER
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
 *             userType:
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
 *             - userType
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
    userType,
    petName,
    petSpecialReqs,
    petCategory,
  }: {
    username: string;
    password: string;
    email: string;
    name: string;
    userType: USER_TYPES;
    petName: string;
    petSpecialReqs: string;
    petCategory: string;
  } = req.body;

  const errors: Array<string> = [];

  if (userType == USER_TYPES.FULL_TIME_CARETAKER) {
    return res
      .status(400)
      .json(
        generateDefaultErrorJson(
          "Full-time caretaker must be manually added by admin"
        )
      );
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

  let validCheck = errors.length === 0;

  if (validCheck && userType === USER_TYPES.PET_OWNER) {
    if (!petName || !petSpecialReqs || !petCategory) {
      return res
        .status(400)
        .json(
          generateDefaultErrorJson(
            "pet-name, pet-special-reqs and pet-category not found"
          )
        );
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
  } else if (validCheck && userType === USER_TYPES.PART_TIME_CARETAKER) {
    await pool
      .query("CALL add_part_time_caretaker($1, $2, $3, $4)", [
        username,
        email,
        name,
        password,
      ])
      .then((result) => 1)
      .catch((err) => errors.push(err));
  } else {
    return res
      .status(400)
      .json(
        generateDefaultErrorJson(
          "userType must be either PET_OWNER or PART_TIME_CARETAKER"
        )
      );
  }

  res.json(
    generateResponseJson(
      errors.length > 0
        ? "An error has occurred"
        : "Successfully created account for new user",
      errors.join("\n"),
      errors.length == 0
    )
  );
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
      `SELECT u.username, u.email, u.name, u.user_type 
      FROM users u WHERE u.username=$1`,
      [username]
    )
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson("Selected user details"),
        result: result.rows[0],
      })
    )
    .catch((err) => res.json(generateDefaultErrorJson(err)));
});

/**
 * @swagger
 *
 * /api/user/:
 *   delete:
 *     description: Deletes a user. Must be logged in as admin to use this route.
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
 *               example: sallyPO
 *           required:
 *             - username
 *     responses:
 *       200:
 *         description: Delete user OK
 *       400:
 *         description: Bad request
 */
userRoutes.delete("/", authMiddleware, async (req, res) => {
  const { username }: { username: string } = req.body; // user to be deleted
  await pool
    .query("CALL delete_user($1)", [username])
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson("Successfully deleted user"),
        result: result.rows[0],
      })
    )
    .catch((err) => res.json(generateDefaultErrorJson(err)));
});

/**
 * @swagger
 *
 * /api/user/verify-pt-caretaker:
 *   post:
 *     description: Called by PCS Admin. Verifies a part-time caretaker so that he can advertise his availability and accept bids from pet owners
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
    .query("INSERT INTO verified_caretakers VALUES ($1, $2, CURRENT_DATE)", [
      ct_username,
      username,
    ])
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson("Successfully verified caretaker"),
        result: result.rows,
      })
    )
    .catch((err) => res.json(generateDefaultErrorJson(err)));
});

/**
 * @swagger
 *
 * /api/user/:
 *   get:
 *     description: Gets ALL user. Must be logged in to use this route.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get all users OK
 *       400:
 *         description: Bad request
 */
userRoutes.get("/", authMiddleware, async (req, res) => {
  await pool
    .query("SELECT * FROM users WHERE is_deleted = FALSE")
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson("Successfully get all users"),
        result: result.rows,
      })
    )
    .catch((err) => generateDefaultErrorJson(err));
});

/**
 * @swagger
 *
 * /api/user/admin-cq:
 *   get:
 *     description: Gets all underperforming ft ct- avg rating for past 90 days is < 2 OR no caretaking jobs for past 90 days (subquery + aggregation). Must be logged in as admin.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get admin cq OK
 *       400:
 *         description: Bad request
 */
userRoutes.get("/admin-cq", authMiddleware, async (req, res) => {
  await pool
    .query(
      `
      (SELECT username
      FROM full_time_caretakers
      EXCEPT
      SELECT caretaker_username
      FROM makes
      WHERE is_successful = TRUE AND CURRENT_DATE - bid_start_period <= 90)
      UNION
      SELECT m.caretaker_username
      FROM makes m INNER JOIN full_time_caretakers f ON m.caretaker_username = f.username AND m.is_successful = TRUE AND CURRENT_DATE - m.bid_start_period <= 60
      GROUP BY m.caretaker_username
      HAVING AVG(m.rating) < 2
    `
    )
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson(
          "Successfully generated admin complex query"
        ),
        result: result.rows,
      })
    )
    .catch((err) => generateDefaultErrorJson(err));
});

/**
 * @swagger
 *
 * /api/user/caretaker-cq:
 *   get:
 *     description: Gets total num of pet-days for this month. Must be logged in as caretaker.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get caretaker cq OK
 *       400:
 *         description: Bad request
 */
userRoutes.get("/caretaker-cq", authMiddleware, async (req, res) => {
  const { username } = req.user as any; // caretaker username
  await pool
    .query(
      `
      SELECT COALESCE(
        (
          SELECT SUM(m.bid_end_period - m.bid_start_period + 1)
          FROM makes m
          WHERE m.caretaker_username = $1 AND m.is_successful = TRUE AND EXTRACT(MONTH FROM CURRENT_DATE) = EXTRACT(MONTH FROM m.bid_start_period) 
          GROUP BY m.caretaker_username
        ), 0) AS num_pet_days`,
      [username]
    )
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson(
          "Successfully generated caretaker complex query"
        ),
        result: result.rows,
      })
    )
    .catch((err) => generateDefaultErrorJson(err));
});

/**
 * @swagger
 *
 * /api/user/petowner-cq:
 *   get:
 *     description: Gets average daily caretaking cost for each pet. Must be logged in as pet owner.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get petowner cq OK
 *       400:
 *         description: Bad request
 */
userRoutes.get("/petowner-cq", authMiddleware, async (req, res) => {
  const { username } = req.user as any; // pet owner username
  await pool
    .query(petOwnerCQ, [username])
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson(
          "Successfully generated pet owner complex query"
        ),
        result: result.rows,
      })
    )
    .catch((err) => generateDefaultErrorJson(err));
});

export default userRoutes;
