import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  Rating,
  Stack,
  IconButton,
  Alert,
  Skeleton,
  Breadcrumbs,
  Link,
  alpha,
  useMediaQuery,
  useTheme,
  Tab,
  Tabs,
  Avatar,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  WhatsApp as WhatsAppIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";

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
};

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const ProductDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [mainImage, setMainImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts();
      const products = response.data.data || [];

      const foundProduct = products.find(
        (p) =>
          p.slug === slug ||
          p.id === parseInt(slug) ||
          p.name?.toLowerCase().replace(/\s+/g, "-") === slug,
      );

      if (foundProduct) {
        // Parse JSON fields
        if (foundProduct.images && typeof foundProduct.images === "string") {
          foundProduct.images = JSON.parse(foundProduct.images);
        }
        if (
          foundProduct.features &&
          typeof foundProduct.features === "string"
        ) {
          foundProduct.features = JSON.parse(foundProduct.features);
        }
        if (
          foundProduct.specifications &&
          typeof foundProduct.specifications === "string"
        ) {
          foundProduct.specifications = JSON.parse(foundProduct.specifications);
        }
        if (
          foundProduct.dimensions &&
          typeof foundProduct.dimensions === "string"
        ) {
          foundProduct.dimensions = JSON.parse(foundProduct.dimensions);
        }

        setProduct(foundProduct);
        const allImages = [
          foundProduct.image_url,
          ...(foundProduct.images || []),
        ].filter(Boolean);
        setMainImage(allImages[0] || foundProduct.image_url);
      } else {
        setError("Product not found");
      }
    } catch (error) {
      console.error("Failed to load product:", error);
      setError("Failed to load product details");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const allImages = product
    ? [product.image_url, ...(product.images || [])].filter(Boolean)
    : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    setMainImage(allImages[(currentImageIndex + 1) % allImages.length]);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
    setMainImage(
      allImages[(currentImageIndex - 1 + allImages.length) % allImages.length],
    );
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    navigate(`/checkout/${product.slug || product.id}`, {
      state: { product: { ...product, quantity } },
    });
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const msg = `Hello Chala Mobile, I'm interested in:%0A%0A*Product:* ${product.name}%0A*Brand:* ${product.brand} ${product.model}%0A*Price:* ETB ${product.price}%0A*Condition:* ${product.type}%0A%0AI would like to know more about this product.`;
    window.open(
      `https://wa.me/251982310974?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const inCart = product ? isInCart(product.id) : false;
  const itemQuantity = product ? getItemQuantity(product.id) : 0;

  if (loading) {
    return (
      <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={60} />
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={100} />
              <Skeleton variant="rectangular" height={120} sx={{ mt: 2 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h5" color="error" gutterBottom>
              {error || "Product Not Found"}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              The product you're looking for doesn't exist or has been removed.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/products")}
              sx={{ bgcolor: colors.primary }}
            >
              Back to Products
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const stockAvailable = product.stock_quantity > 0;
  const lowStock = product.stock_quantity <= 5 && product.stock_quantity > 0;
  const outOfStock = product.stock_quantity === 0;

  return (
    <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            Home
          </Link>
          <Link
            color="inherit"
            onClick={() => navigate("/products")}
            sx={{ cursor: "pointer" }}
          >
            Products
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        {/* Success Alert */}
        {showSuccess && (
          <Alert
            severity="success"
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setShowSuccess(false)}
          >
            Added to cart!{" "}
            <Link
              onClick={() => navigate("/cart")}
              sx={{ cursor: "pointer", fontWeight: 600 }}
            >
              View Cart
            </Link>
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Left Column - Images */}
          <Grid item xs={12} md={6}>            {/* Images Gallery */}
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              {/* Main Image */}
              <Box
                sx={{
                  height: { xs: 300, sm: 400 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: colors.light,
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                {allImages.length > 1 && (
                  <>
                    <IconButton
                      onClick={prevImage}
                      sx={{
                        position: "absolute",
                        left: 8,
                        bgcolor: "rgba(255,255,255,0.8)",
                        "&:hover": { bgcolor: "white" },
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      onClick={nextImage}
                      sx={{
                        position: "absolute",
                        right: 8,
                        bgcolor: "rgba(255,255,255,0.8)",
                        "&:hover": { bgcolor: "white" },
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </>
                )}
                <Box
                  component="img"
                  src={mainImage || product.image_url}
                  alt={product.name}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x400/FF8500/FFFFFF?text=Product";
                  }}
                />
              </Box>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 2,
                    overflowX: "auto",
                    pb: 1,
                  }}
                >
                  {allImages.map((img, idx) => (
                    <Avatar
                      key={idx}
                      src={img}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setMainImage(img);
                      }}
                      variant="rounded"
                      sx={{
                        width: 60,
                        height: 60,
                        cursor: "pointer",
                        border:
                          currentImageIndex === idx
                            ? `2px solid ${colors.primary}`
                            : "none",
                        opacity: currentImageIndex === idx ? 1 : 0.6,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Product Info */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
              {/* Title & Brand */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color={colors.primary}
                  sx={{ mb: 1, display: "block" }}
                >
                  {product.brand || "Brand"}
                </Typography>
                <Typography variant="h4" fontWeight="600" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.model} {product.sku && `• SKU: ${product.sku}`}
                </Typography>
              </Box>

              {/* Rating */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Rating
                  value={product.rating || 0}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  ({product.reviews_count || 0} reviews)
                </Typography>
              </Box>

              {/* Price */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h3"
                  sx={{ color: colors.primary, fontWeight: 700 }}
                >
                  ETB {product.price?.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Inclusive of VAT
                </Typography>
              </Box>

              {/* Stock Status */}
              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                {outOfStock ? (
                  <Chip label="Out of Stock" color="error" size="small" />
                ) : lowStock ? (
                  <Chip
                    label={`Only ${product.stock_quantity} left`}
                    color="warning"
                    size="small"
                  />
                ) : (
                  <Chip
                    label="In Stock"
                    color="success"
                    size="small"
                    icon={<CheckCircleIcon />}
                  />
                )}
                <Chip
                  label={product.type === "new" ? "New" : "Pre-owned"}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`${product.warranty_months || 12} months warranty`}
                  size="small"
                  variant="outlined"
                />
              </Box>

              {/* Short Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, lineHeight: 1.6 }}
              >
                {product.short_description ||
                  product.description?.substring(0, 150) ||
                  "No description available."}
              </Typography>

              {/* Quantity Selector */}
              {stockAvailable && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
                >
                  <Typography variant="body2" fontWeight="500">
                    Quantity:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: `1px solid ${colors.lightGray}`,
                      borderRadius: 2,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      sx={{ px: 2, minWidth: 40, textAlign: "center" }}
                    >
                      {quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setQuantity(
                          Math.min(product.stock_quantity, quantity + 1),
                        )
                      }
                      disabled={quantity >= product.stock_quantity}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {inCart && (
                    <Chip
                      label={`${itemQuantity} in cart`}
                      size="small"
                      sx={{
                        bgcolor: alpha(colors.success, 0.1),
                        color: colors.success,
                      }}
                    />
                  )}
                </Box>
              )}

              {/* Action Buttons */}
              <Stack spacing={2}>
                {stockAvailable ? (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<CartIcon />}
                      onClick={handleAddToCart}
                      sx={{
                        bgcolor: colors.primary,
                        py: 1.5,
                        fontSize: "1rem",
                        "&:hover": { bgcolor: colors.secondary },
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      onClick={handleBuyNow}
                      sx={{
                        borderColor: colors.primary,
                        color: colors.primary,
                        py: 1.5,
                        fontSize: "1rem",
                        "&:hover": {
                          borderColor: colors.secondary,
                          color: colors.secondary,
                        },
                      }}
                    >
                      Buy Now
                    </Button>
                  </>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled
                    sx={{ py: 1.5 }}
                  >
                    Out of Stock
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<WhatsAppIcon />}
                  onClick={handleWhatsApp}
                  sx={{
                    borderColor: "#25D366",
                    color: "#25D366",
                    py: 1.5,
                    "&:hover": { bgcolor: alpha("#25D366", 0.1) },
                  }}
                >
                  Inquire via WhatsApp
                </Button>
              </Stack>

              {/* Delivery Info */}
              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ShippingIcon sx={{ color: colors.primary }} />
                  <Typography variant="body2">
                    Free delivery in Shashemene
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SecurityIcon sx={{ color: colors.primary }} />
                  <Typography variant="body2">1 Year Warranty</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <VerifiedIcon sx={{ color: colors.primary }} />
                  <Typography variant="body2">100% Genuine</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Paper sx={{ mt: 4, borderRadius: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              borderBottom: 1,
              borderColor: colors.lightGray,
              "& .MuiTab-root.Mui-selected": { color: colors.primary },
              "& .MuiTabs-indicator": { bgcolor: colors.primary },
            }}
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Features" />
            <Tab label="Reviews" />
            <Tab label="Warranty" />
          </Tabs>

          {/* Description Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Product Description
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}
              >
                {product.description ||
                  "No detailed description available for this product."}
              </Typography>
            </Box>
          </TabPanel>

          {/* Specifications Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Technical Specifications
              </Typography>
              <Table>
                <TableBody>
                  {Object.entries(product.specifications || {}).map(
                    ([key, value]) => (
                      <TableRow
                        key={key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontWeight: 600, width: "30%" }}
                        >
                          {key}
                        </TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ),
                  )}
                  {(!product.specifications ||
                    Object.keys(product.specifications).length === 0) && (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        No specifications available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </TabPanel>

          {/* Features Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Features
              </Typography>
              <Grid container spacing={2}>
                {(product.features && product.features.length > 0
                  ? product.features
                  : [
                      "High-quality build",
                      "Reliable performance",
                      "Latest technology",
                      "Energy efficient",
                    ]
                ).map((feature, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckCircleIcon
                        sx={{ color: colors.success, fontSize: 18 }}
                      />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          {/* Reviews Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Reviews
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Typography
                  variant="h2"
                  sx={{ color: colors.primary, fontWeight: 700 }}
                >
                  {product.rating || 0}
                </Typography>
                <Rating value={product.rating || 0} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  Based on {product.reviews_count || 0} reviews
                </Typography>
              </Box>
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No reviews yet. Be the first to review this product!
              </Typography>
            </Box>
          </TabPanel>

          {/* Warranty Tab */}
          <TabPanel value={tabValue} index={4}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Warranty Information
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 3, bgcolor: colors.light, borderRadius: 2 }}
              >
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  {product.warranty_months || 12} Month Warranty
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  This product comes with a {product.warranty_months || 12}
                  -month warranty against manufacturing defects.
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>What's covered:</strong> Manufacturing defects,
                  hardware failures, and software issues not caused by user
                  damage.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>What's not covered:</strong> Physical damage, water
                  damage, unauthorized repairs, and normal wear and tear.
                </Typography>
              </Paper>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProductDetail;
