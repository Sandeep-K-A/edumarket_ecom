const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");

const orderAddressSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(15),
  line1: z.string().trim().min(3).max(150),
  line2: z.string().trim().max(150).optional(),
  city: z.string().trim().min(2).max(60),
  state: z.string().trim().min(2).max(60),
  postalCode: z.string().trim().min(3).max(12),
  country: z.string().trim().min(2).max(60),
});

// Auth Schema---
const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(50),
    email: z.string().trim().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain a special character"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1, "Password is required"),
  }),
});

// const refreshSchema = z.object({
//   body: z.object({
//     refreshToken: z.string().min(1, "refreshToken is required"),
//   }),
// });

//User Profile Schema---
// const updateProfileSchema = z.object({
//   body: z
//     .object({
//       name: z.string().trim().min(2).max(80).optional(),
//       phone: z.string().trim().optional(),
//       address: addressSchema.optional(),
//       avatarUrl: z.string().trim().url().optional(),
//     })
//     .refine(
//       (obj) => Object.keys(obj).length > 0,
//       "At least one field is required",
//     ),
// });

const updateUserRoleSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ role: z.enum(["admin", "user", "guest"]) }),
});

const idParamSchema = z.object({
  params: z.object({ id: objectId }),
});

//Product Schema---

const textbookDetailsSchema = z.object({
  author: z.string().trim().min(1, "Author is required"),
  publisher: z.string().trim().min(1, "Publisher is required"),
  format: z.string().trim().min(1, "Format is required"),
});

const stationeryDetailsSchema = z.object({
  material: z.string().trim().min(1, "Material is required"),
  color: z.string().trim().min(1, "Color is required"),
  dimensions: z.string().trim().min(1, "Dimensions are required"),
});

const commonProductFields = {
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(150, "Product name cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  tags: z.array(z.string().trim().min(1)).optional(),

  price: z.number().nonnegative("Price cannot be negative"),

  stock: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative")
    .default(0),

  images: z.array(z.string().trim().url("Invalid image URL")).optional(),
};

const productBodySchema = z.discriminatedUnion("category", [
  z.object({
    ...commonProductFields,
    category: z.literal("Textbooks"),
    details: textbookDetailsSchema,
  }),

  z.object({
    ...commonProductFields,
    category: z.literal("Stationery"),
    details: stationeryDetailsSchema,
  }),
]);

const createProductSchema = z.object({
  body: productBodySchema,
});

const updateProductSchema = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object({
      name: z.string().trim().min(2).max(150).optional(),
      description: z.string().trim().max(2000).optional(),
      category: z.string().trim().min(1).optional(),
      tags: z.array(z.string().trim()).optional(),
      price: z.number().nonnegative().optional(),
      stock: z.number().int().nonnegative().optional(),
      images: z.array(z.string().trim().url()).optional(),
      isActive: z.boolean().optional(),
    })
    .refine(
      (obj) => Object.keys(obj).length > 0,
      "At least one field is required",
    ),
});

const productQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    sortBy: z.enum(["price", "name", "createdAt", "ratingAverage"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

//Order Schema---
const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          product: objectId,
          quantity: z.coerce.number().int().positive(),
        }),
      )
      .min(1, "Order must contain at least one product"),

    shippingAddress: z.object({
      fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name cannot exceed 100 characters"),

      phone: z
        .string()
        .trim()
        .regex(/^[0-9]{10}$/, "Phone number must contain exactly 10 digits"),

      line1: z
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address cannot exceed 200 characters"),

      line2: z
        .string()
        .trim()
        .max(200, "Address cannot exceed 200 characters")
        .optional()
        .or(z.literal("")),

      city: z.string().trim().min(2, "City is required").max(100),

      state: z.string().trim().min(2, "State is required").max(100),

      postalCode: z.string().trim().min(3, "Postal code is required").max(10),

      country: z.string().trim().min(2, "Country is required").max(100),
    }),
  }),
});

const updateOrderStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.enum([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]),
  }),
});

module.exports = {
  objectId,
  registerSchema,
  loginSchema,
  updateUserRoleSchema,
  idParamSchema,
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  createOrderSchema,
  updateOrderStatusSchema,
};
