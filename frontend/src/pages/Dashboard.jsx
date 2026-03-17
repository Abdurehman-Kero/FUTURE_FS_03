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
  Container,
  Fab,
  Badge,
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
  Close as CloseIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

// Primary color scheme
const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  dark: "#1F2937",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
};

// Quick action cards - simplified for mobile
const actions = [
  {
    title: "Products",
    icon: <ProductsIcon />,
    path: "/admin/products",
    color: colors.info,
    bgColor: alpha(colors.info, 0.1),
    count: "156",
    roles: ["admin", "technician", "sales"],
  },
  {
    title: "Customers",
    icon: <CustomersIcon />,
    path: "/admin/customers",
    color: colors.warning,
    bgColor: alpha(colors.warning, 0.1),
    count: "89",
    roles: ["admin", "technician", "sales"],
  },
  {
    title: "Repairs",
    icon: <BuildIcon />,
    path: "/admin/repairs",
    color: colors.error,
    bgColor: alpha(colors.error, 0.1),
    count: "12",
    roles: ["admin", "technician"],
  },
  {
    title: "Sales",
    icon: <SalesIcon />,
    path: "/admin/sales",
    color: colors.success,
    bgColor: alpha(colors.success, 0.1),
    count: "15.2k",
    roles: ["admin", "sales"],
  },
];

// Recent activities - simplified
const recentActivities = [
  {
    type: "repair",
    title: "iPhone 13 Repair",
    customer: "Abebe K.",
    status: "progress",
    time: "10m",
    icon: <BuildIcon />,
    color: colors.warning,
  },
  {
    type: "sale",
    title: "Samsung S22",
    customer: "Almaz T.",
    amount: "45k",
    time: "25m",
    icon: <SalesIcon />,
    color: colors.success,
  },
  {
    type: "repair",
    title: "MacBook Pro",
    customer: "Tigist H.",
    status: "done",
    time: "1h",
    icon: <BuildIcon />,
    color: colors.success,
  },
];

const lowStockItems = [
  { name: "iPhone 13 Screen", stock: 3, threshold: 5, percentage: 60 },
  { name: "Samsung Charger", stock: 2, threshold: 10, percentage: 20 },
  { name: "Power Bank", stock: 1, threshold: 8, percentage: 12.5 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats] = useState({
    products: 156,
    customers: 89,
    repairs: 12,
    sales: 15200,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
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

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Products", icon: <ProductsIcon />, path: "/admin/products" },
    { text: "Customers", icon: <CustomersIcon />, path: "/admin/customers" },
    { text: "Repairs", icon: <BuildIcon />, path: "/admin/repairs" },
    { text: "Sales", icon: <SalesIcon />, path: "/admin/sales" },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: "100%", bgcolor: colors.white }}>
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          borderBottom: `1px solid ${colors.lightGray}`,
        }}
      >
        <Avatar
          sx={{
            width: 70,
            height: 70,
            mx: "auto",
            mb: 2,
            bgcolor: colors.primary,
            fontSize: "2rem",
            fontWeight: 600,
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Typography variant="h6" fontWeight={600} color={colors.dark}>
          {user?.name}
        </Typography>
        <Chip
          label={user?.role}
          size="small"
          sx={{
            mt: 1,
            bgcolor: alpha(colors.primary, 0.1),
            color: colors.primary,
            fontWeight: 500,
            textTransform: "capitalize",
          }}
        />
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              sx={{
                mx: 2,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: alpha(colors.primary, 0.05),
                },
              }}
            >
              <ListItemIcon sx={{ color: colors.primary, minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 2, mx: 2 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            sx={{
              mx: 2,
              borderRadius: 2,
              color: colors.error,
              "&:hover": {
                bgcolor: alpha(colors.error, 0.05),
              },
            }}
          >
            <ListItemIcon sx={{ color: colors.error, minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box sx={{ width: "80%", maxWidth: 300, textAlign: "center" }}>
          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(colors.primary, 0.1),
              "& .MuiLinearProgress-bar": { bgcolor: colors.primary },
            }}
          />
          <Typography sx={{ mt: 2, color: colors.gray }}>
            Loading dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Simple Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: colors.white,
          color: colors.dark,
          borderBottom: `1px solid ${colors.lightGray}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
          <IconButton
            onClick={() => setMobileMenuOpen(true)}
            sx={{
              mr: 2,
              color: colors.gray,
              display: { md: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 600, color: colors.dark }}
          >
            Dashboard
          </Typography>

          <Button
            variant="text"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              display: { xs: "none", sm: "flex" },
              color: colors.gray,
              "&:hover": {
                color: colors.error,
                bgcolor: alpha(colors.error, 0.05),
              },
            }}
          >
            Logout
          </Button>

          <IconButton
            onClick={handleLogout}
            sx={{
              display: { xs: "flex", sm: "none" },
              color: colors.gray,
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { borderRadius: "0 20px 20px 0" } }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Welcome Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: { xs: 2, sm: 3 },
            borderRadius: 3,
            background: colors.gradient,
            color: colors.white,
          }}
        >
          <Typography variant="h5" fontWeight="600" gutterBottom>
            {getGreeting()}, {user?.name?.split(" ")[0]}! 👋
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
            Here's your business summary
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.8, display: "block" }}
                  >
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
            <Grid item xs={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ScheduleIcon sx={{ mr: 1, fontSize: 20 }} />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.8, display: "block" }}
                  >
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

        {/* Stats Cards - Horizontal scroll on mobile */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{ mb: 2, color: colors.dark }}
          >
            Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    color="text.secondary"
                    variant="caption"
                    display="block"
                  >
                    Products
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                  >
                    {stats.products}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 14, mr: 0.3 }} />
                    +12
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    color="text.secondary"
                    variant="caption"
                    display="block"
                  >
                    Customers
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                  >
                    {stats.customers}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 14, mr: 0.3 }} />
                    +5
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    color="text.secondary"
                    variant="caption"
                    display="block"
                  >
                    Repairs
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                  >
                    {stats.repairs}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="warning.main"
                    sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                  >
                    <ScheduleIcon sx={{ fontSize: 14, mr: 0.3 }} />3 due
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    color="text.secondary"
                    variant="caption"
                    display="block"
                  >
                    Sales
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    sx={{
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                      color: colors.primary,
                    }}
                  >
                    ETB {stats.sales.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 14, mr: 0.3 }} />
                    +8%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Quick Actions - Clean grid */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{ mb: 2, color: colors.dark }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {allowedActions.map((action, index) => (
              <Grid item xs={6} key={index}>
                <Card
                  onClick={() => navigate(action.path)}
                  sx={{
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:active": { transform: "scale(0.98)" },
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: action.bgColor,
                          color: action.color,
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight="600"
                          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                        >
                          {action.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {action.count}{" "}
                          {action.title === "Sales" ? "today" : "active"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Activity & Alerts */}
        <Grid container spacing={2}>
          {/* Recent Activity */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                  >
                    Recent Activity
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowIcon />}
                    sx={{ color: colors.primary }}
                  >
                    View All
                  </Button>
                </Box>

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
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: alpha(activity.color, 0.1),
                              color: activity.color,
                            }}
                          >
                            {activity.icon}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight="600"
                              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                            >
                              {activity.title}
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
                            sx={{
                              bgcolor: alpha(activity.color, 0.1),
                              color: activity.color,
                              height: 24,
                              fontSize: "0.75rem",
                            }}
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
                      {i < recentActivities.length - 1 && (
                        <Divider sx={{ mt: 1.5 }} />
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
              sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
                >
                  <WarningIcon sx={{ color: colors.warning }} />
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                  >
                    Low Stock
                  </Typography>
                </Box>

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
                        <Typography variant="body2" fontWeight="500">
                          {item.name}
                        </Typography>
                        <Chip
                          label={`${item.stock} left`}
                          size="small"
                          sx={{
                            bgcolor:
                              item.stock <= 2
                                ? alpha(colors.error, 0.1)
                                : alpha(colors.warning, 0.1),
                            color:
                              item.stock <= 2 ? colors.error : colors.warning,
                            height: 20,
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(colors.warning, 0.1),
                          "& .MuiLinearProgress-bar": {
                            bgcolor:
                              item.stock <= 2 ? colors.error : colors.warning,
                          },
                        }}
                      />
                      {i < lowStockItems.length - 1 && (
                        <Divider sx={{ mt: 1.5 }} />
                      )}
                    </Box>
                  ))}
                </Stack>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/admin/products")}
                  sx={{
                    mt: 2,
                    borderColor: colors.primary,
                    color: colors.primary,
                    borderRadius: 2,
                    textTransform: "none",
                    py: 1,
                  }}
                >
                  Manage Stock
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
