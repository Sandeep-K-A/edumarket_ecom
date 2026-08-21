const mongoose = require("mongoose");

const productDetailsSchema = new mongoose.Schema(
  {
    // Textbook-specific
    author: {
      type: String,
      trim: true,
    },

    publisher: {
      type: String,
      trim: true,
    },

    format: {
      type: String,
      trim: true,
    },

    // Stationery-specific
    material: {
      type: String,
      trim: true,
    },

    color: {
      type: String,
      trim: true,
    },

    dimensions: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Textbooks", "Stationery"],
      trim: true,
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    // Category-specific product information
    details: {
      type: productDetailsSchema,
      default: {},
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    embedding: {
      type: [Number],
      default: undefined,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * Text index
 *
 * Used for free-text searching across:
 * name
 * description
 * category
 * tags
 */
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  tags: "text",
});

/*
 * Compound index
 *
 * Useful for queries such as:
 * category = "Textbooks"
 * sorted/filtered by price
 */
productSchema.index({
  category: 1,
  price: 1,
});

/*
 * Price index
 *
 * Useful for price filtering/sorting.
 */
productSchema.index({
  price: 1,
});

productSchema.index({ createdAt: -1 });
module.exports = mongoose.model("Product", productSchema);
