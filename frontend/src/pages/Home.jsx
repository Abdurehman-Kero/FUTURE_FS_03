import React, { useState, useEffect, useRef } from "react";
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
  alpha, 
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
  AdminPanelSettings as AdminIcon,
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
  { name: "Home", path: "/", section: "home" },
  { name: "Products", path: "/products", section: "products" },
  { name: "Services", path: "/services", section: "services" },
  { name: "Contact", path: "/contact", section: "contact" },
  { name: "Repair Request", path: "/repair-request", section: "repair" },
  { name: "About Us", path: "/about", section: "about" },
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

  // Refs for sections
  const homeRef = useRef(null);
  const productsRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);

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
    alert(`Thank you for subscribing with: ${newsletterEmail}`);
    setNewsletterEmail("");
  };

  const scrollToSection = (sectionRef) => {
    if (sectionRef && sectionRef.current) {
      window.scrollTo({
        top: sectionRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path, section = null) => {
    if (path === "/" && section) {
      // If on home page, scroll to section
      switch (section) {
        case "home":
          scrollToSection(homeRef);
          break;
        case "products":
          scrollToSection(productsRef);
          break;
        case "services":
          scrollToSection(servicesRef);
          break;
        case "contact":
          scrollToSection(contactRef);
          break;
        default:
          navigate(path);
      }
    } else {
      // Navigate to different page
      navigate(path);
    }
    setMobileMenuOpen(false);
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

  const handleShopNow = () => {
    navigate("/products");
  };

  const handleAdminLogin = () => {
    navigate("/login");
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
              onClick={() => scrollToSection(homeRef)}
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
              spacing={3}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Button
                onClick={() => scrollToSection(homeRef)}
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
                Home
              </Button>
              <Button
                onClick={() => scrollToSection(productsRef)}
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
                Products
              </Button>
              <Button
                onClick={() => scrollToSection(servicesRef)}
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
                Services
              </Button>
              <Button
                onClick={() => scrollToSection(contactRef)}
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
                Contact
              </Button>

              {/* Admin Button */}
              <IconButton
                onClick={handleAdminLogin}
                sx={{
                  bgcolor: alpha(colors.primary, 0.1),
                  color: colors.primary,
                  ml: 1,
                  "&:hover": {
                    bgcolor: colors.primary,
                    color: colors.white,
                  },
                }}
                title="Admin Login"
              >
                <AdminIcon />
              </IconButton>

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
            <Stack direction="row" spacing={1} alignItems="center">
              {/* Mobile Admin Button */}
              <IconButton
                onClick={handleAdminLogin}
                sx={{
                  display: { xs: "flex", md: "none" },
                  bgcolor: alpha(colors.primary, 0.1),
                  color: colors.primary,
                  "&:hover": {
                    bgcolor: colors.primary,
                    color: colors.white,
                  },
                }}
              >
                <AdminIcon />
              </IconButton>

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
                  <Button
                    fullWidth
                    onClick={() => scrollToSection(homeRef)}
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
                    Home
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => scrollToSection(productsRef)}
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
                    Products
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => scrollToSection(servicesRef)}
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
                    Services
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => scrollToSection(contactRef)}
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
                    Contact
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
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

      {/* Home Section */}
      <div ref={homeRef}>
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
                  Quality phones, laptops, and professional repair services.
                  We're here to help with all your tech needs.
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
                    onClick={() => scrollToSection(contactRef)}
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
                    <VerifiedIcon
                      sx={{ color: colors.success, fontSize: 20 }}
                    />
                    <Typography variant="body2" color={colors.gray}>
                      100% Genuine
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VerifiedIcon
                      sx={{ color: colors.success, fontSize: 20 }}
                    />
                    <Typography variant="body2" color={colors.gray}>
                      1 Year Warranty
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VerifiedIcon
                      sx={{ color: colors.success, fontSize: 20 }}
                    />
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
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
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
      </div>

      {/* Products Section */}
      <div ref={productsRef}>
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
      </div>

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
      <div ref={servicesRef}>
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
      </div>

      {/* Contact Section */}
      <div ref={contactRef}>
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: colors.light }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Typography
                  variant="overline"
                  sx={{
                    color: colors.primary,
                    fontWeight: 600,
                    letterSpacing: 2,
                    mb: 2,
                    display: "block",
                  }}
                >
                  Get in Touch
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: colors.dark,
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                    mb: 3,
                  }}
                >
                  Visit Our Store
                </Typography>

                <Stack spacing={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, md: 3 },
                      borderRadius: "16px",
                      background: colors.white,
                      border: `1px solid ${colors.lightGray}`,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: colors.primary,
                          width: { xs: 40, md: 48 },
                          height: { xs: 40, md: 48 },
                        }}
                      >
                        <LocationIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600} gutterBottom>
                          Store Location
                        </Typography>
                        <Typography color={colors.gray}>
                          Abosto, Shashemene, Ethiopia
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, md: 3 },
                      borderRadius: "16px",
                      background: colors.white,
                      border: `1px solid ${colors.lightGray}`,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: colors.primary,
                          width: { xs: 40, md: 48 },
                          height: { xs: 40, md: 48 },
                        }}
                      >
                        <TimeIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600} gutterBottom>
                          Business Hours
                        </Typography>
                        <Typography color={colors.gray}>
                          Mon-Sat: 9:00 AM - 8:00 PM
                        </Typography>
                        <Typography color={colors.gray}>
                          Sunday: 10:00 AM - 5:00 PM
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, md: 3 },
                      borderRadius: "16px",
                      background: colors.white,
                      border: `1px solid ${colors.lightGray}`,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: colors.primary,
                          width: { xs: 40, md: 48 },
                          height: { xs: 40, md: 48 },
                        }}
                      >
                        <PhoneIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600} gutterBottom>
                          Contact Info
                        </Typography>
                        <Typography color={colors.gray}>
                          +251 91 234 5678
                        </Typography>
                        <Typography color={colors.gray}>
                          info@chalamobile.com
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>

              <Grid item xs={12} md={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: "24px",
                    background: colors.white,
                    border: `1px solid ${colors.lightGray}`,
                    height: "100%",
                  }}
                >
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Send us a Message
                  </Typography>
                  <Typography color={colors.gray} sx={{ mb: 4 }}>
                    We'll get back to you within 24 hours
                  </Typography>

                  <form onSubmit={handleWhatsAppSubmit}>
                    <Stack spacing={3}>
                      <TextField
                        label="Your Name"
                        fullWidth
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            "&:hover fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                      <TextField
                        label="Phone Number"
                        fullWidth
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            "&:hover fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                      <TextField
                        label="Message"
                        multiline
                        rows={4}
                        fullWidth
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            "&:hover fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<WhatsAppIcon />}
                        sx={{
                          background: "#25D366",
                          py: { xs: 1.5, md: 1.8 },
                          borderRadius: "12px",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          fontWeight: 600,
                          textTransform: "none",
                          "&:hover": {
                            background: "#128C7E",
                          },
                        }}
                      >
                        Send via WhatsApp
                      </Button>
                    </Stack>
                  </form>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>

      {/* Footer */}
      <Box sx={{ bgcolor: colors.dark, color: colors.white, py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: colors.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Chala<span style={{ color: colors.primary }}>Mobile</span>
                </Typography>
              </Stack>
              <Typography
                sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, mb: 3 }}
              >
                Your trusted partner for quality electronics and professional
                maintenance services in Shashemene.
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton
                  onClick={() => window.open("https://facebook.com", "_blank")}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: colors.white,
                    "&:hover": { bgcolor: colors.primary },
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  onClick={() => window.open("https://twitter.com", "_blank")}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: colors.white,
                    "&:hover": { bgcolor: colors.primary },
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  onClick={() => window.open("https://linkedin.com", "_blank")}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: colors.white,
                    "&:hover": { bgcolor: colors.primary },
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Stack>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Links
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mb: 1.5,
                  cursor: "pointer",
                  "&:hover": { color: colors.primary },
                }}
                onClick={() => scrollToSection(homeRef)}
              >
                Home
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mb: 1.5,
                  cursor: "pointer",
                  "&:hover": { color: colors.primary },
                }}
                onClick={() => scrollToSection(productsRef)}
              >
                Products
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mb: 1.5,
                  cursor: "pointer",
                  "&:hover": { color: colors.primary },
                }}
                onClick={() => scrollToSection(servicesRef)}
              >
                Services
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mb: 1.5,
                  cursor: "pointer",
                  "&:hover": { color: colors.primary },
                }}
                onClick={() => scrollToSection(contactRef)}
              >
                Contact
              </Typography>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                More
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mb: 1.5,
                  cursor: "pointer",
                  "&:hover": { color: colors.primary },
                }}
                onClick={() => navigate("/repair-request")}
              >
                Repair Request
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mb: 1.5,
                  cursor: "pointer",
                  "&:hover": { color: colors.primary },
                }}
                onClick={() => navigate("/about")}
              >
                About Us
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mb: 1.5,
                  cursor: "pointer",
                  "&:hover": { color: colors.primary },
                }}
                onClick={handleAdminLogin}
              >
                Admin Login
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Newsletter
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mb: 2,
                  fontSize: "0.9rem",
                }}
              >
                Subscribe to get updates about new products and special offers
              </Typography>
              <form onSubmit={handleNewsletterSubmit}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    placeholder="Your email"
                    size="small"
                    fullWidth
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    type="email"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      "& .MuiInputBase-input": { color: colors.white },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: colors.primary,
                      whiteSpace: "nowrap",
                      borderRadius: "8px",
                      "&:hover": { bgcolor: colors.secondary },
                    }}
                  >
                    Subscribe
                  </Button>
                </Stack>
              </form>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              © {new Date().getFullYear()} Chala Mobile. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography
                onClick={() => navigate("/privacy")}
                sx={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  "&:hover": { color: colors.primary },
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                onClick={() => navigate("/terms")}
                sx={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  "&:hover": { color: colors.primary },
                }}
              >
                Terms of Service
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Floating WhatsApp */}
      <IconButton
        href="https://wa.me/251912345678"
        target="_blank"
        sx={{
          position: "fixed",
          bottom: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          bgcolor: "#25D366",
          color: colors.white,
          width: { xs: 50, md: 60 },
          height: { xs: 50, md: 60 },
          "&:hover": {
            bgcolor: "#128C7E",
            transform: "scale(1.1)",
          },
          boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
      >
        <WhatsAppIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
      </IconButton>
    </Box>
  );
}
