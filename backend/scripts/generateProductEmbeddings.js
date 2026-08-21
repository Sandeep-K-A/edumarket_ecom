require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Product = require("../models/product");
const {
  updateProductEmbedding,
} = require("../services/productEmbeddingService");

const generateEmbeddings = async () => {
  try {
    await connectDB();

    const products = await Product.find({
      isActive: true,
      embedding: { $exists: false },
    });

    console.log(`Products needing embeddings: ${products.length}`);

    for (const product of products) {
      console.log(`Generating embedding: ${product.name}`);

      await updateProductEmbedding(product);

      console.log(`✓ Done: ${product.name}`);
    }

    console.log("All embeddings generated.");
  } catch (error) {
    console.error("Embedding generation failed:", error);
  } finally {
    await mongoose.connection.close();
  }
};

generateEmbeddings();
