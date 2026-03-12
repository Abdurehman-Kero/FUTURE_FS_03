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
} from "@mui/material";
import {
  Search as SearchIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import { getProducts } from "../services/api";

const PublicProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.data);
    } catch (error) {
      console.error("Failed to load products");
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
    const msg = `Hello, I'm interested in: ${product.name} - ETB ${product.price}`;
    window.open(
      `https://wa.me/251912345678?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="600" gutterBottom>
          Our Products
        </Typography>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="phone">Phones</MenuItem>
                  <MenuItem value="laptop">Laptops</MenuItem>
                  <MenuItem value="accessory">Accessories</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={3}>
          {displayedProducts.map((p) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={p.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={`https://via.placeholder.com/300x160/eeeeee/333333?text=${p.category}`}
                  alt={p.name}
                  sx={{ objectFit: "contain", p: 2 }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2">{p.brand}</Typography>
                    <Chip
                      label={p.type}
                      size="small"
                      color={p.type === "new" ? "success" : "warning"}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1rem", fontWeight: 600 }}
                  >
                    {p.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {p.model}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="#BE3300" fontWeight="700">
                      ETB {p.price?.toLocaleString()}
                    </Typography>
                    <Chip
                      label={`Stock: ${p.stock_quantity}`}
                      size="small"
                      color={p.stock_quantity > 0 ? "success" : "error"}
                    />
                  </Box>
                  {p.stock_quantity > 0 && (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<WhatsAppIcon />}
                      onClick={() => handleWhatsApp(p)}
                      sx={{
                        mt: 2,
                        bgcolor: "#25D366",
                        "&:hover": { bgcolor: "#128C7E" },
                      }}
                    >
                      Inquire via WhatsApp
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredProducts.length / itemsPerPage)}
            page={page}
            onChange={(e, v) => setPage(v)}
            color="primary"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default PublicProducts;
