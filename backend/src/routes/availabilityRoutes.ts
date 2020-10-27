import express from "express";
import pool from "../db/init";
import {
  generateDefaultErrorJson,
  generateDefaultSuccessJson,
} from "../helpers/generateResponseJson";

const availabilityRoutes = express.Router();

/**
 * @swagger
 *
 * /api/availability:
 *   get:
 *     description: Caretaker uses this route. Gets ALL availability.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get all availabilities OK.
 *       400:
 *         description: Bad request
 */
availabilityRoutes.get("/", async (req, res) => {
  const { username } = req.user as any;

  await pool
    .query(
      `
    SELECT *
    FROM advertise_availabilities
    WHERE is_deleted = FALSE`
    )
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson(
          "Successfully fetched all availabilities"
        ),
        result: result.rows,
      })
    )
    .catch((err) => res.json(generateDefaultErrorJson(err)));
});

/**
 * @swagger
 *
 * /api/availability/:
 *   post:
 *     description: Caretaker uses this route. Adds an availability with daily price for a particular pet category. If availability exists then just add the pet category with given daily price.
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Date is always YYYY-MM-DD
 *         schema:
 *           type: object
 *           properties:
 *             availabilityStartDate:
 *               type: string
 *               example: 2020-12-01
 *             availabilityEndDate:
 *               type: string
 *               example: 2020-12-20
 *             petCategory:
 *               type: string
 *               example: test
 *             dailyPrice:
 *               type: number
 *               example: 20
 *           required:
 *             - availabilityStartDate
 *             - availabilityEndDate
 *             - petCategory
 *             - dailyPrice
 *     responses:
 *       200:
 *         description: Add availability OK
 *       400:
 *         description: Bad request
 */
availabilityRoutes.post("/", async (req, res) => {
  const { username } = req.user as any; // caretaker username
  const {
    availabilityStartDate,
    availabilityEndDate,
    petCategory,
    dailyPrice,
  }: {
    availabilityStartDate: string;
    availabilityEndDate: string;
    petCategory: string;
    dailyPrice: number;
  } = req.body;

  await pool
    .query("CALL advertise_availability($1, $2, $3, $4, $5)", [
      username,
      availabilityStartDate,
      availabilityEndDate,
      petCategory,
      dailyPrice,
    ])
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson("Successfully added availability"),
        result: result.rows,
      })
    )
    .catch((err) => res.json(generateDefaultErrorJson(err)));
});

/**
 * @swagger
 *
 * /api/availability/:
 *   delete:
 *     description: Caretaker uses this route. Deletes a availability period.
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Date is always YYYY-MM-DD
 *         schema:
 *           type: object
 *           properties:
 *             availabilityStartDate:
 *               type: string
 *               example: 2020-12-01
 *             availabilityEndDate:
 *               type: string
 *               example: 2020-12-20
 *           required:
 *             - availabilityStartDate
 *             - availabilityEndDate
 *     responses:
 *       200:
 *         description: Delete availability OK
 *       400:
 *         description: Bad request
 */
availabilityRoutes.delete("/", async (req, res) => {
  const { username } = req.user as any; // caretaker username
  const {
    availabilityStartDate,
    availabilityEndDate,
  }: {
    availabilityStartDate: string;
    availabilityEndDate: string;
  } = req.body;

  await pool
    .query(
      "UPDATE advertise_availabilities SET is_deleted=TRUE WHERE ct_username=$1 AND availability_start_date=$2 AND availability_end_date=$3",
      [username, availabilityStartDate, availabilityEndDate]
    )
    .then((result) =>
      res.json({
        ...generateDefaultSuccessJson("Successfully deleted availability"),
        result: result.rows,
      })
    )
    .catch((err) => res.json(generateDefaultErrorJson(err)));
});

export default availabilityRoutes;
