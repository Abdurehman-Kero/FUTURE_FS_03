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
  Fab,
  ImageList,
  ImageListItem,
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
  Inventory as InventoryIcon,
  DeleteOutline as DeleteOutlineIcon,
  AddPhotoAlternate as AddPhotoIcon,
} from "@mui/icons-material";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
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

const categoryColors = {
  phone: "#2196f3",
  laptop: "#4caf50",
  tablet: "#ff9800",
  accessory: "#9c27b0",
};

const categoryIcons = {
  phone: <PhoneIcon />,
  laptop: <LaptopIcon />,
  tablet: <TabletIcon />,
  accessory: <AccessoryIcon />,
};

const DEFAULT_PRODUCT_IMAGE =
  "https://placehold.co/300x200/FF8500/FFFFFF?text=Product";

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
  const [imagePreview, setImagePreview] = useState([]);
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
    images: [],
    warranty_months: 12,
  });

  useEffect(() => {
    setRowsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      let productsData = response.data.data || [];

      // Parse images JSON for each product
      productsData = productsData.map((p) => ({
        ...p,
        images:
          typeof p.images === "string"
            ? JSON.parse(p.images || "[]")
            : p.images || [],
      }));

      setProducts(productsData);
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
        images: product.images || [],
        warranty_months: product.warranty_months || 12,
      });
      setImagePreview(product.images || []);
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
        images: [],
        warranty_months: 12,
      });
      setImagePreview([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setImagePreview([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url && url.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url.trim()],
      }));
      setImagePreview((prev) => [...prev, url.trim()]);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        const response = await uploadProductImage(formData);
        if (response.data.imageUrl) {
          uploadedUrls.push(response.data.imageUrl);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      setImagePreview((prev) => [...prev, ...uploadedUrls]);
      showSnackbar(
        `${uploadedUrls.length} image(s) uploaded successfully`,
        "success",
      );
    } catch (error) {
      showSnackbar("Failed to upload images", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock_quantity) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    try {
      const productData = {
        ...formData,
        images: JSON.stringify(formData.images),
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
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProduct(id);
      showSnackbar("Product deleted successfully", "success");
      loadProducts();
    } catch {
      showSnackbar("Failed to delete product", "error");
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.brand?.toLowerCase().includes(searchLower) ||
      product.model?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  });

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) =>
    setRowsPerPage(parseInt(e.target.value, 10)) || setPage(0);

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
            Products
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
              Add Product
            </Button>
          )}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card
              sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <PhoneIcon fontSize={isMobile ? "small" : "medium"} />
                </Avatar>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Total
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "1.2rem", sm: "1.4rem" },
                    fontWeight: 600,
                  }}
                >
                  {products.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 2, bgcolor: alpha("#ff9800", 0.05) }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha("#ff9800", 0.1),
                    color: "#ff9800",
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <WarningIcon fontSize={isMobile ? "small" : "medium"} />
                </Avatar>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Low Stock
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "1.2rem", sm: "1.4rem" },
                    fontWeight: 600,
                    color: "#ff9800",
                  }}
                >
                  {lowStockCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 2, bgcolor: alpha("#f44336", 0.05) }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha("#f44336", 0.1),
                    color: "#f44336",
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                </Avatar>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Out of Stock
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "1.2rem", sm: "1.4rem" },
                    fontWeight: 600,
                    color: "#f44336",
                  }}
                >
                  {outOfStockCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={
                isMobile ? "Search..." : "Search by name, brand, or model..."
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
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ),
              }}
              sx={{ bgcolor: "#f8f9fa", borderRadius: 1 }}
            />
            <Tooltip title="Refresh">
              <IconButton onClick={loadProducts}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Products List */}
        {isMobile ? (
          <Box>
            {paginatedProducts.map((product) => (
              <Card key={product.id} sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Avatar
                      src={product.image_url || DEFAULT_PRODUCT_IMAGE}
                      alt={product.name}
                      sx={{
                        width: 70,
                        height: 70,
                        bgcolor:
                          categoryColors[product.category] || colors.primary,
                        borderRadius: 2,
                        flexShrink: 0,
                      }}
                      variant="rounded"
                    >
                      {categoryIcons[product.category]}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={600} noWrap>
                        {product.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {product.brand} {product.model}
                      </Typography>
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
                          sx={{ height: 20 }}
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
                          sx={{ height: 20 }}
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
                        <Typography fontWeight={600} color={colors.primary}>
                          ETB {product.price?.toLocaleString()}
                        </Typography>
                        <Box>
                          {(user?.role === "admin" ||
                            user?.role === "sales") && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(product)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              {user?.role === "admin" && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(product.id)}
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
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <InventoryIcon
                  sx={{ fontSize: 40, color: colors.gray, mb: 1 }}
                />
                <Typography color="text.secondary">
                  No products found
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
                          src={product.image_url || DEFAULT_PRODUCT_IMAGE}
                          alt={product.name}
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            bgcolor:
                              categoryColors[product.category] ||
                              colors.primary,
                          }}
                          variant="rounded"
                        >
                          {categoryIcons[product.category]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
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
                      <Typography fontWeight={600} color={colors.primary}>
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
                              onClick={() => handleOpenDialog(product)}
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}

        {/* Mobile FAB */}
        {isMobile && (user?.role === "admin" || user?.role === "sales") && (
          <Fab
            onClick={() => handleOpenDialog()}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              background: colors.gradient,
              color: colors.white,
              "&:hover": { background: colors.secondary },
              zIndex: 100,
            }}
          >
            <AddIcon />
          </Fab>
        )}

        {/* Add/Edit Product Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullScreen={isMobile}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: { xs: 0, sm: 3 } } }}
        >
          <DialogTitle
            sx={{
              background: colors.gradient,
              color: colors.white,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {editingProduct ? "Edit Product" : "Add Product"}
            {isMobile && (
              <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent
              sx={{
                pt: 3,
                pb: isMobile ? 10 : 3,
                maxHeight: "70vh",
                overflowY: "auto",
              }}
            >
              <Grid container spacing={2}>
                {/* Basic Info */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Product Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
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
                    fullWidth
                    name="brand"
                    label="Brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Samsung"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="model"
                    label="Model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g., Galaxy S22"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="price"
                    label="Price *"
                    type="number"
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
                    fullWidth
                    name="stock_quantity"
                    label="Stock *"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    required
                    size={isMobile ? "small" : "medium"}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="warranty_months"
                    label="Warranty (months)"
                    type="number"
                    value={formData.warranty_months}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>

                {/* Main Image */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Main Image
                  </Typography>
                  <TextField
                    fullWidth
                    name="image_url"
                    label="Main Image URL"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/main-image.jpg"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>

                {/* Additional Images */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2">
                      Additional Images
                    </Typography>
                    <Box>
                      <Button
                        size="small"
                        startIcon={<AddPhotoIcon />}
                        onClick={handleAddImageUrl}
                        sx={{ mr: 1 }}
                      >
                        Add URL
                      </Button>
                      <Button
                        size="small"
                        component="label"
                        startIcon={<UploadIcon />}
                      >
                        Upload Files
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          hidden
                          onChange={handleFileUpload}
                        />
                      </Button>
                    </Box>
                  </Box>

                  {uploading && <CircularProgress size={20} sx={{ mb: 1 }} />}

                  {imagePreview.length > 0 && (
                    <Paper variant="outlined" sx={{ p: 1, mt: 1 }}>
                      <Grid container spacing={1}>
                        {imagePreview.map((img, idx) => (
                          <Grid item xs={4} sm={3} md={2} key={idx}>
                            <Box sx={{ position: "relative" }}>
                              <Avatar
                                src={img}
                                variant="rounded"
                                sx={{
                                  width: "100%",
                                  height: 80,
                                  objectFit: "cover",
                                }}
                              />
                              <IconButton
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  bgcolor: "rgba(0,0,0,0.5)",
                                  color: "white",
                                }}
                                onClick={() => handleRemoveImage(idx)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  )}
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Product Description"
                    multiline
                    rows={8}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Write a detailed description. You can include specifications, features, and anything else about the product..."
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
              }}
            >
              {!isMobile && (
                <Button onClick={handleCloseDialog} variant="outlined">
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth={isMobile}
                disabled={uploading}
                sx={{
                  background: colors.gradient,
                  "&:hover": { background: colors.secondary },
                  py: isMobile ? 1.2 : 1,
                }}
              >
                {uploading ? (
                  <CircularProgress size={24} />
                ) : editingProduct ? (
                  "Update"
                ) : (
                  "Create"
                )}
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
            horizontal: "center",
          }}
        >
          <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Products;
