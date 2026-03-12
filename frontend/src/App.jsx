import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public Pages (everyone can access)
import Home from "./pages/Home";
import Login from "./pages/Login";
import PublicProducts from "./pages/PublicProducts"; // Public product browsing
import PublicRepairRequest from "./pages/PublicRepairRequest";

// Protected Pages (require login)
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products"; // Admin product management
import Customers from "./pages/Customers";
import Repairs from "./pages/Repairs";
import Sales from "./pages/Sales";
import Layout from "./layouts/Layout";

import "./App.css";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* 🌍 PUBLIC ROUTES - No login needed */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<PublicProducts />} />{" "}
      {/* Public product browsing */}
      <Route path="/repair-request" element={<PublicRepairRequest />} />
      {/* 🔒 PROTECTED ROUTES - Admin area (login required) */}
      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Products Management - Admin only area */}
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["admin", "technician", "sales"]}>
            <Layout>
              <Products />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Customers Management */}
      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute allowedRoles={["admin", "technician", "sales"]}>
            <Layout>
              <Customers />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Repairs Management */}
      <Route
        path="/admin/repairs"
        element={
          <ProtectedRoute allowedRoles={["admin", "technician"]}>
            <Layout>
              <Repairs />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Sales Management */}
      <Route
        path="/admin/sales"
        element={
          <ProtectedRoute allowedRoles={["admin", "sales"]}>
            <Layout>
              <Sales />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
