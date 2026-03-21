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
  "https://placehold.co/400x400/FF8500/FFFFFF?text=No+Image";

const Products = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [imageList, setImageList] = useState([]);

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

      productsData = productsData.map((p) => {
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

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      const productImages = product.images || [];
      setImageList([...productImages]);
      setFormData({
        name: product.name || "",
        category: product.category || "phone",
        type: product.type || "new",
        brand: product.brand || "",
        model: product.model || "",
        price: product.price || "",
        stock_quantity: product.stock_quantity || "",
        description: product.description || "",
        images: productImages,
        warranty_months: product.warranty_months || 12,
      });
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setImageList([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url && url.trim()) {
      const newList = [...imageList, url.trim()];
      setImageList(newList);
      setFormData((prev) => ({ ...prev, images: newList }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        image_url: imageList[0], // CRITICAL: First image as main
      };

      console.log("SAVING PRODUCT:", {
        name: payload.name,
        total_images: imageList.length,
        images: imageList,
      });

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

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.brand?.toLowerCase().includes(searchLower) ||
      product.model?.toLowerCase().includes(searchLower)
    );
  });

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
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: colors.dark }}>
            Products
          </Typography>
          {(user?.role === "admin" || user?.role === "sales") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ background: colors.gradient }}
            >
              Add Product
            </Button>
          )}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <PhoneIcon />
                </Avatar>
                <Typography variant="caption">Total</Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {products.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ bgcolor: alpha("#ff9800", 0.05) }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha("#ff9800", 0.1),
                    color: "#ff9800",
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <WarningIcon />
                </Avatar>
                <Typography variant="caption">Low Stock</Typography>
                <Typography sx={{ fontWeight: 600, color: "#ff9800" }}>
                  {lowStockCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ bgcolor: alpha("#f44336", 0.05) }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha("#f44336", 0.1),
                    color: "#f44336",
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <DeleteIcon />
                </Avatar>
                <Typography variant="caption">Out of Stock</Typography>
                <Typography sx={{ fontWeight: 600, color: "#f44336" }}>
                  {outOfStockCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search products..."
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
                    <CloseIcon />
                  </IconButton>
                ),
              }}
            />
            <IconButton onClick={loadProducts}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Paper>

        {/* Products Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: colors.light }}>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Images</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={product.images?.[0] || DEFAULT_PRODUCT_IMAGE}
                        sx={{ width: 50, height: 50, borderRadius: 1 }}
                        variant="rounded"
                        onError={(e) => {
                          e.target.src = DEFAULT_PRODUCT_IMAGE;
                        }}
                      />
                      <Box>
                        <Typography fontWeight="600">{product.name}</Typography>
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
                      variant="outlined"
                      color={product.type === "new" ? "success" : "warning"}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="600" color={colors.primary}>
                      ETB {product.price?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.stock_quantity}
                      size="small"
                      color={product.stock_quantity === 0 ? "error" : "success"}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`${product.images?.length || 0} image(s)`}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <AddPhotoIcon fontSize="small" />
                        <Typography fontWeight="bold">
                          {product.images?.length || 0}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(product)}
                    >
                      <EditIcon />
                    </IconButton>
                    {user?.role === "admin" && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {paginatedProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>No products found</Typography>
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

        {/* Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ background: colors.gradient, color: "white" }}>
            {editingProduct ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pt: 3, maxHeight: "70vh", overflowY: "auto" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Product Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category *</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
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
                  <FormControl fullWidth>
                    <InputLabel>Condition *</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
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
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="model"
                    label="Model"
                    value={formData.model}
                    onChange={handleInputChange}
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
                    Upload images one by one or add URLs. First image is the
                    main product image.
                  </Typography>

                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                    disabled={uploading}
                    sx={{ mr: 2, mb: 2, background: colors.gradient }}
                  >
                    {uploading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Upload Image"
                    )}
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

                  {imageList.length > 0 && (
                    <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
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
                                )}
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
                    name="description"
                    label="Product Description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={uploading}
                sx={{ background: colors.gradient }}
              >
                {editingProduct ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Products;
