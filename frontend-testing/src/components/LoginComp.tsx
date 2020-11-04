import React, { useState } from "react";
import axios from "axios";

const LoginComp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ background: "lightblue", padding: "50px" }}>
      <div>Login</div>
      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={(e) =>
          axios
            .post("/api/auth/login", { username, password })
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err))
        }
      >
        Login-User
      </button>
      <button
        onClick={(e) =>
          axios
            .post("/api/auth/login-admin", { username, password })
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err))
        }
      >
        Login-Admin
      </button>
      <button
        onClick={(e) =>
          axios
            .post("/api/auth/logout")
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err))
        }
      >
        Logout
      </button>
    </div>
  );
};

export default LoginComp;
