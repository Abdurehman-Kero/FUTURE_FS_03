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

 
}
