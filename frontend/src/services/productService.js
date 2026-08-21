import api from "./api";

export const getProducts = async (params = {}) => {
  const res = await api.get("/products", {
    params,
  });
  return res.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data.data.product;
};

export const getProductRecommendations = async (productId) => {
  const response = await api.get(`/products/${productId}/recommendations`);

  return response.data.data;
};
