import React, { useState } from "react";
import axios from "axios";

const PetComp = () => {
  const [addPetName, setAddPetName] = useState("");
  const [addSpecialReqs, setAddSpecialReqs] = useState("");
  const [addPetCatName, setAddPetCatName] = useState("");
  const [delPetName, setDelPetName] = useState("");

  return (
    <div style={{ background: "lightyellow", padding: "50px" }}>
      <div>Pet routes</div>
      <div>
        <div>Add Pets</div>
        <input
          placeholder="petName"
          value={addPetName}
          onChange={(e) => setAddPetName(e.target.value)}
        />
        <input
          placeholder="special reqs"
          value={addSpecialReqs}
          onChange={(e) => setAddSpecialReqs(e.target.value)}
        />
        <input
          placeholder="pet category"
          value={addPetCatName}
          onChange={(e) => setAddPetCatName(e.target.value)}
        />
        <button
          onClick={(e) =>
            axios
              .post("/api/pet/", {
                pet_name: addPetName,
                special_requirements: addSpecialReqs,
                pet_category_name: addPetCatName,
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Add pet
        </button>
      </div>
      <div>
        <div>Get Pets</div>
        <button
          onClick={(e) =>
            axios
              .get("/api/pet/")
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Get pets
        </button>
      </div>
      <div>
        <div>Delete Pets</div>
        <input
          placeholder="petName"
          value={delPetName}
          onChange={(e) => setDelPetName(e.target.value)}
        />
        <button
          onClick={(e) =>
            axios
              .delete("/api/pet/", {
                data: {
                  pet_name: delPetName,
                },
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Delete pet
        </button>
      </div>
    </div>
  );
};

export default PetComp;
