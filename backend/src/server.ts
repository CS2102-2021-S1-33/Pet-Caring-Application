require('dotenv').config();
import express from 'express';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT * from game_list", (err, res) => {
    console.log(err, res);
})

app.listen(PORT, () => console.log(`Connected at ${PORT}!`));