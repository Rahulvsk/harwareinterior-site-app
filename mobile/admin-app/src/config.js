import Constants from "expo-constants";

// API base URL — see the customer app's config.js for the same dev/prod notes.
//   Android emulator:  http://10.0.2.2:5055/v1
//   iOS simulator:     http://localhost:5055/v1
//   Physical phone:    http://<computer-LAN-IP>:5055/v1
//   Production:        https://your-backend.up.railway.app/v1
const FALLBACK =
  Constants?.expoConfig?.extra?.apiBaseUrl ||
  "https://YOUR-BACKEND.up.railway.app/v1";

export const API_BASE_URL = FALLBACK;

export const localized = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en || Object.values(value)[0] || "";
};

export const COLORS = {
  primary: "#059669",
  primaryDark: "#047857",
  text: "#111827",
  muted: "#6b7280",
  bg: "#f9fafb",
  card: "#ffffff",
  border: "#e5e7eb",
  danger: "#ef4444",
  warn: "#f59e0b",
};
