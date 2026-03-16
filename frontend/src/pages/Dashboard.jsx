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
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Inventory as ProductsIcon,
  People as CustomersIcon,
  Build as BuildIcon,
  PointOfSale as SalesIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

// Primary color from homepage
const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
};

// Quick action cards configuration
const actions = [
  {
    title: "Products",
    description: "Manage inventory",
    icon: <ProductsIcon sx={{ fontSize: 32 }} />,
    path: "/admin/products",
    color: "#4caf50",
    roles: ["admin", "technician", "sales"],
    stats: "156 items",
  },
  {
    title: "Customers",
    description: "View customers",
    icon: <CustomersIcon sx={{ fontSize: 32 }} />,
    path: "/admin/customers",
    color: "#ff9800",
    roles: ["admin", "technician", "sales"],
    stats: "89 active",
  },
  {
    title: "Repairs",
    description: "Track orders",
    icon: <BuildIcon sx={{ fontSize: 32 }} />,
    path: "/admin/repairs",
    color: "#f44336",
    roles: ["admin", "technician"],
    stats: "12 in progress",
  },
  {
    title: "Sales",
    description: "Process sales",
    icon: <SalesIcon sx={{ fontSize: 32 }} />,
    path: "/admin/sales",
    color: "#9c27b0",
    roles: ["admin", "sales"],
    stats: "ETB 15.2k",
  },
];

// Mock data
const recentActivities = [
  {
    type: "repair",
    customer: "Abebe K.",
    device: "iPhone 13",
    status: "progress",
    time: "10 min",
  },
  {
    type: "sale",
    customer: "Almaz T.",
    product: "Samsung S22",
    amount: "ETB 45k",
    time: "25 min",
  },
  {
    type: "repair",
    customer: "Tigist H.",
    device: "MacBook",
    status: "done",
    time: "1 hour",
  },
];

const lowStockItems = [
  { name: "iPhone 13 Screen", stock: 3 },
  { name: "Samsung Charger", stock: 2 },
  { name: "Power Bank", stock: 1 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats] = useState({
    products: 156,
    customers: 89,
    repairs: 12,
    sales: 15200,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const allowedActions = actions.filter((action) =>
    action.roles.includes(user?.role),
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Products", icon: <ProductsIcon />, path: "/admin/products" },
    { text: "Customers", icon: <CustomersIcon />, path: "/admin/customers" },
    { text: "Repairs", icon: <BuildIcon />, path: "/admin/repairs" },
    { text: "Sales", icon: <SalesIcon />, path: "/admin/sales" },
  ];

  const drawer = (
    <Box sx={{ width: 250, height: "100%", bgcolor: "#f8f9fa" }}>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            mx: "auto",
            mb: 1,
            bgcolor: colors.primary,
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Typography variant="subtitle1" fontWeight={600}>
          {user?.name}
        </Typography>
        <Chip
          label={user?.role}
          size="small"
          sx={{
            bgcolor: alpha(colors.primary, 0.1),
            color: colors.primary,
            textTransform: "capitalize",
            mt: 0.5,
          }}
        />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: colors.primary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ color: "#f44336" }}>
            <ListItemIcon sx={{ color: "#f44336" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 4 }}>
        <LinearProgress
          sx={{
            borderRadius: 1,
            bgcolor: alpha(colors.primary, 0.2),
            "& .MuiLinearProgress-bar": { bgcolor: colors.primary },
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: colors.white,
          color: colors.dark,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          {/* Logout Button #1 - In Header */}
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderColor: colors.primary,
              color: colors.primary,
              borderRadius: "50px",
              "&:hover": {
                borderColor: colors.secondary,
                bgcolor: alpha(colors.primary, 0.05),
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          mt: 8,
        }}
      >
        {/* Welcome Card */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: colors.gradient,
            color: "white",
          }}
        >
          <Typography variant="h5" fontWeight="600" gutterBottom>
            {getGreeting()}, {user?.name}! 👋
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
            Here's what's happening today
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Role
                  </Typography>
                  <Typography
                    variant="body2"
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
                <ScheduleIcon sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Last Login
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    Today
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" variant="caption">
                  Products
                </Typography>
                <Typography variant="h5" fontWeight="600">
                  {stats.products}
                </Typography>
                <Typography variant="caption" color="success.main">
                  +12 this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" variant="caption">
                  Customers
                </Typography>
                <Typography variant="h5" fontWeight="600">
                  {stats.customers}
                </Typography>
                <Typography variant="caption" color="success.main">
                  +5 this week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" variant="caption">
                  Repairs
                </Typography>
                <Typography variant="h5" fontWeight="600">
                  {stats.repairs}
                </Typography>
                <Typography variant="caption" color="warning.main">
                  3 due today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" variant="caption">
                  Sales
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.primary}
                >
                  ETB {stats.sales.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="success.main">
                  +8% vs yesterday
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {allowedActions.map((action, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                }}
                onClick={() => navigate(action.path)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(action.color, 0.1),
                        color: action.color,
                        width: 40,
                        height: 40,
                        mr: 1,
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600">
                        {action.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {action.stats}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Two Column Layout */}
        <Grid container spacing={3}>
          {/* Recent Activity */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Recent Activity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  {recentActivities.map((activity, i) => (
                    <Box key={i}>
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
                              width: 32,
                              height: 32,
                              bgcolor:
                                activity.type === "repair"
                                  ? alpha("#f44336", 0.1)
                                  : alpha("#4caf50", 0.1),
                              color:
                                activity.type === "repair"
                                  ? "#f44336"
                                  : "#4caf50",
                              mr: 1,
                            }}
                          >
                            {activity.type === "repair" ? (
                              <BuildIcon />
                            ) : (
                              <SalesIcon />
                            )}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {activity.type === "repair"
                                ? activity.device
                                : activity.product}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {activity.customer} • {activity.time}
                            </Typography>
                          </Box>
                        </Box>
                        {activity.type === "repair" ? (
                          <Chip
                            label={activity.status}
                            size="small"
                            color={
                              activity.status === "done" ? "success" : "warning"
                            }
                            sx={{ height: 20 }}
                          />
                        ) : (
                          <Typography
                            variant="caption"
                            fontWeight="600"
                            color="success.main"
                          >
                            {activity.amount}
                          </Typography>
                        )}
                      </Box>
                      {i < recentActivities.length - 1 && (
                        <Divider sx={{ mt: 1 }} />
                      )}
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Low Stock Alerts */}
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <WarningIcon sx={{ color: "#f44336", mr: 1, fontSize: 20 }} />
                  <Typography variant="h6" fontWeight="600">
                    Low Stock
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  {lowStockItems.map((item, i) => (
                    <Box key={i}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2">{item.name}</Typography>
                        <Chip
                          label={`${item.stock} left`}
                          size="small"
                          color={item.stock <= 2 ? "error" : "warning"}
                          sx={{ height: 20 }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(item.stock / 5) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha("#f44336", 0.1),
                          "& .MuiLinearProgress-bar": {
                            bgcolor: item.stock <= 2 ? "#f44336" : "#ff9800",
                          },
                        }}
                      />
                      {i < lowStockItems.length - 1 && (
                        <Divider sx={{ mt: 1 }} />
                      )}
                    </Box>
                  ))}
                </Stack>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{
                    mt: 2,
                    borderColor: colors.primary,
                    color: colors.primary,
                  }}
                  onClick={() => navigate("/admin/products")}
                >
                  Manage Stock
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
