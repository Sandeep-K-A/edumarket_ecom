require("dotenv").config();

const { generateEmbedding } = require("../utils/huggingfaceService");

const test = async () => {
  try {
    const embedding = await generateEmbedding(
      "Wireless Bluetooth headphones with noise cancellation",
    );

    console.log("Embedding generated");
    console.log("Dimensions:", embedding.length);
    console.log("First values:", embedding.slice(0, 5));
  } catch (error) {
    console.error("Embedding error:", error);
  }
};

test();
