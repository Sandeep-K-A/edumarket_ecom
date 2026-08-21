const express = require("express");
const productController = require("../controllers/productController");
const validate = require("../middleware/validate");
const {
  protect,
  optionalAuth,
  authorize,
} = require("../middleware/authMiddleware");
const {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  idParamSchema,
} = require("../utils/validationSchemas");

const router = express.Router();

const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  getProductRecommendations,
} = productController;

// Public: browsing, filtering, search
router.get("/", optionalAuth, validate(productQuerySchema), listProducts);
router.get("/categories", listCategories);
router.get("/:id/recommendations", getProductRecommendations);
router.get("/:id", validate(idParamSchema), getProduct);

// Admin: inventory management.
router.post(
  "/",
  protect,
  authorize("admin"),
  validate(createProductSchema),
  createProduct,
);
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  validate(updateProductSchema),
  updateProduct,
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validate(idParamSchema),
  deleteProduct,
);

module.exports = router;
