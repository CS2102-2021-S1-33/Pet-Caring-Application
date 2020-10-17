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
 *   post:
 *     description: Makes a bid
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
 *             bidPrice:
 *               type: number
 *               example: 10
 *           required:
 *             - poUsername
 *             - poPetName
 *             - bidStartPeriod
 *             - bidEndPeriod
 *             - ctUsername
 *             - availabilityStartDate
 *             - availabilityEndDate
 *             - username
 *             - bidPrice:
 *     responses:
 *       200:
 *         description: Make bid OK
 *       400:
 *         description: Bad request
 */
bidRoutes.post("/", async (req, res) => {
  const {
    poUsername,
    poPetName,
    bidStartPeriod,
    bidEndPeriod,
    ctUsername,
    availabilityStartDate,
    availabilityEndDate,
    bidPrice,
  }: {
    poUsername: string;
    poPetName: string;
    bidStartPeriod: string;
    bidEndPeriod: string;
    ctUsername: string;
    availabilityStartDate: string;
    availabilityEndDate: string;
    bidPrice: number;
  } = req.body;

  await pool
    .query("CALL make_bid($1, $2, $3, $4, $5, $6, $7, $8)", [
      poUsername,
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
 *     description: Chooses a successful bid
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
 *             - ctUsername
 *             - availabilityStartDate
 *             - availabilityEndDate
 *             - username
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
    ctUsername,
    availabilityStartDate,
    availabilityEndDate,
    paymentMtd,
    petTransferMtd,
  }: {
    poUsername: string;
    poPetName: string;
    bidStartPeriod: string;
    bidEndPeriod: string;
    ctUsername: string;
    availabilityStartDate: string;
    availabilityEndDate: string;
    paymentMtd: PAYMENT_METHOD;
    petTransferMtd: TRANSFER_METHOD;
  } = req.body;

  await pool
    .query(
      "UPDATE makes SET is_successful=TRUE, payment_method=$8, transfer_method=$9 WHERE pet_owner_username=$1 AND pet_name=$2 AND bid_start_period=$3 AND bid_end_period=$4 AND ct_username=$5 AND availability_start_date=$6 AND availability_end_date=$7",
      [
        poUsername,
        poPetName,
        bidStartPeriod,
        bidEndPeriod,
        ctUsername,
        availabilityStartDate,
        availabilityEndDate,
        paymentMtd,
        petTransferMtd,
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
