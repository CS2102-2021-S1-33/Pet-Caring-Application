import express from "express";
import pool from "../db/init";

const petRoutes = express.Router();

/**
 * @swagger
 *
 * /api/pet/:
 *   post:
 *     description: Adds a pet that is owned by a pet owner. Pet owner must be logged in.
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
 *             pet_name:
 *               type: string
 *               example: test
 *             special_requirements:
 *               type: string
 *               example: Need to eat every 3 hours
 *             pet_category_name:
 *               type: string
 *               example: test
 *           required:
 *             - pet_name
 *             - pet_category_name
 *     responses:
 *       200:
 *         description: Add pet OK
 *       400:
 *         description: Bad request
 */
petRoutes.post("/", async (req, res) => {
  const {
    pet_name,
    special_requirements,
    pet_category_name,
  }: {
    pet_name: string;
    special_requirements: string;
    pet_category_name: string;
  } = req.body;

  const { username } = req.user as any; //pet owner username
  await pool
    .query("INSERT INTO owned_pets VALUES ($1, $2, $3, $4)", [
      username,
      pet_name,
      special_requirements,
      pet_category_name,
    ])
    .then((result) => res.json({ msg: "Successfully added pet" }))
    .catch((err) =>
      res.status(400).json({ msg: "An error has occurred", err })
    );
});

/**
 * @swagger
 *
 * /api/pet/:
 *   get:
 *     description: Gets ALL pets belonging to the pet owner
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get pets OK.
 *       400:
 *         description: Bad request
 */
petRoutes.get("/", async (req, res) => {
  const { username } = req.user as any; // pet owner username
  await pool
    .query("SELECT * FROM owned_pets op WHERE op.pet_owner_username = $1", [
      username,
    ])
    .then((result) => res.json({ result: result.rows }))
    .catch((err) =>
      res.status(400).json({ msg: "An error has occurred", err })
    );
});

/**
 * @swagger
 *
 * /api/pet/:
 *   delete:
 *     description: Deletes a pet that is owned by a pet owner. Pet owner must be logged in.
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
 *             pet_name:
 *               type: string
 *               example: petName
 *           required:
 *             - pet_name
 *     responses:
 *       200:
 *         description: Add pet OK
 *       400:
 *         description: Bad request
 */
petRoutes.delete("/", async (req, res) => {
  const {
    pet_name,
  }: {
    pet_name: string;
  } = req.body;

  const { username } = req.user as any; // pet owner username

  await pool
    .query(
      "UPDATE owned_pets SET is_deleted=TRUE WHERE pet_owner_username = $1 AND pet_name = $2",
      [username, pet_name]
    )
    .then((result) => res.json({ result: result.rows }))
    .catch((err) =>
      res.status(400).json({ msg: "An error has occurred", err })
    );
});

export default petRoutes;
