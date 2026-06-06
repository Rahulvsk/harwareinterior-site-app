import client from "./client";

// ----- Products -----
// The store endpoint returns: { products, popularProducts, discountedProducts, ... }
export const getStoreProducts = async () => {
  const { data } = await client.get("/products/store");
  return data;
};

// Search / filter products by title (returns { products: [...] }).
export const searchProducts = async (title) => {
  const { data } = await client.get("/products/store", {
    params: { title },
  });
  return data;
};

export const getProductBySlug = async (slug) => {
  // The store endpoint accepts a slug and returns the matched product(s).
  const { data } = await client.get("/products/store", {
    params: { slug },
  });
  return data;
};

// ----- Categories -----
export const getCategories = async () => {
  const { data } = await client.get("/category/show");
  return data;
};

// ----- Auth (customer) -----
export const loginCustomer = async (email, password) => {
  const { data } = await client.post("/customer/login", { email, password });
  return data; // { token, _id, name, email, ... }
};

export const changePassword = async (payload) => {
  const { data } = await client.post("/customer/change-password", payload);
  return data;
};

// ----- Orders -----
export const placeOrder = async (orderPayload) => {
  const { data } = await client.post("/order/add", orderPayload);
  return data;
};

export const getMyOrders = async () => {
  // Requires auth token (added by the client interceptor).
  const { data } = await client.get("/order");
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await client.get(`/order/${id}`);
  return data;
};
