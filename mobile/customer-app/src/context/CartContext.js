import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // [{ _id, title, price, image, qty }]

  // Persist cart across launches.
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("cart");
      if (raw) setItems(JSON.parse(raw));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (id) =>
    setItems((prev) => prev.filter((i) => i._id !== id));

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, changeQty, removeFromCart, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
