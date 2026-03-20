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
  TextField,
  Alert,
  Skeleton,
  Breadcrumbs,
  Link,
  Avatar,
  Card,
  CardContent,
  alpha,
  useMediaQuery,
  useTheme,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  WhatsApp as WhatsAppIcon,
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";

// Color scheme
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

// Mock product data for fallback
const mockProducts = {
  1: {
    id: 1,
    name: "iPhone 14 Pro",
    brand: "Apple",
    model: "iPhone 14 Pro",
    price: 1299,
    description:
      "The iPhone 14 Pro features a stunning Super Retina XDR display, ProMotion technology, and the powerful A16 Bionic chip. With a 48MP main camera, it captures incredible detail. Available in Deep Purple, Space Black, Silver, and Gold.",
    category: "phone",
    type: "new",
    stock_quantity: 5,
    image_url: "https://i.imgur.com/fRYR2yP.png",
    rating: 4.8,
    reviews: 128,
    warranty_months: 12,
    features: [
      "6.1-inch Super Retina XDR display",
      "A16 Bionic chip",
      "48MP Main camera",
      "Up to 23 hours video playback",
      "Dynamic Island",
      "Always-On display",
    ],
    specifications: {
      Display: "6.1-inch Super Retina XDR",
      Processor: "A16 Bionic",
      Camera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      Battery: "Up to 23 hours video playback",
      Charging: "MagSafe wireless charging",
      "Water Resistance": "IP68",
    },
  },
  2: {
    id: 2,
    name: "MacBook Pro 14",
    brand: "Apple",
    model: "MacBook Pro 14",
    price: 2499,
    description:
      "The MacBook Pro 14-inch delivers groundbreaking performance with the M2 Pro chip, 12-core CPU, and up to 19-core GPU. Perfect for professionals who need maximum power.",
    category: "laptop",
    type: "new",
    stock_quantity: 3,
    image_url: "https://i.imgur.com/Omysr24.jpeg",
    rating: 4.9,
    reviews: 89,
    warranty_months: 24,
    features: [
      "M2 Pro chip with 12-core CPU",
      "Up to 19-core GPU",
      "14-inch Liquid Retina XDR display",
      "Up to 18 hours battery life",
      "16GB unified memory",
      "512GB SSD storage",
    ],
    specifications: {
      Processor: "Apple M2 Pro",
      Memory: "16GB Unified Memory",
      Storage: "512GB SSD",
      Display: "14-inch Liquid Retina XDR",
      Battery: "Up to 18 hours",
      Ports: "HDMI, SDXC, Thunderbolt 4",
    },
  },
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
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [mainImage, setMainImage] = useState("");
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

      // Find product by slug or id
      const foundProduct = products.find(
        (p) =>
          p.slug === slug ||
          p.id === parseInt(slug) ||
          p.name?.toLowerCase().replace(/\s+/g, "-") === slug,
      );

      if (foundProduct) {
        setProduct(foundProduct);
        setMainImage(foundProduct.image_url);
      } else {
        // Use mock data for demo
        const mockId = parseInt(slug) || 1;
        if (mockProducts[mockId]) {
          setProduct(mockProducts[mockId]);
          setMainImage(mockProducts[mockId].image_url);
        } else {
          setError("Product not found");
        }
      }
    } catch (error) {
      console.error("Failed to load product:", error);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
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
    const msg = `Hello Chala Mobile, I'm interested in:%0A%0A*Product:* ${product?.name}%0A*Brand:* ${product?.brand} ${product?.model}%0A*Price:* ETB ${product?.price}%0A*Condition:* ${product?.type}%0A%0AI would like to know more about this product.`;
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
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
              <Box
                sx={{
                  height: { xs: 300, sm: 400 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: colors.light,
                  borderRadius: 2,
                }}
              >
                <Box
                  component="img"
                  src={mainImage || product.image_url}
                  alt={product.name}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
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
                  {product.model}
                </Typography>
              </Box>

              {/* Rating */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Rating
                  value={product.rating || 4.5}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  ({product.reviews || 0} reviews)
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
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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

              {/* Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, lineHeight: 1.6 }}
              >
                {product.description || "No description available."}
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

        {/* Tabs Section - Description, Specs, Reviews */}
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
            <Tab label="Reviews" />
            <Tab label="Warranty" />
          </Tabs>

          {/* Description Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Product Description
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {product.description ||
                  "No detailed description available for this product."}
              </Typography>

              {product.features && (
                <>
                  <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                    Key Features
                  </Typography>
                  <Grid container spacing={2}>
                    {product.features.map((feature, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CheckCircleIcon
                            sx={{ color: colors.success, fontSize: 18 }}
                          />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Box>
          </TabPanel>

          {/* Specifications Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Technical Specifications
              </Typography>
              <Grid container spacing={2}>
                {(
                  product.specifications || {
                    Brand: product.brand || "N/A",
                    Model: product.model || "N/A",
                    Condition: product.type === "new" ? "New" : "Pre-owned",
                    Warranty: `${product.warranty_months || 12} months`,
                    Stock:
                      product.stock_quantity > 0 ? "In Stock" : "Out of Stock",
                  }
                ).map((spec, key) => (
                  <Grid item xs={12} key={key}>
                    <Box
                      sx={{
                        display: "flex",
                        py: 1,
                        borderBottom: `1px solid ${colors.lightGray}`,
                      }}
                    >
                      <Typography
                        sx={{
                          width: { xs: "40%", sm: "30%" },
                          fontWeight: 500,
                        }}
                      >
                        {spec.label}
                      </Typography>
                      <Typography color="text.secondary">
                        {spec.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          {/* Reviews Tab */}
          <TabPanel value={tabValue} index={2}>
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
                  {product.rating || 4.5}
                </Typography>
                <Rating
                  value={product.rating || 4.5}
                  precision={0.5}
                  readOnly
                />
                <Typography variant="body2" color="text.secondary">
                  Based on {product.reviews || 0} reviews
                </Typography>
              </Box>
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No reviews yet. Be the first to review this product!
              </Typography>
            </Box>
          </TabPanel>

          {/* Warranty Tab */}
          <TabPanel value={tabValue} index={3}>
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

        {/* Related Products Section (Optional) */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            You Might Also Like
          </Typography>
          <Grid container spacing={2}>
            {/* Add related products here */}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetail;
