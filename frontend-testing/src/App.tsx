import React from "react";
import axios from "axios";
import AvailComp from "./components/AvailComp";
import BidComp from "./components/BidComp";
import LoginComp from "./components/LoginComp";
import PetCatComp from "./components/PetCatComp";
import PetComp from "./components/PetComp";
import UserComp from "./components/UserComp";

function App() {
  if (process.env.NODE_ENV === "production") {
    axios.defaults.baseURL = "https://poochfriendly.herokuapp.com";
  } else {
    axios.defaults.baseURL = "http://localhost:5000";
  }
  axios.defaults.withCredentials = true;
  return (
    <div>
      <button
        onClick={(e) =>
          axios
            .post("/api/god")
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err))
        }
      >
        GOD
      </button>
      <LoginComp />
      <UserComp />
      <PetComp />
      <PetCatComp />
      <AvailComp />
      <BidComp />
    </div>
  );
}

export default App;
