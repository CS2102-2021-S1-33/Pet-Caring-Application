import express from "express";
import passport from "passport";
import passportLocal from "passport-local";
import pool from "../db/init";

const authRoutes = express.Router();

passport.use(
  new passportLocal.Strategy((username: string, password: string, done) => {
    pool.query(
      "SELECT * FROM users WHERE username=$1 AND password=$2",
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
    "SELECT * FROM users WHERE username=$1",
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

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     description: Login to the application
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
 *             username:
 *               type: string
 *             password:
 *               type: string
 *           required:
 *             - username
 *             - password
 *     responses:
 *       200:
 *         description: Successful login
 */
authRoutes.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({
    msg: "Found user",
    user: req.user,
  });
});

authRoutes.get("/check", (req, res) => {
  res.json({
    msg: `authenticated? ${req.isAuthenticated()}`,
  });
});

authRoutes.post("/logout", (req, res) => {
  req.logout();
  res.json({
    msg: `authenticated? ${req.isAuthenticated()}`,
  });
});

export default authRoutes;
