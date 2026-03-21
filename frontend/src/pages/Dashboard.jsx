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
  useMediaQuery,
  useTheme,
  Fade,
  Grow,
} from "@mui/material";
import {
  Inventory as ProductsIcon,
  People as CustomersIcon,
  Build as BuildIcon,
  PointOfSale as SalesIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ArrowForwardIos as ArrowIcon,
  NotificationsNone as NotifIcon,
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

const actions = [
  {
    title: "Products",
    icon: <ProductsIcon />,
    path: "/admin/products",
    color: colors.info,
    count: "156",
    roles: ["admin", "technician", "sales"],
  },
  {
    title: "Customers",
    icon: <CustomersIcon />,
    path: "/admin/customers",
    color: colors.warning,
    count: "89",
    roles: ["admin", "technician", "sales"],
  },
  {
    title: "Repairs",
    icon: <BuildIcon />,
    path: "/admin/repairs",
    color: colors.error,
    count: "12",
    roles: ["admin", "technician"],
  },
  {
    title: "Sales",
    icon: <SalesIcon />,
    path: "/admin/sales",
    color: colors.success,
    count: "15.2k",
    roles: ["admin", "sales"],
  },
];

const recentActivities = [
  {
    type: "repair",
    title: "iPhone 13 Repair",
    customer: "Abebe K.",
    status: "In Progress",
    time: "10m",
    icon: <BuildIcon />,
    color: colors.warning,
  },
  {
    type: "sale",
    title: "Samsung S22",
    customer: "Almaz T.",
    amount: "ETB 45,000",
    time: "25m",
    icon: <SalesIcon />,
    color: colors.success,
  },
  {
    type: "repair",
    title: "MacBook Pro",
    customer: "Tigist H.",
    status: "Completed",
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Products", icon: <ProductsIcon />, path: "/admin/products" },
    { text: "Customers", icon: <CustomersIcon />, path: "/admin/customers" },
    { text: "Repairs", icon: <BuildIcon />, path: "/admin/repairs" },
    { text: "Sales", icon: <SalesIcon />, path: "/admin/sales" },
  ];

  const sidebar = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        bgcolor: colors.white,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{ p: 4, textAlign: "center", bgcolor: alpha(colors.primary, 0.03) }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            background: colors.gradient,
            boxShadow: "0 10px 20px rgba(255,133,0,0.2)",
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Typography variant="h6" fontWeight="900" color={colors.dark}>
          {user?.name}
        </Typography>
        <Chip
          label={user?.role}
          size="small"
          sx={{
            mt: 1,
            fontWeight: 700,
            bgcolor: alpha(colors.primary, 0.1),
            color: colors.primary,
          }}
        />
      </Box>
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              sx={{
                borderRadius: 3,
                "&:hover": {
                  bgcolor: alpha(colors.primary, 0.05),
                  color: colors.primary,
                },
              }}
            >
              <ListItemIcon sx={{ color: colors.primary, minWidth: 45 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            color: colors.error,
            bgcolor: alpha(colors.error, 0.05),
            fontWeight: 700,
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: colors.bg,
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );

  return (
    <Box
      sx={{
        bgcolor: colors.bg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${colors.lightGray}`,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 2, color: colors.dark }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              fontWeight="900"
              sx={{ color: colors.dark, display: { xs: "none", sm: "block" } }}
            >
              Admin<span style={{ color: colors.primary }}>Hub</span>
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton sx={{ bgcolor: colors.lightGray }}>
              <NotifIcon />
            </IconButton>
            <Avatar
              sx={{
                width: 35,
                height: 35,
                bgcolor: colors.primary,
                cursor: "pointer",
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { border: "none", boxShadow: "20px 0 50px rgba(0,0,0,0.05)" },
        }}
      >
        {sidebar}
      </Drawer>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 6,
              background: colors.gradient,
              color: colors.white,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography variant="h4" fontWeight="900">
                Welcome back, {user?.name?.split(" ")[0]}! 👋
              </Typography>
              <Typography sx={{ opacity: 0.8, mt: 1 }}>
                Here's what's happening with your business today.
              </Typography>
            </Box>
            <Box
              sx={{ position: "absolute", right: -20, top: -20, opacity: 0.1 }}
            >
              <TrendingUpIcon sx={{ fontSize: 200 }} />
            </Box>
          </Paper>
        </Fade>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {actions.map((stat, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Grow in timeout={1000 + i * 200}>
                <Card
                  sx={{
                    borderRadius: 5,
                    border: "1px solid #fff",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)" },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(stat.color, 0.1),
                        color: stat.color,
                        mx: "auto",
                        mb: 2,
                        width: 50,
                        height: 50,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h5" fontWeight="900">
                      {stat.count}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="700"
                      sx={{ textTransform: "uppercase", letterSpacing: 1 }}
                    >
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Activity */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: 6,
                boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                p: 1,
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" fontWeight="900">
                    Recent Activity
                  </Typography>
                  <Button
                    endIcon={<ArrowIcon sx={{ fontSize: 12 }} />}
                    sx={{ color: colors.primary, fontWeight: 700 }}
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
                        p: 2,
                        borderRadius: 4,
                        bgcolor: colors.bg,
                        transition: "0.2s",
                        "&:hover": { bgcolor: alpha(colors.primary, 0.03) },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(act.color, 0.1),
                          color: act.color,
                          mr: 2,
                        }}
                      >
                        {act.icon}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography fontWeight="800" variant="body2">
                          {act.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {act.customer} • {act.time} ago
                        </Typography>
                      </Box>
                      {act.amount ? (
                        <Typography fontWeight="900" color={colors.success}>
                          {act.amount}
                        </Typography>
                      ) : (
                        <Chip
                          label={act.status}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: "0.65rem",
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

          {/* Inventory Alerts */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 6,
                boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                p: 1,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="900"
                  sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <WarningIcon sx={{ color: colors.warning }} /> Stock Alerts
                </Typography>
                <Stack spacing={3}>
                  {lowStockItems.map((item, i) => (
                    <Box key={i}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2" fontWeight="700">
                          {item.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight="900"
                          color={item.stock < 3 ? colors.error : colors.warning}
                        >
                          {item.stock} left
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{
                          height: 8,
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
                  sx={{
                    mt: 4,
                    borderRadius: 3,
                    py: 1.5,
                    background: colors.dark,
                    fontWeight: 700,
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

      {isMobile && (
        <Fab
          onClick={() => navigate("/admin/products")}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: colors.gradient,
            color: "#fff",
            boxShadow: "0 10px 20px rgba(255,133,0,0.3)",
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default Dashboard;
