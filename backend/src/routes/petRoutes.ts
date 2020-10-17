import express from "express";
import pool from "../db/init";
import User from "../models/User";

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
petRoutes.post("/", (req, res) => {
  const {
    pet_name,
    special_requirements,
    pet_category_name,
  }: {
    pet_name: string;
    special_requirements: string;
    pet_category_name: string;
  } = req.body;

  if (req.user) {
    const user = req.user as User;
    pool
      .query("INSERT INTO owned_pets VALUES ($1, $2, $3, $4)", [
        user.username,
        pet_name,
        special_requirements,
        pet_category_name,
      ])
      .then((result) => res.json({ msg: "Successfully added pet" }))
      .catch((err) =>
        res.status(400).json({ msg: "An error has occurred", err })
      );
  } else {
    res.status(400).json({
      msg: "No user object found in request",
    });
  }
});

export default petRoutes;
