require("dotenv").config();
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRoutes from "./routes/auth";

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_LOCAL_URL }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Connected at ${PORT}!`));
