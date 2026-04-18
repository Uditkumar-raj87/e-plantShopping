const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("pn_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  health: () => apiRequest("/api/health"),
  register: (payload) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  me: () => apiRequest("/api/auth/me"),
  createPaymentIntent: (payload) =>
    apiRequest("/api/payment/create-intent", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  createOrder: (payload) =>
    apiRequest("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getOrders: () => apiRequest("/api/orders")
};
