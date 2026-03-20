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

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);

const Customers = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
              fontWeight: 600,
              color: colors.dark,
              textAlign: { xs: "center", sm: "left" },
            }}
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
                py: { xs: 1.2, sm: 1 },
                "&:hover": { background: colors.secondary },
              }}
            >
              Add Customer
            </Button>
          )}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            {
              icon: <PersonIcon />,
              label: "Total",
              value: customers.length,
              color: colors.primary,
            },
            {
              icon: <SalesIcon />,
              label: "Purchases",
              value: customers.filter((c) => c.purchases?.length > 0).length,
              color: "#4caf50",
            },
            {
              icon: <RepairsIcon />,
              label: "Repairs",
              value: customers.filter((c) => c.repairs?.length > 0).length,
              color: "#ff9800",
            },
          ].map((stat, i) => (
            <Grid item xs={4} key={i}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent
                  sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(stat.color, 0.1),
                      color: stat.color,
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1.2rem", sm: "1.4rem" },
                      fontWeight: 600,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Search */}
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={
                isMobile ? "Search..." : "Search by name or phone..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.primary }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ),
              }}
              sx={{ bgcolor: "#f8f9fa", borderRadius: 1 }}
            />
            <Tooltip title="Refresh">
              <IconButton onClick={loadCustomers}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          {isSearching && (
            <Chip
              label={`${searchResults.length} results`}
              size="small"
              onDelete={() => {
                setSearchTerm("");
                setIsSearching(false);
              }}
              sx={{
                mt: 1,
                bgcolor: alpha(colors.primary, 0.1),
                color: colors.primary,
              }}
            />
          )}
        </Paper>

        {/* Customers List */}
        {isMobile ? (
          <Box>
            {paginatedCustomers.map((c) => (
              <Card
                key={c.id}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  border:
                    selectedCustomer?.id === c.id
                      ? `2px solid ${colors.primary}`
                      : "none",
                }}
                onClick={() => handleViewCustomer(c)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, flex: 1, minWidth: 0 }}>
                      <Avatar
                        sx={{
                          bgcolor: colors.primary,
                          width: 50,
                          height: 50,
                          flexShrink: 0,
                        }}
                      >
                        {c.name?.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight="600" noWrap>
                          {c.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {c.phone}
                        </Typography>
                        {c.email && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {c.email}
                          </Typography>
                        )}
                        {c.repairs?.length > 0 && (
                          <Chip
                            size="small"
                            icon={<RepairsIcon />}
                            label={`${c.repairs.length} repairs`}
                            sx={{
                              mt: 1,
                              bgcolor: alpha(colors.primary, 0.1),
                              color: colors.primary,
                              height: 20,
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
                          handleWhatsApp(c.phone);
                        }}
                        sx={{ color: "#25D366" }}
                      >
                        <WhatsAppIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(c.phone);
                        }}
                        sx={{ color: colors.primary }}
                      >
                        <PhoneIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  {c.address && (
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <LocationIcon sx={{ fontSize: 16, color: colors.gray }} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {c.address}
                      </Typography>
                    </Box>
                  )}
                  {(user?.role === "admin" || user?.role === "sales") && (
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(c);
                        }}
                        sx={{
                          borderColor: colors.primary,
                          color: colors.primary,
                          flex: 1,
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
                            handleDelete(c.id);
                          }}
                          sx={{ flex: 1 }}
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
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">
                  No customers found
                </Typography>
              </Paper>
            )}
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, overflowX: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: colors.light }}>
                  <TableCell>Customer</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCustomers.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    onClick={() => handleViewCustomer(c)}
                    sx={{
                      cursor: "pointer",
                      bgcolor:
                        selectedCustomer?.id === c.id
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
                            width: 40,
                            height: 40,
                          }}
                        >
                          {c.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {c.name}
                          </Typography>
                          {c.repairs?.length > 0 && (
                            <Chip
                              size="small"
                              icon={<RepairsIcon />}
                              label={`${c.repairs.length} repairs`}
                              sx={{
                                bgcolor: alpha(colors.primary, 0.1),
                                color: colors.primary,
                                height: 20,
                                mt: 0.5,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{c.phone}</Typography>
                      {c.email && (
                        <Typography variant="caption" color="text.secondary">
                          {c.email}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {c.address || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Tooltip title="WhatsApp">
                        <IconButton
                          size="small"
                          onClick={() => handleWhatsApp(c.phone)}
                          sx={{ color: "#25D366" }}
                        >
                          <WhatsAppIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Call">
                        <IconButton
                          size="small"
                          onClick={() => handleCall(c.phone)}
                          sx={{ color: colors.primary }}
                        >
                          <PhoneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {(user?.role === "admin" || user?.role === "sales") && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(c)}
                              sx={{ color: colors.primary }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {user?.role === "admin" && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(c.id)}
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

        {/* Customer Details Drawer */}
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
                colors={colors}
                alpha={alpha}
                isMobile={isMobile}
              />
            </Box>
          )}
        </Drawer>

        {/* Dialog */}
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
                    fullWidth
                    name="name"
                    label="Full Name *"
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
                          <PhoneIcon sx={{ color: colors.primary }} />
                        </InputAdornment>
                      ),
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
                          <EmailIcon sx={{ color: colors.primary }} />
                        </InputAdornment>
                      ),
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: isMobile ? "top" : "bottom",
            horizontal: "center",
          }}
        >
          <Alert severity={snackbar.severity} sx={{ borderRadius: 1 }}>
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
  <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
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
    <Tabs
      value={tabValue}
      onChange={(e, v) => onTabChange(v)}
      sx={{ mt: 2 }}
      variant={isMobile ? "fullWidth" : "standard"}
    >
      <Tab label="Repairs" icon={<RepairsIcon />} iconPosition="start" />
      <Tab label="Purchases" icon={<SalesIcon />} iconPosition="start" />
    </Tabs>
    <TabPanel value={tabValue} index={0}>
      {customer.repairs?.length > 0 ? (
        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {customer.repairs.map((r) => (
            <ListItem key={r.id} divider>
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
                      {r.device_brand} {r.device_model}
                    </Typography>
                    <Chip
                      label={r.status}
                      size="small"
                      sx={{
                        bgcolor:
                          r.status === "completed"
                            ? alpha("#4caf50", 0.1)
                            : alpha(colors.primary, 0.1),
                        color:
                          r.status === "completed" ? "#4caf50" : colors.primary,
                        height: 20,
                      }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="caption" display="block">
                      {r.issue_description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(r.created_at).toLocaleDateString()}
                      {r.final_cost && ` • ETB ${r.final_cost}`}
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
    <TabPanel value={tabValue} index={1}>
      {customer.purchases?.length > 0 ? (
        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {customer.purchases.map((s) => (
            <ListItem key={s.id} divider>
              <ListItemIcon>
                <SalesIcon sx={{ color: "#4caf50" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight="600">
                      {s.product_name}
                    </Typography>
                    <Chip label={`x${s.quantity}`} size="small" />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2">
                      ETB {s.total_amount?.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(s.created_at).toLocaleDateString()}
                      {s.payment_method && ` • ${s.payment_method}`}
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
