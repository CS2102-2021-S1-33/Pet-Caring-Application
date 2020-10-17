import express from "express";
import passport from "passport";
import passportLocal from "passport-local";
import pool from "../db/init";

const authRoutes = express.Router();

passport.use(
  "local-user",
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

passport.use(
  "local-admin",
  new passportLocal.Strategy((username: string, password: string, done) => {
    pool.query(
      "SELECT * FROM pcs_admins WHERE username=$1 AND password=$2",
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

passport.serializeUser(({ username }, cb) => {
  cb(null, username);
});

passport.deserializeUser(function (username, cb) {
  pool.query(
    "SELECT * FROM (SELECT username FROM users UNION SELECT username FROM pcs_admins) AS t WHERE username=$1",
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
 * /api/auth/login:
 *   post:
 *     description: Login as a User
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
 *               example: test
 *             password:
 *               type: string
 *               example: password
 *           required:
 *             - username
 *             - password
 *     responses:
 *       200:
 *         description: Login successful
 */
authRoutes.post("/login", passport.authenticate("local-user"), (req, res) => {
  res.json({
    msg: "Found user",
    isAuthenticated: true,
  });
});

/**
 * @swagger
 *
 * /api/auth/login-admin:
 *   post:
 *     description: Login as an Admin
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
 *               example: test
 *             password:
 *               type: string
 *               example: password
 *           required:
 *             - username
 *             - password
 *     responses:
 *       200:
 *         description: Login successful
 */
authRoutes.post(
  "/login-admin",
  passport.authenticate("local-admin"),
  (req, res) => {
    res.json({
      msg: "Found admin",
      isAuthenticated: true,
    });
  }
);

/**
 * @swagger
 *
 * /api/auth/logout:
 *   post:
 *     description: Logout of the application
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Logout unsuccessful
 */
authRoutes.post("/logout", (req, res) => {
  req.logout();
  if (req.isAuthenticated()) {
    res.status(400).json({
      msg: "Logout unsuccessful",
    });
  } else {
    res.json({
      msg: "Logout successful",
    });
  }
});

export default authRoutes;