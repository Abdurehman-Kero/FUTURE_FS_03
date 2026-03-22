import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Stack,
  IconButton,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  dark: "#1E1A3A",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
};

const Footer = () => {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const subject = "Newsletter Subscription";
    const body = `Email: ${newsletterEmail} wants to subscribe to newsletter.`;
    window.location.href = `mailto:keroabdurehman@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    alert("Thank you for subscribing! We'll send you an email confirmation.");
    setNewsletterEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        bgcolor: colors.dark,
        color: "white",
        py: 6,
        width: "100%",
        position: "relative",
        left: 0,
        right: 0,
        mx: 0,
        my: 0,
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
          <Grid item xs={12} md={4}>
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
                onClick={scrollToTop}
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
                      color: "white",
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
                        color: "white",
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
          <Grid item xs={6} md={2}>
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
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Services", path: "/services" },
                { name: "Contact", path: "/contact" },
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

          {/* More Links */}
          <Grid item xs={6} md={2}>
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
          <Grid item xs={12} md={4}>
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
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
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
  );
};

export default Footer;
