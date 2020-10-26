import React, { useState } from "react";
import axios from "axios";

const BidComp = () => {
  /*
    {
  "poPetName": "petName",
  "bidStartPeriod": "2020-12-01T00:00:00.000Z",
  "bidEndPeriod": "2020-12-10T00:00:00.000Z",
  "ctUsername": "john",
  "availabilityStartDate": "2020-12-01T00:00:00.000Z",
  "availabilityEndDate": "2020-12-20T00:00:00.000Z",
  "bidPrice": 10
}*/
  /*
  "poUsername": "sallyPO",
  "poPetName": "petName",
  "bidStartPeriod": "2020-12-01T00:00:00.000Z",
  "bidEndPeriod": "2020-12-10T00:00:00.000Z",
  "availabilityStartDate": "2020-12-01T00:00:00.000Z",
  "availabilityEndDate": "2020-12-20T00:00:00.000Z",
  "paymentMtd": "CREDIT_CARD",
  "petTransferMtd": "PET_OWNER_DELIVERS"
}
*/
  /*
{
  "poPetName": "petName",
  "bidStartPeriod": "2020-12-01T00:00:00.000Z",
  "bidEndPeriod": "2020-12-10T00:00:00.000Z",
  "ctUsername": "john",
  "availabilityStartDate": "2020-12-01T00:00:00.000Z",
  "availabilityEndDate": "2020-12-20T00:00:00.000Z",
  "rating": 3,
  "review": "Very good experience!"
}
*/
  /*
{
  "poPetName": "petName",
  "bidStartPeriod": "2020-12-01T00:00:00.000Z",
  "bidEndPeriod": "2020-12-10T00:00:00.000Z",
  "ctUsername": "john",
  "availabilityStartDate": "2020-12-01T00:00:00.000Z",
  "availabilityEndDate": "2020-12-20T00:00:00.000Z"
}
*/
  const [addPoPetName, setAddPoPetName] = useState("");
  const [addBidStartPeriod, setAddBidStartPeriod] = useState("");
  const [addBidEndPeriod, setAddBidEndPeriod] = useState("");
  const [addCtUsername, setAddCtUsername] = useState("");
  const [addAvailStartDate, setAddAvailStartDate] = useState("");
  const [addAvailEndDate, setAddAvailEndDate] = useState("");
  const [addBidPrice, setAddBidPrice] = useState(0);

  const [delPoPetName, setDelPoPetName] = useState("");
  const [delBidStartPeriod, setDelBidStartPeriod] = useState("");
  const [delBidEndPeriod, setDelBidEndPeriod] = useState("");
  const [delCtUsername, setDelCtUsername] = useState("");
  const [delAvailStartDate, setDelAvailStartDate] = useState("");
  const [delAvailEndDate, setDelAvailEndDate] = useState("");

  const [chPoUsername, setChPoUsername] = useState("");
  const [chPoPetName, setChPoPetName] = useState("");
  const [chBidStartPeriod, setChBidStartPeriod] = useState("");
  const [chBidEndPeriod, setChBidEndPeriod] = useState("");
  const [chAvailStartDate, setChAvailStartDate] = useState("");
  const [chAvailEndDate, setChAvailEndDate] = useState("");
  const [paymentMtd, setPaymentMtd] = useState("");
  const [petTransferMtd, setPetTransferMtd] = useState("");

  const [rrPoPetName, setRrPoPetName] = useState("");
  const [rrBidStartPeriod, setRrBidStartPeriod] = useState("");
  const [rrBidEndPeriod, setRrBidEndPeriod] = useState("");
  const [rrCtUsername, setRrCtUsername] = useState("");
  const [rrAvailStartDate, setRrAvailStartDate] = useState("");
  const [rrAvailEndDate, setRrAvailEndDate] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  return (
    <div style={{ background: "lightgrey", padding: "50px" }}>
      <div>Bid routes</div>
      <div>
        <div>Make Bid</div>
        <input
          placeholder="pet name"
          value={addPoPetName}
          onChange={(e) => setAddPoPetName(e.target.value)}
        />
        <input
          placeholder="bid start period"
          value={addBidStartPeriod}
          onChange={(e) => setAddBidStartPeriod(e.target.value)}
        />
        <input
          placeholder="bid end period"
          value={addBidEndPeriod}
          onChange={(e) => setAddBidEndPeriod(e.target.value)}
        />
        <input
          placeholder="caretaker username"
          value={addCtUsername}
          onChange={(e) => setAddCtUsername(e.target.value)}
        />
        <input
          placeholder="avail start period"
          value={addAvailStartDate}
          onChange={(e) => setAddAvailStartDate(e.target.value)}
        />
        <input
          placeholder="avail end period"
          value={addAvailEndDate}
          onChange={(e) => setAddAvailEndDate(e.target.value)}
        />
        <input
          placeholder="bid price"
          value={addBidPrice}
          onChange={(e) => setAddBidPrice(parseInt(e.target.value))}
        />
        <button
          onClick={(e) =>
            axios
              .post("/api/bid/", {
                poPetName: addPoPetName,
                bidStartPeriod: addBidStartPeriod,
                bidEndPeriod: addBidEndPeriod,
                ctUsername: addCtUsername,
                availabilityStartDate: addAvailStartDate,
                availabilityEndDat: addAvailEndDate,
                bidPrice: addBidPrice,
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Make bid
        </button>
      </div>
      <div>
        <div>Delete Bid</div>
        <input
          placeholder="pet name"
          value={delPoPetName}
          onChange={(e) => setDelPoPetName(e.target.value)}
        />
        <input
          placeholder="bid start period"
          value={delBidStartPeriod}
          onChange={(e) => setDelBidStartPeriod(e.target.value)}
        />
        <input
          placeholder="bid end period"
          value={delBidEndPeriod}
          onChange={(e) => setDelBidEndPeriod(e.target.value)}
        />
        <input
          placeholder="caretaker username"
          value={delCtUsername}
          onChange={(e) => setDelCtUsername(e.target.value)}
        />
        <input
          placeholder="avail start period"
          value={delAvailStartDate}
          onChange={(e) => setDelAvailStartDate(e.target.value)}
        />
        <input
          placeholder="avail end period"
          value={delAvailEndDate}
          onChange={(e) => setDelAvailEndDate(e.target.value)}
        />
        <button
          onClick={(e) =>
            axios
              .delete("/api/bid/", {
                data: {
                  poPetName: delPoPetName,
                  bidStartPeriod: delBidStartPeriod,
                  bidEndPeriod: delBidEndPeriod,
                  ctUsername: delCtUsername,
                  availabilityStartDate: delAvailStartDate,
                  availabilityEndDat: delAvailEndDate,
                },
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Delete bid
        </button>
      </div>
      <div>
        <div>Get bids</div>
        <button
          onClick={(e) =>
            axios
              .get("/api/bid/")
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Get bids
        </button>
      </div>
      <div>
        <div>Choose bid</div>

        <input
          placeholder="pet owner username"
          value={chPoUsername}
          onChange={(e) => setChPoUsername(e.target.value)}
        />
        <input
          placeholder="pet name"
          value={chPoPetName}
          onChange={(e) => setChPoPetName(e.target.value)}
        />
        <input
          placeholder="bid start period"
          value={chBidStartPeriod}
          onChange={(e) => setChBidStartPeriod(e.target.value)}
        />
        <input
          placeholder="bid end period"
          value={chBidEndPeriod}
          onChange={(e) => setChBidEndPeriod(e.target.value)}
        />
        <input
          placeholder="avail start period"
          value={chAvailStartDate}
          onChange={(e) => setChAvailStartDate(e.target.value)}
        />
        <input
          placeholder="avail end period"
          value={chAvailEndDate}
          onChange={(e) => setChAvailEndDate(e.target.value)}
        />
        <input
          placeholder="payment mtd"
          value={paymentMtd}
          onChange={(e) => setPaymentMtd(e.target.value)}
        />
        <input
          placeholder="pet trf mtd"
          value={petTransferMtd}
          onChange={(e) => setPetTransferMtd(e.target.value)}
        />
        <button
          onClick={(e) =>
            axios
              .post("/api/bid/choose-bid", {
                poUsername: chPoUsername,
                poPetName: chPoPetName,
                bidStartPeriod: chBidStartPeriod,
                bidEndPeriod: chBidEndPeriod,
                availabilityStartPeriod: chAvailStartDate,
                availabilityEndPeriod: chAvailEndDate,
                paymentMtd,
                petTransferMtd,
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Choose bid
        </button>
      </div>
      <div>
        <div>Submit rating and review</div>
        <input
          placeholder="pet name"
          value={rrPoPetName}
          onChange={(e) => setRrPoPetName(e.target.value)}
        />
        <input
          placeholder="bid start period"
          value={rrBidStartPeriod}
          onChange={(e) => setRrBidStartPeriod(e.target.value)}
        />
        <input
          placeholder="bid end period"
          value={rrBidEndPeriod}
          onChange={(e) => setRrBidEndPeriod(e.target.value)}
        />
        <input
          placeholder="caretaker username"
          value={rrCtUsername}
          onChange={(e) => setRrCtUsername(e.target.value)}
        />
        <input
          placeholder="avail start period"
          value={rrAvailStartDate}
          onChange={(e) => setRrAvailStartDate(e.target.value)}
        />
        <input
          placeholder="avail end period"
          value={rrAvailEndDate}
          onChange={(e) => setRrAvailEndDate(e.target.value)}
        />
        <input
          placeholder="rating"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
        />
        <input
          placeholder="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button
          onClick={(e) =>
            axios
              .post("/api/bid/submit-rating-review", {
                poPetName: rrPoPetName,
                bidStartPeriod: rrBidStartPeriod,
                bidEndPeriod: rrBidEndPeriod,
                ctUsername: rrCtUsername,
                availabilityStartDate: rrAvailStartDate,
                availabilityEndDat: rrAvailEndDate,
                rating,
                review,
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Submit review and rating
        </button>
      </div>
    </div>
  );
};

export default BidComp;
