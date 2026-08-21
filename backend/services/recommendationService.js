const { generateEmbedding } = require("../utils/huggingfaceService");
const Product = require("../models/product");

const productToText = (product) => {
  return [
    product.name,
    product.description,
    product.category,
    product.subcategory,
  ]
    .filter(Boolean)
    .join(". ");
};

const generateProductEmbedding = async (product) => {
  const text = productToText(product);

  return generateEmbedding(text);
};

const cosineSimilarity = (vectorA, vectorB) => {
  if (
    !Array.isArray(vectorA) ||
    !Array.isArray(vectorB) ||
    vectorA.length === 0 ||
    vectorB.length === 0 ||
    vectorA.length !== vectorB.length
  ) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] ** 2;
    magnitudeB += vectorB[i] ** 2;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

const getRecommendations = async (productId, limit = 4) => {
  const product = await Product.findById(productId).select(
    "name description category subcategory embedding",
  );

  if (
    !product ||
    !Array.isArray(product.embedding) ||
    product.embedding.length === 0
  ) {
    return [];
  }

  const products = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    embedding: {
      $exists: true,
      $type: "array",
      $ne: [],
    },
  }).select(
    "name description category subcategory price images stock embedding",
  );

  const recommendations = products
    .filter(
      (candidate) =>
        Array.isArray(candidate.embedding) &&
        candidate.embedding.length === product.embedding.length,
    )
    .map((candidate) => ({
      product: candidate,
      score: cosineSimilarity(product.embedding, candidate.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return recommendations.map(({ product }) => product);
};

module.exports = {
  productToText,
  generateProductEmbedding,
  cosineSimilarity,
  getRecommendations,
};
