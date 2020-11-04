require("dotenv").config();
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import authMiddleware from "./middlewares/authMiddleware";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import petRoutes from "./routes/petRoutes";
import petCategoryRoutes from "./routes/petCategoryRoutes";
import bidRoutes from "./routes/bidRoutes";
import availabilityRoutes from "./routes/availabilityRoutes";
import godRoutes from "./routes/godRoutes";

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
    express.static(
      path.join(__dirname, "../../frontend/frontend/dist/frontend")
    )
  );
}
app.use(
  "/test/frontend-test",
  express.static(path.join(__dirname, "../../frontend-testing/build/"))
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pet", authMiddleware, petRoutes);
app.use("/api/pet-category", authMiddleware, petCategoryRoutes);
app.use("/api/availability", authMiddleware, availabilityRoutes);
app.use("/api/bid", authMiddleware, bidRoutes);
app.use("/api/god", godRoutes);

const options = {
  definition: {
    info: {
      title: "PoochFriendly Backend Routes", // Title (required)
      version: "1.4.0", // Version (required)
    },
  },
  // Path to the API docs
  apis: ["./src/routes/*.ts"],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Connected at ${PORT}!`));
