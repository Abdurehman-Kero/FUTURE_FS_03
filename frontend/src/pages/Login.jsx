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
  alpha,
} from "@mui/material";
import {
  PhoneAndroid as PhoneIcon,
  Lock as LockIcon,
  Store as StoreIcon,
  VerifiedUser as VerifiedIcon,
} from "@mui/icons-material";

// Vibrant color scheme matching homepage
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
  overlay:
    "linear-gradient(135deg, rgba(255,133,0,0.95) 0%, rgba(255,163,60,0.95) 100%)",
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
        justifyContent: "center",
        background: `url('https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.overlay,
        },
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 4,
            background: colors.white,
            backdropFilter: "blur(10px)",
            boxShadow: `0 20px 60px ${alpha(colors.primary, 0.3)}`,
            border: `1px solid ${alpha(colors.primary, 0.2)}`,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: alpha(colors.primary, 0.05),
              zIndex: 0,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -50,
              left: -50,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: alpha(colors.secondary, 0.05),
              zIndex: 0,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar
                sx={{
                  mx: "auto",
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  background: colors.gradient,
                  boxShadow: `0 10px 20px ${alpha(colors.primary, 0.3)}`,
                  mb: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <StoreIcon
                  sx={{ fontSize: { xs: 40, sm: 50 }, color: colors.white }}
                />
              </Avatar>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                  background: colors.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 1,
                  letterSpacing: "-0.5px",
                }}
              >
                Chala Mobile
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  color: colors.gray,
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Welcome Back! 👋
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: alpha(colors.gray, 0.8),
                }}
              >
                Sign in to manage your business
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: alpha("#f44336", 0.1),
                  color: "#f44336",
                  border: `1px solid ${alpha("#f44336", 0.2)}`,
                }}
              >
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
                size="medium"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <PhoneIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary,
                        borderWidth: 2,
                      },
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary,
                        borderWidth: 2,
                      },
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary,
                    fontWeight: 600,
                  },
                }}
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
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ mr: 1, color: colors.primary }} />
                  ),
                }}
                sx={{
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary,
                        borderWidth: 2,
                      },
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary,
                        borderWidth: 2,
                      },
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary,
                    fontWeight: 600,
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.8,
                  background: colors.gradient,
                  borderRadius: 3,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: `0 8px 20px ${alpha(colors.primary, 0.3)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 30px ${alpha(colors.primary, 0.4)}`,
                  },
                  "&:disabled": {
                    background: alpha(colors.gray, 0.3),
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: colors.white }} />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Trust Indicators */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: `1px solid ${alpha(colors.gray, 0.2)}`,
                display: "flex",
                justifyContent: "center",
                gap: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <VerifiedIcon sx={{ color: colors.success, fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: colors.gray }}>
                  Secure Login
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <VerifiedIcon sx={{ color: colors.success, fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: colors.gray }}>
                  Encrypted
                </Typography>
              </Box>
            </Box>

            {/* Demo Credentials (Hidden but accessible) */}
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 2,
                color: alpha(colors.gray, 0.5),
                fontSize: "0.7rem",
              }}
            >
           
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
