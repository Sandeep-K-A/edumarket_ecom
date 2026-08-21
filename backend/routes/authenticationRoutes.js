const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/authMiddleware");
const { registerSchema, loginSchema } = require("../utils/validationSchemas");

const router = express.Router();

// Seperate ratelimiter for auth routes to slow down credential-stuffing / brute-force attempts on auth endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, please try again later",
  },
});

const { register, login, refresh, logout, me } = authController;

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", protect, logout);
router.get("/me", protect, me);

module.exports = router;
