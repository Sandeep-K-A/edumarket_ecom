const { generateProductEmbedding } = require("./recommendationService");

const updateProductEmbedding = async (product) => {
  const embedding = await generateProductEmbedding(product);

  product.embedding = embedding;

  await product.save();

  return product;
};

module.exports = {
  updateProductEmbedding,
};
