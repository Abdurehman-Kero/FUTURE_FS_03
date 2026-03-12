import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  useTheme,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as SalesIcon,
  Build as RepairsIcon,
  People as CustomersIcon,
  Inventory as ProductsIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import {
  getDashboardStats,
  getSalesChart,
  getTopProducts,
} from "../services/api";

const StatCard = ({ title, value, icon, color, trend }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: `${color}.light`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Chip
              size="small"
              icon={<TrendingUpIcon />}
              label={`${trend}%`}
              color={trend > 0 ? "success" : "error"}
              variant="outlined"
            />
          )}
        </Box>
        <Typography variant="h4" gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Here's what's happening with your business today.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Today's Sales */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Sales"
            value={`ETB ${stats?.sales?.today?.total?.toLocaleString() || 0}`}
            icon={<SalesIcon />}
            color="primary"
            trend={12}
          />
        </Grid>

        {/* Active Repairs */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Repairs"
            value={stats?.repairs?.active || 0}
            icon={<RepairsIcon />}
            color="warning"
          />
        </Grid>

        {/* Total Customers */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats?.customers?.total || 0}
            icon={<CustomersIcon />}
            color="success"
          />
        </Grid>

        {/* Low Stock Items */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={stats?.inventory?.low_stock || 0}
            icon={<ProductsIcon />}
            color="error"
          />
        </Grid>

        {/* Quick Actions based on role */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Quick Actions
          </Typography>
        </Grid>

        {user?.role === "admin" && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <SalesIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">Process Sale</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create new sales transaction
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <RepairsIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">New Repair</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Register customer repair
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {user?.role === "technician" && (
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: "pointer",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <CardContent>
                <RepairsIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Update Repair Status</Typography>
                <Typography variant="body2" color="text.secondary">
                  View and update your repairs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {user?.role === "sales" && (
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: "pointer",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <CardContent>
                <SalesIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">New Sale</Typography>
                <Typography variant="body2" color="text.secondary">
                  Process customer purchase
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
