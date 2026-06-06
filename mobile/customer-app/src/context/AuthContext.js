import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginCustomer } from "../api/services";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app launch.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("userInfo");
        if (raw) setUser(JSON.parse(raw));
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const data = await loginCustomer(email, password);
    await AsyncStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
