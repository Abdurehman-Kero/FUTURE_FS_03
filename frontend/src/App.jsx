import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";


// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import PublicProducts from "./pages/PublicProducts";
import PublicRepairRequest from "./pages/PublicRepairRequest";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Repairs from "./pages/Repairs";
import Sales from "./pages/Sales";
import Layout from "./layouts/Layout";

import "./App.css";
// Import new pages
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';

// Add to your Routes (public routes section)

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    // Instead of redirecting to login, we let the route render nothing
    // and let the natural navigation happen
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<PublicProducts />} />
      <Route path="/cart" element={<Cart />} />

      <Route path="/repair-request" element={<PublicRepairRequest />} />

      <Route path="/checkout/:slug" element={<Checkout />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      {/* Protected Routes - Note: These are still defined but won't render if not authenticated */}
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

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          {" "}
          {/* Add this */}
          <AppRoutes />
        </CartProvider>{" "}
        {/* Add this */}
      </AuthProvider>
    </Router>
  );
}

export default App;
