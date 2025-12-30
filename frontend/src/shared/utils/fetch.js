import { store } from "@core/store/store";

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
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      const errorData = await response.json();
      throw new Error(errorData.message || "API Error");
    }

    return response;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}
