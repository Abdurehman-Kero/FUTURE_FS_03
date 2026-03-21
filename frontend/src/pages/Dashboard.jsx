import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Avatar,
  Stack,
  Paper,
  alpha,
  LinearProgress,
  Chip,
  Container,
  Fade,
  Grow,
} from "@mui/material";
import {
  Inventory as ProductsIcon,
  People as CustomersIcon,
  Build as RepairIcon,
  PointOfSale as SalesIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  ArrowForwardIos as ArrowIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  white: "#FFFFFF",
  gray: "#64748b",
  lightGray: "#F1F5F9",
  dark: "#0f172a",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  bg: "#F8FAFC",
};

// Stats data
const getStats = (counts = {}) => [
  {
    title: "Products",
    icon: <ProductsIcon />,
    path: "/admin/products",
    color: colors.info,
    count: counts.products || "0",
  },
  {
    title: "Customers",
    icon: <CustomersIcon />,
    path: "/admin/customers",
    color: colors.warning,
    count: counts.customers || "0",
  },
  {
    title: "Repairs",
    icon: <RepairIcon />,
    path: "/admin/repairs",
    color: colors.error,
    count: counts.repairs || "0",
  },
  {
    title: "Sales",
    icon: <SalesIcon />,
    path: "/admin/sales",
    color: colors.success,
    count: counts.sales || "0",
  },
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
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoading(false);
    };
    loadData();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Recent activities
  const recentActivities = [
    {
      type: "repair",
      title: "iPhone 13 Screen Repair",
      customer: "Abebe Kebede",
      status: "In Progress",
      time: "10 minutes ago",
      icon: <RepairIcon />,
      color: colors.warning,
      amount: "ETB 3,500",
    },
    {
      type: "sale",
      title: "Samsung Galaxy S22",
      customer: "Almaz Tadese",
      amount: "ETB 45,000",
      time: "25 minutes ago",
      icon: <SalesIcon />,
      color: colors.success,
    },
    {
      type: "repair",
      title: "MacBook Pro Screen",
      customer: "Tigist Haile",
      status: "Completed",
      time: "1 hour ago",
      icon: <RepairIcon />,
      color: colors.success,
      amount: "ETB 6,500",
    },
    {
      type: "sale",
      title: "iPhone Charger",
      customer: "Bekele Alemu",
      amount: "ETB 2,500",
      time: "2 hours ago",
      icon: <SalesIcon />,
      color: colors.info,
    },
  ];

  // Low stock items
  const lowStockItems = [
    { name: "iPhone 13 Screen", stock: 3, threshold: 5, percentage: 60 },
    { name: "Samsung Fast Charger", stock: 2, threshold: 10, percentage: 20 },
    { name: "Power Bank 20000mAh", stock: 1, threshold: 8, percentage: 12.5 },
    { name: "USB-C Cable", stock: 4, threshold: 15, percentage: 26.7 },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: "100%" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Welcome Banner */}
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              mb: { xs: 3, sm: 4 },
              borderRadius: { xs: 3, sm: 4, md: 5 },
              background: colors.gradient,
              color: colors.white,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography
                variant="h4"
                fontWeight="900"
                sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" } }}
              >
                Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
              </Typography>
              <Typography
                sx={{
                  opacity: 0.9,
                  mt: 1,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                Here's what's happening with your business today.
              </Typography>
            </Box>
            <Box
              sx={{ position: "absolute", right: -20, top: -20, opacity: 0.1 }}
            >
              <TrendingUpIcon sx={{ fontSize: { xs: 150, sm: 200 } }} />
            </Box>
          </Paper>
        </Fade>

        {/* Stats Grid */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3 }}
          sx={{ mb: { xs: 3, sm: 4 } }}
        >
          {getStats(stats).map((stat, i) => (
            <Grid item xs={6} sm={6} md={3} key={i}>
              <Grow in timeout={800 + i * 100}>
                <Card
                  onClick={() => handleNavigation(stat.path)}
                  sx={{
                    borderRadius: { xs: 2, sm: 3, md: 4 },
                    border: "1px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <CardContent
                    sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(stat.color, 0.1),
                        color: stat.color,
                        mx: "auto",
                        mb: { xs: 1.5, sm: 2 },
                        width: { xs: 40, sm: 45, md: 50 },
                        height: { xs: 40, sm: 45, md: 50 },
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography
                      variant="h5"
                      fontWeight="900"
                      sx={{
                        fontSize: {
                          xs: "1.25rem",
                          sm: "1.5rem",
                          md: "1.75rem",
                        },
                      }}
                    >
                      {typeof stat.count === "number" && stat.count > 1000
                        ? `${(stat.count / 1000).toFixed(1)}k`
                        : stat.count}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="700"
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity & Stock Alerts */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Recent Activity */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: { xs: 2, sm: 3, md: 4 },
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: { xs: 2, sm: 3 } }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="900"
                    sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                  >
                    Recent Activity
                  </Typography>
                  <Button
                    endIcon={<ArrowIcon sx={{ fontSize: 12 }} />}
                    sx={{
                      color: colors.primary,
                      fontWeight: 700,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                    onClick={() => handleNavigation("/admin/repairs")}
                  >
                    View All
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  {recentActivities.map((act, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: { xs: 2, sm: 2.5 },
                        bgcolor: colors.bg,
                        transition: "0.2s",
                        "&:hover": { bgcolor: alpha(colors.primary, 0.03) },
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                        gap: { xs: 1, sm: 0 },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(act.color, 0.1),
                          color: act.color,
                          mr: { xs: 1.5, sm: 2 },
                          width: { xs: 35, sm: 40 },
                          height: { xs: 35, sm: 40 },
                        }}
                      >
                        {act.icon}
                      </Avatar>
                      <Box
                        sx={{
                          flexGrow: 1,
                          minWidth: { xs: "calc(100% - 80px)", sm: "auto" },
                        }}
                      >
                        <Typography
                          fontWeight="800"
                          variant="body2"
                          sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                        >
                          {act.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                        >
                          {act.customer} • {act.time}
                        </Typography>
                      </Box>
                      {act.amount ? (
                        <Typography
                          fontWeight="900"
                          color={colors.success}
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          {act.amount}
                        </Typography>
                      ) : (
                        <Chip
                          label={act.status}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: "0.6rem", sm: "0.65rem" },
                            bgcolor: alpha(act.color, 0.1),
                            color: act.color,
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Stock Alerts */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: { xs: 2, sm: 3, md: 4 },
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  fontWeight="900"
                  sx={{
                    mb: { xs: 2, sm: 3 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  }}
                >
                  <WarningIcon
                    sx={{ color: colors.warning, fontSize: { xs: 20, sm: 24 } }}
                  />
                  Stock Alerts
                </Typography>
                <Stack spacing={{ xs: 2, sm: 2.5 }}>
                  {lowStockItems.map((item, i) => (
                    <Box key={i}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mb: 1 }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="700"
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight="900"
                          color={item.stock < 3 ? colors.error : colors.warning}
                          sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                        >
                          {item.stock} left
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{
                          height: { xs: 6, sm: 8 },
                          borderRadius: 5,
                          bgcolor: alpha(colors.gray, 0.1),
                          "& .MuiLinearProgress-bar": {
                            bgcolor:
                              item.stock < 3 ? colors.error : colors.warning,
                            borderRadius: 5,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleNavigation("/admin/products")}
                  sx={{
                    mt: { xs: 3, sm: 4 },
                    borderRadius: 3,
                    py: { xs: 1, sm: 1.2 },
                    background: colors.dark,
                    fontWeight: 700,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    "&:hover": { background: "#000" },
                  }}
                >
                  Restock Now
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
