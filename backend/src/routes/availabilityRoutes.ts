import express from "express";
import pool from "../db/init";
import {
  generateDefaultErrorJson,
  generateResponseJson,
} from "../helpers/generateResponseJson";

const availabilityRoutes = express.Router();

/**
 * @swagger
 *
 * /api/availability:
 *   get:
 *     description: Caretaker uses this route. Gets ALL availability that fits within startPeriod and endPeriod (YYYY-MM-DD). If start and end period not given, then gets ALL availability made by the caretaker.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: startPeriod
 *         schema:
 *           type: string
 *           example: 2020-10-05
 *       - in: query
 *         name: endPeriod
 *         schema:
 *           type: string
 *           example: 2020-10-10
 *     responses:
 *       200:
 *         description: Get availabilities OK.
 *       400:
 *         description: Bad request
 */
availabilityRoutes.get("/", async (req, res) => {
  const { username } = req.user as any;

  const {
    startPeriod, //YYYY-MM-DD
    endPeriod, //YYYY-MM-DD
  }: { startPeriod: string; endPeriod: string } = req.query as any;

  if (startPeriod && endPeriod) {
    await pool
      .query(
        `
    SELECT aa.availability_start_date, aa.availability_end_date 
    FROM advertise_availabilities aa 
    WHERE aa.ct_username=$1 AND aa.availability_start_date >= date($2) AND aa.availability_end_date <= date($3)`,
        [username, startPeriod, endPeriod]
      )
      .then((result) =>
        res.json({
          ...generateResponseJson(
            "Successfully fetched all availabilities within given period",
            "",
            true
          ),
          result: result.rows,
        })
      )
      .catch((err) => res.status(400).json(generateDefaultErrorJson(err)));
  } else {
    await pool
      .query(
        `
    SELECT aa.availability_start_date, aa.availability_end_date 
    FROM advertise_availabilities aa 
    WHERE aa.ct_username=$1`,
        [username]
      )
      .then((result) =>
        res.json({
          ...generateResponseJson(
            "Successfully fetched all availabilities",
            "",
            true
          ),
          result: result.rows,
        })
      )
      .catch((err) => res.status(400).json(generateDefaultErrorJson(err)));
  }
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
        ...generateResponseJson("Successfully added availability", "", true),
        result: result.rows,
      })
    )
    .catch((err) => res.status(400).json(generateDefaultErrorJson(err)));
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
        ...generateResponseJson("Successfully deleted availability", "", true),
        result: result.rows,
      })
    )
    .catch((err) => res.status(400).json(generateDefaultErrorJson(err)));
});

export default availabilityRoutes;
