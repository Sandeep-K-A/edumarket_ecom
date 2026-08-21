const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokens");

/**
 * POST /api/auth/register
 * Public. Creates a new user. `role` defaults to 'user', only an
 * already-authenticated admin can create other admins.
 */
const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    role: "user",
  });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokens = [refreshToken];
  await user.save();

  res
    .status(201)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      data: { user: user.toSafeObject() },
    });
});

/**
 * POST /api/auth/login
 * Public. Verifies credentials and issues a fresh access token/refresh token.
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshTokens");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }
  if (!user.isActive) {
    throw ApiError.forbidden("This account has been deactivated");
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  // Keep the refresh-token list for multiple sessions.
  user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5);
  await user.save();

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      data: { user: user.toSafeObject() },
    });
});

/**
 * POST /api/auth/refresh
 * Public (requires a valid refresh token). Rotates the refresh token
 * and issues a new access token.
 */
const refresh = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw ApiError.unauthorized("Refresh token missing");
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  if (payload.tokenType !== "refresh") {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const user = await User.findById(payload.sub).select("+refreshTokens");

  if (!user || !user.refreshTokens.includes(refreshToken)) {
    throw ApiError.unauthorized("Refresh token has been revoked");
  }

  if (!user.isActive) {
    throw ApiError.unauthorized("User is deactivated");
  }

  const newAccessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);

  user.refreshTokens = user.refreshTokens
    .filter((token) => token !== refreshToken)
    .concat(newRefreshToken);

  await user.save();

  res
    .cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message: "Token refreshed successfully",
    });
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

/**
 * POST /api/auth/logout
 * Protected. Revokes the supplied refresh token so it can't be reused.
 */
const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { refreshTokens: refreshToken },
    });
  }

  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

/**
 * GET /api/auth/me
 * Protected. Returns the currently authenticated user.
 */
const me = catchAsync(async (req, res) => {
  res.json({ success: true, data: { user: req.user.toSafeObject() } });
});

module.exports = { register, login, refresh, logout, me };
