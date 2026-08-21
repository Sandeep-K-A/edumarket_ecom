require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
    );
  });

  process.on("unhandledRejection", (err) => {
    logger.error({ err }, "Unhandled promise rejection — shutting down");
    server.close(() => process.exit(1));
  });

  process.on("SIGTERM", () => {
    logger.info("SIGTERM received — shutting down gracefully");
    server.close(() => process.exit(0));
  });
}

startServer();
