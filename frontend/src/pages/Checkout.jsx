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
  Stack,
  Chip,
  alpha,
  IconButton,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  ChevronRight as ChevronRightIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { initializePayment } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const colors = {
  primary: "#FF8500",
  primaryDark: "#E67600",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFB347 100%)",
  light: "#F8F9FF",
  white: "#FFFFFF",
  dark: "#1E1A3A",
  lightGray: "#E5E7EB",
  gray: "#6B7280",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  inputBg: "#F9FAFB",
  border: "rgba(0,0,0,0.06)",
};

const steps = ["Details", "Summary", "Payment"];

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
    city: "Shashemene",
    notes: "",
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
              <CartIcon sx={{ fontSize: 60, color: colors.gray, mb: 2 }} />
              <Typography variant="h5" fontWeight="800" gutterBottom>
                No Product Selected
              </Typography>
              <Typography color={colors.gray} sx={{ mb: 3 }}>
                Please add items to your cart before proceeding to checkout.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/products")}
                sx={{
                  background: colors.gradient,
                  borderRadius: "50px",
                  px: 4,
                  py: 1.2,
                }}
              >
                Browse Products
              </Button>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.firstName || !formData.email || !formData.phone) {
        setError("Please fill in all required fields");
        return;
      }
      if (!formData.email.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }
      if (formData.phone.length < 9) {
        setError("Please enter a valid phone number");
        return;
      }
    }
    setError("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
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
        address: formData.address,
        city: formData.city,
      };
      const response = await initializePayment(paymentData);
      if (response.data?.success) {
        window.location.href = response.data.checkout_url;
      } else {
        setError("Payment initialization failed. Please try again.");
      }
    } catch (err) {
      setError(
        "Payment failed to initialize. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Input field with icon
  const InputField = ({
    icon: Icon,
    label,
    name,
    type = "text",
    required = false,
    ...props
  }) => (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={formData[name]}
      onChange={handleInputChange}
      required={required}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <Box sx={{ mr: 1.5, display: "flex", alignItems: "center" }}>
            <Icon sx={{ color: colors.primary, fontSize: 20 }} />
          </Box>
        ),
      }}
      sx={{
        mb: 2.5,
        "& .MuiOutlinedInput-root": {
          borderRadius: "16px",
          backgroundColor: colors.white,
          "&:hover fieldset": {
            borderColor: colors.primary,
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.primary,
            borderWidth: 2,
          },
        },
        "& .MuiInputLabel-root": {
          fontWeight: 500,
          "&.Mui-focused": {
            color: colors.primary,
          },
        },
      }}
      {...props}
    />
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: colors.primary,
                  fontWeight: 700,
                  mb: 3,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputField
                    icon={PersonIcon}
                    label="First Name"
                    name="firstName"
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputField
                    icon={PersonIcon}
                    label="Last Name"
                    name="lastName"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <InputField
                    icon={EmailIcon}
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <InputField
                    icon={PhoneIcon}
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    required
                    placeholder="09xxxxxxxx"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <InputField
                    icon={LocationIcon}
                    label="Delivery Address"
                    name="address"
                    multiline
                    rows={2}
                    placeholder="House number, street, landmark"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <InputField
                    icon={LocationIcon}
                    label="City"
                    name="city"
                    defaultValue="Shashemene"
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: colors.primary,
                  fontWeight: 700,
                  mb: 3,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Order Summary
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: colors.light,
                  border: `1px solid ${colors.lightGray}`,
                  mb: 3,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    variant="rounded"
                    src={product.image_url}
                    sx={{
                      width: { xs: 70, md: 80 },
                      height: { xs: 70, md: 80 },
                      bgcolor: colors.white,
                      p: 1,
                      borderRadius: 3,
                    }}
                  >
                    <CartIcon sx={{ color: colors.primary, fontSize: 30 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="800">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color={colors.gray}>
                      {product.brand} {product.model}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Chip
                        label={`Qty: ${quantity}`}
                        size="small"
                        sx={{
                          bgcolor: alpha(colors.primary, 0.1),
                          color: colors.primary,
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label={product.type === "new" ? "New" : "Pre-owned"}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                  {/* <Typography
                    variant="h6"
                    fontWeight="800"
                    color={colors.primary}
                  >
                    ETB {product.price?.toLocaleString()}
                  </Typography> */}
                </Stack>
              </Paper>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={colors.gray}>Subtotal</Typography>
                  <Typography fontWeight="600">
                    ETB {(product.price * quantity).toLocaleString()}
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
                {product.price * quantity > 5000 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color={colors.gray}>Discount</Typography>
                    <Typography color={colors.success} fontWeight="600">
                      - ETB 200
                    </Typography>
                  </Stack>
                )}
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" fontWeight="800">
                  Total
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="800"
                  color={colors.primary}
                >
                  ETB{" "}
                  {(
                    product.price * quantity -
                    (product.price * quantity > 5000 ? 200 : 0)
                  ).toLocaleString()}
                </Typography>
              </Stack>

              {/* Delivery Info */}
              <Box
                sx={{
                  mt: 3,
                  pt: 2,
                  borderTop: `1px dashed ${colors.lightGray}`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <ShippingIcon sx={{ color: colors.primary, fontSize: 18 }} />
                  <Typography variant="caption" color={colors.gray}>
                    Free delivery in Shashemene
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Fade>
        );

      case 2:
        return (
          <Fade in={true}>
            <Box sx={{ textAlign: "center", py: 2 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <PaymentIcon
                  sx={{
                    fontSize: { xs: 60, md: 80 },
                    color: colors.primary,
                    mb: 2,
                  }}
                />
              </motion.div>
              <Typography variant="h5" fontWeight="800" gutterBottom>
                Secure Payment
              </Typography>
              <Typography variant="body2" color={colors.gray} sx={{ mb: 3 }}>
                You'll be redirected to Chapa secure payment gateway
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  textAlign: "left",
                  bgcolor: colors.light,
                  border: `1px solid ${colors.lightGray}`,
                  mb: 2,
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color={colors.gray}>
                      Name
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {formData.firstName} {formData.lastName}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color={colors.gray}>
                      Email
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {formData.email}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color={colors.gray}>
                      Phone
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {formData.phone}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color={colors.gray}>
                      Address
                    </Typography>
                    <Typography variant="body2" fontWeight="600" align="right">
                      {formData.address || "Not specified"}, {formData.city}
                    </Typography>
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" fontWeight="700">
                      Total
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="800"
                      color={colors.primary}
                    >
                      ETB{" "}
                      {(
                        product.price * quantity -
                        (product.price * quantity > 5000 ? 200 : 0)
                      ).toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  mt: 2,
                }}
              >
                <VerifiedIcon sx={{ color: colors.success, fontSize: 16 }} />
                <Typography variant="caption" color={colors.gray}>
                  Secured by Chapa Payment Gateway
                </Typography>
              </Box>
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{ bgcolor: colors.light, minHeight: "100vh", py: { xs: 2, md: 6 } }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header with Back Button */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          <IconButton
            onClick={() => navigate(-1)}
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
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Checkout
          </Typography>
        </Stack>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: { xs: 4, md: 5 },
            "& .MuiStepLabel-label": {
              fontWeight: 600,
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
            },
            "& .Mui-active .MuiStepLabel-label": {
              color: colors.primary,
              fontWeight: 700,
            },
            "& .Mui-completed .MuiStepLabel-label": {
              color: colors.success,
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: { xs: 2.5, sm: 3, md: 4 },
              borderRadius: 4,
              boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
              border: `1px solid ${colors.lightGray}`,
              background: colors.white,
            }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  "& .MuiAlert-icon": { alignItems: "center" },
                }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {getStepContent(activeStep)}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <Box
              sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={
                    activeStep === steps.length - 1 ? handleSubmit : handleNext
                  }
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    borderRadius: 3,
                    background: colors.gradient,
                    fontWeight: 800,
                    fontSize: "1rem",
                    boxShadow: `0 8px 20px ${alpha(colors.primary, 0.3)}`,
                    "&:hover": {
                      background: colors.secondary,
                    },
                  }}
                  endIcon={
                    activeStep !== steps.length - 1 && <ArrowForwardIcon />
                  }
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : activeStep === steps.length - 1 ? (
                    "Pay Now"
                  ) : (
                    "Continue"
                  )}
                </Button>
              </motion.div>

              {activeStep > 0 && (
                <Button
                  fullWidth
                  variant="text"
                  onClick={handleBack}
                  sx={{
                    color: colors.gray,
                    fontWeight: 600,
                    "&:hover": { bgcolor: alpha(colors.gray, 0.05) },
                  }}
                >
                  Back
                </Button>
              )}
            </Box>
          </Paper>
        </motion.div>

        {/* Security Footer */}
        <Box
          sx={{
            mt: 4,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            opacity: 0.6,
          }}
        >
          <SecurityIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" fontWeight="600">
            SECURE PAYMENT BY CHAPA
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Checkout;
