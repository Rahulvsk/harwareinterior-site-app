import Constants from "expo-constants";

// ---------------------------------------------------------------------------
// API base URL — where this app talks to your backend.
//
// While developing locally:
//   - Android emulator:  http://10.0.2.2:5055/v1
//   - iOS simulator:     http://localhost:5055/v1
//   - Physical phone:    http://<your-computer-LAN-IP>:5055/v1  (e.g. 192.168.1.20)
//
// In production: your deployed Railway backend, e.g.
//   https://your-backend.up.railway.app/v1
//
// You can also set it in app.json -> expo.extra.apiBaseUrl (used as fallback).
// ---------------------------------------------------------------------------
const FALLBACK =
  Constants?.expoConfig?.extra?.apiBaseUrl ||
  "https://YOUR-BACKEND.up.railway.app/v1";

export const API_BASE_URL = FALLBACK;

// Helper: product titles/descriptions are stored as multi-language objects
// (e.g. { en: "Hammer" }). This safely renders a string from either shape.
export const localized = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en || Object.values(value)[0] || "";
};

export const COLORS = {
  primary: "#10b981",
  primaryDark: "#059669",
  text: "#111827",
  muted: "#6b7280",
  bg: "#f9fafb",
  card: "#ffffff",
  border: "#e5e7eb",
  danger: "#ef4444",
};
