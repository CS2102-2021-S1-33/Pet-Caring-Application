import express from "express";
import pool from "../db/init";
import {
  generateDefaultErrorJson,
  generateDefaultSuccessJson,
} from "../helpers/generateResponseJson";

const petCategoryRoutes = express.Router();

/**
 * @swagger
 *
 * /api/pet-category/:
 *   post:
 *     description: Adds a pet category with a corresponding base price. Called by the PCS Admin.
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
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson("Successfully added new pet category"),
        result: result.rows,
      })
    )
    .catch((err) => res.status(400).json(generateDefaultErrorJson(err)));
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
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson(
          "Successfully fetched all pet categories and their corresponding base price"
        ),
        result: result.rows,
      })
    )
    .catch((err) => res.status(400).json(generateDefaultErrorJson(err)));
});

/**
 * @swagger
 *
 * /api/pet-category/:
 *   delete:
 *     description: Delets a pet category.
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
 *           required:
 *             - pet_category_name
 *     responses:
 *       200:
 *         description: Delete pet category OK
 *       400:
 *         description: Bad request
 */
petCategoryRoutes.delete("/", async (req, res) => {
  const {
    pet_category_name,
  }: {
    pet_category_name: string;
  } = req.body;
  await pool
    .query(
      `UPDATE pet_categories SET is_deleted=TRUE WHERE pet_category_name=$1`,
      [pet_category_name]
    )
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson("Successfully deleted pet category"),
        result: result.rows,
      })
    )
    .catch((err) => res.status(400).json(generateDefaultErrorJson(err)));
});

export default petCategoryRoutes;
