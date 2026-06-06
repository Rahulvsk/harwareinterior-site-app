import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Attach the admin's auth token to every request (backend uses isAuth).
client.interceptors.request.use(async (config) => {
  try {
    const raw = await AsyncStorage.getItem("adminInfo");
    if (raw) {
      const admin = JSON.parse(raw);
      if (admin?.token) {
        config.headers.Authorization = `Bearer ${admin.token}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default client;
