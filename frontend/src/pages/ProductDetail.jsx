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
  useTheme, // Added this
  useMediaQuery, // Added this
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
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";

const colors = {
  primary: "#FF8500",
  primaryGradient: "linear-gradient(135deg, #FF8500 0%, #FFB347 100%)",
  dark: "#1E1A3A",
  light: "#F4F7FE",
  white: "#FFFFFF",
  gray: "#6B7280",
  success: "#10B981",
  glass: "rgba(255, 255, 255, 0.8)",
};

const DEFAULT_IMAGE =
  "https://placehold.co/600x600/FF8500/FFFFFF?text=Product+Image";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { addToCart } = useCart();

  // Define isMobile here to fix the ReferenceError
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  const [images, setImages] = useState([]);

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

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: colors.light,
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );

  if (error || !product)
    return (
      <Box
        sx={{
          bgcolor: colors.light,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="700"
              color="error"
              gutterBottom
            >
              Oops!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {error || "Product not found."}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/products")}
              sx={{ bgcolor: colors.dark, borderRadius: 2 }}
            >
              Back
            </Button>
          </Paper>
        </Container>
      </Box>
    );

  const inStock = product.stock_quantity > 0;
  const lowStock = product.stock_quantity <= 5 && inStock;

  return (
    <Box
      sx={{ bgcolor: colors.light, minHeight: "100vh", py: { xs: 2, md: 6 } }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs
          sx={{
            mb: { xs: 2, md: 4 },
            "& .MuiTypography-root": {
              fontWeight: 500,
              fontSize: { xs: "0.75rem", md: "0.875rem" },
            },
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/products")}
            sx={{ cursor: "pointer" }}
          >
            Products
          </Link>
          <Typography color="text.primary" fontWeight="700">
            {product.name}
          </Typography>
        </Breadcrumbs>

        <Fade in={showSuccess}>
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              fontSize: { xs: "0.8rem", md: "1rem" },
            }}
            onClose={() => setShowSuccess(false)}
          >
            Added!{" "}
            <Link
              onClick={() => navigate("/cart")}
              sx={{ cursor: "pointer", ml: 1, color: colors.success }}
            >
              View Cart
            </Link>
          </Alert>
        </Fade>

        <Grid container spacing={isMobile ? 2 : 5}>
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: { md: "sticky" }, top: 20 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 0,
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: "transparent",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 300, sm: 400, md: 500 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: colors.white,
                    borderRadius: { xs: 2, md: 4 },
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  {images.length > 1 && (
                    <>
                      <IconButton
                        onClick={prevImage}
                        sx={{
                          position: "absolute",
                          left: 10,
                          bgcolor: colors.glass,
                          zIndex: 2,
                        }}
                      >
                        <ChevronLeftIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={nextImage}
                        sx={{
                          position: "absolute",
                          right: 10,
                          bgcolor: colors.glass,
                          zIndex: 2,
                        }}
                      >
                        <ChevronRightIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    onClick={() => {
                      setLightboxImage(currentImage);
                      setLightboxOpen(true);
                    }}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: colors.glass,
                      zIndex: 2,
                    }}
                  >
                    <ZoomInIcon fontSize="small" />
                  </IconButton>
                  <img
                    src={currentImage}
                    alt={product.name}
                    style={{
                      maxWidth: "90%",
                      maxHeight: "90%",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                {images.length > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 2,
                      overflowX: "auto",
                      py: 1,
                      "::-webkit-scrollbar": { display: "none" },
                    }}
                  >
                    {images.map((img, idx) => (
                      <Box
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        sx={{
                          flexShrink: 0,
                          width: { xs: 60, md: 80 },
                          height: { xs: 60, md: 80 },
                          cursor: "pointer",
                          border:
                            currentIndex === idx
                              ? `2px solid ${colors.primary}`
                              : "2px solid transparent",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={img}
                          alt="thumb"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pl: { md: 2 } }}>
              <Typography
                variant="overline"
                sx={{
                  color: colors.primary,
                  fontWeight: 800,
                  fontSize: { xs: "0.65rem", md: "0.75rem" },
                }}
              >
                {product.brand || "PREMIUM"}
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mt: 0.5,
                  mb: 0.5,
                  color: colors.dark,
                  fontSize: { xs: "1.5rem", md: "2.5rem" },
                }}
              >
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 2,
                  fontSize: { xs: "0.8rem", md: "1rem" },
                }}
              >
                Model: {product.model || "N/A"}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: colors.dark,
                    fontWeight: 900,
                    fontSize: { xs: "1.75rem", md: "2.75rem" },
                  }}
                >
                  ETB {product.price?.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Inc. VAT
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <Chip
                  size="small"
                  label={
                    !inStock
                      ? "Out of Stock"
                      : lowStock
                        ? `Low Stock`
                        : "In Stock"
                  }
                  sx={{
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    bgcolor: !inStock
                      ? "#FEE2E2"
                      : lowStock
                        ? "#FEF3C7"
                        : "#D1FAE5",
                    color: !inStock
                      ? "#B91C1C"
                      : lowStock
                        ? "#B45309"
                        : "#047857",
                  }}
                />
                <Chip
                  size="small"
                  label={product.type === "new" ? "New" : "Used"}
                  variant="outlined"
                  sx={{
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                />
              </Box>

              {inStock && (
                <Box
                  sx={{
                    bgcolor: colors.white,
                    p: 1.5,
                    borderRadius: 3,
                    mb: 3,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 2,
                    border: "1px solid #eee",
                  }}
                >
                  <Typography variant="caption" fontWeight="800">
                    QTY
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: colors.light,
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
                      sx={{
                        px: 1,
                        minWidth: 30,
                        textAlign: "center",
                        fontWeight: 700,
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
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {inStock && (
                  <>
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
                        borderRadius: 3,
                        background: colors.primaryGradient,
                        fontWeight: 700,
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() =>
                        navigate(`/checkout/${product.id}`, {
                          state: { product, quantity },
                        })
                      }
                      sx={{
                        py: 1.2,
                        borderRadius: 3,
                        color: colors.dark,
                        borderColor: colors.dark,
                        fontWeight: 700,
                      }}
                    >
                      Buy Now
                    </Button>
                  </>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  onClick={() =>
                    window.open(
                      `https://wa.me/251982310974?text=Interested in ${product.name}`,
                      "_blank",
                    )
                  }
                  sx={{
                    py: 1.2,
                    borderRadius: 3,
                    bgcolor: "#25D366",
                    fontWeight: 700,
                  }}
                >
                  WhatsApp Expert
                </Button>
              </Box>

              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ShippingIcon
                      sx={{ color: colors.primary, fontSize: "1.2rem" }}
                    />
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                      Free delivery
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <VerifiedIcon
                      sx={{ color: colors.primary, fontSize: "1.2rem" }}
                    />
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                      100% Genuine
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: { xs: 2.5, md: 5 },
            borderRadius: 4,
            bgcolor: colors.white,
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "1.1rem", md: "1.5rem" },
            }}
          >
            Description
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              fontSize: { xs: "0.85rem", md: "1rem" },
            }}
          >
            {product.description || "No technical details provided."}
          </Typography>
        </Paper>

        {lightboxOpen && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.95)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
            onClick={() => setLightboxOpen(false)}
          >
            <IconButton
              onClick={() => setLightboxOpen(false)}
              sx={{ position: "absolute", top: 20, right: 20, color: "white" }}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={lightboxImage}
              alt="zoomed"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProductDetail;
