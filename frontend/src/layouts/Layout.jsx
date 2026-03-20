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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Color scheme matching homepage
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/");
  };

  // Menu items with correct admin paths
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

  // Filter menu items based on user role
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
      {/* User Profile Section - Mobile Optimized */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          textAlign: "center",
          background: colors.gradient,
          color: colors.white,
        }}
      >
        <Avatar
          sx={{
            width: { xs: 60, sm: 70, md: 80 },
            height: { xs: 60, sm: 70, md: 80 },
            mx: "auto",
            mb: { xs: 1.5, sm: 2 },
            border: "3px solid white",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            bgcolor: colors.secondary,
            fontSize: { xs: "1.8rem", sm: "2rem", md: "2.5rem" },
            fontWeight: "bold",
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
          }}
        >
          {user?.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.9,
            textTransform: "capitalize",
            fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
          }}
        >
          {user?.role}
        </Typography>
      </Box>

      {/* Navigation Menu - Mobile Optimized */}
      <List
        sx={{
          flex: 1,
          px: { xs: 1, sm: 1.5, md: 2 },
          py: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        {filteredMenuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ mb: { xs: 0.5, sm: 0.8 } }}
          >
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                py: { xs: 0.8, sm: 1, md: 1.2 },
                px: { xs: 1.5, sm: 2 },
                "&.Mui-selected": {
                  bgcolor: alpha(item.color, 0.1),
                  color: item.color,
                  "& .MuiListItemIcon-root": {
                    color: item.color,
                  },
                },
                "&:hover": {
                  bgcolor: alpha(item.color, 0.05),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path ? item.color : colors.gray,
                  minWidth: { xs: 36, sm: 40 },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontSize: { xs: "0.875rem", sm: "0.9rem" },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Logout Button - Mobile Optimized */}
      <Box sx={{ p: { xs: 1, sm: 1.5, md: 2 } }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#f44336",
            py: { xs: 0.8, sm: 1, md: 1.2 },
            "&:hover": {
              bgcolor: alpha("#f44336", 0.1),
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: { xs: 36, sm: 40 } }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: { xs: "0.875rem", sm: "0.9rem" },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.light }}>
      {/* App Bar - Mobile Optimized */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: colors.white,
          color: colors.dark,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          borderBottom: `1px solid ${colors.lightGray}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
            size={isMobile ? "small" : "medium"}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" },
              color: colors.dark,
            }}
          >
            {menuItems.find((item) => item.path === location.pathname)?.text ||
              "Dashboard"}
          </Typography>

          {/* Cart Icon - Mobile Optimized */}
          <Tooltip title="View Cart">
            <IconButton
              onClick={() => navigate("/cart")}
              sx={{
                mr: { xs: 0.5, sm: 1 },
                color: colors.gray,
                "&:hover": { color: colors.primary },
              }}
              size={isMobile ? "small" : "medium"}
            >
              <Badge
                badgeContent={cartCount}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: { xs: "0.6rem", sm: "0.75rem" },
                    minWidth: { xs: 16, sm: 20 },
                    height: { xs: 16, sm: 20 },
                  },
                }}
              >
                <CartIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Avatar - Mobile Optimized */}
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ p: { xs: 0.5, sm: 0.8 } }}
          >
            <Avatar
              sx={{
                width: { xs: 28, sm: 32, md: 36 },
                height: { xs: 28, sm: 32, md: 36 },
                bgcolor: colors.primary,
                cursor: "pointer",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          {/* User Menu - Mobile Optimized */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: { xs: 160, sm: 200 },
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            <MenuItem onClick={handleMenuClose} sx={{ py: { xs: 1, sm: 1.2 } }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ py: { xs: 1, sm: 1.2 } }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{ color: "#f44336", py: { xs: 1, sm: 1.2 } }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer - Swipeable for better mobile experience */}
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
              borderRight: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            },
          }}
        >
          {/* Close button for mobile */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={handleDrawerToggle} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          {drawer}
        </SwipeableDrawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: `1px solid ${colors.lightGray}`,
              boxShadow: "none",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content - Mobile Optimized */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: colors.light,
        }}
      >
        {/* Spacer for fixed AppBar */}
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

        {/* Content Paper */}
        <Paper
          sx={{
            p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            borderRadius: { xs: 2, sm: 2.5, md: 3 },
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            minHeight: "calc(100vh - 120px)",
            overflowX: "hidden",
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default Layout;
