import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.withCredentials = true;

function App() {
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    login();
  }, []);

  const login = () => {
    axios
      .post("auth/login", { username, password })
      .then((res) => {
        setMsg(res.data.msg);
      })
      .catch((err) => {
        console.log(err.response);
        setMsg(`${err.response.status}: ${err.response.data.msg}`);
      });
  };

  const check = () => {
    axios
      .get("auth/check")
      .then((res) => {
        setMsg(res.data.msg);
      })
      .catch((err) => console.log(err.response));
  };

  const logout = () => {
    axios
      .post("auth/logout")
      .then((res) => {
        setMsg(res.data.msg);
      })
      .catch((err) => console.log(err.response));
  };

  return (
    <div className="App">
      <div>{msg}</div>
      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button onClick={(e) => login()}>Login</button>
      <button onClick={(e) => check()}>Check</button>
      <button onClick={(e) => logout()}>Logout</button>
    </div>
  );
}

export default App;
