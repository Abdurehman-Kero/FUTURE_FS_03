import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Avatar,
  Grid,
  Paper,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Tab,
  Tabs,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  alpha,
  useMediaQuery,
  useTheme,
  Drawer,
  Fade,
  Grow,
  Zoom,
  Slide,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ShoppingBag as SalesIcon,
  Build as RepairsIcon,
  WhatsApp as WhatsAppIcon,
  Call as CallIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  dark: "#1E1A3A",
  light: "#F8F9FF",
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
  purple: "#8B5CF6",
};

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);

const Customers = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDrawer, setOpenDetailsDrawer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    setRowsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await getCustomers();
      setCustomers(response.data.data);
    } catch {
      showSnackbar("Failed to load customers", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      return;
    }
    try {
      setIsSearching(true);
      const response = await searchCustomers(searchTerm);
      setSearchResults(response.data.data);
    } catch {
      showSnackbar("Search failed", "error");
    }
  };

  useEffect(() => {
    const timer = setTimeout(
      () => (searchTerm ? handleSearch() : setIsSearching(false)),
      500,
    );
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
      });
    } else {
      setEditingCustomer(null);
      setFormData({ name: "", phone: "", email: "", address: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showSnackbar("Name and phone are required", "error");
      return;
    }
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
        showSnackbar("Customer updated successfully", "success");
      } else {
        await createCustomer(formData);
        showSnackbar("Customer created successfully", "success");
      }
      handleCloseDialog();
      loadCustomers();
      setSearchTerm("");
      setIsSearching(false);
    } catch {
      showSnackbar("Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
      showSnackbar("Customer deleted", "success");
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
        setOpenDetailsDrawer(false);
      }
      loadCustomers();
    } catch {
      showSnackbar("Delete failed", "error");
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setTabValue(0);
    if (isMobile) setOpenDetailsDrawer(true);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
    setOpenDetailsDrawer(false);
  };

  const handleWhatsApp = (phone) =>
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank");
  const handleCall = (phone) => (window.location.href = `tel:${phone}`);

  const displayedCustomers = isSearching ? searchResults : customers;
  const paginatedCustomers = displayedCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) =>
    setRowsPerPage(parseInt(e.target.value, 10)) || setPage(0);

  const totalCustomers = customers.length;
  const loyalCustomers = customers.filter(
    (c) => (c.repairs?.length || 0) + (c.purchases?.length || 0) > 3,
  ).length;
  const newCustomers = customers.filter((c) => {
    const created = new Date(c.created_at);
    const daysOld = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return daysOld <= 30;
  }).length;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F4F6F8", pb: 8 }}>
      {/* Vivid Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3, md: 5 },
          background: colors.gradient,
          color: "white",
          borderRadius: "0 0 32px 32px",
          mb: { xs: 3, sm: 4 },
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
              fontWeight="800"
              sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
            >
              Customer <span style={{ opacity: 0.9 }}>Hub</span>
            </Typography>
            <Typography
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              }}
            >
              Manage your customer relationships
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: "right" } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: "white",
                color: colors.primary,
                borderRadius: "12px",
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1, sm: 1.2, md: 1.5 },
                fontWeight: "bold",
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                "&:hover": { bgcolor: alpha("#ffffff", 0.9) },
              }}
            >
              Add Customer
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ px: { xs: 1.5, sm: 2, md: 4 } }}>
        {/* Enhanced Stats Cards */}
        <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
          <Grid item xs={4}>
            <Zoom in timeout={500}>
              <Card
                sx={{
                  borderRadius: "20px",
                  background: `linear-gradient(135deg, ${colors.white} 0%, ${alpha(colors.primary, 0.05)} 100%)`,
                  border: `1px solid ${alpha(colors.primary, 0.2)}`,
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(colors.primary, 0.1),
                      color: colors.primary,
                      width: { xs: 40, sm: 45, md: 55 },
                      height: { xs: 40, sm: 45, md: 55 },
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <PersonIcon
                      sx={{
                        fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
                      }}
                    />
                  </Avatar>
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{
                      fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.8rem" },
                    }}
                  >
                    {totalCustomers}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="600"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    Total Customers
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={4}>
            <Zoom in timeout={600}>
              <Card
                sx={{
                  borderRadius: "20px",
                  background: `linear-gradient(135deg, ${colors.white} 0%, ${alpha(colors.purple, 0.05)} 100%)`,
                  border: `1px solid ${alpha(colors.purple, 0.2)}`,
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(colors.purple, 0.1),
                      color: colors.purple,
                      width: { xs: 40, sm: 45, md: 55 },
                      height: { xs: 40, sm: 45, md: 55 },
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <StarIcon
                      sx={{
                        fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
                      }}
                    />
                  </Avatar>
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{
                      fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.8rem" },
                    }}
                  >
                    {loyalCustomers}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="600"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    Loyal Customers
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={4}>
            <Zoom in timeout={700}>
              <Card
                sx={{
                  borderRadius: "20px",
                  background: `linear-gradient(135deg, ${colors.white} 0%, ${alpha(colors.success, 0.05)} 100%)`,
                  border: `1px solid ${alpha(colors.success, 0.2)}`,
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(colors.success, 0.1),
                      color: colors.success,
                      width: { xs: 40, sm: 45, md: 55 },
                      height: { xs: 40, sm: 45, md: 55 },
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <TrendingUpIcon
                      sx={{
                        fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
                      }}
                    />
                  </Avatar>
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{
                      fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.8rem" },
                    }}
                  >
                    {newCustomers}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="600"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    New (30 days)
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Search Bar */}
        <Paper
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: { xs: 3, sm: 4 },
            borderRadius: "20px",
            bgcolor: colors.white,
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={
                isMobile ? "Search..." : "Search by name or phone..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: colors.light,
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: colors.primary,
                        fontSize: { xs: "1.2rem", sm: "1.3rem" },
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
            <Tooltip title="Refresh">
              <IconButton
                onClick={loadCustomers}
                sx={{
                  bgcolor: colors.light,
                  borderRadius: "12px",
                  "&:hover": { bgcolor: colors.primary, color: "white" },
                }}
              >
                <RefreshIcon
                  sx={{ fontSize: { xs: "1.2rem", sm: "1.3rem" } }}
                />
              </IconButton>
            </Tooltip>
          </Box>
          {isSearching && searchResults.length > 0 && (
            <Fade in>
              <Chip
                label={`${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} found`}
                size="small"
                onDelete={() => {
                  setSearchTerm("");
                  setIsSearching(false);
                }}
                sx={{
                  mt: 1.5,
                  bgcolor: alpha(colors.primary, 0.1),
                  color: colors.primary,
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                }}
              />
            </Fade>
          )}
        </Paper>

        {/* Customers Display */}
        {isMobile ? (
          /* MOBILE VIEW - Modern Cards */
          <Grid container spacing={2}>
            {paginatedCustomers.map((c, idx) => (
              <Grow in timeout={idx * 100} key={c.id}>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      border:
                        selectedCustomer?.id === c.id
                          ? `2px solid ${colors.primary}`
                          : "none",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
                      },
                    }}
                    onClick={() => handleViewCustomer(c)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          alignItems: "flex-start",
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            background: colors.gradient,
                            boxShadow: `0 4px 12px ${alpha(colors.primary, 0.3)}`,
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                          }}
                        >
                          {c.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="800"
                            sx={{ fontSize: "1rem" }}
                          >
                            {c.name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            <PhoneIcon
                              sx={{ fontSize: 12, color: colors.gray }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              {c.phone}
                            </Typography>
                          </Box>
                          {c.email && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mt: 0.5,
                              }}
                            >
                              <EmailIcon
                                sx={{ fontSize: 12, color: colors.gray }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                {c.email}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      {/* Stats Badges */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mt: 1.5,
                          flexWrap: "wrap",
                        }}
                      >
                        {(c.repairs?.length || 0) > 0 && (
                          <Chip
                            size="small"
                            icon={<RepairsIcon sx={{ fontSize: 12 }} />}
                            label={`${c.repairs.length} repairs`}
                            sx={{
                              bgcolor: alpha(colors.warning, 0.1),
                              color: colors.warning,
                              fontWeight: 600,
                              height: 24,
                              fontSize: "0.65rem",
                              "& .MuiChip-icon": { fontSize: 12 },
                            }}
                          />
                        )}
                        {(c.purchases?.length || 0) > 0 && (
                          <Chip
                            size="small"
                            icon={<SalesIcon sx={{ fontSize: 12 }} />}
                            label={`${c.purchases.length} purchases`}
                            sx={{
                              bgcolor: alpha(colors.success, 0.1),
                              color: colors.success,
                              fontWeight: 600,
                              height: 24,
                              fontSize: "0.65rem",
                              "& .MuiChip-icon": { fontSize: 12 },
                            }}
                          />
                        )}
                      </Box>

                      {/* Action Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mt: 1.5,
                          pt: 1,
                          borderTop: `1px solid ${colors.lightGray}`,
                        }}
                      >
                        <Tooltip title="WhatsApp">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsApp(c.phone);
                            }}
                            sx={{
                              bgcolor: alpha("#25D366", 0.1),
                              color: "#25D366",
                              "&:hover": { bgcolor: "#25D366", color: "white" },
                              width: 32,
                              height: 32,
                            }}
                          >
                            <WhatsAppIcon sx={{ fontSize: "1.1rem" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Call">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCall(c.phone);
                            }}
                            sx={{
                              bgcolor: alpha(colors.primary, 0.1),
                              color: colors.primary,
                              "&:hover": {
                                bgcolor: colors.primary,
                                color: "white",
                              },
                              width: 32,
                              height: 32,
                            }}
                          >
                            <CallIcon sx={{ fontSize: "1.1rem" }} />
                          </IconButton>
                        </Tooltip>
                        {(user?.role === "admin" || user?.role === "sales") && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDialog(c);
                                }}
                                sx={{
                                  bgcolor: alpha(colors.info, 0.1),
                                  color: colors.info,
                                  "&:hover": {
                                    bgcolor: colors.info,
                                    color: "white",
                                  },
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                <EditIcon sx={{ fontSize: "1.1rem" }} />
                              </IconButton>
                            </Tooltip>
                            {user?.role === "admin" && (
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(c.id);
                                  }}
                                  sx={{
                                    bgcolor: alpha(colors.warning, 0.1),
                                    color: colors.warning,
                                    "&:hover": {
                                      bgcolor: colors.warning,
                                      color: "white",
                                    },
                                    width: 32,
                                    height: 32,
                                  }}
                                >
                                  <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>
        ) : (
          /* DESKTOP VIEW - Enhanced Table */
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: alpha(colors.dark, 0.03) }}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                    }}
                  >
                    Customer
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                    }}
                  >
                    Contact
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                    }}
                  >
                    Activity
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCustomers.map((c, idx) => (
                  <TableRow
                    key={c.id}
                    hover
                    onClick={() => handleViewCustomer(c)}
                    sx={{
                      cursor: "pointer",
                      transition: "background 0.2s",
                      bgcolor:
                        selectedCustomer?.id === c.id
                          ? alpha(colors.primary, 0.05)
                          : "inherit",
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            background: colors.gradient,
                            boxShadow: `0 2px 8px ${alpha(colors.primary, 0.2)}`,
                          }}
                        >
                          {c.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="700"
                            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                          >
                            {c.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                          >
                            Member since{" "}
                            {new Date(c.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontSize: { xs: "0.8rem", sm: "0.85rem" },
                          }}
                        >
                          <PhoneIcon
                            sx={{ fontSize: 14, color: colors.primary }}
                          />
                          {c.phone}
                        </Typography>
                        {c.email && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                          >
                            {c.email}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {(c.repairs?.length || 0) > 0 && (
                          <Chip
                            size="small"
                            icon={<RepairsIcon sx={{ fontSize: 14 }} />}
                            label={`${c.repairs.length} repairs`}
                            sx={{
                              bgcolor: alpha(colors.warning, 0.1),
                              color: colors.warning,
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              height: 28,
                            }}
                          />
                        )}
                        {(c.purchases?.length || 0) > 0 && (
                          <Chip
                            size="small"
                            icon={<SalesIcon sx={{ fontSize: 14 }} />}
                            label={`${c.purchases.length} purchases`}
                            sx={{
                              bgcolor: alpha(colors.success, 0.1),
                              color: colors.success,
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              height: 28,
                            }}
                          />
                        )}
                        {(c.repairs?.length || 0) === 0 &&
                          (c.purchases?.length || 0) === 0 && (
                            <Chip
                              size="small"
                              label="New"
                              sx={{
                                bgcolor: alpha(colors.info, 0.1),
                                color: colors.info,
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                height: 28,
                              }}
                            />
                          )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        <Tooltip title="WhatsApp">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsApp(c.phone);
                            }}
                            sx={{ color: "#25D366" }}
                          >
                            <WhatsAppIcon
                              sx={{ fontSize: { xs: "1.1rem", sm: "1.2rem" } }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Call">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCall(c.phone);
                            }}
                            sx={{ color: colors.primary }}
                          >
                            <CallIcon
                              sx={{ fontSize: { xs: "1.1rem", sm: "1.2rem" } }}
                            />
                          </IconButton>
                        </Tooltip>
                        {(user?.role === "admin" || user?.role === "sales") && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDialog(c);
                                }}
                                sx={{ color: colors.info }}
                              >
                                <EditIcon
                                  sx={{
                                    fontSize: { xs: "1.1rem", sm: "1.2rem" },
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                            {user?.role === "admin" && (
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(c.id);
                                  }}
                                  color="error"
                                >
                                  <DeleteIcon
                                    sx={{
                                      fontSize: { xs: "1.1rem", sm: "1.2rem" },
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedCustomers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No customers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={displayedCustomers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select":
                  { fontSize: { xs: "0.75rem", sm: "0.85rem" } },
              }}
            />
          </TableContainer>
        )}

        {/* Customer Details Drawer */}
        <Drawer
          anchor="bottom"
          open={openDetailsDrawer}
          onClose={handleCloseDetails}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "85vh",
              bgcolor: colors.light,
            },
          }}
        >
          <Slide
            direction="up"
            in={openDetailsDrawer}
            mountOnEnter
            unmountOnExit
          >
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {selectedCustomer && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="800"
                      color={colors.dark}
                      sx={{
                        fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                      }}
                    >
                      Customer Profile
                    </Typography>
                    <IconButton
                      onClick={handleCloseDetails}
                      sx={{ bgcolor: alpha(colors.gray, 0.1) }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <CustomerDetails
                    customer={selectedCustomer}
                    tabValue={tabValue}
                    onTabChange={setTabValue}
                    colors={colors}
                    alpha={alpha}
                    isMobile={isMobile}
                  />
                </>
              )}
            </Box>
          </Slide>
        </Drawer>

        {/* Add/Edit Customer Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: { borderRadius: isMobile ? 0 : "24px", overflow: "hidden" },
          }}
        >
          <DialogTitle
            sx={{
              background: colors.gradient,
              color: "white",
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              p: { xs: 2, sm: 3 },
            }}
          >
            {editingCustomer ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Full Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon
                            sx={{
                              color: colors.primary,
                              fontSize: { xs: "1rem", sm: "1.2rem" },
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon
                            sx={{
                              color: colors.primary,
                              fontSize: { xs: "1rem", sm: "1.2rem" },
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon
                            sx={{
                              color: colors.primary,
                              fontSize: { xs: "1rem", sm: "1.2rem" },
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="address"
                    label="Address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon
                            sx={{
                              color: colors.primary,
                              fontSize: { xs: "1rem", sm: "1.2rem" },
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{
                p: { xs: 2, sm: 3 },
                gap: 1,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Button
                onClick={handleCloseDialog}
                fullWidth={isMobile}
                variant="outlined"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth={isMobile}
                sx={{
                  background: colors.gradient,
                  "&:hover": { background: colors.secondary },
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  py: { xs: 1, sm: 1.2 },
                }}
              >
                {editingCustomer ? "Update Customer" : "Create Customer"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: isMobile ? "top" : "bottom",
            horizontal: "center",
          }}
        >
          <Alert
            severity={snackbar.severity}
            variant="filled"
            sx={{ borderRadius: "12px" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

const CustomerDetails = ({
  customer,
  tabValue,
  onTabChange,
  colors,
  alpha,
  isMobile,
}) => (
  <Paper
    sx={{
      p: isMobile ? 1.5 : 3,
      borderRadius: "20px",
      bgcolor: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.5, sm: 2 },
        mb: 3,
        flexWrap: "wrap",
      }}
    >
      <Avatar
        sx={{
          width: { xs: 50, sm: 70 },
          height: { xs: 50, sm: 70 },
          background: colors.gradient,
          boxShadow: `0 4px 12px ${alpha(colors.primary, 0.3)}`,
          fontSize: { xs: "1.2rem", sm: "2rem" },
          fontWeight: "bold",
        }}
      >
        {customer.name?.charAt(0).toUpperCase()}
      </Avatar>
      <Box>
        <Typography
          variant="h5"
          fontWeight="800"
          sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" } }}
        >
          {customer.name}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
          <Chip
            icon={<PhoneIcon sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }} />}
            label={customer.phone}
            size="small"
            onClick={() => (window.location.href = `tel:${customer.phone}`)}
            sx={{
              cursor: "pointer",
              bgcolor: alpha(colors.primary, 0.1),
              color: colors.primary,
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              height: { xs: 28, sm: 32 },
            }}
          />
          {customer.email && (
            <Chip
              icon={
                <EmailIcon sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }} />
              }
              label={customer.email}
              size="small"
              sx={{
                bgcolor: alpha(colors.info, 0.1),
                color: colors.info,
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                height: { xs: 28, sm: 32 },
              }}
            />
          )}
        </Box>
      </Box>
    </Box>

    <Divider />

    <Tabs
      value={tabValue}
      onChange={(e, v) => onTabChange(v)}
      sx={{ mt: 2 }}
      variant={isMobile ? "fullWidth" : "standard"}
      TabIndicatorProps={{ sx: { bgcolor: colors.primary } }}
    >
      <Tab
        label="Repairs"
        icon={<RepairsIcon sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }} />}
        iconPosition="start"
        sx={{
          "&.Mui-selected": { color: colors.primary },
          fontSize: { xs: "0.75rem", sm: "0.85rem" },
        }}
      />
      <Tab
        label="Purchases"
        icon={<SalesIcon sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }} />}
        iconPosition="start"
        sx={{
          "&.Mui-selected": { color: colors.primary },
          fontSize: { xs: "0.75rem", sm: "0.85rem" },
        }}
      />
    </Tabs>

    <TabPanel value={tabValue} index={0}>
      {customer.repairs?.length > 0 ? (
        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {customer.repairs.map((r) => (
            <ListItem
              key={r.id}
              divider
              sx={{ borderRadius: "12px", mb: 1, px: { xs: 1, sm: 2 } }}
            >
              <ListItemIcon>
                <RepairsIcon
                  sx={{
                    color: colors.warning,
                    fontSize: { xs: "1.2rem", sm: "1.4rem" },
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      sx={{
                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                      }}
                    >
                      {r.device_brand} {r.device_model}
                    </Typography>
                    <Chip
                      label={r.status}
                      size="small"
                      sx={{
                        bgcolor:
                          r.status === "completed"
                            ? alpha(colors.success, 0.1)
                            : alpha(colors.warning, 0.1),
                        color:
                          r.status === "completed"
                            ? colors.success
                            : colors.warning,
                        height: 24,
                        fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      }}
                    >
                      {r.issue_description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem" } }}
                      >
                        📅 {new Date(r.created_at).toLocaleDateString()}
                      </Typography>
                      {r.final_cost && (
                        <Typography
                          variant="caption"
                          fontWeight="600"
                          color={colors.primary}
                          sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem" } }}
                        >
                          💰 ETB {r.final_cost}
                        </Typography>
                      )}
                    </Box>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <RepairsIcon
            sx={{
              fontSize: { xs: 40, sm: 48 },
              color: colors.gray,
              mb: 1,
              opacity: 0.5,
            }}
          />
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
          >
            No repairs yet
          </Typography>
        </Box>
      )}
    </TabPanel>

    <TabPanel value={tabValue} index={1}>
      {customer.purchases?.length > 0 ? (
        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {customer.purchases.map((s) => (
            <ListItem
              key={s.id}
              divider
              sx={{ borderRadius: "12px", mb: 1, px: { xs: 1, sm: 2 } }}
            >
              <ListItemIcon>
                <SalesIcon
                  sx={{
                    color: colors.success,
                    fontSize: { xs: "1.2rem", sm: "1.4rem" },
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      sx={{
                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                      }}
                    >
                      {s.product_name}
                    </Typography>
                    <Chip
                      label={`x${s.quantity}`}
                      size="small"
                      sx={{
                        bgcolor: alpha(colors.success, 0.1),
                        color: colors.success,
                        height: 24,
                        fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color={colors.primary}
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                    >
                      ETB {s.total_amount?.toLocaleString()}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem" } }}
                      >
                        📅 {new Date(s.created_at).toLocaleDateString()}
                      </Typography>
                      {s.payment_method && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem" } }}
                        >
                          💳 {s.payment_method}
                        </Typography>
                      )}
                    </Box>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <SalesIcon
            sx={{
              fontSize: { xs: 40, sm: 48 },
              color: colors.gray,
              mb: 1,
              opacity: 0.5,
            }}
          />
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
          >
            No purchases yet
          </Typography>
        </Box>
      )}
    </TabPanel>
  </Paper>
);

export default Customers;
