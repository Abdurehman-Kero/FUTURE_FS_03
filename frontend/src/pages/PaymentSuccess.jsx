import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { getTransactionStatus } from "../services/api";

const colors = {
  primary: "#FF8500",
  success: "#10B981",
};

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tx_ref = queryParams.get("tx_ref");

    if (tx_ref) {
      fetchTransaction(tx_ref);
    } else {
      setLoading(false);
    }
  }, [location]);

  const fetchTransaction = async (tx_ref) => {
    try {
      const response = await getTransactionStatus(tx_ref);
      setTransaction(response.data.data);
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Paper
          sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, textAlign: "center" }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 80, color: colors.success, mb: 2 }}
          />

          <Typography variant="h4" fontWeight="600" gutterBottom>
            Payment Successful! 🎉
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Thank you for your purchase. Your transaction has been completed
            successfully.
          </Typography>

          {transaction && (
            <Box
              sx={{
                textAlign: "left",
                bgcolor: "#f8f9fa",
                p: 3,
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Transaction Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography color="text.secondary">Transaction Ref:</Typography>
                <Typography fontWeight="500">{transaction.tx_ref}</Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography color="text.secondary">Product:</Typography>
                <Typography fontWeight="500">
                  {transaction.product_name}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography color="text.secondary">Amount:</Typography>
                <Typography fontWeight="600" color={colors.primary}>
                  ETB {transaction.amount?.toLocaleString()}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography color="text.secondary">Date:</Typography>
                <Typography>
                  {new Date(transaction.created_at).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{ bgcolor: colors.primary, px: 4, py: 1.5 }}
            >
              Back to Home
            </Button>

            <Button
              variant="outlined"
              startIcon={<ShoppingIcon />}
              onClick={() => navigate("/products")}
              sx={{
                borderColor: colors.primary,
                color: colors.primary,
                px: 4,
                py: 1.5,
              }}
            >
              Continue Shopping
            </Button>

            <Button
              variant="text"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print Receipt
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PaymentSuccess;
