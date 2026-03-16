import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Avatar,
  alpha,
  Pagination,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  WhatsApp as WhatsAppIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/api";

// Color palette matching homepage
const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  dark: "#1E1A3A",
  light: "#F8F9FF",
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  success: "#10B981",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
};

// Category configuration
const categoryConfig = {
  phone: {
    label: "Phones",
    color: "#FF8500",
    bgColor: "#FFF4E6",
    icon: "📱",
  },
  laptop: {
    label: "Laptops",
    color: "#4A90E2",
    bgColor: "#E8F0FE",
    icon: "💻",
  },
  tablet: {
    label: "Tablets",
    color: "#9C27B0",
    bgColor: "#F3E5F5",
    icon: "📟",
  },
  accessory: {
    label: "Accessories",
    color: "#10B981",
    bgColor: "#E8F5E9",
    icon: "🎧",
  },
};

const PublicProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching products...");
      const res = await getProducts();
      console.log("API Response:", res);
      console.log("Products data:", res.data);

      if (res.data && res.data.data) {
        setProducts(res.data.data);
        console.log("Products set:", res.data.data.length);
      } else {
        console.log("No products data in response");
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      setError(error.message);
      if (error.response) {
        console.log(
          "Error response:",
          error.response.status,
          error.response.data,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "all" || p.category === categoryFilter),
  );

  const displayedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleWhatsApp = (product) => {
    const msg = `Hello Chala Mobile, I'm interested in:%0A%0A*Product:* ${product.name}%0A*Brand:* ${product.brand} ${product.model}%0A*Price:* ETB ${product.price}%0A*Condition:* ${product.type}`;
    window.open(
      `https://wa.me/251912345678?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography>Loading products...</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="error">Error: {error}</Typography>
            <Button
              variant="contained"
              onClick={loadProducts}
              sx={{ mt: 2, bgcolor: colors.primary }}
            >
              Retry
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.light, minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header with Back Button */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={handleBackToHome}
              sx={{
                bgcolor: colors.white,
                border: `1px solid ${colors.lightGray}`,
                borderRadius: "12px",
                "&:hover": {
                  bgcolor: colors.primary,
                  color: colors.white,
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="600" color={colors.dark}>
                Our Products
              </Typography>
              <Typography variant="body2" color={colors.gray}>
                Browse our collection of quality devices and accessories
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={handleBackToHome}
            sx={{
              borderColor: colors.primary,
              color: colors.primary,
              borderRadius: "50px",
              px: 3,
              display: { xs: "none", sm: "flex" },
              "&:hover": {
                borderColor: colors.secondary,
                color: colors.secondary,
                bgcolor: alpha(colors.primary, 0.05),
              },
            }}
          >
            Back to Home
          </Button>
        </Stack>

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: "20px",
            border: `1px solid ${colors.lightGray}`,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                placeholder="Search by product name or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: colors.primary }} />
                    </InputAdornment>
                  ),
                }}
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&:hover fieldset": {
                      borderColor: colors.primary,
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ color: colors.gray }}>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                  sx={{
                    borderRadius: "12px",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.primary,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.primary,
                    },
                  }}
                >
                  <MenuItem value="all">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <span>📦</span>
                      <span>All Categories</span>
                    </Stack>
                  </MenuItem>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <span>{config.icon}</span>
                        <span>{config.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Active Filters */}
          {searchTerm && (
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm("")}
                size="small"
                sx={{
                  bgcolor: alpha(colors.primary, 0.1),
                  color: colors.primary,
                  "& .MuiChip-deleteIcon": {
                    color: colors.primary,
                  },
                }}
              />
            </Stack>
          )}
        </Paper>

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <Grid container spacing={3}>
            {displayedProducts.map((p) => {
              const category = categoryConfig[p.category] || {
                label: p.category,
                color: colors.gray,
                bgColor: colors.lightGray,
                icon: "📦",
              };

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={p.id}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      borderRadius: "20px",
                      border: `1px solid ${colors.lightGray}`,
                      boxShadow: "none",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: `0 20px 40px ${alpha(colors.primary, 0.15)}`,
                        borderColor: colors.primary,
                      },
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Box
                        sx={{
                          height: 160,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                          bgcolor: category.bgColor,
                          borderRadius: "12px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          component="img"
                          src={`https://via.placeholder.com/300x160/${category.color.slice(1)}/ffffff?text=${p.category}`}
                          alt={p.name}
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
                        <Chip
                          label={category.label}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: colors.white,
                            color: category.color,
                            fontWeight: 500,
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: colors.gray }}
                        >
                          {p.brand}
                        </Typography>
                        <Chip
                          label={p.type}
                          size="small"
                          sx={{
                            bgcolor:
                              p.type === "new"
                                ? alpha(colors.success, 0.1)
                                : alpha(colors.primary, 0.1),
                            color:
                              p.type === "new"
                                ? colors.success
                                : colors.primary,
                            fontWeight: 500,
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: colors.dark,
                          mb: 0.5,
                        }}
                      >
                        {p.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: colors.gray, mb: 2 }}
                      >
                        {p.model}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: colors.primary,
                            fontWeight: 700,
                            fontSize: "1.1rem",
                          }}
                        >
                          ETB {p.price?.toLocaleString()}
                        </Typography>
                        <Chip
                          label={`Stock: ${p.stock_quantity}`}
                          size="small"
                          sx={{
                            bgcolor:
                              p.stock_quantity > 5
                                ? alpha(colors.success, 0.1)
                                : p.stock_quantity > 0
                                  ? alpha(colors.primary, 0.1)
                                  : alpha("#f44336", 0.1),
                            color:
                              p.stock_quantity > 5
                                ? colors.success
                                : p.stock_quantity > 0
                                  ? colors.primary
                                  : "#f44336",
                            fontWeight: 500,
                          }}
                        />
                      </Box>

                      {p.stock_quantity > 0 ? (
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<WhatsAppIcon />}
                          onClick={() => handleWhatsApp(p)}
                          sx={{
                            bgcolor: "#25D366",
                            color: colors.white,
                            borderRadius: "12px",
                            py: 1,
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                              bgcolor: "#128C7E",
                            },
                          }}
                        >
                          Inquire via WhatsApp
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          disabled
                          sx={{
                            borderRadius: "12px",
                            py: 1,
                            textTransform: "none",
                          }}
                        >
                          Out of Stock
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: "20px",
              bgcolor: colors.white,
            }}
          >
            <Typography variant="h6" color={colors.gray} gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color={colors.gray}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
              }}
              sx={{
                mt: 2,
                borderColor: colors.primary,
                color: colors.primary,
                "&:hover": {
                  borderColor: colors.secondary,
                  color: colors.secondary,
                },
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
              mb: 2,
            }}
          >
            <Pagination
              count={Math.ceil(filteredProducts.length / itemsPerPage)}
              page={page}
              onChange={(e, v) => setPage(v)}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "10px",
                  "&.Mui-selected": {
                    bgcolor: colors.primary,
                    color: colors.white,
                    "&:hover": {
                      bgcolor: colors.secondary,
                    },
                  },
                },
              }}
            />
          </Box>
        )}

        {/* Mobile Back Button */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={handleBackToHome}
            fullWidth
            sx={{
              borderColor: colors.primary,
              color: colors.primary,
              borderRadius: "50px",
              py: 1.2,
              "&:hover": {
                borderColor: colors.secondary,
                color: colors.secondary,
                bgcolor: alpha(colors.primary, 0.05),
              },
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PublicProducts;
