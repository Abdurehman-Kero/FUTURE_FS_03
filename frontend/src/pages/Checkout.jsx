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
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { initializePayment } from "../services/api";

const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  light: "#F8F9FF",
  gray: "#6B7280",
};

const steps = ["Customer Info", "Order Summary", "Payment"];

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="warning">No product selected</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/products")}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate customer info
      if (!formData.firstName || !formData.email || !formData.phone) {
        setError("Please fill in all required fields");
        return;
      }
      setError("");
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await initializePayment({
        amount: product.price?.replace(/[^0-9.-]+/g, "") || "0",
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        product_name: product.name,
        product_id: product.id,
        customer_phone: formData.phone,
        metadata: {
          address: formData.address,
          city: formData.city,
        },
      });

      if (response.data.success && response.data.checkout_url) {
        // Redirect to Chapa payment page
        window.location.href = response.data.checkout_url;
      } else {
        setError("Failed to initialize payment");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name *"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number *"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <PhoneIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <LocationIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Product:</Typography>
                <Typography fontWeight="600">{product.name}</Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Brand:</Typography>
                <Typography>
                  {product.brand} {product.model}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Price:</Typography>
                <Typography color={colors.primary} fontWeight="700">
                  {product.price || "Call for price"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total:</Typography>
                <Typography
                  variant="h5"
                  color={colors.primary}
                  fontWeight="700"
                >
                  {product.price || "Call for price"}
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                You'll be redirected to Chapa's secure payment page to complete
                your purchase.
              </Alert>
            </CardContent>
          </Card>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="600" gutterBottom align="center">
            Checkout
          </Typography>

          <Stepper activeStep={activeStep} sx={{ my: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {getStepContent(activeStep)}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              onClick={
                activeStep === 0 ? () => navigate("/products") : handleBack
              }
              startIcon={<ArrowBackIcon />}
            >
              {activeStep === 0 ? "Back to Products" : "Back"}
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  background: colors.gradient,
                  px: 4,
                  py: 1.5,
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Pay Now"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  background: colors.gradient,
                  px: 4,
                  py: 1.5,
                }}
              >
                Continue
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Checkout;
