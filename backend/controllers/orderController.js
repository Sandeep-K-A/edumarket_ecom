const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/**
 * POST /api/orders
 * Protected (user). Validates stock, product name and price at
 * time of purchase, and atomically decrements stock.
 */
const createOrder = catchAsync(async (req, res) => {
  const { items, shippingAddress } = req.body;

  const session = await mongoose.startSession();
  let order;

  try {
    await session.withTransaction(async () => {
      const orderItems = [];
      let totalAmount = 0;

      for (const { product: productId, quantity } of items) {
        const product = await Product.findById(productId).session(session);

        if (!product || !product.isActive) {
          throw ApiError.notFound(`Product ${productId} not found`);
        }

        if (product.stock < quantity) {
          throw ApiError.badRequest(`Insufficient stock for '${product.name}'`);
        }

        product.stock -= quantity;
        await product.save({ session });

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity,
        });

        totalAmount += product.price * quantity;
      }

      const created = await Order.create(
        [
          {
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
          },
        ],
        { session },
      );

      order = created[0];
    });
  } finally {
    await session.endSession();
  }

  res.status(201).json({
    success: true,
    data: { order },
  });
});

/**
 * GET /api/orders/me
 * Protected. Returns the user order history.
 */
const getMyOrders = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

/**
 * GET /api/orders/:id
 * Protected. user can view their own order; admins can view any order.
 */
const getOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound("Order not found");

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    throw ApiError.forbidden("You do not have access to this order");
  }

  res.json({ success: true, data: { order } });
});

/**
 * GET /api/orders
 * Protected, admin only. Lists all orders, optionally filter by status.
 */
const listOrders = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

/**
 * PATCH /api/orders/:id/status
 * Protected, admin only. Transitions an order's fulfillment status.
 */
const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  );
  if (!order) throw ApiError.notFound("Order not found");
  res.json({ success: true, data: { order } });
});

/**
 * PATCH /api/orders/:id/cancel
 * Protected. user may cancel their own order while it's still pending.
 */
const cancelOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound("Order not found");

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    throw ApiError.forbidden("You do not have access to this order");
  }
  if (!["pending", "processing"].includes(order.status)) {
    throw ApiError.badRequest(
      `Order cannot be cancelled once it is '${order.status}'`,
    );
  }

  order.status = "cancelled";
  await order.save();

  // Restock cancelled items
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      }),
    ),
  );

  res.json({ success: true, data: { order } });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  listOrders,
  updateOrderStatus,
  cancelOrder,
};
