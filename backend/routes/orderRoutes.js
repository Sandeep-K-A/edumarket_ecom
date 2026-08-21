const express = require("express");
const orderController = require("../controllers/orderController");
const validate = require("../middleware/validate");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createOrderSchema,
  updateOrderStatusSchema,
  idParamSchema,
} = require("../utils/validationSchemas");

const router = express.Router();

router.use(protect);

const {
  createOrder,
  getMyOrders,
  getOrder,
  listOrders,
  updateOrderStatus,
  cancelOrder,
} = orderController;

router.post(
  "/",
  authorize("user", "admin"),
  validate(createOrderSchema),
  createOrder,
);
router.get("/me", authorize("user", "admin"), getMyOrders);
router.get(
  "/:id",
  authorize("user", "admin"),
  validate(idParamSchema),
  getOrder,
);
router.patch("/:id/cancel", validate(idParamSchema), cancelOrder);

//Admin: list of all orders and order fulfilment transition
router.get("/", authorize("admin"), listOrders);
router.patch(
  "/:id/status",
  authorize("admin"),
  validate(updateOrderStatusSchema),
  updateOrderStatus,
);

module.exports = router;
