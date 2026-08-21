const { InferenceClient } = require("@huggingface/inference");

const hf = new InferenceClient(process.env.HF_TOKEN);

const MODEL = "sentence-transformers/all-MiniLM-L6-v2";

const generateEmbedding = async (text) => {
  const result = await hf.featureExtraction({
    model: MODEL,
    inputs: text,
  });

  return result;
};

module.exports = {
  generateEmbedding,
};
