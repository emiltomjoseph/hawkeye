const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any, message: string) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch {
      data = { detail: response.statusText };
    }
    
    // Handle 401 Unauthorized (token expired)
    if (response.status === 401 && token) {
      localStorage.removeItem("access_token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    throw new ApiError(response.status, data, data.detail || response.statusText);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/pdf")) {
    return response.blob();
  }

  return response.json();
}

export const api = {
  auth: {
    login: (data: any) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    register: (data: any) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    refresh: (data: { refresh_token: string }) => request("/auth/refresh", { method: "POST", body: JSON.stringify(data) }),
  },
  user: {
    getProfile: () => request("/user/profile"),
    updateProfile: (data: any) => request("/user/profile", { method: "PUT", body: JSON.stringify(data) }),
    changePassword: (data: any) => request("/user/change-password", { method: "PUT", body: JSON.stringify(data) }),
    deactivate: () => request("/user/profile", { method: "DELETE" }),
  },
  scan: {
    submit: (url: string) => request("/scan", { method: "POST", body: JSON.stringify({ url }) }),
    get: (id: number | string) => request(`/scan/${id}`),
    getHistory: (page = 1, size = 20) => request(`/history?page=${page}&size=${size}`),
    delete: (id: number | string) => request(`/history/${id}`, { method: "DELETE" }),
  },
  report: {
    download: (scanId: number | string) => request(`/report/${scanId}`),
  }
};
