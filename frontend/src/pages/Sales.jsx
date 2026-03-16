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
  Clear as ClearIcon,
  Phone as PhoneIcon,
  Inventory as InventoryIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { getSales, createSale, getTodaysSales } from "../services/api";
import { getProducts } from "../services/api";
import { getCustomers, searchCustomers } from "../services/api";
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

const paymentMethods = {
  cash: { label: "Cash", color: "#4caf50", icon: <MoneyIcon /> },
  mpesa: { label: "M-Pesa", color: "#2196f3", icon: <PhoneIcon /> },
  telebirr: { label: "Telebirr", color: "#9c27b0", icon: <PhoneIcon /> },
};

const Sales = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [warrantyPeriod, setWarrantyPeriod] = useState("12");
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
  });

  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  useEffect(() => {
    loadSales();
  }, [dateFilter]);

  const loadSales = async () => {
    try {
      setLoading(true);
      const res =
        dateFilter === "today" ? await getTodaysSales() : await getSales();
      console.log("Sales data:", res.data.data); // Debug: Check if warranty_months is coming from backend
      setSales(res.data.data || []);
    } catch (error) {
      showSnackbar("Failed to load sales", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.data.filter((p) => p.stock_quantity > 0));
    } catch (error) {}
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (customerSearch) {
        const res = await searchCustomers(customerSearch);
        setSearchResults(res.data.data);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const filteredSales = sales.filter(
    (s) =>
      s.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.product_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedSales = filteredSales.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const addToCart = (product) => {
    const existing = cart.find((i) => i.product_id === product.id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
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

  const removeFromCart = (productId) =>
    setCart(cart.filter((i) => i.product_id !== productId));

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((i) =>
          i.product_id === productId ? { ...i, quantity: newQty } : i,
        ),
      );
    }
  };

  const calculateTotal = () =>
    cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showSnackbar("Please add items to cart", "error");
      return;
    }
    try {
      for (const item of cart) {
        // Parse warranty period to integer
        const warrantyMonths = parseInt(warrantyPeriod) || 12;

        console.log("Sending warranty_months:", warrantyMonths); // Debug

        await createSale({
          product_id: item.product_id,
          customer_id: formData.customer_id || null,
          customer_name: formData.customer_name || "Walk-in Customer",
          customer_phone: formData.customer_phone || "",
          quantity: item.quantity,
          payment_method: formData.payment_method,
          warranty_months: warrantyMonths, // This is the key field
        });
      }
      showSnackbar("Sale completed successfully!", "success");
      setOpenDialog(false);
      setCart([]);
      setWarrantyPeriod("12");
      setFormData({
        customer_id: "",
        customer_name: "",
        customer_phone: "",
        payment_method: "cash",
      });
      loadSales();
      loadProducts();
    } catch (error) {
      console.error("Sale error:", error);
      showSnackbar("Failed to process sale", "error");
    }
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
        <Typography variant="h5" fontWeight="600" color={colors.dark}>
          Sales
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setCart([]);
            setFormData({
              customer_id: "",
              customer_name: "",
              customer_phone: "",
              payment_method: "cash",
            });
            setOpenDialog(true);
          }}
          sx={{
            background: colors.gradient,
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            "&:hover": { background: colors.secondary },
          }}
        >
          New Sale
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <TodayIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="caption">
                    Today's Sales
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    ETB{" "}
                    {sales
                      .filter(
                        (s) =>
                          new Date(s.created_at).toDateString() ===
                          new Date().toDateString(),
                      )
                      .reduce((sum, s) => sum + (s.total_amount || 0), 0)
                      .toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha("#2196f3", 0.1),
                    color: "#2196f3",
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="caption">
                    Total Sales
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    ETB{" "}
                    {sales
                      .reduce((sum, s) => sum + (s.total_amount || 0), 0)
                      .toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha("#ff9800", 0.1),
                    color: "#ff9800",
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <ReceiptIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="caption">
                    Transactions
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {sales.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search & Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="Search by customer or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.primary }} />
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
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label="Today"
                onClick={() => setDateFilter("today")}
                sx={{
                  bgcolor:
                    dateFilter === "today" ? colors.primary : "transparent",
                  color: dateFilter === "today" ? "white" : colors.gray,
                  border:
                    dateFilter === "today"
                      ? "none"
                      : `1px solid ${colors.lightGray}`,
                }}
              />
              <Chip
                label="All"
                onClick={() => setDateFilter("all")}
                sx={{
                  bgcolor:
                    dateFilter === "all" ? colors.primary : "transparent",
                  color: dateFilter === "all" ? "white" : colors.gray,
                  border:
                    dateFilter === "all"
                      ? "none"
                      : `1px solid ${colors.lightGray}`,
                }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }} sx={{ textAlign: "right" }}>
            <IconButton onClick={loadSales} size="small">
              <RefreshIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {/* Sales List */}
      {paginatedSales.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <ReceiptIcon sx={{ fontSize: 48, color: colors.gray, mb: 2 }} />
          <Typography color={colors.gray}>No sales found</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              mt: 2,
              bgcolor: colors.primary,
              "&:hover": { bgcolor: colors.secondary },
            }}
          >
            Create First Sale
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {paginatedSales.map((sale) => (
            <Card key={sale.id} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(
                            paymentMethods[sale.payment_method]?.color ||
                              "#757575",
                            0.1,
                          ),
                          color:
                            paymentMethods[sale.payment_method]?.color ||
                            "#757575",
                          mr: 2,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {paymentMethods[sale.payment_method]?.icon || (
                          <ReceiptIcon />
                        )}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                          {sale.product_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(sale.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonIcon
                        sx={{ fontSize: 16, mr: 0.5, color: colors.gray }}
                      />
                      <Typography variant="body2">
                        {sale.customer_name || "Walk-in"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Chip
                      label={`Qty: ${sale.quantity}`}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {/* Show warranty badge if available */}
                    {sale.warranty_months && (
                      <Chip
                        label={`${sale.warranty_months}m`}
                        size="small"
                        sx={{
                          bgcolor: alpha(colors.primary, 0.1),
                          color: colors.primary,
                        }}
                      />
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: colors.primary, fontWeight: 600 }}
                    >
                      ETB {sale.total_amount?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedSale(sale);
                        setOpenReceiptDialog(true);
                      }}
                      sx={{ color: colors.primary }}
                    >
                      <ReceiptIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {paginatedSales.length > 0 && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <TablePagination
            component="div"
            count={filteredSales.length}
            page={page}
            onPageChange={(e, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Box>
      )}

      {/* New Sale Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: colors.primary, color: "white" }}>
          New Sale
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              {/* Customer Search */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Search Customer (Optional)"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  size="small"
                  placeholder="Type name or phone..."
                />
                {searchResults.length > 0 && (
                  <Paper sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
                    {searchResults.map((c) => (
                      <ListItem
                        key={c.id}
                        button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            customer_id: c.id,
                            customer_name: c.name,
                            customer_phone: c.phone,
                          });
                          setCustomerSearch("");
                          setSearchResults([]);
                        }}
                      >
                        <ListItemIcon>
                          <PersonIcon sx={{ color: colors.primary }} />
                        </ListItemIcon>
                        <ListItemText primary={c.name} secondary={c.phone} />
                      </ListItem>
                    ))}
                  </Paper>
                )}
              </Grid>

              {formData.customer_id && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="success" sx={{ borderRadius: 1 }}>
                    Customer: {formData.customer_name} (
                    {formData.customer_phone})
                  </Alert>
                </Grid>
              )}

              {/* Products */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Select Products
                </Typography>
                <Paper sx={{ maxHeight: 200, overflow: "auto", p: 1 }}>
                  {products.length === 0 ? (
                    <Typography
                      color="text.secondary"
                      align="center"
                      sx={{ py: 2 }}
                    >
                      No products in stock
                    </Typography>
                  ) : (
                    products.map((p) => (
                      <ListItem key={p.id} button onClick={() => addToCart(p)}>
                        <ListItemIcon>
                          <InventoryIcon sx={{ color: colors.primary }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={p.name}
                          secondary={`ETB ${p.price} • Stock: ${p.stock_quantity}`}
                        />
                        <Chip
                          label="Add"
                          size="small"
                          sx={{
                            bgcolor: alpha(colors.primary, 0.1),
                            color: colors.primary,
                          }}
                        />
                      </ListItem>
                    ))
                  )}
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
                        <Typography variant="body2">{item.name}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity - 1)
                            }
                          >
                            -
                          </IconButton>
                          <Typography
                            sx={{ mx: 1, minWidth: 20, textAlign: "center" }}
                          >
                            {item.quantity}
                          </Typography>
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
                            onClick={() => removeFromCart(item.product_id)}
                            sx={{ ml: 1, color: "#f44336" }}
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
                      <Typography variant="h6" sx={{ color: colors.primary }}>
                        ETB {calculateTotal().toLocaleString()}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}

              {/* Warranty Period - This is the key field */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Warranty Period (months)"
                  type="number"
                  value={warrantyPeriod}
                  onChange={(e) => setWarrantyPeriod(e.target.value)}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">months</InputAdornment>
                    ),
                  }}
                  helperText="Enter warranty duration in months (e.g., 6, 12, 24)"
                  required
                />
              </Grid>

              {/* Payment Method */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={formData.payment_method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value,
                      })
                    }
                    label="Payment Method"
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="mpesa">M-Pesa</MenuItem>
                    <MenuItem value="telebirr">Telebirr</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={cart.length === 0}
              sx={{
                bgcolor: colors.primary,
                "&:hover": { bgcolor: colors.secondary },
              }}
            >
              Complete Sale
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Receipt Dialog with Dynamic Warranty */}
      <Dialog
        open={openReceiptDialog}
        onClose={() => setOpenReceiptDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: colors.primary,
            color: "white",
            textAlign: "center",
          }}
        >
          <VerifiedIcon sx={{ fontSize: 30, mb: 1 }} />
          <Typography variant="h6" fontWeight="600">
            SALE RECEIPT
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedSale && (
            <Box>
              {/* Store Info */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ color: colors.primary, fontWeight: 700 }}
                >
                  Chala Mobile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Abosto, Shashemene • +251 98 231 0974
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Receipt Info */}
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">
                    Receipt No:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2" fontWeight="500">
                    #{selectedSale.id?.toString().padStart(6, "0")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">
                    Date:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {new Date(selectedSale.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </Typography>
                </Grid>
              </Grid>

              {/* Customer Info */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 1 }}>
                <Typography
                  variant="subtitle2"
                  color={colors.primary}
                  gutterBottom
                >
                  CUSTOMER
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {selectedSale.customer_name || "Walk-in Customer"}
                </Typography>
                {selectedSale.customer_phone && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedSale.customer_phone}
                  </Typography>
                )}
              </Paper>

              {/* Product Info */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 1 }}>
                <Typography
                  variant="subtitle2"
                  color={colors.primary}
                  gutterBottom
                >
                  PRODUCT
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {selectedSale.product_name}
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Quantity:
                    </Typography>
                    <Typography variant="body2">
                      {selectedSale.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Unit Price:
                    </Typography>
                    <Typography variant="body2">
                      ETB {selectedSale.unit_price?.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Warranty Info - DYNAMIC based on what was selected */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                  borderColor: colors.primary,
                  bgcolor: alpha(colors.primary, 0.02),
                }}
              >
                <Typography
                  variant="subtitle2"
                  color={colors.primary}
                  gutterBottom
                >
                  WARRANTY
                </Typography>

                {/* Get warranty months from the sale data */}
                {(() => {
                  // Parse warranty months - ensure it's a number
                  const warrantyMonths = selectedSale.warranty_months
                    ? parseInt(selectedSale.warranty_months)
                    : 12;

                  // Calculate valid until date
                  const validUntil = new Date(selectedSale.created_at);
                  validUntil.setMonth(validUntil.getMonth() + warrantyMonths);

                  return (
                    <>
                      {/* Show the warranty period badge */}
                      <Box sx={{ mb: 1 }}>
                        <Chip
                          label={`${warrantyMonths} MONTHS WARRANTY`}
                          size="small"
                          sx={{
                            bgcolor: alpha(colors.primary, 0.1),
                            color: colors.primary,
                            fontWeight: 600,
                          }}
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Valid From:
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {new Date(
                              selectedSale.created_at,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Valid Until:
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="700"
                            color={colors.primary}
                          >
                            {validUntil.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Show warranty duration in years/months */}
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {warrantyMonths >= 12
                            ? `Covered for ${warrantyMonths / 12} ${warrantyMonths / 12 === 1 ? "year" : "years"} from purchase date`
                            : `Covered for ${warrantyMonths} ${warrantyMonths === 1 ? "month" : "months"} from purchase date`}
                        </Typography>
                      </Box>
                    </>
                  );
                })()}
              </Paper>

              {/* Total */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Typography variant="h6">TOTAL:</Typography>
                <Typography
                  variant="h5"
                  sx={{ color: colors.primary, fontWeight: 700 }}
                >
                  ETB {selectedSale.total_amount?.toLocaleString()}
                </Typography>
              </Box>

              {/* Payment Method */}
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Chip
                  label={`Paid via ${selectedSale.payment_method}`}
                  size="small"
                  sx={{
                    bgcolor: alpha(
                      paymentMethods[selectedSale.payment_method]?.color ||
                        colors.gray,
                      0.1,
                    ),
                    color:
                      paymentMethods[selectedSale.payment_method]?.color ||
                      colors.gray,
                  }}
                />
              </Box>

              {/* Thank You Note */}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography variant="body2" sx={{ color: colors.primary }}>
                  Thank you for your purchase!
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  This receipt serves as warranty proof
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={() => setOpenReceiptDialog(false)}
            variant="outlined"
          >
            Close
          </Button>
          <Button
            startIcon={<PrintIcon />}
            variant="contained"
            sx={{
              bgcolor: colors.primary,
              "&:hover": { bgcolor: colors.secondary },
            }}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 1 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sales;
