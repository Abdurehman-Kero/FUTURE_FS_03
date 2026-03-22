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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/api";
import { useCart } from "../context/CartContext";

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
const categoryConfig = {
  phone: {
    label: "Phones",
    color: "#FF8500",
    bgColor: "#FFF4E6",
    icon: "📱",
  },
  laptop: {
    label: "Laptops",
    color: "#4A90E2",
    bgColor: "#E8F0FE",
    icon: "💻",
  },
  tablet: {
    label: "Tablets",
    color: "#9C27B0",
    bgColor: "#F3E5F5",
    icon: "📟",
  },
  accessory: {
    label: "Accessories",
    color: "#10B981",
    bgColor: "#E8F5E9",
    icon: "🎧",
  },
};

// Default image for products without image
const DEFAULT_PRODUCT_IMAGE =
  "https://placehold.co/300x200/FF8500/FFFFFF?text=Product";

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
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const itemsPerPage = isMobile ? 6 : 12;

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

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: Show a quick snackbar notification
    // You can implement a snackbar later
  };

  // Safe filtering with null checks
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

  const handleWhatsApp = (product) => {
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

  const handleBuyNow = (product) => {
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

  // Mobile filter drawer
  const filterDrawer = (
    <Drawer
      anchor="bottom"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: "80vh",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Filter Products
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          placeholder="Search by product name or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <MenuItem key={key} value={key}>
                {config.icon} {config.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          onClick={handleClearFilters}
          sx={{ bgcolor: colors.primary, mb: 1 }}
        >
          Clear Filters
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setFilterDrawerOpen(false)}
        >
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );

  if (loading) {
    return (
      <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress sx={{ color: colors.primary }} />
            <Typography sx={{ mt: 2 }}>Loading products...</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="error" gutterBottom>
              Error: {error}
            </Typography>
            <Button
              variant="contained"
              onClick={loadProducts}
              sx={{ mt: 2, bgcolor: colors.primary }}
            >
              Retry
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{ bgcolor: colors.light, minHeight: "100vh", pb: { xs: 8, sm: 4 } }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Header - Mobile Optimized */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py: 2,
            position: "sticky",
            top: 0,
            bgcolor: colors.light,
            zIndex: 10,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={handleBackToHome}
              sx={{
                bgcolor: colors.white,
                border: `1px solid ${colors.lightGray}`,
                borderRadius: "12px",
                "&:hover": {
                  bgcolor: colors.primary,
                  color: colors.white,
                },
              }}
              size={isMobile ? "small" : "medium"}
            >
              <ArrowBackIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="h5" fontWeight="600" color={colors.dark}>
                Our Products
              </Typography>
              <Typography variant="caption" color={colors.gray}>
                Browse our collection
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* Cart Icon with Badge */}
            <IconButton
              onClick={() => navigate("/cart")}
              sx={{
                bgcolor: colors.white,
                border: `1px solid ${colors.lightGray}`,
                borderRadius: "12px",
                "&:hover": {
                  bgcolor: colors.primary,
                  color: colors.white,
                },
              }}
              size={isMobile ? "small" : "medium"}
            >
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon fontSize={isMobile ? "small" : "medium"} />
              </Badge>
            </IconButton>

            {/* Filter Button - Mobile Only */}
            {isMobile && (
              <IconButton
                onClick={() => setFilterDrawerOpen(true)}
                sx={{
                  bgcolor: colors.white,
                  border: `1px solid ${colors.lightGray}`,
                  borderRadius: "12px",
                }}
                size="small"
              >
                <FilterIcon />
              </IconButton>
            )}

            {/* Desktop Home Button */}
            {!isMobile && (
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={handleBackToHome}
                sx={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  borderRadius: "50px",
                  px: 3,
                  "&:hover": {
                    borderColor: colors.secondary,
                    color: colors.secondary,
                    bgcolor: alpha(colors.primary, 0.05),
                  },
                }}
              >
                Back to Home
              </Button>
            )}
          </Box>
        </Stack>

        {/* Mobile Title */}
        {isMobile && (
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.dark}
            sx={{ mb: 2 }}
          >
            Our Products
          </Typography>
        )}

        {/* Desktop Filters - Hidden on Mobile */}
        {!isMobile && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: "20px",
              border: `1px solid ${colors.lightGray}`,
            }}
          >
            <Grid container spacing={2}>
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
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: colors.primary,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <FormControl fullWidth size="medium">
                  <InputLabel sx={{ color: colors.gray }}>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                    sx={{
                      borderRadius: "12px",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary,
                      },
                    }}
                  >
                    <MenuItem value="all">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <span>📦</span>
                        <span>All Categories</span>
                      </Stack>
                    </MenuItem>
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <MenuItem key={key} value={key}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <span>{config.icon}</span>
                          <span>{config.label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Active Filters */}
            {searchTerm && (
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => setSearchTerm("")}
                  size="small"
                  sx={{
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    "& .MuiChip-deleteIcon": {
                      color: colors.primary,
                    },
                  }}
                />
              </Stack>
            )}
          </Paper>
        )}

        {/* Mobile Filter Drawer */}
        {filterDrawer}

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <Grid container spacing={isMobile ? 1.5 : 3}>
            {displayedProducts.map((p) => {
              if (!p) return null;

              const category = categoryConfig[p.category] || {
                label: p.category || "Other",
                color: colors.gray,
                bgColor: colors.lightGray,
                icon: "📦",
              };

              const stockQuantity = p.stock_quantity || 0;
              const productPrice = p.price
                ? `ETB ${p.price.toLocaleString()}`
                : "Price on request";
              const productType = p.type || "new";
              const productName = p.name || "Unnamed Product";
              const productBrand = p.brand || "";
              const productModel = p.model || "";

              return (
                <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={p.id}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      borderRadius: { xs: "16px", sm: "20px" },
                      border: `1px solid ${colors.lightGray}`,
                      boxShadow: "none",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      "&:hover": {
                        transform: { xs: "none", sm: "translateY(-8px)" },
                        boxShadow: {
                          sm: `0 20px 40px ${alpha(colors.primary, 0.15)}`,
                        },
                        borderColor: { sm: colors.primary },
                      },
                    }}
                    onClick={() => navigate(`/product/${p.slug || p.id}`)} // 👈 Make entire card clickable
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 }, flex: 1 }}>
                      {/* Product Image */}
                      <Box
                        sx={{
                          height: { xs: 120, sm: 160 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1.5,
                          bgcolor: category.bgColor,
                          borderRadius: { xs: "10px", sm: "12px" },
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {!imageErrors[p.id] && p.image_url ? (
                          <Box
                            component="img"
                            src={p.image_url}
                            alt={productName}
                            onError={() => handleImageError(p.id)}
                            sx={{
                              maxWidth: "80%",
                              maxHeight: "80%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <Box sx={{ textAlign: "center" }}>
                            <InventoryIcon
                              sx={{
                                fontSize: { xs: 32, sm: 48 },
                                color: colors.primary,
                              }}
                            />
                          </Box>
                        )}
                        <Chip
                          label={category.label}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: { xs: 4, sm: 8 },
                            right: { xs: 4, sm: 8 },
                            bgcolor: colors.white,
                            color: category.color,
                            fontWeight: 500,
                            fontSize: { xs: "0.6rem", sm: "0.7rem" },
                            height: { xs: 18, sm: 20 },
                          }}
                        />
                      </Box>

                      {/* Product Details */}
                      <Box sx={{ mb: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.gray,
                            fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          }}
                        >
                          {productBrand || "Unknown"}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            fontWeight: 600,
                            color: colors.dark,
                            mb: 0.5,
                          }}
                          noWrap
                        >
                          {productName}
                        </Typography>
                        <Chip
                          label={productType}
                          size="small"
                          sx={{
                            height: { xs: 16, sm: 20 },
                            fontSize: { xs: "0.55rem", sm: "0.65rem" },
                            bgcolor:
                              productType === "new"
                                ? alpha(colors.success, 0.1)
                                : alpha(colors.primary, 0.1),
                            color:
                              productType === "new"
                                ? colors.success
                                : colors.primary,
                          }}
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
                          variant="subtitle2"
                          sx={{
                            color: colors.primary,
                            fontWeight: 700,
                            fontSize: { xs: "0.85rem", sm: "1rem" },
                          }}
                        >
                          {productPrice}
                        </Typography>
                        <Chip
                          label={`${stockQuantity}`}
                          size="small"
                          sx={{
                            height: { xs: 16, sm: 20 },
                            fontSize: { xs: "0.55rem", sm: "0.65rem" },
                            bgcolor:
                              stockQuantity > 5
                                ? alpha(colors.success, 0.1)
                                : stockQuantity > 0
                                  ? alpha(colors.primary, 0.1)
                                  : alpha("#f44336", 0.1),
                            color:
                              stockQuantity > 5
                                ? colors.success
                                : stockQuantity > 0
                                  ? colors.primary
                                  : "#f44336",
                          }}
                        />
                      </Box>
                    </CardContent>

                    {/* Action Buttons */}
                    <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
                      {stockQuantity > 0 ? (
                        <>
                          {/* Add to Cart Button - Mobile Optimized */}
                          <Button
                            fullWidth
                            variant="outlined"
                            size={isMobile ? "small" : "medium"}
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => handleAddToCart(p)}
                            sx={{
                              mb: 1,
                              borderColor: colors.primary,
                              color: colors.primary,
                              borderRadius: "10px",
                              py: { xs: 0.8, sm: 1 },
                              fontSize: { xs: "0.7rem", sm: "0.85rem" },
                              "&:hover": {
                                bgcolor: alpha(colors.primary, 0.1),
                              },
                            }}
                          >
                            Add
                          </Button>

                          {/* Buy Now Button */}
                          <Button
                            fullWidth
                            variant="contained"
                            size={isMobile ? "small" : "medium"}
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => handleBuyNow(p)}
                            sx={{
                              mb: 1,
                              bgcolor: colors.primary,
                              color: colors.white,
                              borderRadius: "10px",
                              py: { xs: 0.8, sm: 1 },
                              fontSize: { xs: "0.7rem", sm: "0.85rem" },
                              "&:hover": { bgcolor: colors.secondary },
                            }}
                          >
                            Buy
                          </Button>

                          {/* WhatsApp Button - Icon only on mobile */}
                          {isMobile ? (
                            <IconButton
                              // fullWidth
                              onClick={() => handleWhatsApp(p)}
                              sx={{
                                bgcolor: alpha("#25D366", 0.1),
                                color: "#25D366",
                                borderRadius: "10px",
                                width: "100%",
                              }}
                              size="small"
                            >
                              <WhatsAppIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <Button
                              fullWidth
                              variant="outlined"
                              size="small"
                              startIcon={<WhatsAppIcon />}
                              onClick={() => handleWhatsApp(p)}
                              sx={{
                                borderColor: "#25D366",
                                color: "#25D366",
                                borderRadius: "10px",
                                py: 0.8,
                                fontSize: "0.75rem",
                                "&:hover": {
                                  bgcolor: alpha("#25D366", 0.1),
                                },
                              }}
                            >
                              Inquire
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          disabled
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            borderRadius: "10px",
                            py: { xs: 0.8, sm: 1 },
                            fontSize: { xs: "0.7rem", sm: "0.85rem" },
                          }}
                        >
                          Out of Stock
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Paper
            sx={{
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              borderRadius: "20px",
              bgcolor: colors.white,
            }}
          >
            <InventoryIcon
              sx={{ fontSize: { xs: 40, sm: 60 }, color: colors.gray, mb: 2 }}
            />
            <Typography variant="h6" color={colors.gray} gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color={colors.gray}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{
                mt: 2,
                borderColor: colors.primary,
                color: colors.primary,
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 4, sm: 6 },
              mb: 2,
            }}
          >
            <Pagination
              count={Math.ceil(filteredProducts.length / itemsPerPage)}
              page={page}
              onChange={(e, v) => setPage(v)}
              color="primary"
              size={isMobile ? "small" : "medium"}
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "8px",
                  "&.Mui-selected": {
                    bgcolor: colors.primary,
                    color: colors.white,
                  },
                },
              }}
            />
          </Box>
        )}

        {/* Mobile Back Button - Fixed at bottom */}
        {isMobile && (
          <Fab
            variant="extended"
            size="small"
            onClick={handleBackToHome}
            sx={{
              position: "fixed",
              bottom: 16,
              left: 16,
              bgcolor: colors.white,
              color: colors.primary,
              border: `1px solid ${colors.primary}`,
              boxShadow: 2,
              display: { xs: "flex", sm: "none" },
              zIndex: 100,
            }}
          >
            <HomeIcon sx={{ mr: 1, fontSize: 18 }} />
            Home
          </Fab>
        )}
      </Container>
    </Box>
  );
};

export default PublicProducts;
