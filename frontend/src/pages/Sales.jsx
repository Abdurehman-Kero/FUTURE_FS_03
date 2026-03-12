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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Stack,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Phone as PhoneIcon,
  Inventory as InventoryIcon,
  PointOfSale as SaleIcon,
} from "@mui/icons-material";
import {
  getSales,
  createSale,
  getTodaysSales,
  getSalesByDate,
} from "../services/api";
import { getProducts } from "../services/api";
import { getCustomers, searchCustomers } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Payment method configuration
const paymentMethods = {
  cash: { label: "Cash", color: "#4caf50", icon: <MoneyIcon /> },
  mpesa: { label: "M-Pesa", color: "#2196f3", icon: <PhoneIcon /> },
  telebirr: { label: "Telebirr", color: "#9c27b0", icon: <PhoneIcon /> },
  bank: { label: "Bank Transfer", color: "#ff9800", icon: <ReceiptIcon /> },
};

const Sales = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("today"); // today, week, month, custom
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    customer_phone: "",
    payment_method: "cash",
    notes: "",
  });

  // Load data on mount
  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  // Load sales based on date filter
  useEffect(() => {
    loadSales();
  }, [dateFilter, customDateRange]);

  const loadSales = async () => {
    try {
      setLoading(true);
      let response;

      if (dateFilter === "today") {
        response = await getTodaysSales();
      } else if (
        dateFilter === "custom" &&
        customDateRange.start &&
        customDateRange.end
      ) {
        response = await getSalesByDate(
          customDateRange.start,
          customDateRange.end,
        );
      } else {
        response = await getSales();
      }

      setSales(response.data.data || []);
    } catch (error) {
      showSnackbar("Failed to load sales", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.data.filter((p) => p.stock_quantity > 0));
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const handleCustomerSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await searchCustomers(query);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Customer search failed:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (customerSearch) handleCustomerSearch(customerSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  const selectCustomer = (customer) => {
    setFormData((prev) => ({
      ...prev,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_phone: customer.phone,
    }));
    setCustomerSearch("");
    setSearchResults([]);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setCart([]);
    setFormData({
      customer_id: "",
      customer_name: "",
      customer_phone: "",
      payment_method: "cash",
      notes: "",
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCart([]);
    setCustomerSearch("");
    setSearchResults([]);
  };

  const handleOpenReceipt = (sale) => {
    setSelectedSale(sale);
    setOpenReceiptDialog(true);
  };

  const handleCloseReceipt = () => {
    setOpenReceiptDialog(false);
    setSelectedSale(null);
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.product_id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock_quantity,
        },
      ]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.product_id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showSnackbar("Please add at least one item to cart", "error");
      return;
    }

    try {
      // Create a sale for each item in cart
      for (const item of cart) {
        await createSale({
          product_id: item.product_id,
          customer_id: formData.customer_id || null,
          quantity: item.quantity,
          payment_method: formData.payment_method,
        });
      }

      showSnackbar("Sale completed successfully", "success");
      handleCloseDialog();
      loadSales();
      loadProducts(); // Refresh product stock
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to process sale",
        "error",
      );
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer_phone?.includes(searchTerm) ||
      sale.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const paginatedSales = filteredSales.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Calculate totals
  const totalSales = sales.reduce(
    (sum, sale) => sum + (sale.total_amount || 0),
    0,
  );
  const todayTotal = sales
    .filter(
      (s) =>
        new Date(s.created_at).toDateString() === new Date().toDateString(),
    )
    .reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="500">
          Sales Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          New Sale
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                  >
                    Today's Sales
                  </Typography>
                  <Typography variant="h5" fontWeight="600">
                    ETB {todayTotal.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha("#4caf50", 0.1),
                    color: "#4caf50",
                    width: 48,
                    height: 48,
                  }}
                >
                  <TodayIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                  >
                    Total Sales
                  </Typography>
                  <Typography variant="h5" fontWeight="600">
                    ETB {totalSales.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha("#2196f3", 0.1),
                    color: "#2196f3",
                    width: 48,
                    height: 48,
                  }}
                >
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                  >
                    Transactions
                  </Typography>
                  <Typography variant="h5" fontWeight="600">
                    {sales.length}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha("#ff9800", 0.1),
                    color: "#ff9800",
                    width: 48,
                    height: 48,
                  }}
                >
                  <ReceiptIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                  >
                    Avg. Sale Value
                  </Typography>
                  <Typography variant="h5" fontWeight="600">
                    ETB{" "}
                    {sales.length ? (totalSales / sales.length).toFixed(0) : 0}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha("#9c27b0", 0.1),
                    color: "#9c27b0",
                    width: 48,
                    height: 48,
                  }}
                >
                  <SaleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by customer or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: "#f8f9fa" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label="Today"
                onClick={() => setDateFilter("today")}
                color={dateFilter === "today" ? "primary" : "default"}
                sx={{ borderRadius: 1 }}
              />
              <Chip
                label="This Week"
                onClick={() => setDateFilter("week")}
                color={dateFilter === "week" ? "primary" : "default"}
                sx={{ borderRadius: 1 }}
              />
              <Chip
                label="This Month"
                onClick={() => setDateFilter("month")}
                color={dateFilter === "month" ? "primary" : "default"}
                sx={{ borderRadius: 1 }}
              />
              <Chip
                label="All Time"
                onClick={() => setDateFilter("all")}
                color={dateFilter === "all" ? "primary" : "default"}
                sx={{ borderRadius: 1 }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }} sx={{ textAlign: "right" }}>
            <Tooltip title="Refresh">
              <IconButton onClick={loadSales} sx={{ bgcolor: "#f8f9fa" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Sales List */}
      <Stack spacing={2}>
        {paginatedSales.map((sale) => (
          <Card
            key={sale.id}
            sx={{ borderRadius: 2, "&:hover": { boxShadow: 3 } }}
          >
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(
                          paymentMethods[sale.payment_method]?.color ||
                            "#757575",
                          0.1,
                        ),
                      }}
                    >
                      {paymentMethods[sale.payment_method]?.icon || (
                        <ReceiptIcon />
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {sale.product_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(sale.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                    <Box>
                      <Typography variant="body2">
                        {sale.customer_name || "Walk-in Customer"}
                      </Typography>
                      {sale.customer_phone && (
                        <Typography variant="caption" color="text.secondary">
                          {sale.customer_phone}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Chip
                    label={`x${sale.quantity}`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={sale.payment_method}
                    size="small"
                    sx={{
                      bgcolor: alpha(
                        paymentMethods[sale.payment_method]?.color || "#757575",
                        0.1,
                      ),
                      color:
                        paymentMethods[sale.payment_method]?.color || "#757575",
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight="600"
                  >
                    ETB {sale.total_amount?.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenReceipt(sale)}
                    sx={{ color: "text.secondary" }}
                  >
                    <ReceiptIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Pagination */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <TablePagination
          component="div"
          count={filteredSales.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>

      {/* New Sale Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>New Sale</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Customer Search */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Search Customer (Optional)"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Type name or phone number..."
                />
                {searchResults.length > 0 && (
                  <Paper sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
                    {searchResults.map((customer) => (
                      <ListItem
                        key={customer.id}
                        button
                        onClick={() => selectCustomer(customer)}
                      >
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={customer.name}
                          secondary={customer.phone}
                        />
                      </ListItem>
                    ))}
                  </Paper>
                )}
              </Grid>

              {formData.customer_id && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="info" sx={{ borderRadius: 1 }}>
                    Customer: {formData.customer_name} (
                    {formData.customer_phone})
                  </Alert>
                </Grid>
              )}

              {/* Product Selection */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Add Products
                </Typography>
                <Paper sx={{ maxHeight: 200, overflow: "auto", p: 1 }}>
                  {products.map((product) => (
                    <ListItem
                      key={product.id}
                      button
                      onClick={() => addToCart(product)}
                      disabled={product.stock_quantity === 0}
                    >
                      <ListItemIcon>
                        <InventoryIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={product.name}
                        secondary={`ETB ${product.price} - Stock: ${product.stock_quantity}`}
                      />
                      <Chip
                        label="Add"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </Paper>
              </Grid>

              {/* Cart */}
              {cart.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Cart
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    {cart.map((item) => (
                      <Box
                        key={item.product_id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography variant="body2">{item.name}</Typography>
                          <Chip
                            label={`ETB ${item.price}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity - 1)
                            }
                          >
                            -
                          </IconButton>
                          <Typography>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeFromCart(item.product_id)}
                          >
                            <ClearIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">Total:</Typography>
                      <Typography variant="h6" color="primary.main">
                        ETB {calculateTotal().toLocaleString()}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}

              {/* Payment Method */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="payment_method"
                    value={formData.payment_method}
                    label="Payment Method"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value,
                      })
                    }
                  >
                    {Object.entries(paymentMethods).map(([key, method]) => (
                      <MenuItem key={key} value={key}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Notes */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="notes"
                  label="Notes (Optional)"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={cart.length === 0}
            >
              Complete Sale
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog
        open={openReceiptDialog}
        onClose={handleCloseReceipt}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Sale Receipt</DialogTitle>
        <DialogContent>
          {selectedSale && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography variant="h6">Chala Mobile</Typography>
                <Typography variant="body2" color="text.secondary">
                  Solutions Hub
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Receipt #{selectedSale.id}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Date:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography variant="body2">
                    {new Date(selectedSale.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Customer:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography variant="body2">
                    {selectedSale.customer_name || "Walk-in Customer"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Payment:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Chip
                    label={selectedSale.payment_method}
                    size="small"
                    sx={{
                      bgcolor: alpha(
                        paymentMethods[selectedSale.payment_method]?.color ||
                          "#757575",
                        0.1,
                      ),
                      color:
                        paymentMethods[selectedSale.payment_method]?.color ||
                        "#757575",
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {selectedSale.product_name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {selectedSale.quantity} x ETB{" "}
                    {selectedSale.unit_price}
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    ETB {selectedSale.total_amount?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h5" color="primary.main" fontWeight="600">
                  ETB {selectedSale.total_amount?.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Thank you for your business!
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReceipt}>Close</Button>
          <Button startIcon={<PrintIcon />} variant="contained">
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ borderRadius: 1 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sales;
