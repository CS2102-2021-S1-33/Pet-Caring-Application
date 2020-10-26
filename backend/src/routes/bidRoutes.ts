import express from "express";
import pool from "../db/init";

const bidRoutes = express.Router();

enum PAYMENT_METHOD {
  CREDIT_CARD = "CREDIT_CARD",
  CASH = "CASH",
}

enum TRANSFER_METHOD {
  PET_OWNER_DELIVERS = "PET_OWNER_DELIVERS",
  CARETAKER_PICKS_UP = "CARETAKER_PICKS_UP",
  TRANSFER_THROUGH_PCS_BUILDING = "TRANSFER_THROUGH_PCS_BUILDING",
}

/**
 * @swagger
 *
 * /api/bid:
 *   get:
 *     description: Gets ALL BIDS where the user participates as either pet owner or caretaker
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get all bids OK.
 *       400:
 *         description: Bad request
 */
bidRoutes.get("/", async (req, res) => {
  const { username }: { username: string } = req.user as any;
  await pool
    .query(
      "SELECT * FROM makes m WHERE m.pet_owner_username=$1 OR m.ct_username=$1",
      [username]
    )
    .then((result) => res.json({ result: result.rows }))
    .catch((err) =>
      res.status(400).json({ msg: "An error has occurred", err })
    );
});

/**
 * @swagger
 *
 * /api/bid:
 *   post:
 *     description: Makes a bid. Called by the pet owner.
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
 *             poPetName:
 *               type: string
 *               example: petName
 *             bidStartPeriod:
 *               type: string
 *               example: 2020-12-01
 *             bidEndPeriod:
 *               type: string
 *               example: 2020-12-10
 *             ctUsername:
 *               type: string
 *               example: john
 *             availabilityStartDate:
 *               type: string
 *               example: 2020-12-01
 *             availabilityEndDate:
 *               type: string
 *               example: 2020-12-20
 *             bidPrice:
 *               type: number
 *               example: 10
 *           required:
 *             - poPetName
 *             - bidStartPeriod
 *             - bidEndPeriod
 *             - ctUsername
 *             - availabilityStartDate
 *             - availabilityEndDate
 *             - bidPrice
 *     responses:
 *       200:
 *         description: Make bid OK
 *       400:
 *         description: Bad request
 */
bidRoutes.post("/", async (req, res) => {
  const {
    poPetName,
    bidStartPeriod,
    bidEndPeriod,
    ctUsername,
    availabilityStartDate,
    availabilityEndDate,
    bidPrice,
  }: {
    poPetName: string;
    bidStartPeriod: string;
    bidEndPeriod: string;
    ctUsername: string;
    availabilityStartDate: string;
    availabilityEndDate: string;
    bidPrice: number;
  } = req.body;

  const { username }: { username: string } = req.user as any; // PET OWNER USERNAME

  await pool
    .query("CALL make_bid($1, $2, $3, $4, $5, $6, $7, $8)", [
      username,
      poPetName,
      bidStartPeriod,
      bidEndPeriod,
      ctUsername,
      availabilityStartDate,
      availabilityEndDate,
      bidPrice,
    ])
    .then((result) =>
      res.json({
        msg: "successfully made call to make_bid",
      })
    )
    .catch((err) => res.status(400).json({ msg: err }));
});

/**
 * @swagger
 *
 * /api/bid/choose_bid:
 *   post:
 *     description: Chooses a successful bid. Called by the caretaker.
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
 *             poUsername:
 *               type: string
 *               example: sallyPO
 *             poPetName:
 *               type: string
 *               example: petName
 *             bidStartPeriod:
 *               type: string
 *               example: 2020-12-01
 *             bidEndPeriod:
 *               type: string
 *               example: 2020-12-10
 *             ctUsername:
 *               type: string
 *               example: john
 *             availabilityStartDate:
 *               type: string
 *               example: 2020-12-01
 *             availabilityEndDate:
 *               type: string
 *               example: 2020-12-20
 *             paymentMtd:
 *               type: string
 *               example: CREDIT_CARD
 *             petTransferMtd:
 *               type: string
 *               example: PET_OWNER_DELIVERS
 *           required:
 *             - poUsername
 *             - poPetName
 *             - bidStartPeriod
 *             - bidEndPeriod
 *             - availabilityStartDate
 *             - availabilityEndDate
 *             - paymentMtd
 *             - petTransferMtd
 *     responses:
 *       200:
 *         description: Create account OK
 *       400:
 *         description: Bad request
 */
bidRoutes.post("/choose_bid", async (req, res) => {
  const {
    poUsername,
    poPetName,
    bidStartPeriod,
    bidEndPeriod,
    availabilityStartDate,
    availabilityEndDate,
    paymentMtd,
    petTransferMtd,
  }: {
    poUsername: string;
    poPetName: string;
    bidStartPeriod: string;
    bidEndPeriod: string;
    availabilityStartDate: string;
    availabilityEndDate: string;
    paymentMtd: PAYMENT_METHOD;
    petTransferMtd: TRANSFER_METHOD;
  } = req.body;

  const { username }: { username: string } = req.user as any; // CARETAKER USERNAME

  await pool
    .query("CALL choose_bid($1, $2, $3, $4, $5, $6, $7, $8, $9)", [
      poUsername,
      poPetName,
      bidStartPeriod,
      bidEndPeriod,
      username,
      availabilityStartDate,
      availabilityEndDate,
      paymentMtd,
      petTransferMtd,
    ])
    .then((result) =>
      res.json({
        msg: "Successfully made update call",
        res: result.rows,
      })
    )
    .catch((err) =>
      res.status(400).json({ msg: "An error has occurred!", err })
    );
});

/**
 * @swagger
 *
 * /api/bid/submit-rating-review:
 *   post:
 *     description: Submits a rating and review for a transaction. Called by the pet owner.
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
 *             poPetName:
 *               type: string
 *               example: petName
 *             bidStartPeriod:
 *               type: string
 *               example: 2020-12-01
 *             bidEndPeriod:
 *               type: string
 *               example: 2020-12-10
 *             ctUsername:
 *               type: string
 *               example: john
 *             availabilityStartDate:
 *               type: string
 *               example: 2020-12-01
 *             availabilityEndDate:
 *               type: string
 *               example: 2020-12-20
 *             rating:
 *               type: number
 *               example: 3
 *             review:
 *               type: string
 *               example: Very good experience!
 *           required:
 *             - poPetName
 *             - bidStartPeriod
 *             - bidEndPeriod
 *             - ctUsername
 *             - availabilityStartDate
 *             - availabilityEndDate
 *             - rating
 *             - review
 *     responses:
 *       200:
 *         description: Create account OK
 *       400:
 *         description: Bad request
 */
bidRoutes.post("/submit-rating-review", async (req, res) => {
  const {
    poPetName,
    bidStartPeriod,
    bidEndPeriod,
    ctUsername,
    availabilityStartDate,
    availabilityEndDate,
    rating,
    review,
  }: {
    poPetName: string;
    bidStartPeriod: string;
    bidEndPeriod: string;
    ctUsername: string;
    availabilityStartDate: string;
    availabilityEndDate: string;
    rating: number;
    review: string;
  } = req.body;

  const { username }: { username: string } = req.user as any; // PET OWNER USERNAME

  await pool
    .query(
      `
      UPDATE makes SET rating=$8, review=$9 
      WHERE pet_owner_username=$1 AND pet_name=$2 AND bid_start_period=$3 AND bid_end_period=$4 AND ct_username=$5 AND availability_start_date=$6 AND availability_end_date=$7 AND is_successful=TRUE
      `,
      [
        username,
        poPetName,
        bidStartPeriod,
        bidEndPeriod,
        ctUsername,
        availabilityStartDate,
        availabilityEndDate,
        rating,
        review,
      ]
    )
    .then((result) =>
      res.json({
        msg: "Successfully made update call",
        res: result.rows,
      })
    )
    .catch((err) =>
      res.status(400).json({ msg: "An error has occurred!", err })
    );
});

export default bidRoutes;
