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
  useMediaQuery,
  useTheme,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
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
  Close as CloseIcon,
  FilterList as FilterIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Download as DownloadIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { getSales, createSale, getTodaysSales } from "../services/api";
import { getProducts } from "../services/api";
import { getCustomers, searchCustomers } from "../services/api";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [warrantyPeriod, setWarrantyPeriod] = useState("12");
  const [showFilters, setShowFilters] = useState(false);
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
    setRowsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

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
      } else {
        setSearchResults([]);
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
        const warrantyMonths = parseInt(warrantyPeriod) || 12;
        await createSale({
          product_id: item.product_id,
          customer_id: formData.customer_id || null,
          customer_name: formData.customer_name || "Walk-in Customer",
          customer_phone: formData.customer_phone || "",
          quantity: item.quantity,
          payment_method: formData.payment_method,
          warranty_months: warrantyMonths,
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateFilter("today");
  };

  const calculateWarrantyUntil = (sale) => {
    if (!sale) return "";
    const date = new Date(sale.created_at);
    date.setMonth(date.getMonth() + (sale.warranty_months || 12));
    return date.toLocaleDateString();
  };

  const handleDownloadPDF = (sale) => {
    try {
      const doc = new jsPDF();
      const primaryColor = [255, 133, 0];
      const textColor = [50, 50, 50];

      // Header
      doc.setFontSize(22);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("CHALA MOBILE", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text("Solutions Hub", 105, 30, { align: "center" });
      doc.text("Abosto, Shashemene, Ethiopia", 105, 38, { align: "center" });
      doc.text("+251 98 231 0974", 105, 46, { align: "center" });

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 52, 190, 52);

      doc.setFontSize(16);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("OFFICIAL RECEIPT", 105, 65, { align: "center" });

      let yPos = 80;
      const lineHeight = 7;

      doc.setFontSize(10);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      doc.setFont("helvetica", "bold");
      doc.text("Receipt No:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`#${sale.id?.toString().padStart(6, "0")}`, 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Date:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(new Date(sale.created_at).toLocaleString(), 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Payment:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(sale.payment_method || "Chapa", 80, yPos);

      yPos += lineHeight * 2;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("CUSTOMER INFORMATION", 20, yPos);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Name:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(sale.customer_name || "Walk-in Customer", 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Email:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(sale.customer_email || "Not provided", 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Phone:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(sale.customer_phone || "Not provided", 80, yPos);

      yPos += lineHeight * 2;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("PRODUCT DETAILS", 20, yPos);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Product:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(sale.product_name, 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Quantity:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(sale.quantity.toString(), 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Unit Price:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`ETB ${sale.unit_price?.toLocaleString()}`, 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Total:", 20, yPos);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`ETB ${sale.total_amount?.toLocaleString()}`, 80, yPos);

      yPos += lineHeight * 2;

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("WARRANTY INFORMATION", 20, yPos);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Period:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${sale.warranty_months || 12} months`, 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Valid Until:", 20, yPos);
      doc.setFont("helvetica", "normal");
      const validUntil = new Date(sale.created_at);
      validUntil.setMonth(validUntil.getMonth() + (sale.warranty_months || 12));
      doc.text(validUntil.toLocaleDateString(), 80, yPos);

      yPos = 260;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, 190, yPos);

      yPos += 10;
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text("Thank you for choosing Chala Mobile!", 105, yPos, {
        align: "center",
      });
      yPos += 5;
      doc.text("This receipt serves as your warranty proof.", 105, yPos, {
        align: "center",
      });

      doc.save(`receipt-${sale.id}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      showSnackbar("Failed to generate PDF", "error");
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
    <Box
      sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: "100%", overflow: "hidden" }}
    >
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
          New Sale
        </Button>
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
                  <TodayIcon fontSize={isMobile ? "small" : "medium"} />
                </Avatar>
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="caption"
                    display="block"
                  >
                    Today
                  </Typography>
                  <Typography
                    variant={isMobile ? "subtitle2" : "h6"}
                    fontWeight="600"
                  >
                    {
                      sales.filter(
                        (s) =>
                          new Date(s.created_at).toDateString() ===
                          new Date().toDateString(),
                      ).length
                    }
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
                    bgcolor: alpha("#2196f3", 0.1),
                    color: "#2196f3",
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    mb: 1,
                  }}
                >
                  <MoneyIcon fontSize={isMobile ? "small" : "medium"} />
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
                    variant={isMobile ? "subtitle2" : "h6"}
                    fontWeight="600"
                  >
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
                  <ReceiptIcon fontSize={isMobile ? "small" : "medium"} />
                </Avatar>
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="caption"
                    display="block"
                  >
                    Transactions
                  </Typography>
                  <Typography
                    variant={isMobile ? "subtitle2" : "h6"}
                    fontWeight="600"
                  >
                    {sales.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search & Filters */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            mb: showFilters ? 2 : 0,
          }}
        >
          <TextField
            fullWidth
            placeholder={
              isMobile ? "Search sales..." : "Search by customer or product..."
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
            sx={{ bgcolor: colors.light, borderRadius: 1 }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={loadSales} sx={{ bgcolor: colors.light }}>
              <RefreshIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter">
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                bgcolor: dateFilter !== "today" ? colors.primary : colors.light,
                color: dateFilter !== "today" ? colors.white : colors.gray,
              }}
            >
              <FilterIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        </Box>

        {showFilters && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label="Today"
              onClick={() => setDateFilter("today")}
              size="small"
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
              size="small"
              sx={{
                bgcolor: dateFilter === "all" ? colors.primary : "transparent",
                color: dateFilter === "all" ? "white" : colors.gray,
                border:
                  dateFilter === "all"
                    ? "none"
                    : `1px solid ${colors.lightGray}`,
              }}
            />
            {(searchTerm || dateFilter !== "today") && (
              <Chip
                label="Clear"
                onClick={handleClearFilters}
                size="small"
                icon={<ClearIcon />}
                sx={{ bgcolor: colors.light, color: colors.gray }}
              />
            )}
          </Box>
        )}
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
            fullWidth={isMobile}
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
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(
                          paymentMethods[sale.payment_method]?.color ||
                            colors.gray,
                          0.1,
                        ),
                        color:
                          paymentMethods[sale.payment_method]?.color ||
                          colors.gray,
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                      }}
                    >
                      {paymentMethods[sale.payment_method]?.icon || (
                        <ReceiptIcon />
                      )}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}
                      >
                        {sale.product_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(sale.created_at).toLocaleDateString()} •{" "}
                        {new Date(sale.created_at).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={sale.payment_method}
                    size="small"
                    sx={{
                      bgcolor: alpha(
                        paymentMethods[sale.payment_method]?.color ||
                          colors.gray,
                        0.1,
                      ),
                      color:
                        paymentMethods[sale.payment_method]?.color ||
                        colors.gray,
                      height: 24,
                    }}
                  />
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, color: colors.gray }} />
                      <Typography variant="body2" noWrap>
                        {sale.customer_name || "Walk-in"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Qty: {sale.quantity}
                      </Typography>
                      {sale.warranty_months && (
                        <Chip
                          label={`${sale.warranty_months}m`}
                          size="small"
                          sx={{
                            bgcolor: alpha(colors.primary, 0.1),
                            color: colors.primary,
                            height: 20,
                          }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: colors.primary, fontWeight: 600 }}
                  >
                    ETB {sale.total_amount?.toLocaleString()}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ReceiptIcon />}
                    onClick={() => {
                      setSelectedSale(sale);
                      setOpenReceiptDialog(true);
                    }}
                    sx={{ borderColor: colors.primary, color: colors.primary }}
                  >
                    Receipt
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {paginatedSales.length > 0 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
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
            rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25]}
            labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
          />
        </Box>
      )}

      {/* New Sale Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            background: colors.gradient,
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          New Sale
          {isMobile && (
            <IconButton
              onClick={() => setOpenDialog(false)}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3, pb: isMobile ? 2 : 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search Customer (Optional)"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  size={isMobile ? "small" : "medium"}
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
                <Grid item xs={12}>
                  <Alert severity="success" sx={{ borderRadius: 1 }}>
                    Customer: {formData.customer_name} (
                    {formData.customer_phone})
                  </Alert>
                </Grid>
              )}

              <Grid item xs={12}>
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

              {cart.length > 0 && (
                <Grid item xs={12}>
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
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ maxWidth: "40%" }}
                        >
                          {item.name}
                        </Typography>
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
                            sx={{ ml: 0.5, color: "#f44336" }}
                          >
                            <ClearIcon fontSize="small" />
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Warranty (months)"
                  type="number"
                  value={warrantyPeriod}
                  onChange={(e) => setWarrantyPeriod(e.target.value)}
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">months</InputAdornment>
                    ),
                  }}
                  helperText="e.g., 6, 12, 24"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
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
          <DialogActions
            sx={{ p: 2, flexDirection: isMobile ? "column" : "row", gap: 1 }}
          >
            {!isMobile && (
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              disabled={cart.length === 0}
              sx={{
                background: colors.gradient,
                "&:hover": { background: colors.secondary },
                py: isMobile ? 1.5 : 1,
              }}
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
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
      >
        <DialogTitle
          sx={{
            background: colors.gradient,
            color: "white",
            textAlign: "center",
            py: 3,
          }}
        >
          <VerifiedIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography
            component="div"
            sx={{ fontSize: "1.5rem", fontWeight: 700 }}
          >
            OFFICIAL RECEIPT
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
          {selectedSale && (
            <Box>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{ color: colors.primary, fontWeight: 700 }}
                >
                  CHALA MOBILE
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Solutions Hub
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Abosto, Shashemene, Ethiopia
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <Chip
                    icon={<PhoneIcon />}
                    label="+251 98 231 0974"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<EmailIcon />}
                    label="info@chalamobile.com"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ textAlign: "center", mb: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: colors.success }} />
                <Typography variant="h5" fontWeight="600" gutterBottom>
                  Payment Successful! 🎉
                </Typography>
                <Typography color="text.secondary">
                  Transaction completed successfully
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ color: colors.dark }}>
                Official Receipt
              </Typography>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 4 }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                        width="40%"
                      >
                        Receipt Number
                      </TableCell>
                      <TableCell>
                        #{selectedSale.id?.toString().padStart(6, "0")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                      >
                        Date & Time
                      </TableCell>
                      <TableCell>
                        {new Date(selectedSale.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                      >
                        Payment Method
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={selectedSale.payment_method}
                          size="small"
                          sx={{
                            bgcolor: colors.primary,
                            color: "white",
                            textTransform: "capitalize",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" gutterBottom sx={{ color: colors.dark }}>
                Customer Information
              </Typography>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 4 }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                        width="40%"
                      >
                        Full Name
                      </TableCell>
                      <TableCell>
                        {selectedSale.customer_name || "Walk-in Customer"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                      >
                        Email Address
                      </TableCell>
                      <TableCell>
                        {selectedSale.customer_email || "Not provided"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                      >
                        Phone Number
                      </TableCell>
                      <TableCell>
                        {selectedSale.customer_phone || "Not provided"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" gutterBottom sx={{ color: colors.dark }}>
                Product Details
              </Typography>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 4 }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                        width="40%"
                      >
                        Product Name
                      </TableCell>
                      <TableCell>{selectedSale.product_name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell>{selectedSale.quantity}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                      >
                        Unit Price
                      </TableCell>
                      <TableCell>
                        ETB {selectedSale.unit_price?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                      >
                        Total Amount
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" sx={{ color: colors.primary }}>
                          ETB {selectedSale.total_amount?.toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" gutterBottom sx={{ color: colors.dark }}>
                Warranty Information
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 4,
                  borderColor: colors.primary,
                  bgcolor: colors.lightGray,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Warranty Period
                    </Typography>
                    <Typography variant="h6" sx={{ color: colors.primary }}>
                      {selectedSale.warranty_months || 12} Months
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Purchase Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedSale.created_at).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Valid Until
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: colors.primary, fontWeight: 600 }}
                    >
                      {calculateWarrantyUntil(selectedSale)}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 2 }}
                >
                  ⓘ This receipt serves as your official warranty proof. Please
                  keep it for future reference.
                </Typography>
              </Paper>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Thank you for choosing Chala Mobile!
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  For any inquiries, please contact us at +251 98 231 0974
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            borderTop: `1px solid ${colors.lightGray}`,
          }}
        >
          <Button
            onClick={() => setOpenReceiptDialog(false)}
            variant="outlined"
            fullWidth={isMobile}
            sx={{ minWidth: 120 }}
          >
            Close
          </Button>
          <Button
            startIcon={<PrintIcon />}
            variant="contained"
            fullWidth={isMobile}
            sx={{
              bgcolor: colors.primary,
              "&:hover": { bgcolor: colors.secondary },
              minWidth: 120,
            }}
            onClick={() => window.print()}
          >
            Print Receipt
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            fullWidth={isMobile}
            sx={{ borderColor: colors.gray, color: colors.gray, minWidth: 120 }}
            onClick={() => handleDownloadPDF(selectedSale)}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: isMobile ? "center" : "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: 1, width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sales;
