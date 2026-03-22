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
  alpha,
  useMediaQuery,
  useTheme,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Fade,
  Grow,
  Zoom,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
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
  Email as EmailIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  getSales,
  createSale,
  getTodaysSales,
  deleteSale,
  updateSale,
} from "../services/api";
import { getProducts } from "../services/api";
import { getCustomers, searchCustomers, updateCustomer } from "../services/api";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";

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
  error: "#EF4444",
};

const paymentMethods = {
  cash: {
    label: "Cash",
    color: colors.success,
    icon: <MoneyIcon />,
    bg: alpha(colors.success, 0.1),
  },
  mpesa: {
    label: "M-Pesa",
    color: colors.info,
    icon: <PhoneIcon />,
    bg: alpha(colors.info, 0.1),
  },
  telebirr: {
    label: "Telebirr",
    color: colors.purple,
    icon: <PhoneIcon />,
    bg: alpha(colors.purple, 0.1),
  },
};

const Sales = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [updatingCustomer, setUpdatingCustomer] = useState(false);
  const [products, setProducts] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [warrantyPeriod, setWarrantyPeriod] = useState("12");
  const [showFilters, setShowFilters] = useState(false);
  const [editFormData, setEditFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_id: null,
  });
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
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (customerSearch) {
        try {
          const res = await searchCustomers(customerSearch);
          setSearchResults(res.data.data);
        } catch (error) {
          console.error("Search error:", error);
        }
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

  const handleEditCustomer = (sale, e) => {
    e.stopPropagation();
    setSelectedSale(sale);
    setEditFormData({
      customer_name: sale.customer_name || "",
      customer_phone: sale.customer_phone || "",
      customer_id: sale.customer_id || null,
    });
    setOpenEditDialog(true);
  };

  const handleUpdateCustomer = async () => {
    if (!selectedSale) return;

    setUpdatingCustomer(true);
    try {
      // First update the customer record if there's a customer_id
      if (editFormData.customer_id) {
        await updateCustomer(editFormData.customer_id, {
          name: editFormData.customer_name,
          phone: editFormData.customer_phone,
        });
      } else {
        // If no customer_id, create a new customer
        const newCustomer = await createCustomer({
          name: editFormData.customer_name,
          phone: editFormData.customer_phone,
        });
        editFormData.customer_id = newCustomer.data.data.id;
      }

      // Update the sale with the customer_id
      await updateSale(selectedSale.id, {
        customer_id: editFormData.customer_id,
      });

      showSnackbar("Customer information updated successfully!", "success");

      // Refresh the sales list to show updated information
      await loadSales();
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Update error:", error);
      showSnackbar(
        error.response?.data?.message ||
          "Failed to update customer information",
        "error",
      );
    } finally {
      setUpdatingCustomer(false);
    }
  };

  const handleDeleteClick = (sale, e) => {
    e.stopPropagation();
    setDeleteError(null);
    setSaleToDelete(sale);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!saleToDelete) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteSale(saleToDelete.id);
      showSnackbar("Sale deleted successfully", "success");
      await loadSales();
      setOpenDeleteDialog(false);
      setSaleToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      let errorMessage = "Failed to delete sale";

      if (error.response?.status === 404) {
        errorMessage = "Sale not found";
      } else if (
        error.response?.status === 400 ||
        error.response?.status === 500
      ) {
        errorMessage =
          error.response?.data?.message || "Cannot delete this sale.";
      }

      setDeleteError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSaleToDelete(null);
    setDeleteError(null);
  };

  const handleDownloadPDF = (sale) => {
    try {
      const doc = new jsPDF();
      const primaryColor = [255, 133, 0];
      const textColor = [50, 50, 50];

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
      doc.text(sale.payment_method || "Cash", 80, yPos);

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

  const todaySales = sales.filter(
    (s) => new Date(s.created_at).toDateString() === new Date().toDateString(),
  ).length;
  const totalRevenue = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const totalTransactions = sales.length;

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
      {/* Header */}
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
              Sales <span style={{ opacity: 0.9 }}>Dashboard</span>
            </Typography>
            <Typography
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              }}
            >
              Track and manage all your sales transactions
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: "right" } }}>
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
              New Sale
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ px: { xs: 1.5, sm: 2, md: 4 } }}>
        {/* Stats Cards */}
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
                <CardContent
                  sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}
                >
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
                    <TodayIcon
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
                    {todaySales}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="600"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    Today's Sales
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
                  background: `linear-gradient(135deg, ${colors.white} 0%, ${alpha(colors.success, 0.05)} 100%)`,
                  border: `1px solid ${alpha(colors.success, 0.2)}`,
                }}
              >
                <CardContent
                  sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}
                >
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
                    <MoneyIcon
                      sx={{
                        fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
                      }}
                    />
                  </Avatar>
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                    }}
                  >
                    ETB {totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="600"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    Total Revenue
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
                  background: `linear-gradient(135deg, ${colors.white} 0%, ${alpha(colors.purple, 0.05)} 100%)`,
                  border: `1px solid ${alpha(colors.purple, 0.2)}`,
                }}
              >
                <CardContent
                  sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}
                >
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
                    <ReceiptIcon
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
                    {totalTransactions}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="600"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    Transactions
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Search & Filters */}
        <Paper
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: { xs: 3, sm: 4 },
            borderRadius: "20px",
            bgcolor: colors.white,
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              fullWidth
              placeholder={
                isMobile
                  ? "Search sales..."
                  : "Search by customer or product..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: colors.light,
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
                onClick={loadSales}
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
            <Tooltip title="Filter">
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  bgcolor:
                    dateFilter !== "today" ? colors.primary : colors.light,
                  color: dateFilter !== "today" ? colors.white : colors.gray,
                  borderRadius: "12px",
                  "&:hover": { bgcolor: colors.primary, color: "white" },
                }}
              >
                <FilterIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.3rem" } }} />
              </IconButton>
            </Tooltip>
          </Box>

          {showFilters && (
            <Fade in>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                <Chip
                  label="Today"
                  onClick={() => setDateFilter("today")}
                  size="small"
                  sx={{
                    bgcolor:
                      dateFilter === "today" ? colors.primary : "transparent",
                    color: dateFilter === "today" ? "white" : colors.gray,
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="All Time"
                  onClick={() => setDateFilter("all")}
                  size="small"
                  sx={{
                    bgcolor:
                      dateFilter === "all" ? colors.primary : "transparent",
                    color: dateFilter === "all" ? "white" : colors.gray,
                    fontWeight: 600,
                  }}
                />
                {(searchTerm || dateFilter !== "today") && (
                  <Chip
                    label="Clear Filters"
                    onClick={handleClearFilters}
                    size="small"
                    icon={<ClearIcon />}
                    sx={{
                      bgcolor: colors.light,
                      color: colors.gray,
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Fade>
          )}
        </Paper>

        {/* Sales List - Mobile First Cards */}
        {paginatedSales.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "20px" }}>
            <ReceiptIcon
              sx={{ fontSize: 64, color: colors.gray, mb: 2, opacity: 0.5 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sales found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start by creating your first sale transaction
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                bgcolor: colors.primary,
                "&:hover": { bgcolor: colors.secondary },
              }}
            >
              Create First Sale
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {paginatedSales.map((sale, idx) => (
              <Grow in timeout={idx * 100} key={sale.id}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      borderRadius: "20px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
                      },
                    }}
                    onClick={() => {
                      setSelectedSale(sale);
                      setOpenReceiptDialog(true);
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor:
                              paymentMethods[sale.payment_method]?.bg ||
                              alpha(colors.gray, 0.1),
                            color:
                              paymentMethods[sale.payment_method]?.color ||
                              colors.gray,
                            width: 48,
                            height: 48,
                          }}
                        >
                          {paymentMethods[sale.payment_method]?.icon || (
                            <ReceiptIcon />
                          )}
                        </Avatar>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            label={
                              sale.payment_method?.charAt(0).toUpperCase() +
                                sale.payment_method?.slice(1) || "Cash"
                            }
                            size="small"
                            sx={{
                              bgcolor: paymentMethods[sale.payment_method]?.bg,
                              color: paymentMethods[sale.payment_method]?.color,
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          />
                          {user?.role === "admin" && (
                            <Tooltip title="Delete Sale">
                              <IconButton
                                size="small"
                                onClick={(e) => handleDeleteClick(sale, e)}
                                sx={{ color: colors.error }}
                              >
                                <DeleteIcon sx={{ fontSize: "1rem" }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        fontWeight="800"
                        sx={{ mb: 0.5, fontSize: { xs: "1rem", sm: "1.1rem" } }}
                      >
                        {sale.product_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                      >
                        {new Date(sale.created_at).toLocaleString()}
                      </Typography>

                      <Divider sx={{ my: 1.5 }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PersonIcon
                            sx={{ fontSize: 14, color: colors.gray }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                          >
                            {sale.customer_name || "Walk-in"}
                          </Typography>
                          <Tooltip title="Edit Customer Info">
                            <IconButton
                              size="small"
                              onClick={(e) => handleEditCustomer(sale, e)}
                              sx={{ color: colors.info }}
                            >
                              <EditIcon sx={{ fontSize: "0.8rem" }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                        >
                          Qty: {sale.quantity}
                        </Typography>
                      </Box>

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
                          sx={{
                            color: colors.primary,
                            fontWeight: 800,
                            fontSize: { xs: "1rem", sm: "1.1rem" },
                          }}
                        >
                          ETB {sale.total_amount?.toLocaleString()}
                        </Typography>
                        {sale.warranty_months && (
                          <Chip
                            label={`${sale.warranty_months}m warranty`}
                            size="small"
                            sx={{
                              bgcolor: alpha(colors.primary, 0.1),
                              color: colors.primary,
                              height: 24,
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>
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
              rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25]}
              labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
            />
          </Box>
        )}
      </Box>

      {/* New Sale Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ background: colors.gradient, color: "white" }}>
          <Typography variant="h6" component="div" fontWeight="800">
            New Sale Transaction
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3, maxHeight: "70vh", overflowY: "auto" }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Name (Optional)"
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                  placeholder="Enter customer name"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Phone (Optional)"
                  value={formData.customer_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_phone: e.target.value })
                  }
                  placeholder="Enter customer phone"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="600">
                  Select Products
                </Typography>
                <Paper
                  sx={{
                    maxHeight: 250,
                    overflow: "auto",
                    p: 1,
                    borderRadius: "12px",
                  }}
                >
                  {products.map((p) => (
                    <ListItem
                      key={p.id}
                      onClick={() => addToCart(p)}
                      sx={{
                        cursor: "pointer",
                        borderRadius: "8px",
                        mb: 0.5,
                        "&:hover": { bgcolor: alpha(colors.primary, 0.05) },
                      }}
                    >
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
                  ))}
                </Paper>
              </Grid>

              {cart.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="600">
                    Cart ({cart.length} items)
                  </Typography>
                  <Paper sx={{ p: 2, borderRadius: "12px" }}>
                    {cart.map((item) => (
                      <Box
                        key={item.product_id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            flex: 2,
                            fontSize: { xs: "0.8rem", sm: "0.85rem" },
                          }}
                        >
                          {item.name}
                        </Typography>
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
                          <Typography
                            sx={{ minWidth: 30, textAlign: "center" }}
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
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                    <Divider sx={{ my: 1 }} />
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">months</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
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
                    <MenuItem value="cash">💵 Cash</MenuItem>
                    <MenuItem value="mpesa">📱 M-Pesa</MenuItem>
                    <MenuItem value="telebirr">📱 Telebirr</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{ p: 3, gap: 1, flexDirection: isMobile ? "column" : "row" }}
          >
            <Button
              onClick={() => setOpenDialog(false)}
              fullWidth={isMobile}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              disabled={cart.length === 0}
              sx={{ background: colors.gradient }}
            >
              Complete Sale
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ background: colors.gradient, color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EditIcon />
            <Typography variant="h6" component="div">
              Edit Customer Information
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Product:</strong> {selectedSale?.product_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Sale Date:</strong>{" "}
            {selectedSale && new Date(selectedSale.created_at).toLocaleString()}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                value={editFormData.customer_name}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    customer_name: e.target.value,
                  })
                }
                placeholder="Enter customer name"
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
                label="Customer Phone"
                value={editFormData.customer_phone}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    customer_phone: e.target.value,
                  })
                }
                placeholder="Enter customer phone"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: colors.primary }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Alert severity="info" sx={{ mt: 3, borderRadius: "12px" }}>
            <Typography variant="caption" display="block">
              💡 This will update the customer record and link it to this sale.
              <br />
              The receipt will show the updated information.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenEditDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateCustomer}
            variant="contained"
            disabled={updatingCustomer}
            startIcon={
              updatingCustomer ? <CircularProgress size={20} /> : <SaveIcon />
            }
            sx={{ background: colors.gradient }}
          >
            {updatingCustomer ? "Updating..." : "Update Customer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <WarningIcon sx={{ fontSize: 48, color: colors.error, mb: 1 }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              Delete Sale
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to delete this sale?
            <br />
            <strong>Product: {saleToDelete?.product_name}</strong>
            <br />
            <strong>
              Amount: ETB {saleToDelete?.total_amount?.toLocaleString()}
            </strong>
            <br />
            This action cannot be undone.
          </Typography>

          {deleteError && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: "12px" }}>
              <Typography variant="body2">{deleteError}</Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{ borderRadius: "10px", px: 3 }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: "10px", px: 3 }}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : null}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog
        open={openReceiptDialog}
        onClose={() => setOpenReceiptDialog(false)}
        maxWidth="md"
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
            textAlign: "center",
            py: { xs: 3, sm: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <VerifiedIcon sx={{ fontSize: { xs: 40, sm: 48 }, mb: 1 }} />
            <Typography variant="h5" component="div" fontWeight="800">
              OFFICIAL RECEIPT
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
          {selectedSale && (
            <Box>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ color: colors.primary, fontWeight: 800 }}
                >
                  CHALA MOBILE
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  color="text.secondary"
                >
                  Solutions Hub
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Abosto, Shashemene, Ethiopia
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    mt: 1,
                    flexWrap: "wrap",
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
                <CheckCircleIcon
                  sx={{ fontSize: { xs: 48, sm: 60 }, color: colors.success }}
                />
                <Typography
                  variant="h5"
                  component="div"
                  fontWeight="600"
                  sx={{ mt: 1 }}
                >
                  Payment Successful! 🎉
                </Typography>
                <Typography component="div" color="text.secondary">
                  Transaction completed successfully
                </Typography>
              </Box>

              <Typography
                variant="h6"
                component="div"
                fontWeight="800"
                sx={{ mb: 2, color: colors.dark }}
              >
                Transaction Details
              </Typography>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 3, borderRadius: "12px" }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          bgcolor: colors.light,
                          width: "40%",
                        }}
                      >
                        Receipt Number
                      </TableCell>
                      <TableCell>
                        #{selectedSale.id?.toString().padStart(6, "0")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.light }}
                      >
                        Date & Time
                      </TableCell>
                      <TableCell>
                        {new Date(selectedSale.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.light }}
                      >
                        Payment Method
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={selectedSale.payment_method}
                          size="small"
                          sx={{
                            bgcolor:
                              paymentMethods[selectedSale.payment_method]?.bg,
                            color:
                              paymentMethods[selectedSale.payment_method]
                                ?.color,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography
                variant="h6"
                component="div"
                fontWeight="800"
                sx={{ mb: 2, color: colors.dark }}
              >
                Customer Information
              </Typography>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 3, borderRadius: "12px" }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          bgcolor: colors.light,
                          width: "40%",
                        }}
                      >
                        Full Name
                      </TableCell>
                      <TableCell>
                        {selectedSale.customer_name || "Walk-in Customer"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.light }}
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

              <Typography
                variant="h6"
                component="div"
                fontWeight="800"
                sx={{ mb: 2, color: colors.dark }}
              >
                Product Details
              </Typography>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 3, borderRadius: "12px" }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          bgcolor: colors.light,
                          width: "40%",
                        }}
                      >
                        Product Name
                      </TableCell>
                      <TableCell>{selectedSale.product_name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.light }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell>{selectedSale.quantity}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.light }}
                      >
                        Unit Price
                      </TableCell>
                      <TableCell>
                        ETB {selectedSale.unit_price?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: colors.light }}
                      >
                        Total Amount
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{ color: colors.primary }}
                        >
                          ETB {selectedSale.total_amount?.toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography
                variant="h6"
                component="div"
                fontWeight="800"
                sx={{ mb: 2, color: colors.dark }}
              >
                Warranty Information
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 4,
                  borderColor: colors.primary,
                  bgcolor: alpha(colors.primary, 0.05),
                  borderRadius: "12px",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="caption"
                      component="div"
                      color="text.secondary"
                    >
                      Warranty Period
                    </Typography>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ color: colors.primary }}
                    >
                      {selectedSale.warranty_months || 12} Months
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="caption"
                      component="div"
                      color="text.secondary"
                    >
                      Purchase Date
                    </Typography>
                    <Typography component="div">
                      {new Date(selectedSale.created_at).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="caption"
                      component="div"
                      color="text.secondary"
                    >
                      Valid Until
                    </Typography>
                    <Typography
                      component="div"
                      sx={{ color: colors.primary, fontWeight: 600 }}
                    >
                      {calculateWarrantyUntil(selectedSale)}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  sx={{ display: "block", mt: 2 }}
                >
                  ⓘ This receipt serves as your official warranty proof. Please
                  keep it for future reference.
                </Typography>
              </Paper>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography
                  variant="body2"
                  component="div"
                  color="text.secondary"
                >
                  Thank you for choosing Chala Mobile!
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  For any inquiries, please contact us at +251 98 231 0974
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },
            justifyContent: "center",
            gap: 2,
            borderTop: `1px solid ${colors.lightGray}`,
          }}
        >
          <Button
            onClick={() => setOpenReceiptDialog(false)}
            variant="outlined"
          >
            Close
          </Button>
          <Button
            startIcon={<PrintIcon />}
            variant="contained"
            onClick={() => window.print()}
            sx={{ bgcolor: colors.primary }}
          >
            Print Receipt
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            onClick={() => handleDownloadPDF(selectedSale)}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sales;
