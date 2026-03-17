import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const publicRoutes = [
        "/products",
        "/auth/login",
        "/repair-request",
        "/customers/search",
        "/upload",
      ];
      const isPublicRoute = publicRoutes.some((route) =>
        error.config.url.includes(route),
      );

      if (!isPublicRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export const login = (phone, password) =>
  api.post("/auth/login", { phone, password });
export const getProfile = () => api.get("/auth/profile");

export const getProducts = () => api.get("/products");
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Updated upload function with better error handling
export const uploadProductImage = async (formData) => {
  try {
    const response = await api.post("/upload/product-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const getCustomers = () => api.get("/customers");
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post("/customers", data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
export const searchCustomers = (q) => api.get(`/customers/search?q=${q}`);

export const getRepairs = () => api.get("/repairs");
export const getRepair = (id) => api.get(`/repairs/${id}`);
export const createRepair = (data) => api.post("/repairs", data);
export const updateRepairStatus = (id, data) =>
  api.patch(`/repairs/${id}/status`, data);
export const addRepairPart = (id, data) =>
  api.post(`/repairs/${id}/parts`, data);
export const getRepairsByStatus = (status) =>
  api.get(`/repairs/status/${status}`);

export const getSales = () => api.get("/sales");
export const getTodaysSales = () => api.get("/sales/today");
export const createSale = (data) => api.post("/sales", data);

export default api;
