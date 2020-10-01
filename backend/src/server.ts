require("dotenv").config();
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRoutes from "./routes/auth";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const app = express();
app.use(
  session({
    store: new (require("connect-pg-simple")(session))(),
    secret: process.env.SESSION_SECRET || "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 12 * 60 * 60 * 1000 }, // 0.5 day
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_LOCAL_URL }));

app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV == "production") {
  app.use(
    express.static(path.join(__dirname, "../../frontend-prototype/build"))
  );
}

app.use("/auth", authRoutes);

const options = {
  definition: {
    info: {
      title: "PoochFriendly Backend Routes", // Title (required)
      version: "1.0.0", // Version (required)
    },
  },
  // Path to the API docs
  apis: [path.join(__dirname, "./routes/*.ts")],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Connected at ${PORT}!`));
