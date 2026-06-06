import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Attach the customer's auth token (if logged in) to every request.
client.interceptors.request.use(async (config) => {
  try {
    const raw = await AsyncStorage.getItem("userInfo");
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (e) {
    // ignore storage errors
  }
  return config;
});

export default client;
