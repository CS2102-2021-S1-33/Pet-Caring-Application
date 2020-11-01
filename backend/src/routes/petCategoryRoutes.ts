import express from "express";
import pool from "../db/init";

const petCategoryRoutes = express.Router();

/**
 * @swagger
 *
 * /api/pet-category/:
 *   post:
 *     description: Adds a pet category with a corresponding base price
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
 *             pet_category_name:
 *               type: string
 *               example: test
 *             base_price:
 *               type: integer
 *               example: 30
 *           required:
 *             - pet_category_name
 *             - base_price
 *     responses:
 *       200:
 *         description: Add pet category OK
 *       400:
 *         description: Bad request
 */
petCategoryRoutes.post("/", async (req, res) => {
  const {
    pet_category_name,
    base_price,
  }: {
    pet_category_name: string;
    base_price: string;
  } = req.body;

  const { username } = req.user as any;

  await pool
    .query("INSERT INTO pet_categories VALUES ($1, $2, $3)", [
      pet_category_name,
      username,
      base_price,
    ])
    .then((result) => res.json({ msg: "Successfully added new pet category" }))
    .catch((err) =>
      res.status(400).json({ msg: "An error has occurred", err })
    );
});

/**
 * @swagger
 *
 * /api/pet-category/:
 *   get:
 *     description: Gets ALL pet-categories and their associated base price
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get pet-categories OK.
 *       400:
 *         description: Bad request
 */
petCategoryRoutes.get("/", async (req, res) => {
  await pool
    .query("SELECT * FROM pet_categories")
    .then((result) => res.json({ result: result.rows }))
    .catch((err) => res.status(400).json({ msg: "An error has occured", err }));
});

export default petCategoryRoutes;
