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
  Clear as ClearIcon,
  Phone as PhoneIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { getSales, createSale, getTodaysSales } from "../services/api";
import { getProducts } from "../services/api";
import { getCustomers, searchCustomers } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
    if (existing)
      setCart(
        cart.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    else
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
  };

  const removeFromCart = (productId) =>
    setCart(cart.filter((i) => i.product_id !== productId));

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) removeFromCart(productId);
    else
      setCart(
        cart.map((i) =>
          i.product_id === productId ? { ...i, quantity: newQty } : i,
        ),
      );
  };

  const calculateTotal = () =>
    cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showSnackbar("Add items to cart", "error");
      return;
    }
    try {
      for (const item of cart) {
        await createSale({
          product_id: item.product_id,
          customer_id: formData.customer_id || null,
          quantity: item.quantity,
          payment_method: formData.payment_method,
        });
      }
      showSnackbar("Sale completed", "success");
      setOpenDialog(false);
      setCart([]);
      loadSales();
      loadProducts();
    } catch (error) {
      showSnackbar("Failed to process sale", "error");
    }
  };

  if (loading)
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

  return (
    <Box>
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
        >
          New Sale
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha("#4caf50", 0.1),
                    color: "#4caf50",
                    mr: 2,
                  }}
                >
                  <TodayIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Today's Sales
                  </Typography>
                  <Typography variant="h5" fontWeight="600">
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
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha("#2196f3", 0.1),
                    color: "#2196f3",
                    mr: 2,
                  }}
                >
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Sales
                  </Typography>
                  <Typography variant="h5" fontWeight="600">
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
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha("#ff9800", 0.1),
                    color: "#ff9800",
                    mr: 2,
                  }}
                >
                  <ReceiptIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Transactions
                  </Typography>
                  <Typography variant="h5" fontWeight="600">
                    {sales.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
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
                color={dateFilter === "today" ? "primary" : "default"}
              />
              <Chip
                label="All"
                onClick={() => setDateFilter("all")}
                color={dateFilter === "all" ? "primary" : "default"}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }} sx={{ textAlign: "right" }}>
            <IconButton onClick={loadSales}>
              <RefreshIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      <Stack spacing={2}>
        {paginatedSales.map((sale) => (
          <Card key={sale.id}>
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
                        mr: 2,
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
                      <Typography variant="caption">
                        {new Date(sale.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography variant="body2">
                      {sale.customer_name || "Walk-in"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Chip label={`x${sale.quantity}`} size="small" />
                  <Chip
                    label={sale.payment_method}
                    size="small"
                    sx={{
                      ml: 1,
                      bgcolor: alpha(
                        paymentMethods[sale.payment_method]?.color || "#757575",
                        0.1,
                      ),
                      color: paymentMethods[sale.payment_method]?.color,
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Typography variant="h6" color="primary.main">
                    ETB {sale.total_amount?.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 1 }}>
                  <IconButton
                    onClick={() => {
                      setSelectedSale(sale);
                      setOpenReceiptDialog(true);
                    }}
                  >
                    <ReceiptIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <TablePagination
          component="div"
          count={filteredSales.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(e.target.value);
            setPage(0);
          }}
        />
      </Box>

      {/* New Sale Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>New Sale</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Search Customer"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </Grid>
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
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary={c.name} secondary={c.phone} />
                    </ListItem>
                  ))}
                </Paper>
              )}
              {formData.customer_id && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="info">
                    Customer: {formData.customer_name}
                  </Alert>
                </Grid>
              )}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2">Products</Typography>
                <Paper sx={{ maxHeight: 200, overflow: "auto", p: 1 }}>
                  {products.map((p) => (
                    <ListItem key={p.id} button onClick={() => addToCart(p)}>
                      <ListItemIcon>
                        <InventoryIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={p.name}
                        secondary={`ETB ${p.price}`}
                      />
                      <Chip label="Add" size="small" color="primary" />
                    </ListItem>
                  ))}
                </Paper>
              </Grid>
              {cart.length > 0 && (
                <Grid size={{ xs: 12 }}>
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
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity - 1)
                            }
                          >
                            -
                          </IconButton>
                          <Typography component="span" sx={{ mx: 1 }}>
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
                      <Typography>Total:</Typography>
                      <Typography variant="h6">
                        ETB {calculateTotal().toLocaleString()}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Payment</InputLabel>
                  <Select
                    value={formData.payment_method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="mpesa">M-Pesa</MenuItem>
                    <MenuItem value="telebirr">Telebirr</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
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
        onClose={() => setOpenReceiptDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Receipt</DialogTitle>
        <DialogContent>
          {selectedSale && (
            <Box>
              <Typography variant="h6" align="center">
                Chala Mobile
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption">Date:</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography variant="body2">
                    {new Date(selectedSale.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption">Customer:</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography variant="body2">
                    {selectedSale.customer_name || "Walk-in"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption">Payment:</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Chip label={selectedSale.payment_method} size="small" />
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2">
                {selectedSale.product_name}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">
                  Qty: {selectedSale.quantity} x ETB {selectedSale.unit_price}
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  ETB {selectedSale.total_amount}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h5" color="primary.main">
                  ETB {selectedSale.total_amount}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReceiptDialog(false)}>Close</Button>
          <Button startIcon={<PrintIcon />} variant="contained">
            Print
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Sales;
