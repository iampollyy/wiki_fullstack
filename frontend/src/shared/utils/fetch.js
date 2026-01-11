import { store } from "@core/store/store";
import { logout } from "@core/store/slices/auth/authSlice";

const API_BASE_URL = "http://localhost:5000/";

export async function apiFetch(url, options = {}) {
  const token = store.getState().auth.token;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        store.dispatch(logout());
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }

      throw new Error(errorData.error || errorData.message || "API Error");
    }

    return response;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}
