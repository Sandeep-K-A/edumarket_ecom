const express = require("express");
const userProfileController = require("../controllers/userProfileController");
const validate = require("../middleware/validate");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  updateProfileSchema,
  updateUserRoleSchema,
  idParamSchema,
} = require("../utils/validationSchemas");

const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  deactivateMyAccount,
  listUsers,
  getUserById,
  updateUserRole,
} = userProfileController;

router.use(protect); // every route below requires authentication

router.get("/me", getMyProfile);
router.patch("/me", validate(updateProfileSchema), updateMyProfile);
router.delete("/me", deactivateMyAccount);

// Admin-only user management
router.get("/", authorize("admin"), listUsers);
router.get("/:id", authorize("admin"), validate(idParamSchema), getUserById);
router.patch(
  "/:id/role",
  authorize("admin"),
  validate(updateUserRoleSchema),
  updateUserRole,
);

module.exports = router;
