import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  Grid,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  WhatsApp as WhatsAppIcon,
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ShoppingCart as ShoppingCartIcon, 
  Share as ShareIcon,
  FavoriteBorder as FavoriteIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  SupportAgent as SupportIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const colors = {
  primary: "#FF8500",
  primaryGradient: "linear-gradient(135deg, #FF8500 0%, #FFB347 100%)",
  dark: "#1E1A3A",
  light: "#F8F9FF",
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  success: "#10B981",
  glass: "rgba(255, 255, 255, 0.95)",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
};

const DEFAULT_IMAGE =
  "https://placehold.co/600x600/FF8500/FFFFFF?text=Product+Image";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { addToCart } = useCart();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  const [images, setImages] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      const products = response.data.data || [];
      const found = products.find(
        (p) =>
          p.slug === slug ||
          p.id === parseInt(slug) ||
          p.name?.toLowerCase().replace(/\s+/g, "-") === slug,
      );

      if (found) {
        let imagesArray = [];
        if (found.images) {
          if (typeof found.images === "string") {
            try {
              imagesArray = JSON.parse(found.images);
            } catch (e) {
              imagesArray = [];
            }
          } else if (Array.isArray(found.images)) {
            imagesArray = found.images;
          }
        }
        if (imagesArray.length === 0 && found.image_url)
          imagesArray = [found.image_url];
        const validImages = imagesArray.filter(
          (img) => img && typeof img === "string" && img.trim() !== "",
        );
        setImages(validImages);
        setProduct(found);
      } else {
        setError("Product not found");
      }
    } catch (error) {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () =>
    images.length > 1 && setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    images.length > 1 &&
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const currentImage = images[currentIndex] || DEFAULT_IMAGE;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Chala Mobile!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: colors.light,
          minHeight: "100vh",
          py: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Skeleton width={200} height={30} />
          </Box>
          <Grid container spacing={isMobile ? 2 : 5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton
                variant="rectangular"
                height={isMobile ? 300 : 500}
                sx={{ borderRadius: 4 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton width="80%" height={40} sx={{ mb: 2 }} />
              <Skeleton width="60%" height={30} sx={{ mb: 2 }} />
              <Skeleton width="40%" height={50} sx={{ mb: 2 }} />
              <Skeleton width="100%" height={100} sx={{ mb: 2 }} />
              <Skeleton width="100%" height={50} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box
        sx={{
          bgcolor: colors.light,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: "center",
                borderRadius: 4,
                background: colors.white,
              }}
            >
              <Box sx={{ fontSize: "4rem", mb: 2 }}>🔍</Box>
              <Typography
                variant="h4"
                fontWeight="800"
                color={colors.dark}
                gutterBottom
              >
                Oops!
              </Typography>
              <Typography variant="body1" color={colors.gray} sx={{ mb: 4 }}>
                {error || "Product not found."}
              </Typography>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/products")}
                sx={{
                  background: colors.gradient,
                  borderRadius: "50px",
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                }}
              >
                Back to Products
              </Button>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
  }

  const inStock = product.stock_quantity > 0;
  const lowStock = product.stock_quantity <= 5 && inStock;

  return (
    <Box
      sx={{ bgcolor: colors.light, minHeight: "100vh", py: { xs: 2, md: 6 } }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header with Back Button */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: { xs: 2, md: 4 } }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: colors.white,
              borderRadius: "12px",
              border: `1px solid ${colors.lightGray}`,
              "&:hover": {
                bgcolor: colors.primary,
                color: colors.white,
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={handleShare}
              sx={{
                bgcolor: colors.white,
                borderRadius: "12px",
                border: `1px solid ${colors.lightGray}`,
              }}
            >
              <ShareIcon />
            </IconButton>
            <IconButton
              onClick={() => setIsFavorited(!isFavorited)}
              sx={{
                bgcolor: colors.white,
                borderRadius: "12px",
                border: `1px solid ${colors.lightGray}`,
                color: isFavorited ? colors.primary : colors.gray,
              }}
            >
              <FavoriteIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Breadcrumbs */}
        <Breadcrumbs
          sx={{
            mb: { xs: 2, md: 3 },
            "& .MuiTypography-root": {
              fontWeight: 500,
              fontSize: { xs: "0.7rem", md: "0.875rem" },
            },
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer", "&:hover": { color: colors.primary } }}
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/products")}
            sx={{ cursor: "pointer", "&:hover": { color: colors.primary } }}
          >
            Products
          </Link>
          <Typography color={colors.primary} fontWeight="700">
            {product.name}
          </Typography>
        </Breadcrumbs>

        {/* Success Alert */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: "16px",
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                  bgcolor: alpha(colors.success, 0.1),
                  color: colors.success,
                }}
                onClose={() => setShowSuccess(false)}
                icon={<CheckCircleIcon />}
              >
                Added to cart!{" "}
                <Link
                  onClick={() => navigate("/cart")}
                  sx={{
                    cursor: "pointer",
                    ml: 1,
                    color: colors.primary,
                    fontWeight: 600,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  View Cart →
                </Link>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Grid container spacing={isMobile ? 3 : 5}>
          {/* Image Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: { md: "sticky" }, top: 20 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: { xs: 3, md: 4 },
                  overflow: "hidden",
                  bgcolor: colors.white,
                  border: `1px solid ${colors.lightGray}`,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 280, sm: 400, md: 450 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: colors.light,
                  }}
                >
                  {!imageLoaded && (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                      sx={{ position: "absolute" }}
                    />
                  )}
                  <motion.img
                    src={currentImage}
                    alt={product.name}
                    onLoad={() => setImageLoaded(true)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: imageLoaded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      maxWidth: "85%",
                      maxHeight: "85%",
                      objectFit: "contain",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setLightboxImage(currentImage);
                      setLightboxOpen(true);
                    }}
                  />

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <IconButton
                        onClick={prevImage}
                        sx={{
                          position: "absolute",
                          left: 12,
                          bgcolor: alpha(colors.white, 0.9),
                          backdropFilter: "blur(4px)",
                          "&:hover": { bgcolor: colors.white },
                        }}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                      <IconButton
                        onClick={nextImage}
                        sx={{
                          position: "absolute",
                          right: 12,
                          bgcolor: alpha(colors.white, 0.9),
                          backdropFilter: "blur(4px)",
                          "&:hover": { bgcolor: colors.white },
                        }}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </>
                  )}

                  {/* Zoom Button */}
                  <IconButton
                    onClick={() => {
                      setLightboxImage(currentImage);
                      setLightboxOpen(true);
                    }}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: alpha(colors.white, 0.9),
                      backdropFilter: "blur(4px)",
                      "&:hover": { bgcolor: colors.white },
                    }}
                  >
                    <ZoomInIcon />
                  </IconButton>

                  {/* Stock Badge */}
                  {lowStock && inStock && (
                    <Chip
                      label={`Only ${product.stock_quantity} left`}
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        bgcolor: colors.warning,
                        color: colors.white,
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      p: 2,
                      overflowX: "auto",
                      "&::-webkit-scrollbar": { height: 4 },
                      "&::-webkit-scrollbar-track": {
                        bgcolor: colors.lightGray,
                        borderRadius: 4,
                      },
                      "&::-webkit-scrollbar-thumb": {
                        bgcolor: colors.primary,
                        borderRadius: 4,
                      },
                    }}
                  >
                    {images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Box
                          onClick={() => setCurrentIndex(idx)}
                          sx={{
                            flexShrink: 0,
                            width: { xs: 60, md: 80 },
                            height: { xs: 60, md: 80 },
                            cursor: "pointer",
                            border:
                              currentIndex === idx
                                ? `2px solid ${colors.primary}`
                                : `2px solid transparent`,
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: colors.light,
                          }}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{ pl: { md: 2 } }}>
                {/* Brand & Category */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={product.brand || "Premium"}
                    size="small"
                    sx={{
                      bgcolor: alpha(colors.primary, 0.1),
                      color: colors.primary,
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={product.type === "new" ? "New Arrival" : "Pre-owned"}
                    size="small"
                    sx={{
                      bgcolor: alpha(colors.success, 0.1),
                      color: colors.success,
                      fontWeight: 600,
                    }}
                  />
                </Stack>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    color: colors.dark,
                    fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                    lineHeight: 1.3,
                  }}
                >
                  {product.name}
                </Typography>

                {/* Price */}
                <Stack
                  direction="row"
                  alignItems="baseline"
                  spacing={1}
                  sx={{ mb: 2 }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      color: colors.primary,
                      fontWeight: 800,
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    }}
                  >
                    ETB {product.price?.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color={colors.gray}>
                    Inc. VAT
                  </Typography>
                </Stack>

                {/* Stock Status */}
                <Box sx={{ mb: 3 }}>
                  <Chip
                    icon={inStock ? <CheckCircleIcon /> : null}
                    label={
                      !inStock
                        ? "Out of Stock"
                        : lowStock
                          ? `Only ${product.stock_quantity} left!`
                          : "In Stock"
                    }
                    sx={{
                      borderRadius: "12px",
                      fontWeight: 700,
                      bgcolor: !inStock
                        ? alpha("#EF4444", 0.1)
                        : lowStock
                          ? alpha("#F59E0B", 0.1)
                          : alpha(colors.success, 0.1),
                      color: !inStock
                        ? "#EF4444"
                        : lowStock
                          ? "#F59E0B"
                          : colors.success,
                    }}
                  />
                </Box>

                {/* Quantity Selector */}
                {inStock && (
                  <Box
                    sx={{
                      bgcolor: colors.white,
                      p: 2,
                      borderRadius: 3,
                      mb: 3,
                      border: `1px solid ${colors.lightGray}`,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="body2"
                        fontWeight="700"
                        color={colors.gray}
                      >
                        Quantity
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          sx={{
                            bgcolor: colors.light,
                            "&:hover": { bgcolor: colors.lightGray },
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{
                            px: 2,
                            minWidth: 40,
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                          }}
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
                          sx={{
                            bgcolor: colors.light,
                            "&:hover": { bgcolor: colors.lightGray },
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                )}
                {/* Action Buttons */}
                <Stack spacing={2} sx={{ mb: 4 }}>
                  {inStock && (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<CartIcon />}
                          onClick={() => {
                            addToCart(product, quantity);
                            setShowSuccess(true);
                            setTimeout(() => setShowSuccess(false), 3000);
                          }}
                          sx={{
                            py: 1.5,
                            borderRadius: "16px",
                            background: colors.gradient,
                            fontWeight: 700,
                            fontSize: "1rem",
                            "&:hover": {
                              background: colors.primaryDark,
                            },
                          }}
                        >
                          Add to Cart
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() =>
                            navigate(`/checkout/${product.id}`, {
                              state: { product, quantity },
                            })
                          }
                          sx={{
                            py: 1.2,
                            borderRadius: "16px",
                            borderColor: colors.primary,
                            color: colors.primary,
                            fontWeight: 700,
                            "&:hover": {
                              borderColor: colors.secondary,
                              bgcolor: alpha(colors.primary, 0.05),
                            },
                          }}
                        >
                          Buy Now
                        </Button>
                      </motion.div>
                    </>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<WhatsAppIcon />}
                      onClick={() =>
                        window.open(
                          `https://wa.me/251982310974?text=Hello! I'm interested in ${product.name} at Chala Mobile.`,
                          "_blank",
                        )
                      }
                      sx={{
                        py: 1.2,
                        borderRadius: "16px",
                        borderColor: "#25D366",
                        color: "#25D366",
                        fontWeight: 700,
                        "&:hover": {
                          borderColor: "#128C7E",
                          bgcolor: alpha("#25D366", 0.05),
                        },
                      }}
                    >
                      Chat on WhatsApp
                    </Button>
                  </motion.div>
                </Stack>

                {/* Features */}
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ShippingIcon
                        sx={{ color: colors.primary, fontSize: 20 }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color={colors.gray}
                      >
                        Free delivery in Shashemene
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <VerifiedIcon
                        sx={{ color: colors.primary, fontSize: 20 }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color={colors.gray}
                      >
                        100% Genuine Products
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <SecurityIcon
                        sx={{ color: colors.primary, fontSize: 20 }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color={colors.gray}
                      >
                        1 Year Warranty
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <SupportIcon
                        sx={{ color: colors.primary, fontSize: 20 }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color={colors.gray}
                      >
                        24/7 Support
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Paper
            elevation={0}
            sx={{
              mt: 5,
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              bgcolor: colors.white,
              border: `1px solid ${colors.lightGray}`,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                color: colors.dark,
              }}
            >
              Product Details
            </Typography>
            <Typography
              color={colors.gray}
              sx={{
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              {product.description ||
                "No technical details provided. Please contact us for more information about this product."}
            </Typography>
          </Paper>
        </motion.div>
      </Container>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.95)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
            onClick={() => setLightboxOpen(false)}
          >
            <IconButton
              onClick={() => setLightboxOpen(false)}
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <motion.img
              src={lightboxImage}
              alt="Zoomed product"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ProductDetail;
