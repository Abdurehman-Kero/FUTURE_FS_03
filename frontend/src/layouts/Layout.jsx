import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  Paper,
  alpha,
  Badge,
  Tooltip,
  useMediaQuery,
  SwipeableDrawer,
  CssBaseline,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  People as CustomersIcon,
  Build as RepairsIcon,
  PointOfSale as SalesIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ShoppingCart as CartIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";

const drawerWidth = 280;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Breakpoint checks
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const colors = {
    primary: "#FF8500",
    secondary: "#FFA33C",
    gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
    dark: "#1E1A3A",
    light: "#F8F9FF",
    white: "#FFFFFF",
    gray: "#6B7280",
    lightGray: "#E5E7EB",
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      roles: ["admin", "technician", "sales"],
      color: colors.primary,
    },
    {
      text: "Products",
      icon: <ProductsIcon />,
      path: "/admin/products",
      roles: ["admin", "technician", "sales"],
      color: "#4caf50",
    },
    {
      text: "Customers",
      icon: <CustomersIcon />,
      path: "/admin/customers",
      roles: ["admin", "technician", "sales"],
      color: "#ff9800",
    },
    {
      text: "Repairs",
      icon: <RepairsIcon />,
      path: "/admin/repairs",
      roles: ["admin", "technician"],
      color: "#f44336",
    },
    {
      text: "Sales",
      icon: <SalesIcon />,
      path: "/admin/sales",
      roles: ["admin", "sales"],
      color: "#9c27b0",
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: colors.white,
      }}
    >
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          background: colors.gradient,
          color: colors.white,
        }}
      >
        <Avatar
          sx={{
            width: 70,
            height: 70,
            mx: "auto",
            mb: 2,
            border: "3px solid white",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            bgcolor: colors.secondary,
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {user?.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ opacity: 0.9, textTransform: "capitalize" }}
        >
          {user?.role}
        </Typography>
      </Box>

      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                "&.Mui-selected": {
                  bgcolor: alpha(item.color, 0.1),
                  color: item.color,
                  "& .MuiListItemIcon-root": { color: item.color },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path ? item.color : colors.gray,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 2, color: "#f44336" }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", maxWidth: "100vw" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
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
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
            {menuItems.find((item) => item.path === location.pathname)?.text ||
              "Dashboard"}
          </Typography>

          <Tooltip title="View Cart">
            <IconButton onClick={() => navigate("/cart")} sx={{ mr: 1 }}>
              <Badge badgeContent={cartCount} color="primary">
                <CartIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2 } }}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "#f44336" }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <SwipeableDrawer
          variant="temporary"
          open={mobileOpen}
          onOpen={() => setMobileOpen(true)}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          {drawer}
        </SwipeableDrawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: `1px solid ${colors.lightGray}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* CRITICAL CHANGE: Added overflowX hidden and handled padding carefully */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: colors.light,
          overflowX: "hidden", // Prevents side-scrolling on mobile
        }}
      >
        <Toolbar /> {/* Spacer */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: { xs: 1, sm: 3 },
            minHeight: "calc(100vh - 100px)",
            width: "100%",
            overflow: "auto", // Allows internal table scrolling if necessary
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default Layout;
