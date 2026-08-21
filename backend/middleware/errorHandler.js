const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    if (error.name === "ValidationError") {
      const details = Object.values(error.errors).map((e) => ({
        path: e.path,
        message: e.message,
      }));
      error = new ApiError(400, "Validation failed", details);
    } else if (error.name === "CastError") {
      error = new ApiError(400, `Invalid value for field '${error.path}'`);
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      error = new ApiError(409, `${field} already exists`);
    } else if (error.name === "JsonWebTokenError") {
      error = new ApiError(401, "Invalid token");
    } else if (error.name === "TokenExpiredError") {
      error = new ApiError(401, "Token expired");
    } else {
      error = new ApiError(500, "Internal server error");
    }
  }

  if (!error.isOperational || error.statusCode >= 500) {
    logger.error(
      { err, path: req.originalUrl, method: req.method },
      "Unhandled error",
    );
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
  });
}

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = { errorHandler, notFoundHandler };
