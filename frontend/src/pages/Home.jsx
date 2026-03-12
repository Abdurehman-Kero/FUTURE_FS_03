import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Stack,
  Divider,
  alpha,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  Build as BuildIcon,
  ShoppingCart as CartIcon,
  PhoneAndroid as MobileIcon,
  Laptop as LaptopIcon,
  Headset as AccessoryIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowIcon,
  Star as StarIcon,
  People as PeopleIcon,
  Verified as VerifiedIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const colors = {
  primary: "#BE3300",
  secondary: "#344767",
  footer: "#23262A",
  white: "#FFFFFF",
  lightGray: "#F8F9FA",
  mediumGray: "#E9ECEF",
  darkGray: "#6C757D",
};

const services = [
  {
    icon: <BuildIcon sx={{ fontSize: 40 }} />,
    title: "Phone Repairs",
    description:
      "Screen replacement, battery change, water damage repair for all brands.",
  },
  {
    icon: <LaptopIcon sx={{ fontSize: 40 }} />,
    title: "Computer Services",
    description:
      "Laptop repairs, software installation, virus removal, hardware upgrades.",
  },
  {
    icon: <MobileIcon sx={{ fontSize: 40 }} />,
    title: "New & Used Phones",
    description: "Quality devices at competitive prices with warranty.",
  },
  {
    icon: <AccessoryIcon sx={{ fontSize: 40 }} />,
    title: "Accessories",
    description: "Chargers, cases, screen protectors, power banks, and more.",
  },
];

const stats = [
  { value: "500+", label: "Repairs Completed" },
  { value: "1000+", label: "Happy Customers" },
  { value: "4+", label: "Years Experience" },
  { value: "24h", label: "Fast Turnaround" },
];

const benefits = [
  {
    icon: <VerifiedIcon />,
    title: "Certified Technicians",
    description: "Experienced professionals with expertise in all major brands",
  },
  {
    icon: <SecurityIcon />,
    title: "Quality Guaranteed",
    description: "90-day warranty on all repairs and parts",
  },
  {
    icon: <SpeedIcon />,
    title: "Quick Service",
    description: "Most repairs completed within 24 hours",
  },
  {
    icon: <PeopleIcon />,
    title: "Trusted by Locals",
    description: "Serving Shashemene community for years",
  },
];

const testimonials = [
  {
    name: "Abebe Kebede",
    rating: 5,
    comment: "Fixed my iPhone screen in just 2 hours. Great service!",
    location: "Shashemene",
  },
  {
    name: "Almaz Tadese",
    rating: 5,
    comment: "Bought a used Samsung phone. Works perfectly!",
    location: "Abosto",
  },
  {
    name: "Tigist Haile",
    rating: 5,
    comment: "Professional laptop repair. They recovered all my data.",
    location: "Kuyera",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const message = `Hello Chala Mobile, I'm ${contactForm.name}. ${contactForm.message}`;
    window.open(
      `https://wa.me/251912345678?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <Box>
      {/* Navigation */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: colors.primary, fontWeight: 700, cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Chala Mobile
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/login")}
              sx={{ borderColor: colors.primary, color: colors.primary }}
            >
              Staff Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          bgcolor: colors.lightGray,
          pt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Your Trusted
                <Typography
                  component="span"
                  sx={{
                    color: colors.primary,
                    display: "block",
                    fontSize: "inherit",
                    fontWeight: 700,
                  }}
                >
                  Phone & Computer Expert
                </Typography>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: colors.darkGray,
                  fontWeight: 400,
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Professional repairs, quality devices, and genuine accessories.
                Serving Shashemene with care and expertise since 2020.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/repair-request")}
                  sx={{
                    bgcolor: colors.primary,
                    color: colors.white,
                    py: 1.8,
                    px: 4,
                    "&:hover": { bgcolor: "#A02B00" },
                  }}
                >
                  Request Repair
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/products")}
                  sx={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    py: 1.8,
                    px: 4,
                    borderWidth: 2,
                  }}
                >
                  Browse Products
                </Button>
              </Stack>
              <Grid container spacing={3} sx={{ mt: 6 }}>
                {stats.map((stat, index) => (
                  <Grid size={{ xs: 6, sm: 3 }} key={index}>
                    <Typography
                      variant="h5"
                      sx={{ color: colors.primary, fontWeight: 700 }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.darkGray }}>
                      {stat.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Phone Repair"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{ fontSize: "2.5rem", fontWeight: 600, mb: 2 }}
          >
            Our Services
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.darkGray, maxWidth: 600, mx: "auto" }}
          >
            Comprehensive solutions for all your mobile and computer needs
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 1,
                  boxShadow: "none",
                  border: `1px solid ${colors.mediumGray}`,
                  transition: "all 0.2s",
                  "&:hover": { borderColor: colors.primary },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: alpha(colors.primary, 0.1),
                      color: colors.primary,
                      mb: 2,
                    }}
                  >
                    {service.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.darkGray }}>
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                p: 4,
                bgcolor: alpha(colors.primary, 0.03),
                borderRadius: 2,
                border: `1px solid ${alpha(colors.primary, 0.1)}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{ bgcolor: colors.primary, mr: 2, width: 48, height: 48 }}
                >
                  <CartIcon />
                </Avatar>
                <Typography variant="h5" fontWeight="600">
                  Buy Quality Devices
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ color: colors.darkGray, mb: 3 }}
              >
                Browse our collection of new and used phones, laptops, and
                accessories. All devices are tested and come with warranty.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/products")}
                endIcon={<ArrowIcon />}
                sx={{
                  bgcolor: colors.primary,
                  "&:hover": { bgcolor: "#A02B00" },
                }}
              >
                Shop Now
              </Button>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                p: 4,
                bgcolor: alpha(colors.secondary, 0.03),
                borderRadius: 2,
                border: `1px solid ${alpha(colors.secondary, 0.1)}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: colors.secondary,
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <BuildIcon />
                </Avatar>
                <Typography variant="h5" fontWeight="600">
                  Professional Repairs
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ color: colors.darkGray, mb: 3 }}
              >
                Fast and reliable repair service for all phone and computer
                issues. Free diagnosis with every repair.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/repair-request")}
                endIcon={<ArrowIcon />}
                sx={{
                  bgcolor: colors.secondary,
                  "&:hover": { bgcolor: "#2A3750" },
                }}
              >
                Request Repair
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Why Choose Us */}
      <Box sx={{ bgcolor: colors.secondary, py: 8, mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 600,
                  color: colors.white,
                  mb: 3,
                }}
              >
                Why Choose Us?
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: alpha(colors.white, 0.8), mb: 4, lineHeight: 1.8 }}
              >
                We're committed to providing the best service experience for
                every customer who walks through our door.
              </Typography>
              <Stack spacing={3}>
                {benefits.map((benefit, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(colors.white, 0.1),
                        color: colors.white,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {benefit.icon}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: colors.white, fontWeight: 600, mb: 0.5 }}
                      >
                        {benefit.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: alpha(colors.white, 0.7) }}
                      >
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our Workshop"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{ fontSize: "2.5rem", fontWeight: 600, mb: 2 }}
          >
            What Our Customers Say
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: "none",
                  border: `1px solid ${colors.mediumGray}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        sx={{
                          color:
                            i < testimonial.rating
                              ? "#FFB800"
                              : colors.mediumGray,
                          fontSize: 20,
                        }}
                      />
                    ))}
                  </Box>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ color: colors.darkGray }}
                  >
                    "{testimonial.comment}"
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ bgcolor: colors.primary }}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact */}
      <Box sx={{ bgcolor: colors.lightGray, py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="h2"
                sx={{ fontSize: "2.5rem", fontWeight: 600, mb: 3 }}
              >
                Get in Touch
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: colors.darkGray, mb: 4, lineHeight: 1.8 }}
              >
                Have a question or need assistance? We're here to help. Visit us
                or send a message.
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LocationIcon sx={{ color: colors.primary }} />
                  <Typography variant="body2">
                    Abosto, Shashemene, West Arsi, Oromia, Ethiopia
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PhoneIcon sx={{ color: colors.primary }} />
                  <Typography variant="body2">+251 91 234 5678</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TimeIcon sx={{ color: colors.primary }} />
                  <Typography variant="body2">
                    Mon-Sat: 9AM-8PM | Sun: 10AM-5PM
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <EmailIcon sx={{ color: colors.primary }} />
                  <Typography variant="body2">info@chalamobile.com</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "none",
                  border: `1px solid ${colors.mediumGray}`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <form onSubmit={handleContactSubmit}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              name: e.target.value,
                            })
                          }
                          required
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={contactForm.phone}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              phone: e.target.value,
                            })
                          }
                          required
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Message"
                          multiline
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              message: e.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="large"
                          startIcon={<WhatsAppIcon />}
                          sx={{
                            bgcolor: colors.primary,
                            "&:hover": { bgcolor: "#A02B00" },
                            py: 1.5,
                          }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Map */}
      <Box sx={{ height: 400, width: "100%" }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.000000000000!2d38.000000!3d7.000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDAnMDAuMCJOIDM4wrAwMCcwMC4wIkU!5e0!3m2!1sen!2set!4v1620000000000!5m2!1sen!2set"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Chala Mobile Location"
        />
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: colors.footer, color: colors.white, py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="h6"
                sx={{ color: colors.white, fontWeight: 600, mb: 2 }}
              >
                Chala Mobile
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: alpha(colors.white, 0.7), mb: 2 }}
              >
                Your trusted partner for phone and computer solutions in
                Shashemene.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{ color: colors.white, fontWeight: 600, mb: 2 }}
              >
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  onClick={() => navigate("/")}
                  sx={{
                    color: alpha(colors.white, 0.7),
                    cursor: "pointer",
                    "&:hover": { color: colors.white },
                  }}
                >
                  Home
                </Typography>
                <Typography
                  variant="body2"
                  onClick={() => navigate("/products")}
                  sx={{
                    color: alpha(colors.white, 0.7),
                    cursor: "pointer",
                    "&:hover": { color: colors.white },
                  }}
                >
                  Products
                </Typography>
                <Typography
                  variant="body2"
                  onClick={() => navigate("/repair-request")}
                  sx={{
                    color: alpha(colors.white, 0.7),
                    cursor: "pointer",
                    "&:hover": { color: colors.white },
                  }}
                >
                  Repair Request
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{ color: colors.white, fontWeight: 600, mb: 2 }}
              >
                Connect With Us
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  href="https://wa.me/251912345678"
                  target="_blank"
                  sx={{
                    color: colors.white,
                    bgcolor: alpha(colors.white, 0.1),
                    "&:hover": { bgcolor: alpha(colors.white, 0.2) },
                  }}
                >
                  <WhatsAppIcon />
                </IconButton>
                <IconButton
                  href="tel:+251912345678"
                  sx={{
                    color: colors.white,
                    bgcolor: alpha(colors.white, 0.1),
                    "&:hover": { bgcolor: alpha(colors.white, 0.2) },
                  }}
                >
                  <PhoneIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: alpha(colors.white, 0.1), my: 3 }} />
          <Typography
            variant="body2"
            align="center"
            sx={{ color: alpha(colors.white, 0.5) }}
          >
            © {new Date().getFullYear()} Chala Mobile Solutions Hub. All rights
            reserved.
          </Typography>
        </Container>
      </Box>

      {/* Floating WhatsApp */}
      <IconButton
        href="https://wa.me/251912345678"
        target="_blank"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          bgcolor: "#25D366",
          color: colors.white,
          width: 56,
          height: 56,
          "&:hover": { bgcolor: "#128C7E", transform: "scale(1.1)" },
          boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
          zIndex: 1000,
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 28 }} />
      </IconButton>
    </Box>
  );
};

export default Home;
