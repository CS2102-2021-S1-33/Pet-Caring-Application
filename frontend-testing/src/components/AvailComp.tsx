import React, { useState } from "react";
import axios from "axios";

const AvailComp = () => {
  const [addStartDate, setAddStartDate] = useState("");
  const [addEndDate, setAddEndDate] = useState("");
  const [addPetCategory, setAddPetCategory] = useState("");
  const [addDailyPrice, setAddDailyPrice] = useState(0);
  const [delStartDate, setDelStartDate] = useState("");
  const [delEndDate, setDelEndDate] = useState("");

  return (
    <div style={{ background: "lightsalmon", padding: "50px" }}>
      <div>Availability routes</div>
      <div>
        <div>Add availability</div>
        <input
          placeholder="avail start date"
          value={addStartDate}
          onChange={(e) => setAddStartDate(e.target.value)}
        />
        <input
          placeholder="avail end date"
          value={addEndDate}
          onChange={(e) => setAddEndDate(e.target.value)}
        />
        <input
          placeholder="pet category"
          value={addPetCategory}
          onChange={(e) => setAddPetCategory(e.target.value)}
        />
        <input
          placeholder="daily price"
          value={addDailyPrice}
          onChange={(e) => setAddDailyPrice(parseInt(e.target.value))}
        />
        <button
          onClick={(e) =>
            axios
              .post("/api/availability/", {
                availabilityStartDate: addStartDate,
                availabilityEndDate: addEndDate,
                petCategory: addPetCategory,
                dailyPrice: addDailyPrice,
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Add availability
        </button>
      </div>
      <div>
        <div>Get availabilities</div>
        <button
          onClick={(e) =>
            axios
              .get("/api/availability/")
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Get availabilities
        </button>
      </div>
      <div>
        <div>Delete availabiliy</div>
        <input
          placeholder="avail start date"
          value={delStartDate}
          onChange={(e) => setDelStartDate(e.target.value)}
        />
        <input
          placeholder="avail end date"
          value={delEndDate}
          onChange={(e) => setDelEndDate(e.target.value)}
        />
        <button
          onClick={(e) =>
            axios
              .delete("/api/availability/", {
                data: {
                  availabilityStartDate: delStartDate,
                  availabilityEndDate: delEndDate,
                },
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Delete availability
        </button>
      </div>
    </div>
  );
};

export default AvailComp;
