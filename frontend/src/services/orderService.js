import api from "./api";

export const createOrder = async ({ items, shippingAddress }) => {
  const response = await api.post("/orders", {
    items,
    shippingAddress,
  });

  return response.data;
};

export const getMyOrders = async (page = 1, limit = 20) => {
  const response = await api.get("/orders/me", {
    params: { page, limit },
  });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};
