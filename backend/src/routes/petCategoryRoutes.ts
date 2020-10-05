import express from "express";
import pool from "../db/init";
import authMiddleware from "../middlewares/authMiddleware";
import Admin from "../models/Admin";

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
petCategoryRoutes.post("/", authMiddleware, (req, res) => {
  const {
    pet_category_name,
    base_price,
  }: {
    pet_category_name: string;
    base_price: string;
  } = req.body;

  const admin: Admin = req.user as Admin;

  pool
    .query("INSERT INTO pet_categories VALUES ($1, $2, $3)", [
      pet_category_name,
      admin.username,
      base_price,
    ])
    .then((result) => res.json({ msg: "Successfully added new pet category" }))
    .catch((err) =>
      res.status(400).json({ msg: "An error has occurred", err })
    );
});

export default petCategoryRoutes;
