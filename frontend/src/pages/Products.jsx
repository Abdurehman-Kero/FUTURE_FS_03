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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
  DeleteOutline as DeleteOutlineIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Image as ImageIcon,
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
  danger: "#EF4444",
  warning: "#F59E0B",
};

const categoryColors = {
  phone: "#2196f3",
  laptop: "#4caf50",
  tablet: "#ff9800",
  accessory: "#9c27b0",
};

const DEFAULT_PRODUCT_IMAGE =
  "https://placehold.co/400x400/FF8500/FFFFFF?text=No+Image";

const Products = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tempImageUrl, setTempImageUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "phone",
    type: "new",
    brand: "",
    model: "",
    price: "",
    stock_quantity: "",
    description: "",
    images: [],
    warranty_months: 12,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      const productsData = (response.data.data || []).map((p) => {
        let imagesArray = [];
        if (p.images) {
          if (typeof p.images === "string") {
            try {
              imagesArray = JSON.parse(p.images);
            } catch (e) {
              imagesArray = [];
            }
          } else if (Array.isArray(p.images)) {
            imagesArray = p.images;
          }
        }
        if (imagesArray.length === 0 && p.image_url) {
          imagesArray = [p.image_url];
        }
        return { ...p, images: imagesArray };
      });
      setProducts(productsData);
    } catch (error) {
      showSnackbar("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setImageList(product.images || []);
      setFormData({ ...product });
    } else {
      setEditingProduct(null);
      setImageList([]);
      setFormData({
        name: "",
        category: "phone",
        type: "new",
        brand: "",
        model: "",
        price: "",
        stock_quantity: "",
        description: "",
        images: [],
        warranty_months: 12,
      });
    }
    setTempImageUrl("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setImageList([]);
    setTempImageUrl("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImageUrl = () => {
    if (tempImageUrl && tempImageUrl.trim()) {
      const newList = [...imageList, tempImageUrl.trim()];
      setImageList(newList);
      setFormData((prev) => ({ ...prev, images: newList }));
      setTempImageUrl("");
      showSnackbar("Image URL added", "success");
    }
  };

  const handleRemoveImage = (index) => {
    const newList = imageList.filter((_, i) => i !== index);
    setImageList(newList);
    setFormData((prev) => ({ ...prev, images: newList }));
    showSnackbar("Image removed", "success");
  };

  const handleSetMainImage = (index) => {
    if (index === 0) return;
    const newList = [...imageList];
    const [selected] = newList.splice(index, 1);
    newList.unshift(selected);
    setImageList(newList);
    setFormData((prev) => ({ ...prev, images: newList }));
    showSnackbar("Image set as main", "success");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("image", file);
      const response = await uploadProductImage(uploadData);

      const uploadedUrl = response.data?.imageUrl || response.data?.url;
      if (uploadedUrl) {
        const newList = [...imageList, uploadedUrl];
        setImageList(newList);
        setFormData((prev) => ({ ...prev, images: newList }));
        showSnackbar(
          `Image uploaded. Total: ${newList.length} images`,
          "success",
        );
      } else {
        showSnackbar("Upload failed - no URL returned", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showSnackbar("Failed to upload image", "error");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.stock_quantity) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    if (imageList.length === 0) {
      showSnackbar("Please add at least one image", "error");
      return;
    }

    try {
      const payload = {
        ...formData,
        images: JSON.stringify(imageList),
        image_url: imageList[0],
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showSnackbar(
          `Product updated with ${imageList.length} images`,
          "success",
        );
      } else {
        await createProduct(payload);
        showSnackbar(
          `Product created with ${imageList.length} images`,
          "success",
        );
      }
      handleCloseDialog();
      loadProducts();
    } catch (error) {
      console.error("Submit error:", error);
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

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

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
          p: { xs: 3, md: 5 },
          background: colors.dark,
          color: "white",
          borderRadius: "0 0 32px 32px",
          mb: 4,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant={isMobile ? "h4" : "h3"} fontWeight="800">
              Product <span style={{ color: colors.primary }}>Catalog</span>
            </Typography>
            <Typography sx={{ opacity: 0.7 }}>
              Manage your inventory and stock levels
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: "right" } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: colors.gradient,
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                boxShadow: `0 8px 20px ${alpha(colors.primary, 0.4)}`,
              }}
            >
              Add New Product
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={4}>
            <Card
              sx={{
                borderRadius: "20px",
                textAlign: "center",
                bgcolor: alpha(colors.white, 0.9),
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <InventoryIcon />
                </Avatar>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Total Items
                </Typography>
                <Typography variant="h6" fontWeight="800">
                  {products.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card
              sx={{
                borderRadius: "20px",
                textAlign: "center",
                bgcolor: alpha(colors.warning, 0.05),
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(colors.warning, 0.1),
                    color: colors.warning,
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <WarningIcon />
                </Avatar>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Low Stock
                </Typography>
                <Typography variant="h6" fontWeight="800">
                  {lowStockCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card
              sx={{
                borderRadius: "20px",
                textAlign: "center",
                bgcolor: alpha(colors.danger, 0.05),
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(colors.danger, 0.1),
                    color: colors.danger,
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <DeleteIcon />
                </Avatar>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Out of Stock
                </Typography>
                <Typography variant="h6" fontWeight="800">
                  {outOfStockCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search products by name, brand or model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 4,
            bgcolor: "white",
            borderRadius: "12px",
            "& fieldset": { border: "none" },
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.primary }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {searchTerm && (
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton onClick={loadProducts}>
                  <RefreshIcon />
                </IconButton>
              </>
            ),
          }}
        />

        {/* Products Display */}
        {isMobile ? (
          /* MOBILE VIEW */
          <Grid container spacing={2}>
            {paginatedProducts.map((product) => (
              <Grid item xs={12} key={product.id}>
                <Card sx={{ borderRadius: "16px", overflow: "hidden" }}>
                  <Box sx={{ display: "flex", p: 2, gap: 2 }}>
                    <Avatar
                      src={product.images?.[0] || DEFAULT_PRODUCT_IMAGE}
                      variant="rounded"
                      sx={{ width: 80, height: 80, borderRadius: 2 }}
                      onError={(e) => {
                        e.target.src = DEFAULT_PRODUCT_IMAGE;
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="bold" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.brand} {product.model}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={colors.primary}
                        fontWeight="800"
                        sx={{ mt: 0.5 }}
                      >
                        ETB {product.price?.toLocaleString()}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
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
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <Tooltip title="Edit Product" placement="left">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(product)}
                              sx={{
                                bgcolor: alpha(colors.primary, 0.1),
                                color: colors.primary,
                                "&:hover": {
                                  bgcolor: colors.primary,
                                  color: "white",
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {user?.role === "admin" && (
                            <Tooltip title="Delete Product" placement="left">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(product.id)}
                                sx={{
                                  bgcolor: alpha(colors.danger, 0.1),
                                  "&:hover": {
                                    bgcolor: colors.danger,
                                    color: "white",
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  {product.images?.length > 1 && (
                    <Box sx={{ px: 2, pb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        +{product.images.length - 1} more image(s)
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          /* DESKTOP VIEW */
          <TableContainer
            component={Paper}
            sx={{ borderRadius: "20px", overflow: "hidden" }}
          >
            <Table>
              <TableHead sx={{ bgcolor: alpha(colors.dark, 0.03) }}>
                <TableRow>
                  <TableCell>PRODUCT</TableCell>
                  <TableCell>CATEGORY</TableCell>
                  <TableCell>CONDITION</TableCell>
                  <TableCell>PRICE</TableCell>
                  <TableCell>STOCK</TableCell>
                  <TableCell>IMAGES</TableCell>
                  <TableCell align="center">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={product.images?.[0] || DEFAULT_PRODUCT_IMAGE}
                          variant="rounded"
                          sx={{ width: 50, height: 50, borderRadius: 1 }}
                          onError={(e) => {
                            e.target.src = DEFAULT_PRODUCT_IMAGE;
                          }}
                        />
                        <Box>
                          <Typography fontWeight="700">
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
                        label={product.type === "new" ? "New" : "Used"}
                        size="small"
                        color={product.type === "new" ? "success" : "warning"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="800" color={colors.primary}>
                        ETB {product.price?.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${product.stock_quantity} pcs`}
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
                    <TableCell>
                      <Tooltip
                        title={`${product.images?.length || 0} image(s)`}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AddPhotoIcon
                            fontSize="small"
                            sx={{ color: colors.gray }}
                          />
                          <Typography variant="caption" fontWeight="bold">
                            {product.images?.length || 0}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          alignItems: "center",
                        }}
                      >
                        <Tooltip title="Edit Product" placement="left">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(product)}
                            sx={{
                              bgcolor: alpha(colors.primary, 0.1),
                              color: colors.primary,
                              "&:hover": {
                                bgcolor: colors.primary,
                                color: "white",
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {user?.role === "admin" && (
                          <Tooltip title="Delete Product" placement="left">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(product.id)}
                              sx={{
                                bgcolor: alpha(colors.danger, 0.1),
                                "&:hover": {
                                  bgcolor: colors.danger,
                                  color: "white",
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
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

        {/* Pagination for mobile */}
        {isMobile && filteredProducts.length > rowsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <TablePagination
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10]}
            />
          </Box>
        )}
      </Box>

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: colors.dark, color: "white" }}>
          {editingProduct ? "Edit Product" : "New Product"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, maxHeight: "70vh", overflowY: "auto" }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category *</InputLabel>
                <Select
                  value={formData.category}
                  label="Category *"
                  name="category"
                  onChange={handleInputChange}
                >
                  <MenuItem value="phone">Phone</MenuItem>
                  <MenuItem value="laptop">Laptop</MenuItem>
                  <MenuItem value="tablet">Tablet</MenuItem>
                  <MenuItem value="accessory">Accessory</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Condition *</InputLabel>
                <Select
                  value={formData.type}
                  label="Condition *"
                  name="type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="used">Used</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price *"
                type="number"
                name="price"
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock Quantity *"
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Warranty (months)"
                type="number"
                name="warranty_months"
                value={formData.warranty_months}
                onChange={handleInputChange}
              />
            </Grid>

            {/* IMAGES SECTION */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Product Images ({imageList.length})
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 2, display: "block" }}
              >
                Upload images one by one or add URLs. First image is the main
                product image.
              </Typography>

              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                disabled={uploading}
                sx={{ mr: 2, mb: 2, background: colors.gradient }}
              >
                {uploading ? <CircularProgress size={24} /> : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>

              <Button
                variant="outlined"
                startIcon={<LinkIcon />}
                onClick={handleAddImageUrl}
                sx={{ mb: 2 }}
              >
                Add Image URL
              </Button>

              {/* URL Input */}
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Enter image URL"
                  value={tempImageUrl}
                  onChange={(e) => setTempImageUrl(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleAddImageUrl}
                  disabled={!tempImageUrl.trim()}
                >
                  Add
                </Button>
              </Box>

              {/* Images Gallery */}
              {imageList.length > 0 && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    {imageList.map((url, idx) => (
                      <Grid item xs={4} sm={3} md={2} key={idx}>
                        <Box sx={{ position: "relative" }}>
                          <img
                            src={url}
                            alt={`img-${idx}`}
                            style={{
                              width: "100%",
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 8,
                              border:
                                idx === 0
                                  ? `3px solid ${colors.primary}`
                                  : "1px solid #ddd",
                            }}
                            onError={(e) => {
                              e.target.src = DEFAULT_PRODUCT_IMAGE;
                            }}
                          />
                          {idx === 0 && (
                            <Typography
                              sx={{
                                position: "absolute",
                                bottom: 4,
                                left: 4,
                                bgcolor: colors.primary,
                                color: "white",
                                px: 0.5,
                                borderRadius: 0.5,
                                fontSize: 10,
                              }}
                            >
                              MAIN
                            </Typography>
                          )}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              left: 0,
                              bottom: 0,
                              bgcolor: "rgba(0,0,0,0.5)",
                              opacity: 0,
                              "&:hover": { opacity: 1 },
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                              borderRadius: 1,
                            }}
                          >
                            {idx !== 0 && (
                              <Tooltip title="Set as main image">
                                <IconButton
                                  size="small"
                                  sx={{
                                    bgcolor: "rgba(0,0,0,0.6)",
                                    color: "white",
                                  }}
                                  onClick={() => handleSetMainImage(idx)}
                                >
                                  <ImageIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Remove image">
                              <IconButton
                                size="small"
                                sx={{
                                  bgcolor: "rgba(0,0,0,0.6)",
                                  color: "white",
                                }}
                                onClick={() => handleRemoveImage(idx)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ background: colors.gradient }}
            onClick={handleSubmit}
            disabled={uploading}
          >
            {editingProduct ? "Update Product" : "Create Product"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
