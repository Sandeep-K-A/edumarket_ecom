const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { verifyAccessToken } = require("../utils/tokens");
const User = require("../models/user");

/**
 * Verifies the Bearer access token, loads the user and
 * attaches it to req.user and also rejects deactivated accounts.
 */
const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw ApiError.unauthorized("Authentication token missing");
  }

  let payload;

  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Access token expired");
    }

    throw ApiError.unauthorized("Invalid access token");
  }

  const user = await User.findById(payload.sub);

  if (!user || !user.isActive) {
    throw ApiError.unauthorized("User no longer exists or is deactivated");
  }

  req.user = user;
  next();
});

/**
 * Allows the request through as an unauthenticated "guest" if no
 * token is supplied, but still attaches req.user when a valid token
 * is present. Useful for endpoints guests may browse (e.g. product
 * listing) that behave differently for logged-in users.
 * written for the capstone project.
 */
const optionalAuth = catchAsync(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  // No access token means guest user.
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub);

    req.user = user && user.isActive ? user : null;
  } catch (err) {
    // Invalid/expired token should not prevent
    // public product access.
    req.user = null;
  }

  next();
});

/**
 * Role-based access control.
 * authorize('admin', 'user') to allow the access on protected routes.
 */
const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Role '${req.user.role}' is not permitted to perform this action`,
        ),
      );
    }
    next();
  };

module.exports = { protect, optionalAuth, authorize };
