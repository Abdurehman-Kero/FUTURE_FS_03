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
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";

const drawerWidth = 280;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

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
    navigate("/login");
  };

  // Menu items with correct admin paths
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      roles: ["admin", "technician", "sales"],
      color: "#667eea",
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
        bgcolor: "#ffffff",
      }}
    >
      {/* User Profile Section */}
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            mb: 2,
            border: "4px solid white",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            bgcolor: theme.palette.secondary.main,
            fontSize: "2.5rem",
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

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 2, py: 3 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                py: 1.5,
                "&.Mui-selected": {
                  bgcolor: alpha(item.color, 0.1),
                  color: item.color,
                  "& .MuiListItemIcon-root": {
                    color: item.color,
                  },
                  "&:hover": {
                    bgcolor: alpha(item.color, 0.15),
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
                    location.pathname === item.path
                      ? item.color
                      : "text.secondary",
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

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: theme.palette.error.main,
            py: 1.5,
            "&:hover": {
              bgcolor: alpha(theme.palette.error.main, 0.1),
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          borderBottom: `1px solid ${theme.palette.divider}`,
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

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 500 }}
          >
            {menuItems.find((item) => item.path === location.pathname)?.text ||
              "Dashboard"}
          </Typography>

          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                cursor: "pointer",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{ color: theme.palette.error.main }}
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
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
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
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "#f8f9fa",
        }}
      >
        <Toolbar /> {/* Spacing for fixed AppBar */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            minHeight: "calc(100vh - 120px)",
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default Layout;
