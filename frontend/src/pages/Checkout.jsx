import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { initializePayment } from "../services/api";

// Color scheme matching homepage
const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  light: "#F8F9FF",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  success: "#10B981",
  white: "#FFFFFF",
  dark: "#1E1A3A",
};

const steps = ["Customer Information", "Order Summary", "Payment"];

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const product = location.state?.product;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  // Redirect if no product
  if (!product) {
    return (
      <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              No product selected for checkout
            </Alert>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/products")}
              sx={{ bgcolor: colors.primary }}
            >
              Browse Products
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (validateStep1()) {
        setError("");
        setActiveStep(1);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Clean the price - remove any non-numeric characters
      const cleanPrice =
        product.price?.toString().replace(/[^0-9.-]+/g, "") || "0";
      const amount = parseFloat(cleanPrice).toFixed(2);

      // Validate amount
      if (parseFloat(amount) <= 0) {
        throw new Error("Invalid product price");
      }

     const paymentData = {
       amount: cleanPrice,
       email: formData.email,
       first_name: formData.firstName,
       last_name: formData.lastName,
       product_name: product.name,
       product_id: product.id, // ✅ ADD THIS
       customer_phone: formData.phone,
     };

      console.log("Sending payment data:", paymentData);

      const response = await initializePayment(paymentData);

      if (response.data?.success && response.data?.checkout_url) {
        // Store transaction reference in session storage for tracking
        if (response.data.tx_ref) {
          sessionStorage.setItem("last_tx_ref", response.data.tx_ref);
        }
        // Redirect to Chapa payment page
        window.location.href = response.data.checkout_url;
      } else {
        throw new Error(
          response.data?.message || "Failed to initialize payment",
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment initialization failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="First Name *"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
                error={error && !formData.firstName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
                error={error && !formData.email}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Phone Number *"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
                placeholder="e.g., 0912345678"
                InputProps={{
                  startAdornment: (
                    <PhoneIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
                error={error && !formData.phone}
                helperText="Include your country code (e.g., 251 for Ethiopia)"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleInputChange}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <LocationIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Card
            sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: colors.dark, fontWeight: 600 }}
              >
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Product Image Placeholder */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: colors.light,
                    borderRadius: 2,
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CartIcon sx={{ color: colors.primary }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.brand} {product.model}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography color="text.secondary">Price:</Typography>
                <Typography fontWeight="500">{product.price}</Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography color="text.secondary">Quantity:</Typography>
                <Typography fontWeight="500">1</Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography color="text.secondary">Condition:</Typography>
                <Typography
                  fontWeight="500"
                  sx={{ textTransform: "capitalize" }}
                >
                  {product.type || "New"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total:</Typography>
                <Typography
                  variant="h5"
                  sx={{ color: colors.primary, fontWeight: 700 }}
                >
                  {product.price}
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                  You'll be redirected to Chapa's secure payment page to
                  complete your purchase. We accept Telebirr, CBE Birr, Amole,
                  and all major cards.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card sx={{ borderRadius: 2, bgcolor: colors.light }}>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <CheckCircleIcon
                sx={{ fontSize: 60, color: colors.success, mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Ready to Complete Your Purchase
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Please review your information and click "Pay Now" to proceed
              </Typography>

              <Paper
                sx={{ p: 2, mb: 2, bgcolor: colors.white, textAlign: "left" }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Customer Information
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {formData.firstName}{" "}
                  {formData.lastName}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {formData.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {formData.phone}
                </Typography>
                {(formData.address || formData.city) && (
                  <Typography variant="body2">
                    <strong>Address:</strong> {formData.address},{" "}
                    {formData.city}
                  </Typography>
                )}
              </Paper>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{ bgcolor: colors.light, minHeight: "100vh", py: { xs: 2, sm: 4 } }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight="600"
              color={colors.dark}
              gutterBottom
            >
              Checkout
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete your purchase securely
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper
            activeStep={activeStep}
            sx={{
              my: 4,
              "& .MuiStepLabel-root .Mui-completed": {
                color: colors.success,
              },
              "& .MuiStepLabel-root .Mui-active": {
                color: colors.primary,
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* Step Content */}
          {getStepContent(activeStep)}

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Button
              onClick={
                activeStep === 0 ? () => navigate("/products") : handleBack
              }
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              fullWidth={isMobile}
              sx={{
                borderColor: colors.gray,
                color: colors.gray,
                "&:hover": {
                  borderColor: colors.primary,
                  color: colors.primary,
                },
                order: { xs: 2, sm: 1 },
              }}
            >
              {activeStep === 0 ? "Continue Shopping" : "Back"}
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                fullWidth={isMobile}
                sx={{
                  background: colors.gradient,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    background: colors.secondary,
                  },
                  order: { xs: 1, sm: 2 },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Pay Now"
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                fullWidth={isMobile}
                sx={{
                  background: colors.gradient,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    background: colors.secondary,
                  },
                  order: { xs: 1, sm: 2 },
                }}
              >
                Continue
              </Button>
            )}
          </Box>

          {/* Trust Badge */}
          <Box
            sx={{ mt: 4, pt: 3, borderTop: `1px solid ${colors.lightGray}` }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              display="block"
            >
              🔒 Secure payment powered by Chapa • Your information is encrypted
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Checkout;
