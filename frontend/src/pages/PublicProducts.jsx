import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Avatar,
  alpha,
  Pagination,
  Paper,
  IconButton,
  CircularProgress,
  Badge,
  useMediaQuery,
  useTheme,
  Drawer,
  Fab,
  Fade,
  Grow,
  Zoom,
  Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon,
  WhatsApp as WhatsAppIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  TrendingUp as TrendingIcon,
  NewReleases as NewIcon,
  LocalOffer as OfferIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/api";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced Color palette
const colors = {
  primary: "#FF8500",
  primaryDark: "#E67600",
  secondary: "#FFA33C",
  dark: "#1E1A3A",
  light: "#F8F9FF",
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  darkGradient: "linear-gradient(135deg, #1E1A3A 0%, #2D2A5A 100%)",
};

// Enhanced Category configuration
const categoryConfig = {
  phone: {
    label: "Phones",
    color: "#FF8500",
    bgColor: "#FFF4E6",
    icon: "📱",
    gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  },
  laptop: {
    label: "Laptops",
    color: "#4A90E2",
    bgColor: "#E8F0FE",
    icon: "💻",
    gradient: "linear-gradient(135deg, #4A90E2 0%, #6CA3F0 100%)",
  },
  tablet: {
    label: "Tablets",
    color: "#9C27B0",
    bgColor: "#F3E5F5",
    icon: "📟",
    gradient: "linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)",
  },
  accessory: {
    label: "Accessories",
    color: "#10B981",
    bgColor: "#E8F5E9",
    icon: "🎧",
    gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
  },
};

// Default image
const DEFAULT_PRODUCT_IMAGE =
  "https://placehold.co/400x300/FF8500/FFFFFF?text=Product";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardHover = {
  hover: {
    y: -10,
    transition: { duration: 0.3 },
  },
};

const PublicProducts = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { addToCart, cartCount } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [imageErrors, setImageErrors] = useState({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});

  const itemsPerPage = isMobile ? 8 : 12;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProducts();
      const productsData = res?.data?.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to load products:", error);
      setError(error?.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (productId) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    setAddedToCart({ [product.id]: true });
    setTimeout(() => {
      setAddedToCart({});
    }, 1000);
  };

  const filteredProducts = products.filter((p) => {
    if (!p) return false;
    const searchLower = searchTerm?.toLowerCase() || "";
    const nameMatch = p.name?.toLowerCase().includes(searchLower) || false;
    const brandMatch = p.brand?.toLowerCase().includes(searchLower) || false;
    const categoryMatch =
      categoryFilter === "all" || p.category === categoryFilter;
    return (nameMatch || brandMatch) && categoryMatch;
  });

  const displayedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleWhatsApp = (product, e) => {
    e.stopPropagation();
    if (!product) return;
    const productName = product.name || "Product";
    const productBrand = product.brand || "";
    const productModel = product.model || "";
    const productPrice = product.price
      ? `ETB ${product.price}`
      : "Price on request";
    const productType = product.type || "new";
    const msg = `Hello Chala Mobile, I'm interested in:%0A%0A*Product:* ${productName}%0A*Brand:* ${productBrand} ${productModel}%0A*Price:* ${productPrice}%0A*Condition:* ${productType}`;
    window.open(
      `https://wa.me/251982310974?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    if (!product) return;
    const productSlug =
      product.slug ||
      product.name?.toLowerCase().replace(/\s+/g, "-") ||
      "product";
    navigate(`/checkout/${productSlug}`, {
      state: { product: { ...product, slug: productSlug } },
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setFilterDrawerOpen(false);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.slug || product.id}`);
  };

  // Enhanced Mobile Filter Drawer
  const filterDrawer = (
    <Drawer
      anchor="bottom"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: "85vh",
          background: colors.white,
        },
      }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight="800" color={colors.dark}>
              Filter Products
            </Typography>
            <IconButton
              onClick={() => setFilterDrawerOpen(false)}
              sx={{
                bgcolor: colors.light,
                "&:hover": { bgcolor: colors.lightGray },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="medium"
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                "&:hover fieldset": { borderColor: colors.primary },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.primary }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth size="medium" sx={{ mb: 3 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category"
              sx={{ borderRadius: "16px" }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <MenuItem key={key} value={key}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontSize="1.2rem">{config.icon}</Typography>
                    <Typography>{config.label}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            onClick={handleClearFilters}
            sx={{
              background: colors.gradient,
              py: 1.5,
              borderRadius: "16px",
              fontWeight: 600,
              mb: 1.5,
              "&:hover": { background: colors.secondary },
            }}
          >
            Clear Filters
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setFilterDrawerOpen(false)}
            sx={{
              py: 1.5,
              borderRadius: "16px",
              borderColor: colors.primary,
              color: colors.primary,
              fontWeight: 600,
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </motion.div>
    </Drawer>
  );

  // Loading Skeleton
  if (loading) {
    return (
      <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
            {[...Array(8)].map((_, i) => (
              <Grid item xs={6} sm={6} md={4} lg={3} key={i}>
                <Card sx={{ borderRadius: "20px" }}>
                  <Skeleton
                    variant="rectangular"
                    height={isMobile ? 160 : 200}
                    sx={{ borderRadius: "20px 20px 0 0" }}
                  />
                  <CardContent>
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="80%" height={24} sx={{ mt: 1 }} />
                    <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: { xs: 4, sm: 6 },
                textAlign: "center",
                borderRadius: "24px",
                bgcolor: colors.white,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              <InventoryIcon
                sx={{
                  fontSize: { xs: 48, sm: 64 },
                  color: colors.error,
                  mb: 2,
                }}
              />
              <Typography variant="h6" color={colors.error} gutterBottom>
                Error Loading Products
              </Typography>
              <Typography color={colors.gray} sx={{ mb: 3 }}>
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={loadProducts}
                sx={{
                  background: colors.gradient,
                  borderRadius: "50px",
                  px: 4,
                  py: 1,
                }}
              >
                Try Again
              </Button>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.light, minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Centered Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              py: { xs: 2, sm: 3 },
              position: "sticky",
              top: 0,
              bgcolor: colors.light,
              zIndex: 10,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleBackToHome}
                  sx={{
                    bgcolor: colors.white,
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "14px",
                    "&:hover": {
                      bgcolor: colors.primary,
                      color: colors.white,
                      borderColor: colors.primary,
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </motion.div>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="800"
                  sx={{
                    background: colors.gradient,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Our Products
                </Typography>
                <Typography variant="caption" color={colors.gray}>
                  {filteredProducts.length} items available
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={() => navigate("/cart")}
                  sx={{
                    bgcolor: colors.white,
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "14px",
                    "&:hover": {
                      bgcolor: colors.primary,
                      color: colors.white,
                    },
                  }}
                >
                  <Badge badgeContent={cartCount} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </motion.div>

              {isMobile && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={() => setFilterDrawerOpen(true)}
                    sx={{
                      bgcolor: colors.white,
                      border: `1px solid ${colors.lightGray}`,
                      borderRadius: "14px",
                    }}
                  >
                    <FilterIcon />
                  </IconButton>
                </motion.div>
              )}
            </Box>
          </Stack>
        </motion.div>

        {/* Centered Desktop Filters */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: "24px",
                border: `1px solid ${colors.lightGray}`,
                background: colors.white,
                maxWidth: 800,
                mx: "auto",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 7 }}>
                  <TextField
                    fullWidth
                    placeholder="Search by product name or brand..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: colors.primary }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        "&:hover fieldset": { borderColor: colors.primary },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      label="Category"
                      sx={{ borderRadius: "16px" }}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <MenuItem key={key} value={key}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Typography fontSize="1.2rem">
                              {config.icon}
                            </Typography>
                            <Typography>{config.label}</Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {(searchTerm || categoryFilter !== "all") && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, justifyContent: "center" }}
                >
                  {searchTerm && (
                    <Chip
                      label={`Search: "${searchTerm}"`}
                      onDelete={() => setSearchTerm("")}
                      sx={{
                        bgcolor: alpha(colors.primary, 0.1),
                        color: colors.primary,
                      }}
                    />
                  )}
                  {categoryFilter !== "all" && (
                    <Chip
                      label={`Category: ${categoryConfig[categoryFilter]?.label || categoryFilter}`}
                      onDelete={() => setCategoryFilter("all")}
                      sx={{
                        bgcolor: alpha(colors.primary, 0.1),
                        color: colors.primary,
                      }}
                    />
                  )}
                  <Button
                    size="small"
                    onClick={handleClearFilters}
                    sx={{ color: colors.primary }}
                  >
                    Clear All
                  </Button>
                </Stack>
              )}
            </Paper>
          </motion.div>
        )}

        {filterDrawer}

        {/* Centered Products Grid */}
        {displayedProducts.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <Grid
              container
              spacing={isMobile ? 2 : 3}
              justifyContent="center"
              alignItems="stretch"
            >
              {displayedProducts.map((p, index) => {
                if (!p) return null;

                const category = categoryConfig[p.category] || {
                  label: p.category || "Other",
                  color: colors.gray,
                  bgColor: colors.lightGray,
                  icon: "📦",
                  gradient: colors.gradient,
                };

                const stockQuantity = p.stock_quantity || 0;
                const productPrice = p.price
                  ? `ETB ${p.price.toLocaleString()}`
                  : "Price on request";
                const productType = p.type || "new";
                const productName = p.name || "Unnamed Product";
                const productBrand = p.brand || "";

                return (
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={4}
                    lg={3}
                    key={p.id}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <motion.div
                      variants={fadeInUp}
                      whileHover="hover"
                      animate="visible"
                      custom={index}
                      onHoverStart={() => setHoveredProduct(p.id)}
                      onHoverEnd={() => setHoveredProduct(null)}
                      style={{ width: "100%" }}
                    >
                      <Card
                        onClick={() => handleProductClick(p)}
                        sx={{
                          width: "100%",
                          transition: "all 0.3s ease",
                          borderRadius: "20px",
                          border: `1px solid ${colors.lightGray}`,
                          background: colors.white,
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            transform: { xs: "none", sm: "translateY(-8px)" },
                            boxShadow: {
                              sm: `0 20px 40px ${alpha(colors.primary, 0.15)}`,
                            },
                            borderColor: { sm: colors.primary },
                          },
                        }}
                      >
                        {/* Product Badge */}
                        {productType === "new" && (
                          <Zoom in>
                            <Chip
                              icon={<NewIcon sx={{ fontSize: 14 }} />}
                              label="New"
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                                bgcolor: colors.success,
                                color: colors.white,
                                fontWeight: 600,
                                zIndex: 1,
                              }}
                            />
                          </Zoom>
                        )}

                        {/* Enhanced Product Image - Larger Size */}
                        <Box
                          sx={{
                            position: "relative",
                            height: { xs: 180, sm: 220, md: 240 },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: category.bgColor,
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            animate={{
                              scale: hoveredProduct === p.id ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {!imageErrors[p.id] && p.image_url ? (
                              <Box
                                component="img"
                                src={p.image_url}
                                alt={productName}
                                onError={() => handleImageError(p.id)}
                                sx={{
                                  maxWidth: "90%",
                                  maxHeight: "90%",
                                  objectFit: "contain",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            ) : (
                              <Box sx={{ textAlign: "center" }}>
                                <InventoryIcon
                                  sx={{
                                    fontSize: { xs: 56, sm: 72 },
                                    color: colors.primary,
                                    opacity: 0.6,
                                  }}
                                />
                              </Box>
                            )}
                          </motion.div>

                          {/* Category Chip */}
                          <Chip
                            label={
                              <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                              >
                                <span>{category.icon}</span>
                                <span>{category.label}</span>
                              </Stack>
                            }
                            size="small"
                            sx={{
                              position: "absolute",
                              bottom: 12,
                              right: 12,
                              bgcolor: alpha(colors.white, 0.95),
                              color: category.color,
                              fontWeight: 600,
                              backdropFilter: "blur(4px)",
                            }}
                          />
                        </Box>

                        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                          {/* Brand */}
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.primary,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              display: "block",
                              textAlign: "center",
                            }}
                          >
                            {productBrand || "Premium"}
                          </Typography>

                          {/* Product Name */}
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                              color: colors.dark,
                              mt: 0.5,
                              mb: 1,
                              lineHeight: 1.3,
                              textAlign: "center",
                            }}
                          >
                            {productName}
                          </Typography>

                          {/* Price and Stock */}
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="baseline"
                            sx={{ mb: 1.5 }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                color: colors.primary,
                                fontWeight: 800,
                                fontSize: { xs: "1rem", sm: "1.1rem" },
                              }}
                            >
                              {productPrice}
                            </Typography>
                            <Chip
                              label={`${stockQuantity} left`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.65rem",
                                bgcolor:
                                  stockQuantity > 10
                                    ? alpha(colors.success, 0.1)
                                    : stockQuantity > 0
                                      ? alpha(colors.warning, 0.1)
                                      : alpha(colors.error, 0.1),
                                color:
                                  stockQuantity > 10
                                    ? colors.success
                                    : stockQuantity > 0
                                      ? colors.warning
                                      : colors.error,
                                fontWeight: 600,
                              }}
                            />
                          </Stack>

                          {/* Centered Action Buttons */}
                          <Stack spacing={1}>
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                            >
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ flex: 1 }}
                              >
                                <Button
                                  fullWidth
                                  variant="contained"
                                  size="small"
                                  onClick={(e) => handleBuyNow(p, e)}
                                  disabled={stockQuantity === 0}
                                  sx={{
                                    background: colors.gradient,
                                    borderRadius: "12px",
                                    py: 0.8,
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    "&:hover": {
                                      background: colors.secondary,
                                    },
                                  }}
                                >
                                  Buy Now
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <IconButton
                                  onClick={(e) => handleAddToCart(p, e)}
                                  disabled={stockQuantity === 0}
                                  sx={{
                                    bgcolor: alpha(colors.primary, 0.1),
                                    color: colors.primary,
                                    borderRadius: "12px",
                                    "&:hover": {
                                      bgcolor: colors.primary,
                                      color: colors.white,
                                    },
                                  }}
                                >
                                  <ShoppingCartIcon fontSize="small" />
                                </IconButton>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <IconButton
                                  onClick={(e) => handleWhatsApp(p, e)}
                                  sx={{
                                    bgcolor: alpha("#25D366", 0.1),
                                    color: "#25D366",
                                    borderRadius: "12px",
                                    "&:hover": {
                                      bgcolor: "#25D366",
                                      color: colors.white,
                                    },
                                  }}
                                >
                                  <WhatsAppIcon fontSize="small" />
                                </IconButton>
                              </motion.div>
                            </Stack>
                          </Stack>
                        </CardContent>

                        {/* Add to Cart Success Animation */}
                        <AnimatePresence>
                          {addedToCart[p.id] && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              style={{
                                position: "absolute",
                                bottom: 80,
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 10,
                              }}
                            >
                              <Chip
                                icon={<ShoppingCartIcon />}
                                label="Added to cart!"
                                sx={{
                                  bgcolor: colors.success,
                                  color: colors.white,
                                  fontWeight: 600,
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: { xs: 4, sm: 6 },
                textAlign: "center",
                borderRadius: "24px",
                bgcolor: colors.white,
                maxWidth: 500,
                mx: "auto",
                mt: 4,
              }}
            >
              <InventoryIcon
                sx={{ fontSize: { xs: 48, sm: 64 }, color: colors.gray, mb: 2 }}
              />
              <Typography variant="h6" color={colors.dark} gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color={colors.gray} sx={{ mb: 3 }}>
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="contained"
                onClick={handleClearFilters}
                sx={{
                  background: colors.gradient,
                  borderRadius: "50px",
                  px: 4,
                  py: 1,
                }}
              >
                Clear Filters
              </Button>
            </Paper>
          </motion.div>
        )}

        {/* Centered Pagination */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: { xs: 4, sm: 6 },
                mb: { xs: 8, sm: 4 },
              }}
            >
              <Pagination
                count={Math.ceil(filteredProducts.length / itemsPerPage)}
                page={page}
                onChange={(e, v) => setPage(v)}
                color="primary"
                size={isMobile ? "medium" : "large"}
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "12px",
                    fontWeight: 600,
                    "&.Mui-selected": {
                      background: colors.gradient,
                      color: colors.white,
                      "&:hover": {
                        background: colors.secondary,
                      },
                    },
                  },
                }}
              />
            </Box>
          </motion.div>
        )}

        {/* Centered Mobile Back Button */}
        {isMobile && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Fab
              variant="extended"
              onClick={handleBackToHome}
              sx={{
                position: "fixed",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                background: colors.gradient,
                color: colors.white,
                boxShadow: `0 4px 15px ${alpha(colors.primary, 0.4)}`,
                "&:hover": {
                  background: colors.secondary,
                },
              }}
            >
              <HomeIcon sx={{ mr: 1 }} />
              Home
            </Fab>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default PublicProducts;
