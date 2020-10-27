import React, { useState } from "react";
import axios from "axios";

const UserComp = () => {
  const [caUsername, setCaUsername] = useState("");
  const [caEmail, setCaEmail] = useState("");
  const [caName, setCaName] = useState("");
  const [caPassword, setCaPassword] = useState("");
  const [caUserType, setCaUserType] = useState("");
  const [caPetName, setCaPetName] = useState("");
  const [caPetSpecialReqs, setCaPetSpecialReqs] = useState("");
  const [caPetCategory, setCaPetCategory] = useState("");
  const [delUsername, setDelUsername] = useState("");
  const [verUsername, setVerUsername] = useState("");
  return (
    <div style={{ background: "lightgreen", padding: "50px" }}>
      <div>User routes</div>
      <div>
        <div>Create acc</div>
        <input
          placeholder="username"
          value={caUsername}
          onChange={(e) => setCaUsername(e.target.value)}
        />
        <input
          placeholder="email"
          value={caEmail}
          onChange={(e) => setCaEmail(e.target.value)}
        />
        <input
          placeholder="name"
          value={caName}
          onChange={(e) => setCaName(e.target.value)}
        />
        <input
          placeholder="password"
          value={caPassword}
          onChange={(e) => setCaPassword(e.target.value)}
        />
        <input
          placeholder="userType"
          value={caUserType}
          onChange={(e) => setCaUserType(e.target.value)}
        />
        <input
          placeholder="petName"
          value={caPetName}
          onChange={(e) => setCaPetName(e.target.value)}
        />
        <input
          placeholder="petSpecialReqs"
          value={caPetSpecialReqs}
          onChange={(e) => setCaPetSpecialReqs(e.target.value)}
        />
        <input
          placeholder="petCategory"
          value={caPetCategory}
          onChange={(e) => setCaPetCategory(e.target.value)}
        />
        <button
          onClick={(e) =>
            axios
              .post("/api/user/create-account", {
                username: caUsername,
                email: caEmail,
                name: caName,
                password: caPassword,
                userType: caUserType,
                petName: caPetName,
                petSpecialReqs: caPetSpecialReqs,
                petCategory: caPetCategory,
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Create Acc
        </button>
      </div>
      <div>
        <div>Get all users</div>
        <button
          onClick={(e) =>
            axios
              .get("/api/user/")
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Get all users
        </button>
      </div>
      <div>
        <div>Get user details</div>
        <button
          onClick={(e) =>
            axios
              .get("/api/user/user-details")
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Get user detail
        </button>
      </div>
      <div>
        <div>Delete user</div>
        <input
          placeholder="username"
          onChange={(e) => setDelUsername(e.target.value)}
          value={delUsername}
        />
        <button
          onClick={(e) =>
            axios
              .delete("/api/user/", { data: { username: delUsername } })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Delete user
        </button>
      </div>
      <div>
        <div>Verify PT caretaker</div>
        <input
          placeholder="ct-username"
          value={verUsername}
          onChange={(e) => setVerUsername(e.target.value)}
        />
        <button
          onClick={(e) =>
            axios
              .post("/api/user/verify-pt-caretaker", {
                ct_username: verUsername,
              })
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
          }
        >
          Verify pt caretaker
        </button>
      </div>
    </div>
  );
};

export default UserComp;
