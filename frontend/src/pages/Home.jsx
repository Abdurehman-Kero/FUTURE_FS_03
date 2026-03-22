import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { Badge } from "@mui/material";
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
  Slide,
  Zoom,
  Grow,
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
  ShoppingCart as ShoppingCartIcon,
  ChevronRight as ChevronRightIcon,
  Verified as VerifiedIcon,
  SupportAgent as SupportIcon,
  Star as StarIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  Computer as ComputerIcon,
  Tablet as TabletIcon,
  Headset as HeadsetIcon,
  Watch as WatchIcon,
  Camera as CameraIcon,
  Speaker as SpeakerIcon,
  Gamepad as GamepadIcon,
  Security as SecurityIcon,
  LocalShipping as ShippingIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced Color palette
const colors = {
  primary: "#FF8500",
  primaryDark: "#E67600",
  secondary: "#FFA33C",
  accent: "#4A90E2",
  dark: "#1E1A3A",
  light: "#F8F9FF",
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  darkGradient: "linear-gradient(135deg, #1E1A3A 0%, #2D2A5A 100%)",
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Enhanced Featured Products
const featuredProducts = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    category: "Smartphones",
    price: "From $899",
    image: "http://i.imgur.com/fRYR2yP.png",
    rating: 4.8,
    reviews: 128,
    slug: "iphone-14-pro",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "MacBook Pro 14",
    category: "Laptops",
    price: "From $1,299",
    image: "https://i.imgur.com/Omysr24.jpeg",
    rating: 4.9,
    reviews: 89,
    slug: "macbook-pro-14",
    badge: "New",
  },
  {
    id: 3,
    name: "Samsung Galaxy S23",
    category: "Smartphones",
    price: "From $799",
    image: "https://i.imgur.com/xBasVwP.png",
    rating: 4.7,
    reviews: 215,
    slug: "samsung-galaxy-s23",
    badge: "Hot Deal",
  },
  {
    id: 4,
    name: "iPad Pro",
    category: "Tablets",
    price: "From $699",
    image: "https://i.imgur.com/G9zwfMm.png",
    rating: 4.8,
    reviews: 156,
    slug: "ipad-pro",
    badge: "Limited",
  },
];

// Categories with icons
const categories = [
  {
    id: 1,
    name: "Smartphones",
    icon: "📱",
    count: 45,
    slug: "smartphones",
    color: "#FF8500",
  },
  {
    id: 2,
    name: "Laptops",
    icon: "💻",
    count: 32,
    slug: "laptops",
    color: "#4A90E2",
  },
  {
    id: 3,
    name: "Tablets",
    icon: "📟",
    count: 18,
    slug: "tablets",
    color: "#10B981",
  },
  {
    id: 4,
    name: "Accessories",
    icon: "🎧",
    count: 67,
    slug: "accessories",
    color: "#F59E0B",
  },
];

// What We Sell - Expanded with animations
const whatWeSell = [
  {
    icon: <PhoneIcon sx={{ fontSize: 40 }} />,
    title: "Smartphones",
    desc: "New & used iPhones, Samsung, Tecno, Infinix",
    brands: "Apple, Samsung, Huawei, Xiaomi",
    price: "From $100",
    slug: "smartphones",
  },
  {
    icon: <LaptopIcon sx={{ fontSize: 40 }} />,
    title: "Laptops",
    desc: "HP, Dell, Lenovo, MacBooks for work & gaming",
    brands: "HP, Dell, Lenovo, Apple, Acer",
    price: "From $300",
    slug: "laptops",
  },
  {
    icon: <TabletIcon sx={{ fontSize: 40 }} />,
    title: "Tablets",
    desc: "iPads, Samsung tablets for entertainment & work",
    brands: "Apple, Samsung, Huawei",
    price: "From $200",
    slug: "tablets",
  },
  {
    icon: <HeadsetIcon sx={{ fontSize: 40 }} />,
    title: "Audio",
    desc: "Headphones, earphones, speakers, earbuds",
    brands: "JBL, Sony, Bose, Anker",
    price: "From $20",
    slug: "audio",
  },
  {
    icon: <WatchIcon sx={{ fontSize: 40 }} />,
    title: "Wearables",
    desc: "Smartwatches, fitness trackers, smart bands",
    brands: "Apple Watch, Samsung, Fitbit",
    price: "From $150",
    slug: "wearables",
  },
  {
    icon: <CameraIcon sx={{ fontSize: 40 }} />,
    title: "Cameras",
    desc: "Digital cameras, webcams, security cameras",
    brands: "Canon, Nikon, Sony, Logitech",
    price: "From $200",
    slug: "cameras",
  },
  {
    icon: <SpeakerIcon sx={{ fontSize: 40 }} />,
    title: "Speakers",
    desc: "Bluetooth speakers, soundbars, home audio",
    brands: "JBL, Bose, Sony, Anker",
    price: "From $30",
    slug: "speakers",
  },
  {
    icon: <GamepadIcon sx={{ fontSize: 40 }} />,
    title: "Gaming",
    desc: "Consoles, controllers, gaming accessories",
    brands: "PlayStation, Xbox, Nintendo",
    price: "From $40",
    slug: "gaming",
  },
];

// Services with enhanced descriptions
const services = [
  {
    icon: <BuildIcon sx={{ fontSize: 40 }} />,
    title: "Expert Repairs",
    desc: "Screen replacement, battery service, water damage repair",
    price: "From $20",
    slug: "repairs",
    features: ["24hr turnaround", "Genuine parts", "Warranty included"],
  },
  {
    icon: <LaptopIcon sx={{ fontSize: 40 }} />,
    title: "Maintenance",
    desc: "Computer cleaning, virus removal, performance optimization",
    price: "From $15",
    slug: "maintenance",
    features: ["Free diagnosis", "Software updates", "Data backup"],
  },
  {
    icon: <SupportIcon sx={{ fontSize: 40 }} />,
    title: "24/7 Support",
    desc: "Technical support and consultation, remote assistance",
    price: "Free",
    slug: "support",
    features: ["Phone support", "Remote access", "Video calls"],
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
    title: "Warranty Service",
    desc: "1-year warranty on all repairs and genuine parts",
    price: "Included",
    slug: "warranty",
    features: ["Parts warranty", "Labor warranty", "Free checkup"],
  },
];

// Stats for social proof
const stats = [
  { value: "5000+", label: "Happy Customers", icon: <StarIcon /> },
  { value: "1000+", label: "Devices Repaired", icon: <BuildIcon /> },
  { value: "98%", label: "Satisfaction Rate", icon: <VerifiedIcon /> },
  { value: "24/7", label: "Support Available", icon: <SupportIcon /> },
];

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    email: "",
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Refs for sections
  const homeRef = useRef(null);
  const productsRef = useRef(null);
  const sellRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);

      // Active section detection
      const sections = [
        { ref: homeRef, name: "home" },
        { ref: productsRef, name: "products" },
        { ref: sellRef, name: "sell" },
        { ref: servicesRef, name: "services" },
        { ref: contactRef, name: "contact" },
      ];

      for (const section of sections) {
        if (section.ref.current) {
          const offset = section.ref.current.offsetTop - 150;
          if (scrollPosition >= offset) {
            setActiveSection(section.name);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const subject = `Contact from ${formData.name}`;
    const body = `Name: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0A%0AMessage:%0A${formData.message}`;
    window.location.href = `mailto:keroabdurehman@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    setFormData({ name: "", phone: "", message: "", email: "" });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const subject = "Newsletter Subscription";
    const body = `Email: ${newsletterEmail} wants to subscribe to newsletter.`;
    window.location.href = `mailto:keroabdurehman@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    alert("Thank you for subscribing! We'll send you an email confirmation.");
    setNewsletterEmail("");
  };

  const scrollToSection = (sectionRef) => {
    if (sectionRef && sectionRef.current) {
      window.scrollTo({
        top: sectionRef.current.offsetTop - 80,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  const { cartCount } = useCart();

  const handleNavigation = (path, section = null) => {
    if (path === "/" && section) {
      switch (section) {
        case "home":
          scrollToSection(homeRef);
          break;
        case "products":
          scrollToSection(productsRef);
          break;
        case "sell":
          scrollToSection(sellRef);
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
      navigate(path);
    }
    setMobileMenuOpen(false);
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.slug}`);
    setMobileMenuOpen(false);
  };

  const handleProductClick = (product) => {
    navigate(`/products?product=${product.slug}`);
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

  const handleSellItemClick = (item) => {
    navigate(`/products?category=${item.slug}`);
  };

  return (
    <Box sx={{ bgcolor: colors.light, minHeight: "100vh" }}>
      {/* Sticky Header */}
      <Box
        component={motion.div}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          width: "100%",
          bgcolor: scrolled ? alpha(colors.white, 0.98) : colors.white,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled
            ? `0 4px 20px ${alpha(colors.primary, 0.15)}`
            : "none",
          borderBottom: scrolled
            ? `1px solid ${alpha(colors.primary, 0.15)}`
            : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ py: { xs: 1.2, md: 1.8 } }}
          >
            {/* Logo Section */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                onClick={() => scrollToSection(homeRef)}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    width: { xs: 38, md: 42 },
                    height: { xs: 38, md: 42 },
                    borderRadius: "12px",
                    background: colors.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 10px ${alpha(colors.primary, 0.4)}`,
                  }}
                >
                  <Typography
                    sx={{
                      color: colors.white,
                      fontWeight: 700,
                      fontSize: { xs: "1rem", md: "1.2rem" },
                    }}
                  >
                    CM
                  </Typography>
                </Box>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      background: colors.gradient,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      lineHeight: 1.2,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Chala<span style={{ color: colors.primary }}>Mobile</span>
                  </Typography>
                </Box>
              </Stack>
            </motion.div>

            {/* Desktop Navigation */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{
                display: { xs: "none", md: "flex" },
                flex: 1,
                mx: 3,
              }}
            >
              {[
                { name: "Home", ref: homeRef, id: "home" },
                { name: "Shop", ref: productsRef, id: "products" },
                { name: "Products", ref: sellRef, id: "sell" },
                { name: "Services", ref: servicesRef, id: "services" },
                { name: "Contact", ref: contactRef, id: "contact" },
              ].map((item) => (
                <Button
                  key={item.name}
                  onClick={() => scrollToSection(item.ref)}
                  sx={{
                    color:
                      activeSection === item.id ? colors.primary : colors.gray,
                    fontWeight: 600,
                    position: "relative",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: activeSection === item.id ? "80%" : "0%",
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
                  {item.name}
                </Button>
              ))}
            </Stack>

            {/* Desktop Right Side Actions */}
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={() => navigate("/cart")}
                  sx={{
                    color: colors.gray,
                    "&:hover": {
                      color: colors.primary,
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Badge badgeContent={cartCount} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleAdminLogin}
                  sx={{
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    "&:hover": {
                      bgcolor: colors.primary,
                      color: colors.white,
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  title="Admin Login"
                >
                  <AdminIcon />
                </IconButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  onClick={handleShopNow}
                  sx={{
                    background: colors.gradient,
                    color: colors.white,
                    borderRadius: "50px",
                    px: 3.5,
                    py: 1,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: `0 4px 15px ${alpha(colors.primary, 0.4)}`,
                    "&:hover": {
                      boxShadow: `0 6px 20px ${alpha(colors.primary, 0.6)}`,
                    },
                  }}
                >
                  Shop Now
                </Button>
              </motion.div>
            </Stack>

            {/* Mobile Header Actions */}
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                onClick={() => navigate("/cart")}
                sx={{
                  display: { xs: "flex", md: "none" },
                  color: colors.gray,
                }}
              >
                <Badge badgeContent={cartCount} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

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
                  "&:hover": {
                    bgcolor: alpha(colors.primary, 0.1),
                  },
                }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Stack>
          </Stack>

          {/* Mobile Menu Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
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
                      { name: "Home", ref: homeRef },
                      { name: "Shop", ref: productsRef },
                      { name: "Products", ref: sellRef },
                      { name: "Services", ref: servicesRef },
                      { name: "Contact", ref: contactRef },
                    ].map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Button
                          fullWidth
                          onClick={() => scrollToSection(item.ref)}
                          sx={{
                            justifyContent: "flex-start",
                            px: 3,
                            py: 1.5,
                            color: colors.dark,
                            fontWeight: 500,
                            "&:hover": {
                              bgcolor: colors.light,
                              color: colors.primary,
                            },
                          }}
                        >
                          {item.name}
                        </Button>
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
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
                    </motion.div>
                  </Stack>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Box>
      {/* Spacer for fixed header */}
      <Box sx={{ height: { xs: 70, md: 80 } }} />
      {/* Hero Section */}
      <div ref={homeRef}>
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.light} 100%)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated Background Elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(colors.primary, 0.1)} 0%, ${alpha(colors.primary, 0.05)} 100%)`,
              zIndex: 0,
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -45, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              bottom: -50,
              left: -50,
              width: 250,
              height: 250,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(colors.secondary, 0.1)} 0%, ${alpha(colors.secondary, 0.05)} 100%)`,
              zIndex: 0,
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Grid
              container
              spacing={6}
              alignItems="center"
              justifyContent="center"
            >
              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                >
                  <Chip
                    label="✨ Welcome to ChalaMobile"
                    sx={{
                      bgcolor: alpha(colors.primary, 0.1),
                      color: colors.primary,
                      mb: 3,
                      borderRadius: "50px",
                      fontWeight: 600,
                      backdropFilter: "blur(10px)",
                    }}
                  />

                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
                      color: colors.dark,
                      mb: 2,
                      lineHeight: 1.2,
                      letterSpacing: "-1px",
                    }}
                  >
                    Your Trusted Tech Partner in{" "}
                    <span
                      style={{ color: colors.primary, position: "relative" }}
                    >
                      Shashemene
                      <motion.span
                        animate={{ width: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          position: "absolute",
                          bottom: -5,
                          left: 0,
                          height: 3,
                          background: colors.gradient,
                        }}
                      />
                    </span>
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
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    sx={{
                      justifyContent: { md: "center" },
                    }}
                    spacing={2}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                          fontSize: "1rem",
                          fontWeight: 700,
                          textTransform: "none",
                          boxShadow: `0 4px 15px ${alpha(colors.primary, 0.4)}`,
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        Browse Products
                        <ChevronRightIcon sx={{ ml: 1 }} />
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
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
                          fontSize: "1rem",
                          fontWeight: 600,
                          textTransform: "none",
                          borderWidth: 2,
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        Contact Us
                      </Button>
                    </motion.div>
                  </Stack>

                  {/* Trust Indicators */}
                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{
                      mt: 4,
                      flexWrap: "wrap",
                      justifyContent: { md: "center" },
                      gap: 2,
                    }}
                  >
                    {[
                      { icon: <VerifiedIcon />, text: "100% Genuine" },
                      { icon: <VerifiedIcon />, text: "1 Year Warranty" },
                      { icon: <VerifiedIcon />, text: "Free Diagnosis" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ color: colors.success }}>{item.icon}</Box>
                          <Typography variant="body2" color={colors.gray}>
                            {item.text}
                          </Typography>
                        </Stack>
                      </motion.div>
                    ))}
                  </Stack>
                </motion.div>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: { xs: 1.5, md: 2 },
                    }}
                  >
                    {featuredProducts.slice(0, 4).map((product, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -10, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Paper
                          elevation={0}
                          onClick={() => handleProductClick(product)}
                          sx={{
                            p: { xs: 1.5, md: 2 },
                            borderRadius: "20px",
                            background: colors.white,
                            border: `1px solid ${colors.lightGray}`,
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            "&:hover": {
                              boxShadow: `0 10px 30px ${alpha(colors.primary, 0.2)}`,
                              borderColor: colors.primary,
                            },
                          }}
                        >
                          {product.badge && (
                            <Chip
                              label={product.badge}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 8,
                                left: 8,
                                bgcolor: colors.primary,
                                color: colors.white,
                                fontSize: "0.7rem",
                                fontWeight: 600,
                              }}
                            />
                          )}
                          <Box
                            sx={{
                              width: "100%",
                              height: { xs: 100, sm: 120, md: 140 },
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 1,
                            }}
                          >
                            <Box
                              component="img"
                              src={product.image}
                              alt={product.name}
                              sx={{
                                maxWidth: "90%",
                                maxHeight: "90%",
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
                            variant="subtitle2"
                            fontWeight={600}
                            noWrap
                            sx={{
                              fontSize: { xs: "0.8rem", md: "0.9rem" },
                              mt: 0.5,
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mt: 1 }}
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
                              <StarIcon
                                sx={{ color: "#FFB800", fontSize: 14 }}
                              />
                              <Typography variant="caption">
                                {product.rating}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Paper>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>
      {/* Stats Section */}
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: colors.white }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid
                key={index}
                size={{
                  xs: 6,
                  md: 3
                }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      background: colors.light,
                      borderRadius: "20px",
                      border: `1px solid ${colors.lightGray}`,
                    }}
                  >
                    <Box sx={{ color: colors.primary, mb: 1 }}>{stat.icon}</Box>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color={colors.dark}
                    >
                      {stat.value}
                    </Typography>
                    <Typography color={colors.gray}>{stat.label}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Categories Section */}
      <div ref={productsRef}>
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: colors.light }}>
          <Container maxWidth="lg">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Stack spacing={2} sx={{ mb: 6 }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: colors.primary,
                      fontWeight: 600,
                      letterSpacing: 2,
                      textAlign: "center",
                    }}
                  >
                    Shop by Category
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: colors.dark,
                      fontSize: { xs: "1.8rem", md: "2.5rem" },
                      textAlign: "center",
                    }}
                  >
                    Browse Our Collections
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: colors.gray,
                      maxWidth: 600,
                      px: 2,
                      textAlign: "center",
                    }}
                  >
                    Find exactly what you're looking for in our wide range of
                    categories
                  </Typography>
                </Box>
              </Stack>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Grid container spacing={3} justifyContent="center">
                {categories.map((category) => (
                  <Grid
                    key={category.id}
                    size={{
                      xs: 6,
                      md: 3
                    }}>
                    <motion.div variants={fadeInUp}>
                      <Paper
                        elevation={0}
                        onClick={() => handleCategoryClick(category)}
                        sx={{
                          p: { xs: 3, md: 4 },
                          textAlign: "center",
                          borderRadius: "20px",
                          background: colors.white,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          border: `1px solid ${colors.lightGray}`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            borderColor: category.color,
                            boxShadow: `0 15px 30px -10px ${alpha(category.color, 0.3)}`,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "2.5rem", md: "3rem" },
                            mb: 2,
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          {category.icon}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          gutterBottom
                          sx={{
                            fontSize: { xs: "1rem", md: "1.25rem" },
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          {category.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={colors.gray}
                          sx={{ textAlign: "center", width: "100%" }}
                        >
                          {category.count} Items
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>
      </div>
      {/* What We Sell Section */}
      <div ref={sellRef}>
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: colors.white }}>
          <Container maxWidth="lg">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Stack spacing={2} sx={{ mb: 6 }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: colors.primary,
                      fontWeight: 600,
                      letterSpacing: 2,
                      textAlign: "center",
                    }}
                  >
                    What We Sell
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: colors.dark,
                      fontSize: { xs: "1.8rem", md: "2.5rem" },
                      textAlign: "center",
                    }}
                  >
                    Quality Products at Fair Prices
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: colors.gray,
                      maxWidth: 600,
                      px: 2,
                      textAlign: "center",
                    }}
                  >
                    From smartphones to accessories, we have everything you need
                  </Typography>
                </Box>
              </Stack>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Grid container spacing={3} justifyContent="center">
                {whatWeSell.map((item, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 3
                    }}>
                    <motion.div variants={fadeInUp}>
                      <Paper
                        elevation={0}
                        onClick={() => handleSellItemClick(item)}
                        sx={{
                          p: { xs: 3, md: 3 },
                          borderRadius: "20px",
                          background: colors.white,
                          height: "100%",
                          transition: "all 0.3s ease",
                          border: `1px solid ${colors.lightGray}`,
                          textAlign: "center",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: `0 20px 40px ${alpha(colors.primary, 0.2)}`,
                            borderColor: colors.primary,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            color: colors.primary,
                            mb: 2,
                            transition: "transform 0.3s ease",
                            display: "flex",
                            justifyContent: "center",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          gutterBottom
                          sx={{ textAlign: "center", width: "100%" }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          color={colors.gray}
                          sx={{
                            mb: 1,
                            fontSize: "0.9rem",
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          {item.desc}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.gray,
                            display: "block",
                            mb: 1,
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          {item.brands}
                        </Typography>
                        <Typography
                          color={colors.primary}
                          fontWeight={700}
                          sx={{ textAlign: "center", width: "100%" }}
                        >
                          {item.price}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>
      </div>
      {/* Featured Products with Enhanced Cards */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: colors.light }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "center", sm: "center" }}
            sx={{ mb: 4 }}
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              style={{ width: "100%", textAlign: "center" }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: colors.primary,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Featured Products
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: colors.dark,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Popular This Week
              </Typography>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
            </motion.div>
          </Stack>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Grid container spacing={3} justifyContent="center">
              {featuredProducts.map((product) => (
                <Grid
                  key={product.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3
                  }}>
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ y: -10 }}
                    onHoverStart={() => setHoveredProduct(product.id)}
                    onHoverEnd={() => setHoveredProduct(null)}
                  >
                    <Card
                      onClick={() => handleProductClick(product)}
                      sx={{
                        borderRadius: "20px",
                        background: colors.white,
                        border: `1px solid ${colors.lightGray}`,
                        transition: "all 0.3s ease",
                        overflow: "hidden",
                        cursor: "pointer",
                        position: "relative",
                        "&:hover": {
                          boxShadow: `0 20px 40px ${alpha(colors.primary, 0.2)}`,
                          borderColor: colors.primary,
                        },
                      }}
                    >
                      {product.badge && (
                        <Chip
                          label={product.badge}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            bgcolor: colors.primary,
                            color: colors.white,
                            fontWeight: 600,
                            zIndex: 1,
                          }}
                        />
                      )}
                      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                        <Box
                          sx={{
                            height: { xs: 180, md: 200 },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                            bgcolor: colors.light,
                            borderRadius: "12px",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <motion.img
                            src={product.image}
                            alt={product.name}
                            animate={{
                              scale: hoveredProduct === product.id ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                              maxWidth: "80%",
                              maxHeight: "80%",
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/200x200/FF8500/FFFFFF?text=Product";
                            }}
                          />
                        </Box>

                        <Typography
                          variant="caption"
                          color={colors.gray}
                          sx={{
                            textAlign: "center",
                            display: "block",
                            width: "100%",
                          }}
                        >
                          {product.category}
                        </Typography>

                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            fontSize: { xs: "1rem", md: "1.1rem" },
                            mb: 1,
                            color: colors.dark,
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          {product.name}
                        </Typography>

                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                          sx={{ mb: 2 }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
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
                            fontWeight={800}
                            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                          >
                            {product.price}
                          </Typography>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                bgcolor: colors.primary,
                                color: colors.white,
                                "&:hover": { bgcolor: colors.secondary },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(product);
                              }}
                            >
                              <ShoppingCartIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </motion.div>
                        </Stack>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>
      {/* Services Section with Enhanced Cards */}
      <div ref={servicesRef}>
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: colors.white }}>
          <Container maxWidth="lg">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Stack spacing={2} sx={{ mb: 6 }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: colors.primary,
                      fontWeight: 600,
                      letterSpacing: 2,
                      textAlign: "center",
                    }}
                  >
                    Our Services
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: colors.dark,
                      fontSize: { xs: "1.8rem", md: "2.5rem" },
                      textAlign: "center",
                    }}
                  >
                    Professional Tech Support
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: colors.gray,
                      maxWidth: 600,
                      px: 2,
                      textAlign: "center",
                    }}
                  >
                    Expert repair and maintenance services for all your devices
                  </Typography>
                </Box>
              </Stack>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Grid container spacing={3} justifyContent="center">
                {services.map((service, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 3
                    }}>
                    <motion.div variants={fadeInUp}>
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
                          textAlign: "center",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: `0 20px 40px ${alpha(colors.primary, 0.2)}`,
                            borderColor: colors.primary,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            color: colors.primary,
                            mb: 2,
                            transition: "transform 0.3s ease",
                            display: "flex",
                            justifyContent: "center",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          {service.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          gutterBottom
                          sx={{ textAlign: "center" }}
                        >
                          {service.title}
                        </Typography>
                        <Typography
                          color={colors.gray}
                          sx={{
                            mb: 2,
                            fontSize: "0.9rem",
                            textAlign: "center",
                          }}
                        >
                          {service.desc}
                        </Typography>
                        <Typography
                          color={colors.primary}
                          fontWeight={700}
                          gutterBottom
                          sx={{ textAlign: "center" }}
                        >
                          {service.price}
                        </Typography>
                        <Stack
                          spacing={0.5}
                          sx={{ mt: 2, alignItems: "center" }}
                        >
                          {service.features.map((feature, idx) => (
                            <Typography
                              key={idx}
                              variant="caption"
                              color={colors.gray}
                              sx={{ textAlign: "center" }}
                            >
                              ✓ {feature}
                            </Typography>
                          ))}
                        </Stack>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>
      </div>
      {/* Contact Section with Enhanced Form */}
      <div ref={contactRef}>
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: colors.light }}>
          <Container maxWidth="lg">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Stack spacing={2} sx={{ mb: 6 }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: colors.primary,
                      fontWeight: 600,
                      letterSpacing: 2,
                      textAlign: "center",
                    }}
                  >
                    Get in Touch
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: colors.dark,
                      fontSize: { xs: "1.8rem", md: "2.5rem" },
                      textAlign: "center",
                    }}
                  >
                    Visit Our Store
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: colors.gray,
                      maxWidth: 600,
                      px: 2,
                      textAlign: "center",
                    }}
                  >
                    We'd love to hear from you. Send us a message and we'll
                    respond within 24 hours.
                  </Typography>
                </Box>
              </Stack>
            </motion.div>

            <Grid container spacing={4} justifyContent="center">
              <Grid
                size={{
                  xs: 12,
                  md: 5
                }}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Stack spacing={3}>
                    {[
                      {
                        icon: <LocationIcon />,
                        title: "Store Location",
                        info: "Aposto, Shashemene, Ethiopia",
                      },
                      {
                        icon: <TimeIcon />,
                        title: "Business Hours",
                        info: [
                          "Mon-Sat: 9:00 AM - 8:00 PM",
                          "Sunday: 10:00 AM - 5:00 PM",
                        ],
                      },
                      {
                        icon: <PhoneIcon />,
                        title: "Contact Info",
                        info: ["+251 98 231 0974", "keroabdurehman@gmail.com"],
                      },
                    ].map((item, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: { xs: 2, md: 3 },
                          borderRadius: "16px",
                          background: colors.white,
                          border: `1px solid ${colors.lightGray}`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateX(5px)",
                            borderColor: colors.primary,
                          },
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: alpha(colors.primary, 0.1),
                              color: colors.primary,
                              width: { xs: 40, md: 48 },
                              height: { xs: 40, md: 48 },
                            }}
                          >
                            {item.icon}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={700} gutterBottom>
                              {item.title}
                            </Typography>
                            {Array.isArray(item.info) ? (
                              item.info.map((line, i) => (
                                <Typography
                                  key={i}
                                  color={colors.gray}
                                  variant="body2"
                                >
                                  {line}
                                </Typography>
                              ))
                            ) : (
                              <Typography color={colors.gray}>
                                {item.info}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </motion.div>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 7
                }}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 5 },
                      borderRadius: "24px",
                      background: colors.white,
                      border: `1px solid ${colors.lightGray}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight={800}
                        gutterBottom
                        sx={{ textAlign: "center" }}
                      >
                        Send us a Message
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        color={colors.gray}
                        sx={{ mb: 4, textAlign: "center" }}
                      >
                        We'll get back to you within 24 hours
                      </Typography>
                    </Box>

                    <form onSubmit={handleEmailSubmit}>
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
                              transition: "all 0.3s ease",
                              "&:hover fieldset": {
                                borderColor: colors.primary,
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: colors.primary,
                              },
                            },
                          }}
                        />
                        <TextField
                          label="Email Address"
                          type="email"
                          fullWidth
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
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
                          label="Phone Number (Optional)"
                          fullWidth
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
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
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
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
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ width: "100%" }}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              startIcon={<EmailIcon />}
                              sx={{
                                background: colors.gradient,
                                py: { xs: 1.5, md: 1.8 },
                                borderRadius: "12px",
                                fontSize: { xs: "0.9rem", md: "1rem" },
                                fontWeight: 700,
                                textTransform: "none",
                                width: "100%",
                                "&:hover": {
                                  background: colors.secondary,
                                },
                              }}
                            >
                              Send via Email
                            </Button>
                          </motion.div>
                        </Box>
                      </Stack>
                    </form>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>
      {/* Footer - Full Width */}
      <Box
        sx={{
          bgcolor: colors.dark,
          color: colors.white,
          py: 6,
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          ml: "-50vw",
          mr: "-50vw",
          mt: "auto",
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid
              size={{
                xs: 12,
                md: 4
              }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 3, cursor: "pointer" }}
                  onClick={() => scrollToSection(homeRef)}
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
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Chala<span style={{ color: colors.primary }}>Mobile</span>
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.8,
                    mb: 3,
                  }}
                >
                  Your trusted partner for quality electronics and professional
                  maintenance services in Shashemene.
                </Typography>
                <Stack direction="row" spacing={2}>
                  {[
                    { icon: <FacebookIcon />, url: "https://facebook.com" },
                    { icon: <TwitterIcon />, url: "https://twitter.com" },
                    { icon: <LinkedInIcon />, url: "https://linkedin.com" },
                  ].map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        onClick={() => window.open(social.url, "_blank")}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.1)",
                          color: colors.white,
                          "&:hover": { bgcolor: colors.primary },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Stack>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid
              size={{
                xs: 6,
                md: 2
              }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
                  Quick Links
                </Typography>
                {[
                  { name: "Home", action: () => scrollToSection(homeRef) },
                  { name: "Shop", action: handleShopNow },
                  {
                    name: "Products",
                    action: () => scrollToSection(sellRef),
                  },
                  {
                    name: "Services",
                    action: () => scrollToSection(servicesRef),
                  },
                  {
                    name: "Contact",
                    action: () => scrollToSection(contactRef),
                  },
                ].map((link, index) => (
                  <Typography
                    key={index}
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      mb: 1.5,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "color 0.3s ease",
                      "&:hover": { color: colors.primary },
                    }}
                    onClick={link.action}
                  >
                    {link.name}
                  </Typography>
                ))}
              </motion.div>
            </Grid>

            {/* More Links */}
            <Grid
              size={{
                xs: 6,
                md: 2
              }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
                  More
                </Typography>
                {[
                  { name: "Repair Request", path: "/repair-request" },
                  { name: "About Us", path: "/about" },
                  { name: "Admin Login", path: "/login" },
                ].map((link, index) => (
                  <Typography
                    key={index}
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      mb: 1.5,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "color 0.3s ease",
                      "&:hover": { color: colors.primary },
                    }}
                    onClick={() => navigate(link.path)}
                  >
                    {link.name}
                  </Typography>
                ))}
              </motion.div>
            </Grid>

            {/* Newsletter */}
            <Grid
              size={{
                xs: 12,
                md: 4
              }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
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
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          bgcolor: colors.primary,
                          whiteSpace: "nowrap",
                          borderRadius: "8px",
                          fontWeight: 600,
                          "&:hover": { bgcolor: colors.secondary },
                        }}
                      >
                        Subscribe
                      </Button>
                    </motion.div>
                  </Stack>
                </form>
              </motion.div>
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
                fontSize: "0.85rem",
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
                  fontSize: "0.85rem",
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
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  "&:hover": { color: colors.primary },
                }}
              >
                Terms of Service
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
      {/* Floating WhatsApp with Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <IconButton
          href="https://wa.me/251982310974"
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
            },
            boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
            zIndex: 1000,
          }}
        >
          <WhatsAppIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
        </IconButton>
      </motion.div>
    </Box>
  );
}
