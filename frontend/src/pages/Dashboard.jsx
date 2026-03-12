import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Stack,
  Paper,
  Divider,
  alpha,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  Inventory as ProductsIcon,
  People as CustomersIcon,
  Build as BuildIcon, // 👈 This was missing
  PointOfSale as SalesIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  PhoneAndroid as MobileIcon,
  Assessment as ReportIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

// Quick action cards configuration
const actions = [
  {
    title: "Products",
    description: "Manage inventory and stock",
    icon: <ProductsIcon sx={{ fontSize: 40 }} />,
    path: "/admin/products",
    color: "#4caf50",
    roles: ["admin", "technician", "sales"],
    stats: "156 items",
  },
  {
    title: "Customers",
    description: "View and manage customers",
    icon: <CustomersIcon sx={{ fontSize: 40 }} />,
    path: "/admin/customers",
    color: "#ff9800",
    roles: ["admin", "technician", "sales"],
    stats: "89 active",
  },
  {
    title: "Repairs",
    description: "Track repair orders",
    icon: <BuildIcon sx={{ fontSize: 40 }} />, // 👈 Now using BuildIcon
    path: "/admin/repairs",
    color: "#f44336",
    roles: ["admin", "technician"],
    stats: "12 in progress",
  },
  {
    title: "Sales",
    description: "Process new sales",
    icon: <SalesIcon sx={{ fontSize: 40 }} />,
    path: "/admin/sales",
    color: "#9c27b0",
    roles: ["admin", "sales"],
    stats: "ETB 15.2k today",
  },
];

// Mock data - replace with actual API data
const recentActivities = [
  {
    type: "repair",
    id: "#1234",
    customer: "Abebe Kebede",
    device: "iPhone 13",
    status: "in_progress",
    time: "10 min ago",
  },
  {
    type: "sale",
    id: "#5678",
    customer: "Almaz Tadese",
    product: "Samsung S22",
    amount: "ETB 45,000",
    time: "25 min ago",
  },
  {
    type: "repair",
    id: "#9012",
    customer: "Tigist Haile",
    device: "MacBook Pro",
    status: "completed",
    time: "1 hour ago",
  },
  {
    type: "sale",
    id: "#3456",
    customer: "Bekele Alemu",
    product: "iPhone Charger",
    amount: "ETB 2,500",
    time: "2 hours ago",
  },
];

const lowStockItems = [
  { name: "iPhone 13 Screen", stock: 3, threshold: 5 },
  { name: "Samsung Charger", stock: 2, threshold: 10 },
  { name: "Screen Protector", stock: 4, threshold: 20 },
  { name: "Power Bank", stock: 1, threshold: 8 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 156,
    customers: 89,
    repairs: 12,
    sales: 15200,
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter actions based on user role
  const allowedActions = actions.filter((action) =>
    action.roles.includes(user?.role),
  );

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 4 }}>
        <LinearProgress sx={{ borderRadius: 1 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h4" fontWeight="600" gutterBottom>
            {getGreeting()}, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
            Welcome back to your dashboard. Here's what's happening with your
            business today.
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Role
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {user?.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Last Login
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    Today 9:30 AM
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 200,
            height: 200,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 250,
            height: 250,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        />
      </Paper>

      {/* Stats Overview */}
      <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
        Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                  >
                    Total Products
                  </Typography>
                  <Typography variant="h4" fontWeight="600">
                    {stats.products}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    +12 this month
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha("#4caf50", 0.1),
                    color: "#4caf50",
                    width: 56,
                    height: 56,
                  }}
                >
                  <ProductsIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                  >
                    Total Customers
                  </Typography>
                  <Typography variant="h4" fontWeight="600">
                    {stats.customers}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    +5 this week
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha("#ff9800", 0.1),
                    color: "#ff9800",
                    width: 56,
                    height: 56,
                  }}
                >
                  <CustomersIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                  >
                    Active Repairs
                  </Typography>
                  <Typography variant="h4" fontWeight="600">
                    {stats.repairs}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="warning.main"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />3 due today
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha("#f44336", 0.1),
                    color: "#f44336",
                    width: 56,
                    height: 56,
                  }}
                >
                  <BuildIcon /> {/* 👈 Fixed: Now using BuildIcon */}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                  >
                    Today's Sales
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="#BE3300">
                    ETB {stats.sales.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    +8% vs yesterday
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha("#9c27b0", 0.1),
                    color: "#9c27b0",
                    width: 56,
                    height: 56,
                  }}
                >
                  <SalesIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
        Quick Actions
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {allowedActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                },
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(action.color, 0.1),
                      color: action.color,
                      width: 48,
                      height: 48,
                      mr: 2,
                    }}
                  >
                    {action.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      {action.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {action.stats}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {action.description}
                </Typography>
                <Button
                  variant="text"
                  endIcon={<TrendingUpIcon />}
                  sx={{ color: action.color, p: 0 }}
                >
                  Go to {action.title}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Two Column Layout for Recent Activity & Alerts */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="600">
                  Recent Activity
                </Typography>
                <Button size="small" sx={{ color: "#BE3300" }}>
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                {recentActivities.map((activity, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor:
                              activity.type === "repair"
                                ? alpha("#f44336", 0.1)
                                : alpha("#4caf50", 0.1),
                            color:
                              activity.type === "repair"
                                ? "#f44336"
                                : "#4caf50",
                            mr: 2,
                          }}
                        >
                          {activity.type === "repair" ? (
                            <BuildIcon />
                          ) : (
                            <SalesIcon />
                          )}{" "}
                          {/* 👈 Fixed: Now using BuildIcon */}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {activity.type === "repair"
                              ? activity.device
                              : activity.product}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.customer} • {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                      {activity.type === "repair" ? (
                        <Chip
                          label={activity.status?.replace("_", " ")}
                          size="small"
                          color={
                            activity.status === "completed"
                              ? "success"
                              : "warning"
                          }
                          sx={{ textTransform: "capitalize" }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="success.main"
                        >
                          {activity.amount}
                        </Typography>
                      )}
                    </Box>
                    {index < recentActivities.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <WarningIcon sx={{ color: "#f44336", mr: 1 }} />
                <Typography variant="h6" fontWeight="600">
                  Low Stock Alerts
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                {lowStockItems.map((item, index) => {
                  const percentage = (item.stock / item.threshold) * 100;
                  return (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight="500">
                          {item.name}
                        </Typography>
                        <Chip
                          label={`${item.stock} left`}
                          size="small"
                          color={item.stock <= 2 ? "error" : "warning"}
                          sx={{ height: 20 }}
                        />
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ flex: 1, mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: alpha("#f44336", 0.1),
                              "& .MuiLinearProgress-bar": {
                                bgcolor:
                                  item.stock <= 2 ? "#f44336" : "#ff9800",
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {item.stock}/{item.threshold}
                        </Typography>
                      </Box>
                      {index < lowStockItems.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  );
                })}
              </Stack>

              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3, borderColor: "#BE3300", color: "#BE3300" }}
                onClick={() => navigate("/admin/products")}
              >
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Stats Footer */}
      <Paper sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: "#f8f9fa" }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Total Revenue (Month)
            </Typography>
            <Typography variant="subtitle1" fontWeight="600">
              ETB 245,000
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Avg. Repair Time
            </Typography>
            <Typography variant="subtitle1" fontWeight="600">
              4.5 hours
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Customer Satisfaction
            </Typography>
            <Typography variant="subtitle1" fontWeight="600">
              98%
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Pending Orders
            </Typography>
            <Typography variant="subtitle1" fontWeight="600">
              8
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
