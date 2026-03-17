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
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  alpha,
  Tooltip,
  useMediaQuery,
  useTheme,
  Tab,
  Tabs,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  PhoneIphone as PhoneIcon,
  Laptop as LaptopIcon,
  Tablet as TabletIcon,
  Headset as AccessoryIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

// Color palette matching homepage
const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  dark: "#1E1A3A",
  light: "#F8F9FF",
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  success: "#10B981",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
};

// Category configuration
const categoryIcons = {
  phone: <PhoneIcon />,
  laptop: <LaptopIcon />,
  tablet: <TabletIcon />,
  accessory: <AccessoryIcon />,
};

const categoryColors = {
  phone: "#2196f3",
  laptop: "#4caf50",
  tablet: "#ff9800",
  accessory: "#9c27b0",
};

// Default image for products without image
const DEFAULT_PRODUCT_IMAGE =
  "https://via.placeholder.com/300x200/FF8500/FFFFFF?text=Product";

const Products = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadTab, setUploadTab] = useState(0); // 0 = URL, 1 = File upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    category: "phone",
    type: "new",
    brand: "",
    model: "",
    price: "",
    stock_quantity: "",
    description: "",
    image_url: "",
  });

  // Update rows per page when screen size changes
  useEffect(() => {
    setRowsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data.data);
    } catch (error) {
      showSnackbar("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        category: product.category || "phone",
        type: product.type || "new",
        brand: product.brand || "",
        model: product.model || "",
        price: product.price || "",
        stock_quantity: product.stock_quantity || "",
        description: product.description || "",
        image_url: product.image_url || "",
      });
      setImagePreview(product.image_url || null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "phone",
        type: "new",
        brand: "",
        model: "",
        price: "",
        stock_quantity: "",
        description: "",
        image_url: "",
      });
      setImagePreview(null);
      setSelectedFile(null);
    }
    setUploadTab(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setImagePreview(null);
    setSelectedFile(null);
    setUploading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update image preview when URL changes
    if (name === "image_url") {
      setImagePreview(value);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await uploadProductImage(formData);
      return response.data.imageUrl;
    } catch (error) {
      showSnackbar("Failed to upload image", "error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.price || !formData.stock_quantity) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    try {
      let imageUrl = formData.image_url;

      // If file upload tab and file selected, upload the file
      if (uploadTab === 1 && selectedFile) {
        const uploadedUrl = await handleImageUpload();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const productData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        showSnackbar("Product updated successfully", "success");
      } else {
        await createProduct(productData);
        showSnackbar("Product created successfully", "success");
      }
      handleCloseDialog();
      loadProducts();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Operation failed",
        "error",
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(id);
      showSnackbar("Product deleted successfully", "success");
      loadProducts();
    } catch (error) {
      showSnackbar("Failed to delete product", "error");
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.brand?.toLowerCase().includes(searchLower) ||
      product.model?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const paginatedProducts = filteredProducts.slice(
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

  // Function to get product image
  const getProductImage = (product) => {
    return product.image_url || DEFAULT_PRODUCT_IMAGE;
  };

  // Low stock alerts
  const lowStockCount = products.filter(
    (p) => p.stock_quantity < 5 && p.stock_quantity > 0,
  ).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length;

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
          variant={isMobile ? "h5" : "h4"}
          fontWeight="500"
          sx={{ textAlign: { xs: "center", sm: "left" } }}
        >
          Products
        </Typography>
        {(user?.role === "admin" || user?.role === "sales") && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            fullWidth={isMobile}
            sx={{
              bgcolor: colors.primary,
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: { xs: 1.5, sm: 1 },
              "&:hover": { bgcolor: colors.secondary },
            }}
          >
            Add Product
          </Button>
        )}
      </Box>

      {/* Stats Cards - Grid layout with no horizontal scroll */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
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
                  <PhoneIcon fontSize={isMobile ? "small" : "medium"} />
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
                    variant={isMobile ? "subtitle1" : "h5"}
                    fontWeight="600"
                  >
                    {products.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ borderRadius: 2, bgcolor: alpha("#ff9800", 0.05) }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
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
                  <WarningIcon fontSize={isMobile ? "small" : "medium"} />
                </Avatar>
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="caption"
                    display="block"
                  >
                    Low Stock
                  </Typography>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h5"}
                    fontWeight="600"
                    color="#ff9800"
                  >
                    {lowStockCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ borderRadius: 2, bgcolor: alpha("#f44336", 0.05) }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
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
                    bgcolor: alpha("#f44336", 0.1),
                    color: "#f44336",
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    mb: 1,
                  }}
                >
                  <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                </Avatar>
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="caption"
                    display="block"
                  >
                    Out of Stock
                  </Typography>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h5"}
                    fontWeight="600"
                    color="#f44336"
                  >
                    {outOfStockCount}
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
              isMobile
                ? "Search products..."
                : "Search products by name, brand, or model..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    color="action"
                    fontSize={isMobile ? "small" : "medium"}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: "#f8f9fa", borderRadius: 1 }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={loadProducts} sx={{ bgcolor: "#f8f9fa" }}>
              <RefreshIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Products Table - Card view for mobile, Table for desktop */}
      {isMobile ? (
        <Box
          sx={{ mb: 2, maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}
        >
          {paginatedProducts.map((product) => (
            <Card key={product.id} sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Avatar
                    src={getProductImage(product)}
                    alt={product.name}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor:
                        categoryColors[product.category] || colors.primary,
                      borderRadius: 2,
                    }}
                    variant="rounded"
                  >
                    {categoryIcons[product.category]}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ overflow: "hidden" }}>
                        <Typography variant="subtitle1" fontWeight="600" noWrap>
                          {product.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          noWrap
                        >
                          {product.brand} {product.model}
                        </Typography>
                      </Box>
                      <Chip
                        label={product.category}
                        size="small"
                        sx={{
                          bgcolor: categoryColors[product.category],
                          color: "white",
                          height: 20,
                          fontSize: "0.65rem",
                          ml: 1,
                          flexShrink: 0,
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mt: 1,
                      }}
                    >
                      <Chip
                        label={product.type}
                        size="small"
                        color={product.type === "new" ? "success" : "warning"}
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.65rem" }}
                      />
                      <Chip
                        label={`Stock: ${product.stock_quantity}`}
                        size="small"
                        color={
                          product.stock_quantity === 0
                            ? "error"
                            : product.stock_quantity < 5
                              ? "warning"
                              : "success"
                        }
                        sx={{ height: 20, fontSize: "0.65rem" }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        color={colors.primary}
                      >
                        ETB {product.price?.toLocaleString()}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        {(user?.role === "admin" || user?.role === "sales") && (
                          <>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenDialog(product)}
                              sx={{ bgcolor: alpha(colors.primary, 0.1) }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            {user?.role === "admin" && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(product.id)}
                                sx={{ bgcolor: alpha("#f44336", 0.1) }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          {paginatedProducts.length === 0 && (
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
              <Typography color="text.secondary">No products found</Typography>
            </Paper>
          )}
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, overflowX: "auto" }}
        >
          <Table size={isTablet ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={getProductImage(product)}
                        alt={product.name}
                        sx={{
                          width: 40,
                          height: 40,
                          mr: 2,
                          bgcolor:
                            categoryColors[product.category] || colors.primary,
                        }}
                        variant="rounded"
                      >
                        {categoryIcons[product.category]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.brand} {product.model}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        bgcolor: categoryColors[product.category],
                        color: "white",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.type}
                      size="small"
                      color={product.type === "new" ? "success" : "warning"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color={colors.primary}
                    >
                      ETB {product.price?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.stock_quantity}
                      size="small"
                      color={
                        product.stock_quantity === 0
                          ? "error"
                          : product.stock_quantity < 5
                            ? "warning"
                            : "success"
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    {(user?.role === "admin" || user?.role === "sales") && (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(product)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {user?.role === "admin" && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(product.id)}
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
              {paginatedProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <TablePagination
          component="div"
          count={filteredProducts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
          labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
        />
      </Box>

      {/* Add/Edit Product Dialog with Dual Image Upload */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            bgcolor: colors.primary,
            color: "white",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: isMobile ? 2 : 1.5,
          }}
        >
          {editingProduct ? "Edit Product" : "Add New Product"}
          {isMobile && (
            <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3, pb: isMobile ? 8 : 3 }}>
            <Grid container spacing={2}>
              {/* Image Preview */}
              {imagePreview && (
                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <Avatar
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        border: `3px solid ${colors.primary}`,
                      }}
                      variant="rounded"
                    />
                  </Box>
                </Grid>
              )}

              {/* Image Upload Tabs */}
              <Grid item xs={12}>
                <Tabs
                  value={uploadTab}
                  onChange={(e, v) => setUploadTab(v)}
                  variant="fullWidth"
                  sx={{
                    mb: 2,
                    "& .MuiTab-root": {
                      color: colors.gray,
                      "&.Mui-selected": {
                        color: colors.primary,
                      },
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: colors.primary,
                    },
                  }}
                >
                  <Tab icon={<LinkIcon />} label="URL" iconPosition="start" />
                  <Tab
                    icon={<UploadIcon />}
                    label="Upload"
                    iconPosition="start"
                  />
                </Tabs>

                {uploadTab === 0 ? (
                  <TextField
                    name="image_url"
                    label="Image URL"
                    fullWidth
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    size={isMobile ? "small" : "medium"}
                    helperText="Enter a valid image URL"
                  />
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      border: `2px dashed ${colors.lightGray}`,
                      borderRadius: 2,
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                      id="product-image-upload"
                    />
                    <label htmlFor="product-image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<UploadIcon />}
                        sx={{
                          borderColor: colors.primary,
                          color: colors.primary,
                        }}
                      >
                        Choose Image
                      </Button>
                    </label>
                    {selectedFile && (
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Selected: {selectedFile.name}
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Product Name *"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category *"
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="laptop">Laptop</MenuItem>
                    <MenuItem value="tablet">Tablet</MenuItem>
                    <MenuItem value="accessory">Accessory</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                  <InputLabel>Condition *</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    label="Condition *"
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="used">Used</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="brand"
                  label="Brand"
                  fullWidth
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Samsung"
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="model"
                  label="Model"
                  fullWidth
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., Galaxy S22"
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="price"
                  label="Price *"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">ETB</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="stock_quantity"
                  label="Stock *"
                  type="number"
                  fullWidth
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  required
                  size={isMobile ? "small" : "medium"}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  multiline
                  rows={isMobile ? 2 : 3}
                  fullWidth
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product description..."
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              p: 2,
              flexDirection: isMobile ? "column" : "row",
              gap: 1,
              borderTop: `1px solid ${colors.lightGray}`,
              bgcolor: colors.white,
            }}
          >
            {!isMobile && (
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                fullWidth={isMobile}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              disabled={uploading}
              sx={{
                bgcolor: colors.primary,
                "&:hover": { bgcolor: colors.secondary },
                py: isMobile ? 1.5 : 1,
              }}
            >
              {uploading ? (
                <CircularProgress size={24} />
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
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
  );
};

export default Products;
