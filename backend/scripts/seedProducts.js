const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("../models/product");

dotenv.config();

const products = [
  // =========================
  // TEXTBOOKS
  // =========================

  {
    name: "NCERT Chemistry Textbook for Class 12 - Part II",
    description:
      "NCERT Chemistry textbook for Class 12 covering important concepts in organic and inorganic chemistry.",
    category: "Textbooks",
    tags: ["chemistry", "ncert", "class 12", "cbse"],
    price: 155,
    stock: 25,
    images: ["https://covers.openlibrary.org/b/isbn/9788174507167-L.jpg"],
    details: {
      author: "National Council of Educational Research and Training",
      publisher: "National Council of Educational Research and Training",
      format: "Paperback",
    },
  },

  {
    name: "NCERT Physics Textbook for Class 12 - Part I",
    description:
      "Physics textbook designed for Class 12 students covering electrostatics, current electricity, magnetism and related topics.",
    category: "Textbooks",
    tags: ["physics", "ncert", "class 12", "cbse"],
    price: 140,
    stock: 20,
    images: ["https://covers.openlibrary.org/b/isbn/9788174507167-L.jpg"],
    details: {
      author: "National Council of Educational Research and Training",
      publisher: "National Council of Educational Research and Training",
      format: "Paperback",
    },
  },

  {
    name: "NCERT Mathematics Textbook for Class 12",
    description:
      "Comprehensive mathematics textbook covering calculus, algebra, vectors, probability and other Class 12 topics.",
    category: "Textbooks",
    tags: ["mathematics", "ncert", "class 12", "cbse"],
    price: 150,
    stock: 30,
    images: ["https://covers.openlibrary.org/b/isbn/9788174507167-L.jpg"],
    details: {
      author: "National Council of Educational Research and Training",
      publisher: "National Council of Educational Research and Training",
      format: "Paperback",
    },
  },

  // =========================
  // STATIONERY
  // =========================

  {
    name: "M&G 0.5mm Gel Pen - Black",
    description:
      "Smooth-writing 0.5mm gel pen designed for everyday studying, note-taking and office work.",
    category: "Stationery",
    tags: ["pen", "gel pen", "black", "writing"],
    price: 40,
    stock: 100,
    images: [
      "https://image.made-in-china.com/2f0j00QMIVLhwgZdzb/Office-Stationery-Cheap-Plastic-Black-0-5mm-Gel-Pen-From-China.webp",
    ],
    details: {
      brand: "M&G",
      material: "Plastic",
      color: "Black",
    },
  },

  {
    name: "M&G 0.5mm Gel Pen - Blue",
    description:
      "Fine-tip blue gel pen offering smooth and consistent writing for classroom notes and assignments.",
    category: "Stationery",
    tags: ["pen", "gel pen", "blue", "writing"],
    price: 40,
    stock: 85,
    images: [
      "https://image.made-in-china.com/2f0j00QMIVLhwgZdzb/Office-Stationery-Cheap-Plastic-Black-0-5mm-Gel-Pen-From-China.webp",
    ],
    details: {
      brand: "M&G",
      material: "Plastic",
      color: "Blue",
    },
  },

  {
    name: "M&G 0.5mm Gel Pen - Assorted Pack",
    description:
      "A convenient pack of smooth-writing gel pens suitable for school, university and everyday writing.",
    category: "Stationery",
    tags: ["pen", "gel pen", "assorted", "writing", "stationery"],
    price: 99,
    stock: 60,
    images: [
      "https://image.made-in-china.com/2f0j00QMIVLhwgZdzb/Office-Stationery-Cheap-Plastic-Black-0-5mm-Gel-Pen-From-China.webp",
    ],
    details: {
      brand: "M&G",
      material: "Plastic",
      color: "Assorted",
    },
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany({});

    console.log("Existing products removed");

    const createdProducts = await Product.insertMany(products);

    console.log(`${createdProducts.length} products successfully seeded.`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Product seeding failed:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();
