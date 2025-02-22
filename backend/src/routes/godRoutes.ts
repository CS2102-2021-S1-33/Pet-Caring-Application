// THIS IS THE GOD-MODE ROUTE THAT ENABLES DEVS WORKING ON FRONTEND TO RESET DB TO DEFAULT
// PLEASE DO NOT MODIFY THIS FILE UNLESS YOU KNOW WHAT YOU ARE DOING - RAY

import express from "express";
import pool from "../db/init";
import fs from "fs";
import path from "path";

const godRoutes = express.Router();

const schema = fs
  .readFileSync(path.join(__dirname, "../db/schema.sql"))
  .toString();
const pet_owners_mock_data = fs
  .readFileSync(path.join(__dirname, "../db/pet_owners.sql"))
  .toString();
const caretakers_mock_data = fs
  .readFileSync(path.join(__dirname, "../db/caretakers.sql"))
  .toString();
const procedures = fs
  .readFileSync(path.join(__dirname, "../db/procedures.sql"))
  .toString();
const triggers = fs
  .readFileSync(path.join(__dirname, "../db/triggers.sql"))
  .toString();
const sampleData = fs
  .readFileSync(path.join(__dirname, "../db/sampleData.sql"))
  .toString();
const sessions = fs
  .readFileSync(path.join(__dirname, "../db/sessions.sql"))
  .toString();

godRoutes.post("/", async (req, res) => {
  await pool
    .query(
      schema +
        pet_owners_mock_data +
        caretakers_mock_data +
        procedures +
        triggers +
        sampleData +
        sessions
    )
    .then((result) => res.json({ result: result.rows }))
    .catch((err) => res.json({ err }));
});

export default godRoutes;
