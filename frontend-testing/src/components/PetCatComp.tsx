import React, { useState } from "react";
import axios from "axios";

const PetCatComp = () => {
  const [addPetCategoryName, setAddPetCategoryName] = useState("");
  const [addBasePrice, setAddBasePrice] = useState(0);
  const [delPetCatName, setDelPetCatName] = useState("");

  return (
    <div style={{ background: "lightpink", padding: "50px" }}>
      <div>Pet Categories route</div>
      <div>
        <div>Add Pet Categories</div>
        <input
          placeholder="pet category name"
          value={addPetCategoryName}
          onChange={(e) => setAddPetCategoryName(e.target.value)}
        />
        <input
          placeholder="base price"
          value={addBasePrice}
          onChange={(e) => setAddBasePrice(parseInt(e.target.value))}
        />
        <button
          onClick={(e) =>
            axios
              .post("/api/pet-category/", {
                pet_category_name: addPetCategoryName,
                base_price: addBasePrice,
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Add Pet category
        </button>
      </div>
      <div>
        <div>Get Pet Category</div>
        <button
          onClick={(e) =>
            axios
              .get("/api/pet-category/")
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Get pets
        </button>
      </div>
      <div>
        <div>Delete Pet Category</div>
        <input
          placeholder="petCatName"
          value={delPetCatName}
          onChange={(e) => setDelPetCatName(e.target.value)}
        />
        <button
          onClick={(e) =>
            axios
              .delete("/api/pet-category/", {
                data: {
                  pet_category_name: delPetCatName,
                },
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Delete pet category
        </button>
      </div>
    </div>
  );
};

export default PetCatComp;
