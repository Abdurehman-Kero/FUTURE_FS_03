import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Chala Mobile</h2>
          <p>{user?.name}</p>
          <small>{user?.role}</small>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/customers">Customers</Link>
          </li>
          <li>
            <Link to="/repairs">Repairs</Link>
          </li>
          <li>
            <Link to="/sales">Sales</Link>
          </li>
        </ul>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
