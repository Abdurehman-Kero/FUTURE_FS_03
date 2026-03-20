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
} from "@mui/icons-material";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

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
  success: "#10B981",
};

// Tab Panel Component
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
    } catch (error) {
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
    } catch (error) {
      showSnackbar("Search failed", "error");
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      } else {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCustomer(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Operation failed",
        "error",
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      await deleteCustomer(id);
      showSnackbar("Customer deleted successfully", "success");
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
        setOpenDetailsDrawer(false);
      }
      loadCustomers();
    } catch (error) {
      showSnackbar("Failed to delete customer", "error");
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setTabValue(0);
    if (isMobile) {
      setOpenDetailsDrawer(true);
    }
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
    setOpenDetailsDrawer(false);
  };

  const handleWhatsApp = (phone) => {
    const formattedPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${formattedPhone}`, "_blank");
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const displayedCustomers = isSearching ? searchResults : customers;
  const paginatedCustomers = displayedCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 2, sm: 0 },
            mb: 3,
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h5"}
            fontWeight="600"
            color={colors.dark}
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            Customers
          </Typography>
          {(user?.role === "admin" || user?.role === "sales") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              fullWidth={isMobile}
              sx={{
                background: colors.gradient,
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: { xs: 1.5, sm: 1 },
                "&:hover": { background: colors.secondary },
              }}
            >
              Add Customer
            </Button>
          )}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card
              sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(colors.primary, 0.1),
                      color: colors.primary,
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      mb: 1,
                    }}
                  >
                    <PersonIcon fontSize={isMobile ? "small" : "medium"} />
                  </Avatar>
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="caption"
                      display="block"
                    >
                      Total
                    </Typography>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      fontWeight="600"
                    >
                      {customers.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card
              sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha("#4caf50", 0.1),
                      color: "#4caf50",
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      mb: 1,
                    }}
                  >
                    <SalesIcon fontSize={isMobile ? "small" : "medium"} />
                  </Avatar>
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="caption"
                      display="block"
                    >
                      Purchases
                    </Typography>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      fontWeight="600"
                    >
                      {customers.filter((c) => c.purchases?.length > 0).length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card
              sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha("#ff9800", 0.1),
                      color: "#ff9800",
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      mb: 1,
                    }}
                  >
                    <RepairsIcon fontSize={isMobile ? "small" : "medium"} />
                  </Avatar>
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="caption"
                      display="block"
                    >
                      Repairs
                    </Typography>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      fontWeight="600"
                    >
                      {customers.filter((c) => c.repairs?.length > 0).length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search Bar */}
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={
                isMobile ? "Search customers..." : "Search by name or phone..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ color: colors.primary }}
                      fontSize={isMobile ? "small" : "medium"}
                    />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: "#f8f9fa", borderRadius: 1 }}
            />
            <Tooltip title="Refresh">
              <IconButton onClick={loadCustomers} sx={{ bgcolor: "#f8f9fa" }}>
                <RefreshIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
          </Box>
          {isSearching && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={`${searchResults.length} results`}
                size="small"
                onDelete={() => {
                  setSearchTerm("");
                  setIsSearching(false);
                }}
                sx={{
                  bgcolor: alpha(colors.primary, 0.1),
                  color: colors.primary,
                }}
              />
            </Box>
          )}
        </Paper>

        {/* Main Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={selectedCustomer && !isMobile ? 5 : 12}>
            {isMobile ? (
              // Mobile Card View
              <Box>
                {paginatedCustomers.map((customer) => (
                  <Card
                    key={customer.id}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      cursor: "pointer",
                      border:
                        selectedCustomer?.id === customer.id
                          ? `2px solid ${colors.primary}`
                          : "none",
                    }}
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", gap: 2, flex: 1, minWidth: 0 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: colors.primary,
                              width: 50,
                              height: 50,
                              flexShrink: 0,
                            }}
                          >
                            {customer.name?.charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="600"
                              noWrap
                            >
                              {customer.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {customer.phone}
                            </Typography>
                            {customer.email && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                              >
                                {customer.email}
                              </Typography>
                            )}
                            {customer.repairs?.length > 0 && (
                              <Chip
                                size="small"
                                icon={<RepairsIcon />}
                                label={`${customer.repairs.length} repairs`}
                                sx={{
                                  mt: 1,
                                  bgcolor: alpha(colors.primary, 0.1),
                                  color: colors.primary,
                                  height: 20,
                                  fontSize: "0.65rem",
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsApp(customer.phone);
                            }}
                            sx={{ color: "#25D366" }}
                          >
                            <WhatsAppIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCall(customer.phone);
                            }}
                            sx={{ color: colors.primary }}
                          >
                            <PhoneIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Address */}
                      {customer.address && (
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <LocationIcon
                            sx={{
                              fontSize: 16,
                              color: colors.gray,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {customer.address}
                          </Typography>
                        </Box>
                      )}

                      {/* Action Buttons */}
                      {(user?.role === "admin" || user?.role === "sales") && (
                        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(customer);
                            }}
                            sx={{
                              borderColor: colors.primary,
                              color: colors.primary,
                              flex: 1,
                              fontSize: "0.7rem",
                              py: 0.5,
                            }}
                          >
                            Edit
                          </Button>
                          {user?.role === "admin" && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(customer.id);
                              }}
                              sx={{ flex: 1, fontSize: "0.7rem", py: 0.5 }}
                            >
                              Delete
                            </Button>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {paginatedCustomers.length === 0 && (
                  <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
                    <Typography color="text.secondary">
                      No customers found
                    </Typography>
                  </Paper>
                )}
              </Box>
            ) : (
              // Desktop Table View
              <TableContainer
                component={Paper}
                sx={{ borderRadius: 2, overflowX: "auto" }}
              >
                <Table sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: colors.light }}>
                      <TableCell>Customer</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCustomers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        hover
                        onClick={() => handleViewCustomer(customer)}
                        sx={{
                          cursor: "pointer",
                          bgcolor:
                            selectedCustomer?.id === customer.id
                              ? alpha(colors.primary, 0.05)
                              : "inherit",
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                mr: 2,
                                bgcolor: colors.primary,
                                width: 32,
                                height: 32,
                              }}
                            >
                              {customer.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight="500"
                                noWrap
                                sx={{ maxWidth: 150 }}
                              >
                                {customer.name}
                              </Typography>
                              {customer.repairs?.length > 0 && (
                                <Chip
                                  size="small"
                                  icon={<RepairsIcon />}
                                  label={`${customer.repairs.length} repairs`}
                                  sx={{
                                    bgcolor: alpha(colors.primary, 0.1),
                                    color: colors.primary,
                                    height: 20,
                                    fontSize: "0.65rem",
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {customer.phone}
                          </Typography>
                          {customer.email && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                              sx={{ maxWidth: 150 }}
                            >
                              {customer.email}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 200 }}
                          >
                            {customer.address || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Tooltip title="WhatsApp">
                            <IconButton
                              size="small"
                              onClick={() => handleWhatsApp(customer.phone)}
                              sx={{ color: "#25D366" }}
                            >
                              <WhatsAppIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Call">
                            <IconButton
                              size="small"
                              onClick={() => handleCall(customer.phone)}
                              sx={{ color: colors.primary }}
                            >
                              <PhoneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {(user?.role === "admin" ||
                            user?.role === "sales") && (
                            <>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog(customer)}
                                  sx={{ color: colors.primary }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {user?.role === "admin" && (
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDelete(customer.id)}
                                    color="error"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {paginatedCustomers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
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
                />
              </TableContainer>
            )}
          </Grid>

          {/* Customer Details Panel - Desktop */}
          {selectedCustomer && !isMobile && (
            <Grid item xs={12} md={7}>
              <CustomerDetails
                customer={selectedCustomer}
                tabValue={tabValue}
                onTabChange={setTabValue}
                onClose={handleCloseDetails}
                colors={colors}
                alpha={alpha}
              />
            </Grid>
          )}
        </Grid>

        {/* Customer Details Drawer - Mobile */}
        <Drawer
          anchor="bottom"
          open={openDetailsDrawer}
          onClose={handleCloseDetails}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "85vh",
            },
          }}
        >
          {selectedCustomer && (
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="600">
                  Customer Details
                </Typography>
                <IconButton onClick={handleCloseDetails}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <CustomerDetails
                customer={selectedCustomer}
                tabValue={tabValue}
                onTabChange={setTabValue}
                onClose={handleCloseDetails}
                colors={colors}
                alpha={alpha}
                isMobile={isMobile}
              />
            </Box>
          )}
        </Drawer>

        {/* Add/Edit Customer Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle
            sx={{
              bgcolor: colors.primary,
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {editingCustomer ? "Edit Customer" : "Add New Customer"}
            {isMobile && (
              <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Full Name *"
                    fullWidth
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: colors.primary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="phone"
                    label="Phone Number *"
                    fullWidth
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: colors.primary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: colors.primary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Physical Address"
                    multiline
                    rows={2}
                    fullWidth
                    value={formData.address}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon sx={{ color: colors.primary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{ p: 2, flexDirection: isMobile ? "column" : "row", gap: 1 }}
            >
              {!isMobile && <Button onClick={handleCloseDialog}>Cancel</Button>}
              <Button
                type="submit"
                variant="contained"
                fullWidth={isMobile}
                sx={{
                  bgcolor: colors.primary,
                  "&:hover": { bgcolor: colors.secondary },
                  py: isMobile ? 1.5 : 1,
                }}
              >
                {editingCustomer ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: isMobile ? "top" : "bottom",
            horizontal: isMobile ? "center" : "right",
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ borderRadius: 1, width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

// Customer Details Component
const CustomerDetails = ({
  customer,
  tabValue,
  onTabChange,
  onClose,
  colors,
  alpha,
  isMobile,
}) => (
  <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h6" fontWeight="600">
        Customer Details
      </Typography>
      {!isMobile && (
        <IconButton onClick={onClose} size="small">
          <ClearIcon />
        </IconButton>
      )}
    </Box>

    {/* Customer Info */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 3,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Avatar
        sx={{
          width: 60,
          height: 60,
          bgcolor: colors.primary,
          fontSize: "1.8rem",
          flexShrink: 0,
        }}
      >
        {customer.name?.charAt(0)}
      </Avatar>
      <Box>
        <Typography variant="h6">{customer.name}</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
          <Chip
            icon={<PhoneIcon />}
            label={customer.phone}
            size="small"
            onClick={() => (window.location.href = `tel:${customer.phone}`)}
            sx={{ cursor: "pointer" }}
          />
          {customer.email && (
            <Chip icon={<EmailIcon />} label={customer.email} size="small" />
          )}
        </Box>
      </Box>
    </Box>

    <Divider />

    {/* Tabs */}
    <Tabs
      value={tabValue}
      onChange={(e, v) => onTabChange(v)}
      sx={{ mt: 2 }}
      variant={isMobile ? "fullWidth" : "standard"}
    >
      <Tab
        label="Repairs"
        icon={<RepairsIcon />}
        iconPosition="start"
        sx={{ minHeight: 48 }}
      />
      <Tab
        label="Purchases"
        icon={<SalesIcon />}
        iconPosition="start"
        sx={{ minHeight: 48 }}
      />
    </Tabs>

    {/* Repair History */}
    <TabPanel value={tabValue} index={0}>
      {customer.repairs?.length > 0 ? (
        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {customer.repairs.map((repair) => (
            <ListItem key={repair.id} divider>
              <ListItemIcon>
                <RepairsIcon sx={{ color: colors.primary }} />
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
                    <Typography variant="body2" fontWeight="600">
                      {repair.device_brand} {repair.device_model}
                    </Typography>
                    <Chip
                      label={repair.status}
                      size="small"
                      sx={{
                        bgcolor:
                          repair.status === "completed"
                            ? alpha("#4caf50", 0.1)
                            : alpha(colors.primary, 0.1),
                        color:
                          repair.status === "completed"
                            ? "#4caf50"
                            : colors.primary,
                        height: 20,
                      }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      {repair.issue_description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(repair.created_at).toLocaleDateString()}
                      {repair.final_cost && ` • ETB ${repair.final_cost}`}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography color="text.secondary">No repairs yet</Typography>
        </Box>
      )}
    </TabPanel>

    {/* Purchase History */}
    <TabPanel value={tabValue} index={1}>
      {customer.purchases?.length > 0 ? (
        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {customer.purchases.map((sale) => (
            <ListItem key={sale.id} divider>
              <ListItemIcon>
                <SalesIcon sx={{ color: "#4caf50" }} />
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
                    <Typography variant="body2" fontWeight="600">
                      {sale.product_name}
                    </Typography>
                    <Chip label={`x${sale.quantity}`} size="small" />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2">
                      ETB {sale.total_amount?.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(sale.created_at).toLocaleDateString()}
                      {sale.payment_method && ` • ${sale.payment_method}`}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography color="text.secondary">No purchases yet</Typography>
        </Box>
      )}
    </TabPanel>
  </Paper>
);

export default Customers;
