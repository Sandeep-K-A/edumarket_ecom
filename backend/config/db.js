const mongoose = require("mongoose");
const logger = require("../utils/logger");

mongoose.set("strictQuery", true);

// Connection events
mongoose.connection.on("connecting", () => {
  logger.info("MongoDB connecting...");
});

mongoose.connection.on("connected", () => {
  logger.info("MongoDB connection established");
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB reconnected");
});

mongoose.connection.on("disconnecting", () => {
  logger.warn("MongoDB disconnecting...");
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  logger.error(
    {
      message: error.message,
      name: error.name,
      code: error.code,
    },
    "MongoDB connection error",
  );
});

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    logger.error("MONGO_URI is not defined in the environment");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(
      `MongoDB connected ${conn.connection.host}/${conn.connection.name}`,
    );
  } catch (err) {
    logger.error(
      {
        message: err.message,
        name: err.name,
        code: err.code,
      },
      "Failed to connect to MongoDB",
    );

    process.exit(1);
  }
}

module.exports = connectDB;
