import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  Grid,
  Divider,
  Card,
  CardContent,
  Chip,
  TextField,
  Alert,
  useMediaQuery,
  useTheme,
  Stack,
  alpha,
  Fade,
  Slide,
  Avatar,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingBag as ShoppingBagIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingCart as CartIcon,
  WhatsApp as WhatsAppIcon,
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
  Security as SecurityIcon,
  CreditCard as CreditCardIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "@mui/material/Tooltip"; 


const colors = {
  primary: "#FF8500",
  primaryDark: "#E67600",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  light: "#F8F9FF",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  dark: "#1E1A3A",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
};

const Cart = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const {
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [removingItem, setRemovingItem] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (cart.length === 1) {
      const item = cart[0];
      navigate(`/checkout/${item.slug || item.id}`, {
        state: {
          product: {
            id: item.id,
            name: item.name,
            brand: item.brand,
            model: item.model,
            price: item.price,
            slug: item.slug,
            image_url: item.image,
            quantity: item.quantity,
          },
        },
      });
    } else {
      const firstItem = cart[0];
      navigate(`/checkout/${firstItem.slug || firstItem.id}`, {
        state: {
          product: {
            id: firstItem.id,
            name: firstItem.name,
            brand: firstItem.brand,
            model: firstItem.model,
            price: firstItem.price,
            slug: firstItem.slug,
            image_url: firstItem.image,
            quantity: firstItem.quantity,
          },
        },
      });
      alert(
        "Multi-item checkout coming soon! For now, we'll checkout with the first item.",
      );
    }
  };

  const handleWhatsAppInquiry = () => {
    let message = "Hello Chala Mobile, I'm interested in these items:%0A%0A";

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ${item.brand} ${item.model}%0A`;
      message += `   Quantity: ${item.quantity} x ETB ${item.price?.toLocaleString()}%0A%0A`;
    });

    message += `Total: ETB ${cartTotal.toLocaleString()}`;

    window.open(
      `https://wa.me/251982310974?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const handleRemoveItem = (itemId) => {
    setRemovingItem(itemId);
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItem(null);
    }, 300);
  };

  if (cart.length === 0) {
    return (
      <Box
        sx={{ bgcolor: colors.light, minHeight: "100vh", py: { xs: 4, md: 6 } }}
      >
        <Container maxWidth="lg">
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
                border: `1px solid ${colors.lightGray}`,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <ShoppingBagIcon
                  sx={{
                    fontSize: { xs: 60, md: 80 },
                    color: colors.gray,
                    mb: 2,
                  }}
                />
              </motion.div>
              <Typography
                variant="h4"
                fontWeight="800"
                color={colors.dark}
                gutterBottom
                sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
              >
                Your Cart is Empty
              </Typography>
              <Typography
                color={colors.gray}
                sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
              >
                Looks like you haven't added any items to your cart yet. Start
                shopping to find amazing deals!
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
                Continue Shopping
              </Button>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{ bgcolor: colors.light, minHeight: "100vh", py: { xs: 2, md: 4 } }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: { xs: 2, md: 4 } }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton
              onClick={() => navigate("/products")}
              sx={{
                bgcolor: colors.white,
                borderRadius: "12px",
                border: `1px solid ${colors.lightGray}`,
                "&:hover": { bgcolor: colors.primary, color: colors.white },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{
                background: colors.gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontSize: { xs: "1.3rem", sm: "1.8rem", md: "2rem" },
              }}
            >
              My Cart
            </Typography>
            <Chip
              label={`${cartCount} ${cartCount === 1 ? "item" : "items"}`}
              size="small"
              sx={{
                bgcolor: alpha(colors.primary, 0.1),
                color: colors.primary,
                fontWeight: 600,
              }}
            />
          </Stack>

          {!isMobile && cart.length > 0 && (
            <Button
              variant="text"
              onClick={() => setShowClearConfirm(true)}
              sx={{ color: colors.error }}
            >
              Clear Cart
            </Button>
          )}
        </Stack>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        border: `1px solid ${colors.lightGray}`,
                        boxShadow: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: `0 8px 30px ${alpha(colors.primary, 0.1)}`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Grid container spacing={2} alignItems="center">
                          {/* Product Image */}
                          <Grid size={{ xs: 3, sm: 2 }}>
                            <Box
                              sx={{
                                width: "100%",
                                height: { xs: 70, sm: 80 },
                                bgcolor: colors.light,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                              }}
                            >
                              {item.image ? (
                                <Box
                                  component="img"
                                  src={item.image}
                                  alt={item.name}
                                  sx={{
                                    maxWidth: "90%",
                                    maxHeight: "90%",
                                    objectFit: "contain",
                                  }}
                                />
                              ) : (
                                <ShoppingBagIcon
                                  sx={{ fontSize: 40, color: colors.gray }}
                                />
                              )}
                            </Box>
                          </Grid>

                          {/* Product Info */}
                          <Grid size={{ xs: 9, sm: 5 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="700"
                              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color={colors.gray}
                              display="block"
                            >
                              {item.brand} {item.model}
                            </Typography>
                            <Typography
                              variant="body2"
                              color={colors.primary}
                              fontWeight="600"
                              sx={{ mt: 0.5 }}
                            >
                              ETB {item.price?.toLocaleString()} each
                            </Typography>
                          </Grid>

                          {/* Quantity Controls */}
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: {
                                  xs: "flex-start",
                                  sm: "center",
                                },
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                sx={{
                                  bgcolor: colors.light,
                                  "&:hover": { bgcolor: colors.lightGray },
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography
                                sx={{
                                  mx: 1.5,
                                  minWidth: 40,
                                  textAlign: "center",
                                  fontWeight: 700,
                                  fontSize: { xs: "0.9rem", sm: "1rem" },
                                }}
                              >
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.maxStock}
                                sx={{
                                  bgcolor: colors.light,
                                  "&:hover": { bgcolor: colors.lightGray },
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>

                          {/* Price & Remove */}
                          <Grid size={{ xs: 4, sm: 1 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="700"
                              color={colors.primary}
                              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                            >
                              ETB{" "}
                              {(item.price * item.quantity).toLocaleString()}
                            </Typography>
                          </Grid>

                          <Grid size={{ xs: 2, sm: 1 }}>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveItem(item.id)}
                              sx={{
                                "&:hover": {
                                  bgcolor: alpha(colors.error, 0.1),
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Stack>

            {/* Mobile Clear Cart Button */}
            {isMobile && cart.length > 0 && (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={() => setShowClearConfirm(true)}
                sx={{ mt: 2, borderRadius: "12px" }}
              >
                Clear Cart
              </Button>
            )}
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  position: { md: "sticky" },
                  top: 20,
                  border: `1px solid ${colors.lightGray}`,
                  background: colors.white,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="800"
                  gutterBottom
                  sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
                >
                  Order Summary
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color={colors.gray}>Subtotal</Typography>
                    <Typography fontWeight="600">
                      ETB {cartTotal.toLocaleString()}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography color={colors.gray}>Shipping</Typography>
                    <Chip
                      label="Free"
                      size="small"
                      sx={{
                        bgcolor: alpha(colors.success, 0.1),
                        color: colors.success,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>

                  {cartTotal > 5000 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color={colors.gray}>Discount</Typography>
                      <Typography color={colors.success} fontWeight="600">
                        - ETB 200
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" fontWeight="800">
                    Total
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: colors.primary,
                      fontWeight: 800,
                      fontSize: { xs: "1.3rem", md: "1.5rem" },
                    }}
                  >
                    ETB {cartTotal.toLocaleString()}
                  </Typography>
                </Stack>

                {/* Free Shipping Threshold */}
                {cartTotal < 5000 && (
                  <Alert
                    severity="info"
                    icon={<ShippingIcon />}
                    sx={{
                      mb: 2,
                      borderRadius: "12px",
                      bgcolor: alpha(colors.primary, 0.05),
                    }}
                  >
                    Add ETB {(5000 - cartTotal).toLocaleString()} more for free
                    delivery!
                  </Alert>
                )}

                <Stack spacing={2}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<CreditCardIcon />}
                      onClick={handleCheckout}
                      sx={{
                        background: colors.gradient,
                        py: 1.5,
                        borderRadius: "16px",
                        fontWeight: 700,
                        "&:hover": {
                          background: colors.secondary,
                        },
                      }}
                    >
                      Proceed to Checkout
                      <ArrowForwardIcon sx={{ ml: 1 }} />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<WhatsAppIcon />}
                      onClick={handleWhatsAppInquiry}
                      sx={{
                        borderColor: "#25D366",
                        color: "#25D366",
                        py: 1.2,
                        borderRadius: "16px",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "#128C7E",
                          bgcolor: alpha("#25D366", 0.05),
                        },
                      }}
                    >
                      Inquire via WhatsApp
                    </Button>
                  </motion.div>
                </Stack>

                {/* Trust Badges */}
                <Box
                  sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: `1px solid ${colors.lightGray}`,
                  }}
                >
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Secure Payment">
                      <VerifiedIcon
                        sx={{ color: colors.success, fontSize: 20 }}
                      />
                    </Tooltip>
                    <Tooltip title="Free Returns">
                      <SecurityIcon
                        sx={{ color: colors.success, fontSize: 20 }}
                      />
                    </Tooltip>
                    <Tooltip title="24/7 Support">
                      <WhatsAppIcon
                        sx={{ color: colors.success, fontSize: 20 }}
                      />
                    </Tooltip>
                  </Stack>
                  <Typography
                    variant="caption"
                    color={colors.gray}
                    align="center"
                    sx={{ display: "block", mt: 1 }}
                  >
                    🔒 Secure checkout powered by Chapa
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Clear Cart Confirmation Dialog */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
              }}
              onClick={() => setShowClearConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{ maxWidth: "400px", width: "100%" }}
                onClick={(e) => e.stopPropagation()}
              >
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  <Box sx={{ fontSize: "3rem", mb: 2 }}>🗑️</Box>
                  <Typography variant="h6" fontWeight="800" gutterBottom>
                    Clear Cart?
                  </Typography>
                  <Typography color={colors.gray} sx={{ mb: 3 }}>
                    Are you sure you want to remove all items from your cart?
                    This action cannot be undone.
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setShowClearConfirm(false)}
                      sx={{ borderRadius: "12px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      onClick={() => {
                        clearCart();
                        setShowClearConfirm(false);
                      }}
                      sx={{ borderRadius: "12px" }}
                    >
                      Clear Cart
                    </Button>
                  </Stack>
                </Paper>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default Cart;
