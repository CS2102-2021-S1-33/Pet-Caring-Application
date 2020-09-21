import express from "express";
import passport from "passport";
import passportLocal from "passport-local";
import pool from "../db/init";

const authRoutes = express.Router();

passport.use(
  new passportLocal.Strategy((username: string, password: string, done) => {
    pool.query(
      "SELECT * FROM username_password WHERE username=$1 AND password=$2",
      [username, password],
      (error, result) => {
        if (error) {
          return done(error);
        } else {
          return done(null, result.rows[0]);
        }
      }
    );
  })
);

passport.serializeUser(function ({ username, password }, cb) {
  cb(null, username);
});

passport.deserializeUser(function (username, cb) {
  pool.query(
    "SELECT * FROM username_password WHERE username=$1",
    [username],
    (error, result) => {
      if (error) {
        return cb(error);
      } else {
        return cb(null, result.rows[0]);
      }
    }
  );
});

authRoutes.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({
    user: req.user,
  });
});

export default authRoutes;
