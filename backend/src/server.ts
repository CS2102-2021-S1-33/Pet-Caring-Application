require("dotenv").config();
import express from "express";
import passport from "passport";
import authRoutes from "./routes/auth";

const app = express();
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Connected at ${PORT}!`));
