import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Alert,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingIcon,
  Print as PrintIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { getTransactionStatus } from "../services/api";

const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  success: "#10B981",
  dark: "#1E1A3A",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  white: "#FFFFFF",
};

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        // First try to get tx_ref from URL query params
        const queryParams = new URLSearchParams(location.search);
        let tx_ref = queryParams.get("tx_ref");

        // If not in URL, try to get from session storage (set during checkout)
        if (!tx_ref) {
          tx_ref = sessionStorage.getItem("last_tx_ref");
          console.log("Using tx_ref from session storage:", tx_ref);
        }

        if (tx_ref) {
          await fetchTransaction(tx_ref);
        } else {
          // If still no tx_ref, try to get the most recent transaction from the last few minutes
          console.log("No tx_ref found, will try fallback...");
          setError(
            "No transaction reference found. Please check your email for receipt.",
          );
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in transaction fetch:", err);
        setError("Failed to load transaction details");
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [location]);

  const fetchTransaction = async (tx_ref) => {
    try {
      console.log("Fetching transaction:", tx_ref);
      const response = await getTransactionStatus(tx_ref);
      console.log("Transaction data:", response.data);

      if (response.data?.success && response.data?.data) {
        setTransaction(response.data.data);
        // Clear from session storage once loaded
        sessionStorage.removeItem("last_tx_ref");
      } else {
        setError("Transaction not found");
      }
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
      setError("Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptText = `
CHALA MOBILE - OFFICIAL RECEIPT
================================
Date: ${new Date(transaction?.created_at).toLocaleString()}
Receipt No: ${transaction?.tx_ref}

CUSTOMER INFORMATION
--------------------------------
Name: ${transaction?.customer_name}
Email: ${transaction?.customer_email}
Phone: ${transaction?.customer_phone || "Not provided"}

PRODUCT DETAILS
--------------------------------
Product: ${transaction?.product_name}
Amount: ETB ${transaction?.amount?.toLocaleString()}
Warranty: ${transaction?.warranty_months || 12} months

This receipt serves as your warranty proof.
Valid until: ${new Date(
      new Date(transaction?.created_at).setMonth(
        new Date(transaction?.created_at).getMonth() +
          (transaction?.warranty_months || 12),
      ),
    ).toLocaleDateString()}

Thank you for choosing Chala Mobile!
Abosto, Shashemene, Ethiopia
Contact: +251 98 231 0974
    `;

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${transaction?.tx_ref || "download"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const calculateWarrantyUntil = () => {
    if (!transaction) return "";
    const date = new Date(transaction.created_at);
    date.setMonth(date.getMonth() + (transaction.warranty_months || 12));
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  if (error || !transaction) {
    return (
      <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              {error || "Transaction details not available"}
            </Alert>
            <Typography paragraph>
              Your payment was successful! A receipt has been sent to your
              email.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Transaction reference:{" "}
              {sessionStorage.getItem("last_tx_ref") || "Check your email"}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/")}
                sx={{ bgcolor: colors.primary }}
              >
                Back to Home
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShoppingIcon />}
                onClick={() => navigate("/products")}
                sx={{ borderColor: colors.primary, color: colors.primary }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {/* Printable Receipt */}
        <Paper
          id="receipt-print"
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            mb: 3,
            position: "relative",
            "@media print": {
              boxShadow: "none",
              p: 2,
            },
          }}
        >
          {/* Store Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ color: colors.primary, fontWeight: 700 }}
            >
              CHALA MOBILE
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Solutions Hub
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Abosto, Shashemene, Ethiopia
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}
            >
              <Chip
                icon={<PhoneIcon />}
                label="+251 98 231 0974"
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<EmailIcon />}
                label="info@chalamobile.com"
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Success Badge */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: colors.success }} />
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Payment Successful! 🎉
            </Typography>
            <Typography color="text.secondary">
              Your transaction has been completed successfully
            </Typography>
          </Box>

          {/* Receipt Details */}
          <Typography variant="h6" gutterBottom sx={{ color: colors.dark }}>
            Official Receipt
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                    width="40%"
                  >
                    Receipt Number
                  </TableCell>
                  <TableCell>{transaction.tx_ref}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                  >
                    Date & Time
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                  >
                    Payment Method
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.payment_method || "Chapa"}
                      size="small"
                      sx={{ bgcolor: colors.primary, color: "white" }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Customer Information */}
          <Typography variant="h6" gutterBottom sx={{ color: colors.dark }}>
            Customer Information
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                    width="40%"
                  >
                    Full Name
                  </TableCell>
                  <TableCell>{transaction.customer_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                  >
                    Email Address
                  </TableCell>
                  <TableCell>{transaction.customer_email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                  >
                    Phone Number
                  </TableCell>
                  <TableCell>
                    {transaction.customer_phone || "Not provided"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Product Details */}
          <Typography variant="h6" gutterBottom sx={{ color: colors.dark }}>
            Product Details
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                    width="40%"
                  >
                    Product Name
                  </TableCell>
                  <TableCell>{transaction.product_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: colors.lightGray }}
                  >
                    Amount Paid
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" sx={{ color: colors.primary }}>
                      ETB {transaction.amount?.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Warranty Information */}
          <Typography variant="h6" gutterBottom sx={{ color: colors.dark }}>
            Warranty Information
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              mb: 4,
              borderColor: colors.primary,
              bgcolor: colors.lightGray,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Warranty Period
                </Typography>
                <Typography variant="h6" sx={{ color: colors.primary }}>
                  {transaction.warranty_months || 12} Months
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Purchase Date
                </Typography>
                <Typography variant="body1">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Valid Until
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: colors.primary, fontWeight: 600 }}
                >
                  {calculateWarrantyUntil()}
                </Typography>
              </Grid>
            </Grid>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2 }}
            >
              ⓘ This receipt serves as your official warranty proof. Please keep
              it for future reference.
            </Typography>
          </Paper>

          {/* Footer */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Thank you for choosing Chala Mobile!
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              For any inquiries, please contact us at +251 98 231 0974
            </Typography>
          </Box>
        </Paper>

        {/* Action Buttons (Not printed) */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
            "@media print": {
              display: "none",
            },
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
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              borderColor: colors.gray,
              color: colors.gray,
              px: 4,
              py: 1.5,
            }}
          >
            Print Receipt
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
              borderColor: colors.gray,
              color: colors.gray,
              px: 4,
              py: 1.5,
            }}
          >
            Download Receipt
          </Button>

          <Button
            variant="text"
            startIcon={<WhatsAppIcon />}
            href={`https://wa.me/251982310974?text=${encodeURIComponent(
              `Hello Chala Mobile, I have a question about my receipt: ${transaction.tx_ref}`,
            )}`}
            target="_blank"
            sx={{ color: "#25D366" }}
          >
            Support
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentSuccess;
