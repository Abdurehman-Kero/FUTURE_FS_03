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
  Avatar,
  useMediaQuery,
  useTheme,
  Fade,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { initializePayment } from "../services/api";

const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFB347 100%)",
  light: "#F4F7FE",
  white: "#FFFFFF",
  dark: "#1E1A3A",
  success: "#10B981",
  inputBg: "#F0F2F5", // Soft gray for inputs
  border: "rgba(0,0,0,0.06)",
};

const steps = ["Details", "Summary", "Pay"];

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const product = location.state?.product;
  const quantity = location.state?.quantity || 1;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  if (!product) {
    return (
      <Box
        sx={{
          bgcolor: colors.light,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={() => navigate("/products")}
          variant="contained"
          sx={{ bgcolor: colors.dark }}
        >
          Back to Shop
        </Button>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleNext = () => {
    if (
      activeStep === 0 &&
      (!formData.firstName || !formData.email || !formData.phone)
    ) {
      setError("Please fill in the required fields");
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const cleanPrice =
        product.price?.toString().replace(/[^0-9.-]+/g, "") || "0";
      const paymentData = {
        amount: (parseFloat(cleanPrice) * quantity).toString(),
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        product_name: product.name,
        product_id: product.id,
        customer_phone: formData.phone,
      };
      const response = await initializePayment(paymentData);
      if (response.data?.success) {
        window.location.href = response.data.checkout_url;
      }
    } catch (err) {
      setError("Payment failed to initialize. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Modern Icon Wrapper Component
  const InputIcon = ({ icon: Icon }) => (
    <Box
      sx={{
        bgcolor: colors.white,
        p: 0.8,
        borderRadius: 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 1.5,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        width: 32,
        height: 32,
        border: `1px solid ${colors.border}`,
      }}
    >
      <Icon sx={{ fontSize: 18, color: colors.primary }} />
    </Box>
  );

  // Styled Input Object to fix the clumping issue
  const inputStyles = {
    mb: 2,
    "& .MuiFilledInput-root": {
      borderRadius: 4,
      bgcolor: colors.inputBg,
      border: "1px solid transparent",
      pt: "10px",
      "&:before, &:after": { display: "none" }, // Removes the bottom line
      "&.Mui-focused": {
        bgcolor: "#fff",
        borderColor: colors.primary,
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
      },
    },
    "& .MuiInputLabel-root": {
      ml: 5.5, // Pushes label to the right of the icon
      fontWeight: 600,
      "&.Mui-focused": { color: colors.primary },
    },
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <Grid container spacing={1}>
              <Grid item xs={14}>
                <Typography
                  variant="overline"
                  fontWeight="900"
                  color="primary"
                  mx={3}
                  sx={{ letterSpacing: 1 }}
                >
                  Contact Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name *"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  variant="filled"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: <InputIcon icon={PersonIcon} />,
                  }}
                  sx={inputStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name *"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  variant="filled"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: <InputIcon icon={PersonIcon} />,
                  }}
                  sx={inputStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address *"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="filled"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: <InputIcon icon={EmailIcon} />,
                  }}
                  sx={inputStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  name="phone"
                  placeholder="098231..."
                  value={formData.phone}
                  onChange={handleInputChange}
                  variant="filled"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: <InputIcon icon={PhoneIcon} />,
                  }}
                  sx={inputStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Address"
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  variant="filled"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: <InputIcon icon={LocationIcon} />,
                  }}
                  sx={inputStyles}
                />
              </Grid>
            </Grid>
          </Fade>
        );
      case 1:
        return (
          <Fade in={true}>
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: "#F9FAFB",
                  border: `1px solid ${colors.border}`,
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    src={product.image_url}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "white",
                      p: 1,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <CartIcon sx={{ color: colors.primary }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="900">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {quantity}
                    </Typography>
                    <Typography variant="h6" fontWeight="900" color="primary">
                      ETB {product.price}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight="800">ETB {product.price}</Typography>
              </Box>
              <Divider sx={{ my: 2, borderStyle: "dashed" }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight="900">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight="900" color={colors.dark}>
                  ETB {product.price}
                </Typography>
              </Box>
            </Box>
          </Fade>
        );
      case 2:
        return (
          <Fade in={true}>
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CheckCircleIcon
                sx={{ fontSize: 60, color: colors.success, mb: 2 }}
              />
              <Typography variant="h5" fontWeight="900">
                Final Step
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Redirecting to secure payment...
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 3,
                  textAlign: "left",
                  bgcolor: "#fcfcfc",
                }}
              >
                <Typography variant="body2" fontWeight="800">
                  {formData.firstName} {formData.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formData.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formData.address || "Addis Ababa"}
                </Typography>
              </Paper>
            </Box>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{ bgcolor: colors.light, minHeight: "100vh", py: { xs: 2, md: 8 } }}
    >
      <Container maxWidth="sm">
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 5,
            "& .MuiStepLabel-label": { fontWeight: 700, fontSize: "0.7rem" },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 6,
            boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="1000" color={colors.dark}>
              Checkout
            </Typography>
            <Box
              sx={{
                height: 4,
                width: 40,
                bgcolor: colors.primary,
                borderRadius: 2,
                mt: 1,
                mx: "auto",
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          {getStepContent(activeStep)}

          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
              disabled={loading}
              sx={{
                py: 2,
                borderRadius: 4,
                background: colors.gradient,
                fontWeight: 900,
                fontSize: "1rem",
                boxShadow: "0 10px 25px rgba(255,133,0,0.3)",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                "PAY NOW"
              ) : (
                "CONTINUE"
              )}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={
                activeStep === 0
                  ? () => navigate(-1)
                  : () => setActiveStep(activeStep - 1)
              }
              sx={{ color: colors.dark, fontWeight: 700, opacity: 0.5 }}
            >
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>
          </Box>
        </Paper>

        <Box
          sx={{
            mt: 4,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            opacity: 0.4,
          }}
        >
          <SecurityIcon fontSize="small" />
          <Typography variant="caption" fontWeight="900">
            SECURE CHAPA PAYMENT
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Checkout;
