import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Welcome, {user?.name}!</h1>
        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Your Role</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#007bff" }}>
            {user?.role}
          </p>
        </div>

        <div
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Phone</h3>
          <p style={{ fontSize: "20px" }}>{user?.phone}</p>
        </div>

        <div
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Email</h3>
          <p style={{ fontSize: "16px" }}>{user?.email || "Not provided"}</p>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Quick Actions</h2>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            style={{
              padding: "10px 20px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            View Products
          </button>
          <button
            style={{
              padding: "10px 20px",
              background: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            View Customers
          </button>
          <button
            style={{
              padding: "10px 20px",
              background: "#ffc107",
              color: "black",
              border: "none",
              borderRadius: "5px",
            }}
          >
            View Repairs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
