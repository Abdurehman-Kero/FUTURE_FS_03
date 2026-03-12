import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const login = (phone, password) =>
  api.post("/auth/login", { phone, password });

export const getProfile = () => api.get("/auth/profile");

// Product APIs
export const getProducts = () => api.get("/products");

export const getProduct = (id) => api.get(`/products/${id}`);

export const createProduct = (data) => api.post("/products", data);

export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Customer APIs
export const getCustomers = () => api.get("/customers");

export const getCustomer = (id) => api.get(`/customers/${id}`);

export const createCustomer = (data) => api.post("/customers", data);

export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);

export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

export const searchCustomers = (query) =>
  api.get(`/customers/search?q=${query}`);

// Repair APIs
export const getRepairs = () => api.get("/repairs");

export const getRepair = (id) => api.get(`/repairs/${id}`);

export const createRepair = (data) => api.post("/repairs", data);

export const updateRepairStatus = (id, status) =>
  api.patch(`/repairs/${id}/status`, status);

export const addRepairPart = (id, data) =>
  api.post(`/repairs/${id}/parts`, data);

export const getRepairsByStatus = (status) =>
  api.get(`/repairs/status/${status}`);

// Sale APIs
export const getSales = () => api.get("/sales");

export const getTodaysSales = () => api.get("/sales/today");

export const createSale = (data) => api.post("/sales", data);

export const getSalesByDate = (startDate, endDate) =>
  api.get(`/sales/by-date?start_date=${startDate}&end_date=${endDate}`);

// Dashboard APIs
export const getDashboardStats = () => api.get("/dashboard/stats");

export const getSalesChart = () => api.get("/dashboard/sales-chart");

export const getTopProducts = () => api.get("/dashboard/top-products");

export const getRepairStats = () => api.get("/dashboard/repair-stats");

export const getInventorySummary = () =>
  api.get("/dashboard/inventory-summary");

export default api;
