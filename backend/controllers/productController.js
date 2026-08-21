const Product = require("../models/product");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { getRecommendations } = require("../services/recommendationService");

/**
 * GET /api/products
 * Public. Supports:
 *   - search across name,description,category,tags
 *   - category filter
 *   - price range filter
 *   - sorting
 *   - pagination
 */
const listProducts = catchAsync(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sortBy,
    order,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {
    isActive: true,
  };

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.min(Number(limit) || 20, 100);

  const sortField = sortBy || "createdAt";
  const sortDirection = order === "asc" ? 1 : -1;

  const sort = {
    [sortField]: sortDirection,
  };

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip((currentPage - 1) * currentLimit)
      .limit(currentLimit)
      .lean(),

    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      pages: Math.ceil(total / currentLimit),
    },
  });
});

/**
 * GET /api/products/:id
 * Public. Also logs a "view" against the requesting user (if
 * authenticated)
 */
const getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive)
    throw ApiError.notFound("Product not found");

  if (req.user) {
    const User = require("../models/user");
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        viewedProducts: {
          $each: [{ product: product._id, viewedAt: new Date() }],
          $slice: -50, // keep only the most recent 50 views
        },
      },
    });
  }

  res.json({ success: true, data: { product } });
});

const getProductRecommendations = catchAsync(async (req, res) => {
  const { id } = req.params;

  const recommendations = await getRecommendations(id, 4);

  res.json({
    success: true,
    data: recommendations,
  });
});

/**
 * POST /api/products
 * Protected, admin only.
 */
const createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: { product } });
});

/**
 * PATCH /api/products/:id
 * Protected, admin only.
 */
const updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw ApiError.notFound("Product not found");
  res.json({ success: true, data: { product } });
});

/**
 * DELETE /api/products/:id
 * Protected, admin only. Soft delete to preserve order history integrity.
 */
const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  );
  if (!product) throw ApiError.notFound("Product not found");
  res.json({ success: true, message: "Product deleted" });
});

/**
 * GET /api/products/categories
 * Public. Category list of all the products.
 */
const listCategories = catchAsync(async (req, res) => {
  const categories = await Product.distinct("category", { isActive: true });
  res.json({ success: true, data: categories });
});

module.exports = {
  listProducts,
  getProduct,
  getProductRecommendations,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
};
