const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pinoHttp = require("pino-http");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authenticationRoutes = require("./routes/authenticationRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const logger = require("./utils/logger");

const app = express();

//Security and parsing middlewares---
app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN
      : "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

//API rate limit
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

//Health Check---
app.get("/health", (req, res) =>
  res.json({ success: true, status: "ok", uptime: process.uptime() }),
);

//API routes---
app.use("/api/auth", authenticationRoutes);
app.use("/api/users", userProfileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

//Centralized error handling---
app.use(notFoundHandler);
app.use(errorHandler);
module.exports = app;
