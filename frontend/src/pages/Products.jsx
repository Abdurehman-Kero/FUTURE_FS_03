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
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadTab, setUploadTab] = useState(0);
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
      setProducts(response.data.data);
    } catch {
      showSnackbar("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "image_url") setImagePreview(value);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
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
      let imageUrl = formData.image_url;
      if (uploadTab === 1 && selectedFile) {
        const uploadedUrl = await handleImageUpload();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }
      const productData = { ...formData, image_url: imageUrl };
      if (editingProduct) await updateProduct(editingProduct.id, productData);
      else await createProduct(productData);
      handleCloseDialog();
      loadProducts();
    } catch {
      showSnackbar("Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch {
      showSnackbar("Delete failed", "error");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const lowStockCount = products.filter(
    (p) => p.stock_quantity < 5 && p.stock_quantity > 0,
  ).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length;
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) =>
    setRowsPerPage(parseInt(e.target.value, 10)) || setPage(0);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

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
          {[
            {
              icon: <PhoneIcon />,
              label: "Total",
              value: products.length,
              color: colors.primary,
            },
            {
              icon: <WarningIcon />,
              label: "Low Stock",
              value: lowStockCount,
              color: "#ff9800",
            },
            {
              icon: <DeleteIcon />,
              label: "Out of Stock",
              value: outOfStockCount,
              color: "#f44336",
            },
          ].map((stat, i) => (
            <Grid item xs={4} key={i}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent
                  sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(stat.color, 0.1),
                      color: stat.color,
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1.2rem", sm: "1.4rem" },
                      fontWeight: 600,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
            {paginatedProducts.map((p) => (
              <Card key={p.id} sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Avatar
                      src={p.image_url || DEFAULT_PRODUCT_IMAGE}
                      alt={p.name}
                      sx={{
                        width: 70,
                        height: 70,
                        bgcolor: categoryColors[p.category] || colors.primary,
                        borderRadius: 2,
                        flexShrink: 0,
                      }}
                      variant="rounded"
                    >
                      {categoryIcons[p.category]}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={600} noWrap>
                        {p.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {p.brand} {p.model}
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
                          label={p.type}
                          size="small"
                          color={p.type === "new" ? "success" : "warning"}
                          variant="outlined"
                          sx={{ height: 20 }}
                        />
                        <Chip
                          label={`Stock: ${p.stock_quantity}`}
                          size="small"
                          color={
                            p.stock_quantity === 0
                              ? "error"
                              : p.stock_quantity < 5
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
                          ETB {p.price?.toLocaleString()}
                        </Typography>
                        <Box>
                          {(user?.role === "admin" ||
                            user?.role === "sales") && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(p)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              {user?.role === "admin" && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(p.id)}
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
                {paginatedProducts.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={p.image_url || DEFAULT_PRODUCT_IMAGE}
                          alt={p.name}
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            bgcolor:
                              categoryColors[p.category] || colors.primary,
                          }}
                          variant="rounded"
                        >
                          {categoryIcons[p.category]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {p.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.brand} {p.model}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.category}
                        size="small"
                        sx={{
                          bgcolor: categoryColors[p.category],
                          color: "white",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.type}
                        size="small"
                        color={p.type === "new" ? "success" : "warning"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600} color={colors.primary}>
                        ETB {p.price?.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.stock_quantity}
                        size="small"
                        color={
                          p.stock_quantity === 0
                            ? "error"
                            : p.stock_quantity < 5
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
                              onClick={() => handleOpenDialog(p)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {user?.role === "admin" && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(p.id)}
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

        {/* Add FAB for Mobile */}
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

        {/* Dialog */}
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
            <DialogContent sx={{ pt: 3, pb: isMobile ? 10 : 3 }}>
              <Grid container spacing={2}>
                {imagePreview && (
                  <Grid item xs={12}>
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
                          border: `3px solid ${colors.primary}`,
                        }}
                        variant="rounded"
                      />
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Tabs
                    value={uploadTab}
                    onChange={(e, v) => setUploadTab(v)}
                    variant="fullWidth"
                    sx={{
                      mb: 2,
                      "& .MuiTab-root.Mui-selected": { color: colors.primary },
                      "& .MuiTabs-indicator": {
                        backgroundColor: colors.primary,
                      },
                    }}
                  >
                    <Tab icon={<LinkIcon />} label="URL" />
                    <Tab icon={<UploadIcon />} label="Upload" />
                  </Tabs>
                  {uploadTab === 0 ? (
                    <TextField
                      fullWidth
                      name="image_url"
                      label="Image URL"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      size={isMobile ? "small" : "medium"}
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Description"
                    multiline
                    rows={isMobile ? 2 : 3}
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
