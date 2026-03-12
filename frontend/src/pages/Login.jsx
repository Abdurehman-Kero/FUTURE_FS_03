import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/api";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  PhoneAndroid as PhoneIcon,
  Lock as LockIcon,
  Store as StoreIcon,
} from "@mui/icons-material";

// Your color scheme
const colors = {
  primary: "#BE3300",
  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(phone, password);
      authLogin(res.data.data.staff, res.data.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: colors.gradient,
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 2,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            width: "100%",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              sx={{
                mx: "auto",
                width: { xs: 60, sm: 80 },
                height: { xs: 60, sm: 80 },
                bgcolor: colors.primary,
                mb: 2,
              }}
            >
              <StoreIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
            </Avatar>
            <Typography
              variant="h4"
              fontWeight="600"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem" },
                color: "#344767",
              }}
            >
              Chala Mobile
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
              size="medium"
              InputProps={{
                startAdornment: (
                  <PhoneIcon sx={{ mr: 1, color: colors.primary }} />
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              size="medium"
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ mr: 1, color: colors.primary }} />
                ),
              }}
              sx={{ mb: 4 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                bgcolor: colors.primary,
                "&:hover": {
                  bgcolor: "#A02B00",
                },
                textTransform: "none",
                fontSize: { xs: "0.95rem", sm: "1rem" },
                fontWeight: 500,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
