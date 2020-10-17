import express from "express";
import pool from "../db/init";

const availabilityRoutes = express.Router();

/**
 * @swagger
 *
 * /api/availability:
 *   get:
 *     description: Gets ALL availability that fits within startPeriod and endPeriod. If start and end period not given, then gets ALL availability made by the user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: startPeriod
 *         schema:
 *           type: string
 *       - in: query
 *         name: endPeriod
 *         schema:
 *           type: string
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
      .then((result) => res.json({ result: result.rows }))
      .catch((err) =>
        res.status(400).json({ msg: "An error has occured", err })
      );
  } else {
    await pool
      .query(
        `
    SELECT aa.availability_start_date, aa.availability_end_date 
    FROM advertise_availabilities aa 
    WHERE aa.ct_username=$1`,
        [username]
      )
      .then((result) => res.json({ result: result.rows }))
      .catch((err) =>
        res.status(400).json({ msg: "An error has occured", err })
      );
  }
});

export default availabilityRoutes;
