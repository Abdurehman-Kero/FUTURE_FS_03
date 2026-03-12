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
  useTheme,
} from "@mui/material";
import {
  PhoneAndroid as PhoneIcon,
  Lock as LockIcon,
  Store as StoreIcon,
} from "@mui/icons-material";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(phone, password);
      const { staff, token } = response.data.data;

      authLogin(staff, token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              sx={{
                mx: "auto",
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main,
                mb: 2,
              }}
            >
              <StoreIcon sx={{ fontSize: 40 }} />
            </Avatar>

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              Chala Mobile
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Solutions Hub
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to manage your business
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ mr: 1, color: "text.secondary" }} />
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
                fontSize: "1.1rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              gutterBottom
            >
              Demo Credentials
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 1 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
              >
                Admin: 0912345678 / password123
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
              >
                Technician: 0923456789 / password123
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
              >
                Sales: 0934567890 / password123
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
