import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Build as BuildIcon,
  Laptop as LaptopIcon,
  ArrowForward as ArrowIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
  ShoppingCart as CartIcon,
  Verified as VerifiedIcon,
  SupportAgent as SupportIcon,
  Star as StarIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Color palette with #FF8500 as primary
const colors = {
  primary: "#FF8500", // New primary orange
  secondary: "#FFA33C", // Lighter orange
  accent: "#4A90E2", // Blue accent
  dark: "#1E1A3A", // Dark purple-gray for text
  light: "#F8F9FF", // Light lavender background
  white: "#FFFFFF",
  gray: "#6B7280", // Gray text
  lightGray: "#E5E7EB", // Border color
  success: "#10B981", // Green for success states
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
};

// Featured Products
const featuredProducts = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    category: "Smartphones",
    price: "$1,299",
    image: "https://i.imgur.com/XkUcKxZ.png",
    rating: 4.8,
    reviews: 128,
    slug: "iphone-14-pro",
  },
  {
    id: 2,
    name: "MacBook Pro 16",
    category: "Laptops",
    price: "$2,499",
    image: "https://i.imgur.com/YQcVZxY.png",
    rating: 4.9,
    reviews: 89,
    slug: "macbook-pro-16",
  },
  {
    id: 3,
    name: "Samsung Galaxy S23",
    category: "Smartphones",
    price: "$999",
    image: "https://i.imgur.com/LmHwYxZ.png",
    rating: 4.7,
    reviews: 215,
    slug: "samsung-galaxy-s23",
  },
  {
    id: 4,
    name: "iPad Pro",
    category: "Tablets",
    price: "$1,099",
    image: "https://i.imgur.com/WxYqZxK.png",
    rating: 4.8,
    reviews: 156,
    slug: "ipad-pro",
  },
];

// Categories
const categories = [
  { id: 1, name: "Smartphones", icon: "📱", count: 45, slug: "smartphones" },
  { id: 2, name: "Laptops", icon: "💻", count: 32, slug: "laptops" },
  { id: 3, name: "Tablets", icon: "📟", count: 18, slug: "tablets" },
  { id: 4, name: "Accessories", icon: "🎧", count: 67, slug: "accessories" },
];

// Services
const services = [
  {
    icon: <BuildIcon sx={{ fontSize: 40 }} />,
    title: "Expert Repairs",
    desc: "Screen replacement, battery service, and water damage repair",
    price: "From $49",
    slug: "repairs",
  },
  {
    icon: <LaptopIcon sx={{ fontSize: 40 }} />,
    title: "Maintenance",
    desc: "Computer cleaning, virus removal, and performance optimization",
    price: "From $39",
    slug: "maintenance",
  },
  {
    icon: <SupportIcon sx={{ fontSize: 40 }} />,
    title: "24/7 Support",
    desc: "Technical support and consultation, remote assistance available",
    price: "From $19",
    slug: "support",
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
    title: "Warranty Service",
    desc: "1-year warranty on all repairs and genuine parts",
    price: "Included",
    slug: "warranty",
  },
];

// Quick links for footer
const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Services", path: "/services" },
  { name: "Contact", path: "/contact" },
  { name: "Repair Request", path: "/repair-request" },
  { name: "About Us", path: "/about" },
];

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const message = `Hello Chala Mobile,%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Message:* ${formData.message}`;
    window.open(`https://wa.me/251912345678?text=${message}`, "_blank");
    setFormData({ name: "", phone: "", message: "" });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this to your backend
    alert(`Thank you for subscribing with: ${newsletterEmail}`);
    setNewsletterEmail("");
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.slug}`);
    setMobileMenuOpen(false);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.slug}`);
  };

  const handleServiceClick = (service) => {
    navigate(`/services/${service.slug}`);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleShopNow = () => {
    navigate("/products");
  };

  const handleContactUs = () => {
    navigate("/contact");
  };

  const handleViewAllProducts = () => {
    navigate("/products");
  };

  return (
    <Box sx={{ bgcolor: colors.light, minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          bgcolor: scrolled ? "rgba(255,255,255,0.95)" : colors.white,
          backdropFilter: "blur(10px)",
          boxShadow: scrolled ? `0 4px 20px ${colors.primary}20` : "none",
          borderBottom: scrolled ? `1px solid ${colors.lightGray}` : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ py: 1.5 }}
          >
            {/* Logo */}
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer" }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  background: colors.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 10px ${colors.primary}40`,
                }}
              >
                <Typography
                  sx={{
                    color: colors.white,
                    fontWeight: 700,
                    fontSize: "1.2rem",
                  }}
                >
                  CM
                </Typography>
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: colors.dark,
                    lineHeight: 1.2,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Chala<span style={{ color: colors.primary }}>Mobile</span>
                </Typography>
              </Box>
            </Stack>

            {/* Desktop Navigation */}
            <Stack
              direction="row"
              spacing={4}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {["Home", "Products", "Services", "Contact"].map((item) => (
                <Button
                  key={item}
                  onClick={() =>
                    handleNavigation(
                      item === "Home" ? "/" : `/${item.toLowerCase()}`,
                    )
                  }
                  sx={{
                    color: colors.gray,
                    fontWeight: 500,
                    position: "relative",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "0%",
                      height: "2px",
                      bgcolor: colors.primary,
                      transition: "width 0.3s ease",
                    },
                    "&:hover": {
                      color: colors.primary,
                      "&:after": {
                        width: "80%",
                      },
                    },
                  }}
                >
                  {item}
                </Button>
              ))}
              <Button
                variant="contained"
                onClick={handleShopNow}
                sx={{
                  background: colors.gradient,
                  color: colors.white,
                  borderRadius: "50px",
                  px: 3.5,
                  py: 1,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: `0 4px 15px ${colors.primary}40`,
                  "&:hover": {
                    boxShadow: `0 6px 20px ${colors.primary}60`,
                  },
                }}
              >
                Shop Now
              </Button>
            </Stack>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: colors.primary,
                border: `1px solid ${colors.lightGray}`,
                borderRadius: "10px",
              }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Stack>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <Fade in={mobileMenuOpen}>
              <Box
                sx={{
                  py: 2,
                  bgcolor: colors.white,
                  borderRadius: "16px",
                  mt: 1,
                  mb: 2,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                <Stack spacing={1}>
                  {[
                    "Home",
                    "Products",
                    "Services",
                    "Contact",
                    "Repair Request",
                  ].map((item) => (
                    <Button
                      key={item}
                      fullWidth
                      onClick={() =>
                        handleNavigation(
                          item === "Home"
                            ? "/"
                            : `/${item.toLowerCase().replace(" ", "-")}`,
                        )
                      }
                      sx={{
                        justifyContent: "flex-start",
                        px: 3,
                        py: 1.5,
                        color: colors.dark,
                        "&:hover": {
                          bgcolor: colors.light,
                          color: colors.primary,
                        },
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleShopNow}
                    sx={{
                      background: colors.gradient,
                      color: colors.white,
                      mx: 2,
                      width: "calc(100% - 32px)",
                      borderRadius: "50px",
                      py: 1.2,
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Shop Now
                  </Button>
                </Stack>
              </Box>
            </Fade>
          )}
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.light} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.primary}20 100%)`,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.primary}10 100%)`,
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="Welcome to ChalaMobile"
                sx={{
                  bgcolor: colors.primary,
                  color: colors.white,
                  mb: 3,
                  borderRadius: "50px",
                  fontWeight: 500,
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3.5rem" },
                  color: colors.dark,
                  mb: 2,
                  lineHeight: 1.2,
                  letterSpacing: "-1px",
                }}
              >
                Your Trusted Tech Partner in{" "}
                <span style={{ color: colors.primary }}>Shashemene</span>
              </Typography>

              <Typography
                sx={{
                  color: colors.gray,
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  mb: 4,
                  lineHeight: 1.8,
                  maxWidth: "90%",
                }}
              >
                Quality phones, laptops, and professional repair services. We're
                here to help with all your tech needs.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ width: "100%" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleShopNow}
                  sx={{
                    background: colors.gradient,
                    px: 4,
                    py: 1.5,
                    borderRadius: "50px",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: `0 4px 15px ${colors.primary}40`,
                    "&:hover": {
                      boxShadow: `0 6px 20px ${colors.primary}60`,
                    },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Browse Products
                  <ChevronRightIcon sx={{ ml: 1 }} />
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleContactUs}
                  sx={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    px: 4,
                    py: 1.5,
                    borderRadius: "50px",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    fontWeight: 600,
                    textTransform: "none",
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: colors.secondary,
                      color: colors.secondary,
                      borderWidth: 2,
                    },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Contact Us
                </Button>
              </Stack>

              {/* Trust Indicators */}
              <Stack
                direction="row"
                spacing={3}
                sx={{ mt: 4, flexWrap: "wrap", gap: 2 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <VerifiedIcon sx={{ color: colors.success, fontSize: 20 }} />
                  <Typography variant="body2" color={colors.gray}>
                    100% Genuine
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <VerifiedIcon sx={{ color: colors.success, fontSize: 20 }} />
                  <Typography variant="body2" color={colors.gray}>
                    1 Year Warranty
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <VerifiedIcon sx={{ color: colors.success, fontSize: 20 }} />
                  <Typography variant="body2" color={colors.gray}>
                    Free Diagnosis
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: { xs: 1.5, md: 2 },
                }}
              >
                {featuredProducts.slice(0, 4).map((product, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    onClick={() => handleProductClick(product)}
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      borderRadius: "20px",
                      background: colors.white,
                      border: `1px solid ${colors.lightGray}`,
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: `0 10px 30px ${colors.primary}20`,
                        borderColor: colors.primary,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{
                        width: "100%",
                        height: "auto",
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" color={colors.gray}>
                      {product.category}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      noWrap
                      sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}
                    >
                      {product.name}
                    </Typography>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: 0.5 }}
                    >
                      <Typography
                        color={colors.primary}
                        fontWeight={700}
                        sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                      >
                        {product.price}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <StarIcon sx={{ color: "#FFB800", fontSize: 14 }} />
                        <Typography variant="caption">
                          {product.rating}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: colors.white }}>
        <Container maxWidth="lg">
          <Stack spacing={2} sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="overline"
              sx={{
                color: colors.primary,
                fontWeight: 600,
                letterSpacing: 2,
              }}
            >
              Shop by Category
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: colors.dark,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Browse Our Collections
            </Typography>
            <Typography
              sx={{
                color: colors.gray,
                maxWidth: 600,
                mx: "auto",
                px: 2,
              }}
            >
              Find exactly what you're looking for in our wide range of
              categories
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={6} md={3} key={category.id}>
                <Paper
                  elevation={0}
                  onClick={() => handleCategoryClick(category)}
                  sx={{
                    p: { xs: 3, md: 4 },
                    textAlign: "center",
                    borderRadius: "20px",
                    background: colors.light,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: `1px solid ${colors.lightGray}`,
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      borderColor: colors.primary,
                      boxShadow: `0 15px 30px -10px ${colors.primary}`,
                      bgcolor: colors.white,
                    },
                  }}
                >
                  <Typography
                    sx={{ fontSize: { xs: "2.5rem", md: "3rem" }, mb: 2 }}
                  >
                    {category.icon}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                  >
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color={colors.gray}>
                    {category.count} Items
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: colors.light }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ mb: 4 }}
          >
            <Box sx={{ mb: { xs: 2, sm: 0 } }}>
              <Typography
                variant="overline"
                sx={{
                  color: colors.primary,
                  fontWeight: 600,
                  letterSpacing: 2,
                }}
              >
                Featured Products
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: colors.dark,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                }}
              >
                Popular This Week
              </Typography>
            </Box>
            <Button
              endIcon={<ArrowIcon />}
              onClick={handleViewAllProducts}
              sx={{
                color: colors.primary,
                fontWeight: 600,
                "&:hover": { color: colors.secondary },
              }}
            >
              View All
            </Button>
          </Stack>

          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <Card
                  onClick={() => handleProductClick(product)}
                  sx={{
                    borderRadius: "20px",
                    background: colors.white,
                    border: `1px solid ${colors.lightGray}`,
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                    cursor: "pointer",
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px ${colors.primary}20`,
                      borderColor: colors.primary,
                    },
                  }}
                >
                  <Box sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Box
                      sx={{
                        height: { xs: 150, md: 180 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        bgcolor: colors.light,
                        borderRadius: "12px",
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          maxWidth: "80%",
                          maxHeight: "80%",
                          objectFit: "contain",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    </Box>

                    <Typography variant="caption" color={colors.gray}>
                      {product.category}
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        mb: 1,
                        color: colors.dark,
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 2, flexWrap: "wrap" }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <StarIcon sx={{ color: "#FFB800", fontSize: 16 }} />
                        <Typography variant="body2" fontWeight={600}>
                          {product.rating}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color={colors.gray}>
                        ({product.reviews} reviews)
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="h6"
                        color={colors.primary}
                        fontWeight={700}
                        sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
                      >
                        {product.price}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: colors.primary,
                          color: colors.white,
                          "&:hover": { bgcolor: colors.secondary },
                          width: { xs: 35, md: 40 },
                          height: { xs: 35, md: 40 },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.slug}`);
                        }}
                      >
                        <CartIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                      </IconButton>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: colors.white }}>
        <Container maxWidth="lg">
          <Stack spacing={2} sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="overline"
              sx={{
                color: colors.primary,
                fontWeight: 600,
                letterSpacing: 2,
              }}
            >
              Our Services
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: colors.dark,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Professional Tech Support
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  onClick={() => handleServiceClick(service)}
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: "20px",
                    background: colors.light,
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: `1px solid ${colors.lightGray}`,
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px ${colors.primary}20`,
                      borderColor: colors.primary,
                      bgcolor: colors.white,
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: colors.primary,
                      mb: 2,
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography
                    color={colors.gray}
                    sx={{ mb: 2, fontSize: "0.9rem" }}
                  >
                    {service.desc}
                  </Typography>
                  <Typography color={colors.primary} fontWeight={600}>
                    {service.price}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


    </Box>
  );
}
