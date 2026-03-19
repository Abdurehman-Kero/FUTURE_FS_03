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
  CardMedia,
  Chip,
  TextField,
  Alert,
  useMediaQuery,
  useTheme,
  Stack,
  alpha,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingBag as ShoppingBagIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingCart as CartIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  light: "#F8F9FF",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  dark: "#1E1A3A",
  success: "#10B981",
};

const Cart = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [whatsappMessage, setWhatsappMessage] = useState("");

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // For single item, go to checkout
    if (cart.length === 1) {
      const product = cart[0];
      navigate(`/checkout/${product.slug}`, {
        state: {
          product: {
            id: product.id,
            name: product.name,
            brand: product.brand,
            model: product.model,
            price: product.price,
            slug: product.slug,
            quantity: product.quantity,
          },
        },
      });
    } else {
      // For multiple items, go to bulk checkout
      navigate("/bulk-checkout", { state: { cart } });
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

  if (cart.length === 0) {
    return (
      <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
            <ShoppingBagIcon sx={{ fontSize: 80, color: colors.gray, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Your Cart is Empty
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Looks like you haven't added any items to your cart yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/products")}
              sx={{ bgcolor: colors.primary }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton
            onClick={() => navigate("/products")}
            sx={{ mr: 2, color: colors.primary }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="600" color={colors.dark}>
            Shopping Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              {cart.map((item) => (
                <Card key={item.id} sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3} sm={2}>
                        <Box
                          sx={{
                            width: "100%",
                            height: 80,
                            bgcolor: colors.lightGray,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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

                      <Grid item xs={9} sm={5}>
                        <Typography variant="subtitle1" fontWeight="600">
                          {item.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {item.brand} {item.model}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={colors.primary}
                          fontWeight="600"
                          sx={{ mt: 1 }}
                        >
                          ETB {item.price?.toLocaleString()} each
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            sx={{ bgcolor: colors.lightGray }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            size="small"
                            inputProps={{
                              style: { textAlign: "center", width: 40 },
                              min: 1,
                              max: item.maxStock,
                            }}
                            sx={{ mx: 1, width: 60 }}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (
                                !isNaN(val) &&
                                val > 0 &&
                                val <= item.maxStock
                              ) {
                                updateQuantity(item.id, val);
                              }
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                            sx={{ bgcolor: colors.lightGray }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>

                      <Grid item xs={4} sm={1}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          color={colors.primary}
                        >
                          ETB {(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </Grid>

                      <Grid item xs={2} sm={1}>
                        <IconButton
                          color="error"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, position: "sticky", top: 100 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Order Summary
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight="500">
                  ETB {cartTotal.toLocaleString()}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight="500">Free</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h6">Total</Typography>
                <Typography
                  variant="h5"
                  sx={{ color: colors.primary, fontWeight: 700 }}
                >
                  ETB {cartTotal.toLocaleString()}
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCheckout}
                  sx={{
                    bgcolor: colors.primary,
                    py: 1.5,
                    "&:hover": { bgcolor: colors.secondary },
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<WhatsAppIcon />}
                  onClick={handleWhatsAppInquiry}
                  sx={{
                    borderColor: "#25D366",
                    color: "#25D366",
                    py: 1.5,
                  }}
                >
                  Inquire via WhatsApp
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={clearCart}
                  sx={{ color: colors.gray }}
                >
                  Clear Cart
                </Button>
              </Stack>

              <Box
                sx={{
                  mt: 3,
                  pt: 2,
                  borderTop: `1px solid ${colors.lightGray}`,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  align="center"
                >
                  🔒 Secure checkout powered by Chapa
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Cart;
