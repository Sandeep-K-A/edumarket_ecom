const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/**
 * GET /api/users/me
 * Protected (admin or user). Returns the user profile.
 */
const getMyProfile = catchAsync(async (req, res) => {
  res.json({ success: true, data: { user: req.user.toSafeObject() } });
});

/**
 * PATCH /api/users/me
 * Protected. Updates the user profile fields.
 */
const updateMyProfile = catchAsync(async (req, res) => {
  const allowedFields = ["name", "phone", "address", "avatarUrl"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: { user: user.toSafeObject() } });
});

/**
 * DELETE /api/users/me
 * Protected. Soft-deletes (deactivates) the user account.
 */
const deactivateMyAccount = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    isActive: false,
    refreshTokens: [],
  });
  res.json({ success: true, message: "Account deactivated" });
});

/**
 * GET /api/users
 * Protected, admin only. Lists all users with pagination.
 */
const listUsers = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

  const [users, total] = await Promise.all([
    User.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);

  res.json({
    success: true,
    data: users.map((u) => u.toSafeObject()),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

/**
 * GET /api/users/:id
 * Protected, admin only.
 */
const getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("User not found");
  res.json({ success: true, data: { user: user.toSafeObject() } });
});

/**
 * PATCH /api/users/:id/role
 * Protected, admin only. Changes another user's role.
 */
const updateUserRole = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true },
  );
  if (!user) throw ApiError.notFound("User not found");
  res.json({ success: true, data: { user: user.toSafeObject() } });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  deactivateMyAccount,
  listUsers,
  getUserById,
  updateUserRole,
};
