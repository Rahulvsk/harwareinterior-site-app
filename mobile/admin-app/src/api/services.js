import client from "./client";

// ----- Admin auth -----
export const loginAdmin = async (email, password) => {
  const { data } = await client.post("/admin/login", { email, password });
  return data; // { token, _id, name, email, image, ... }
};

// ----- Dashboard -----
export const getDashboardCount = async () => {
  const { data } = await client.get("/orders/dashboard-count");
  return data; // { totalOrder, totalPendingOrder, totalProcessingOrder, totalDeliveredOrder }
};

export const getDashboardAmount = async () => {
  const { data } = await client.get("/orders/dashboard-amount");
  return data;
};

// ----- Orders -----
export const getAllOrders = async () => {
  const { data } = await client.get("/orders");
  return data; // { orders, totalDoc, ... } OR an array
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await client.put(`/orders/${id}`, { status });
  return data;
};

// ----- Products -----
export const getAllProducts = async () => {
  const { data } = await client.get("/products");
  return data; // { products, ... } OR an array
};

export const updateProductStatus = async (id, status) => {
  const { data } = await client.put(`/products/status/${id}`, { status });
  return data;
};
