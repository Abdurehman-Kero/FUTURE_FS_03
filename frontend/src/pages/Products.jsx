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
} from "@mui/icons-material";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setImagePreview(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.price || !formData.stock_quantity) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        showSnackbar("Product updated successfully", "success");
      } else {
        await createProduct(formData);
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
          Products Management
        </Typography>
        {(user?.role === "admin" || user?.role === "sales") && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              bgcolor: "#FF8500",
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              "&:hover": { bgcolor: "#FFA33C" },
            }}
          >
            Add Product
          </Button>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 2 }}>
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
                  <PhoneIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Products
                  </Typography>
                  <Typography variant="h4" fontWeight="600">
                    {products.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 2, bgcolor: alpha("#ff9800", 0.05) }}>
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
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Low Stock
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="#ff9800">
                    {lowStockCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ borderRadius: 2, bgcolor: alpha("#f44336", 0.05) }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha("#f44336", 0.1),
                    color: "#f44336",
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <DeleteIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Out of Stock
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="#f44336">
                    {outOfStockCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products by name, brand, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: "#f8f9fa", borderRadius: 1 }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={loadProducts} sx={{ bgcolor: "#f8f9fa" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Products Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Price (ETB)</TableCell>
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
                        width: 50,
                        height: 50,
                        mr: 2,
                        bgcolor: categoryColors[product.category] || "#FF8500",
                        "& img": {
                          objectFit: "cover",
                        },
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
                  <Typography variant="body1" fontWeight="600" color="#FF8500">
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
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {user?.role === "admin" && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(product.id)}
                          >
                            <DeleteIcon />
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ bgcolor: "#FF8500", color: "white", fontWeight: 600 }}
        >
          {editingProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              {/* Image Preview */}
              {imagePreview && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <Avatar
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: 2,
                        border: `2px solid #FF8500`,
                      }}
                      variant="rounded"
                    />
                  </Box>
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                <TextField
                  name="name"
                  label="Product Name *"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
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
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
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
              <Grid size={{ xs: 6 }}>
                <TextField
                  name="brand"
                  label="Brand"
                  fullWidth
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Samsung, iPhone"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  name="model"
                  label="Model"
                  fullWidth
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., Galaxy S22, iPhone 13"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  name="price"
                  label="Price (ETB) *"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">ETB</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  name="stock_quantity"
                  label="Stock Quantity *"
                  type="number"
                  fullWidth
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  required
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product description..."
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="image_url"
                  label="Image URL"
                  fullWidth
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  helperText="Enter a valid image URL"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#FF8500",
                "&:hover": { bgcolor: "#FFA33C" },
              }}
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default Products;
