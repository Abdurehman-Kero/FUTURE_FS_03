import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Avatar,
  Grid,
  Paper,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Divider,
  Stack,
  alpha,
  useMediaQuery,
  useTheme,
  Fab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Grow,
  Zoom,
  Slide,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  Phone as PhoneIcon,
  Laptop as LaptopIcon,
  TabletMac as TabletIcon,
  Call as CallIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import {
  getRepairs,
  createRepair,
  updateRepairStatus,
  getRepairsByStatus,
  deleteRepair,
} from "../services/api";
import { getCustomers, searchCustomers } from "../services/api";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";

const UI_COLORS = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  dark: "#1E1A3A",
  light: "#F8F9FF",
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
  purple: "#8B5CF6",
  error: "#EF4444",
};

const statusConfig = {
  received: { label: "Received", color: "#3B82F6", icon: "📥", order: 1 },
  diagnosing: { label: "Diagnosing", color: "#F59E0B", icon: "🔍", order: 2 },
  in_progress: { label: "In Progress", color: "#9c27b0", icon: "⚙️", order: 3 },
  completed: { label: "Completed", color: "#10B981", icon: "✅", order: 4 },
  delivered: { label: "Delivered", color: "#6B7280", icon: "📦", order: 5 },
};

const Repairs = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [repairToDelete, setRepairToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    customer_id: null,
    customer_name: "",
    customer_phone: "",
    device_type: "phone",
    device_brand: "",
    device_model: "",
    issue_description: "",
    estimated_cost: "",
  });

  const [statusData, setStatusData] = useState({ status: "", final_cost: "" });

  useEffect(() => {
    setRowsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

  useEffect(() => {
    loadRepairs();
  }, [statusFilter]);

  const loadRepairs = async () => {
    setLoading(true);
    try {
      const res =
        statusFilter === "all"
          ? await getRepairs()
          : await getRepairsByStatus(statusFilter);
      setRepairs(res.data.data);
    } catch (e) {
      showSnackbar("Error loading repairs", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const handleSearchCustomer = async (e) => {
    const val = e.target.value;
    setFormData({ ...formData, customer_name: val, customer_id: null });

    if (val.length > 2) {
      try {
        const res = await searchCustomers(val);
        setSearchResults(res.data.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone) {
      return showSnackbar("Customer Name and Phone are required!", "error");
    }

    if (
      !formData.device_brand ||
      !formData.device_model ||
      !formData.issue_description
    ) {
      return showSnackbar(
        "Device Brand, Model and Issue Description are required!",
        "error",
      );
    }

    try {
      await createRepair(formData);
      showSnackbar("Repair ticket created successfully!");
      setOpenDialog(false);
      setFormData({
        customer_id: null,
        customer_name: "",
        customer_phone: "",
        device_type: "phone",
        device_brand: "",
        device_model: "",
        issue_description: "",
        estimated_cost: "",
      });
      loadRepairs();
    } catch (e) {
      showSnackbar(
        e.response?.data?.message || "Failed to create repair",
        "error",
      );
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await updateRepairStatus(selectedRepair.id, statusData);
      showSnackbar("Status updated successfully!");
      setOpenStatusDialog(false);
      loadRepairs();
    } catch (e) {
      showSnackbar("Update failed", "error");
    }
  };

  const handleDeleteClick = (repair, e) => {
    e.stopPropagation();
    setDeleteError(null);
    setRepairToDelete(repair);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!repairToDelete) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteRepair(repairToDelete.id);
      showSnackbar("Repair ticket deleted successfully", "success");
      await loadRepairs();
      setOpenDeleteDialog(false);
      setRepairToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      let errorMessage = "Failed to delete repair ticket";

      if (error.response?.status === 404) {
        errorMessage = "Repair ticket not found";
      } else if (
        error.response?.status === 400 ||
        error.response?.status === 500
      ) {
        errorMessage =
          error.response?.data?.message || "Cannot delete this repair ticket.";
      }

      setDeleteError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setRepairToDelete(null);
    setDeleteError(null);
  };

  const handleOpenStatusDialog = (repair) => {
    setSelectedRepair(repair);
    setStatusData({
      status: repair.status,
      final_cost: repair.final_cost || "",
    });
    setOpenStatusDialog(true);
  };

  const handleGenerateReceipt = (repair, e) => {
    e.stopPropagation();
    setSelectedRepair(repair);
    setOpenReceiptDialog(true);
  };

  const handleDownloadPDF = (repair) => {
    try {
      const doc = new jsPDF();
      const primaryColor = [255, 133, 0];
      const textColor = [50, 50, 50];

      doc.setFontSize(22);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("CHALA MOBILE", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text("Repair Service", 105, 30, { align: "center" });
      doc.text("Abosto, Shashemene, Ethiopia", 105, 38, { align: "center" });
      doc.text("+251 98 231 0974", 105, 46, { align: "center" });

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 52, 190, 52);

      doc.setFontSize(16);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("REPAIR RECEIPT", 105, 65, { align: "center" });

      let yPos = 80;
      const lineHeight = 7;

      doc.setFontSize(10);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      doc.setFont("helvetica", "bold");
      doc.text("Repair ID:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`#${repair.id?.toString().padStart(6, "0")}`, 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Date:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(new Date(repair.created_at).toLocaleString(), 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Status:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(statusConfig[repair.status]?.label || repair.status, 80, yPos);

      yPos += lineHeight * 2;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("CUSTOMER INFORMATION", 20, yPos);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Name:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(repair.customer_name || "Walk-in Customer", 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Phone:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(repair.customer_phone || "Not provided", 80, yPos);

      yPos += lineHeight * 2;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("DEVICE DETAILS", 20, yPos);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Device:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${repair.device_brand} ${repair.device_model}`, 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Type:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(repair.device_type, 80, yPos);

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Issue:", 20, yPos);
      doc.setFont("helvetica", "normal");
      const issueText = repair.issue_description || "No description";
      const splitIssue = doc.splitTextToSize(issueText, 110);
      doc.text(splitIssue, 80, yPos);
      yPos += splitIssue.length * lineHeight;

      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Estimated Cost:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(
        `ETB ${repair.estimated_cost?.toLocaleString() || "TBD"}`,
        80,
        yPos,
      );

      if (repair.final_cost) {
        yPos += lineHeight;
        doc.setFont("helvetica", "bold");
        doc.text("Final Cost:", 20, yPos);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`ETB ${repair.final_cost?.toLocaleString()}`, 80, yPos);
      }

      yPos = 260;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, 190, yPos);

      yPos += 10;
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text("Thank you for choosing Chala Mobile!", 105, yPos, {
        align: "center",
      });
      yPos += 5;
      doc.text("This receipt serves as your repair proof.", 105, yPos, {
        align: "center",
      });

      doc.save(`repair-receipt-${repair.id}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      showSnackbar("Failed to generate PDF", "error");
    }
  };

  const filteredRepairs = repairs.filter(
    (r) =>
      r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_phone?.includes(searchTerm) ||
      r.device_model?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedRepairs = filteredRepairs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const stats = {
    total: repairs.length,
    active: repairs.filter(
      (r) => !["completed", "delivered"].includes(r.status),
    ).length,
    completed: repairs.filter(
      (r) => r.status === "completed" || r.status === "delivered",
    ).length,
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
        <CircularProgress sx={{ color: UI_COLORS.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F4F6F8", pb: 8 }}>
      {/* Vivid Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3, md: 5 },
          background: UI_COLORS.gradient,
          color: "white",
          borderRadius: "0 0 32px 32px",
          mb: { xs: 3, sm: 4 },
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
              fontWeight="800"
              sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
            >
              Repair <span style={{ opacity: 0.9 }}>Hub</span>
            </Typography>
            <Typography
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              }}
            >
              Manage and track all repair tickets
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: "right" } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                bgcolor: "white",
                color: UI_COLORS.primary,
                borderRadius: "12px",
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1, sm: 1.2, md: 1.5 },
                fontWeight: "bold",
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                "&:hover": { bgcolor: alpha("#ffffff", 0.9) },
              }}
            >
              New Repair
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ px: { xs: 1.5, sm: 2, md: 4 } }}>
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
          <Grid item xs={4}>
            <Zoom in timeout={500}>
              <Card
                sx={{
                  borderRadius: "20px",
                  background: `linear-gradient(135deg, ${UI_COLORS.white} 0%, ${alpha(UI_COLORS.primary, 0.05)} 100%)`,
                  border: `1px solid ${alpha(UI_COLORS.primary, 0.2)}`,
                }}
              >
                <CardContent
                  sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(UI_COLORS.primary, 0.1),
                      color: UI_COLORS.primary,
                      width: { xs: 40, sm: 45, md: 55 },
                      height: { xs: 40, sm: 45, md: 55 },
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <BuildIcon
                      sx={{
                        fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
                      }}
                    />
                  </Avatar>
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{
                      fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.8rem" },
                    }}
                  >
                    {stats.total}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="600"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    Total Repairs
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={4}>
            <Zoom in timeout={600}>
              <Card
                sx={{
                  borderRadius: "20px",
                  background: `linear-gradient(135deg, ${UI_COLORS.white} 0%, ${alpha(UI_COLORS.warning, 0.05)} 100%)`,
                  border: `1px solid ${alpha(UI_COLORS.warning, 0.2)}`,
                }}
              >
                <CardContent
                  sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(UI_COLORS.warning, 0.1),
                      color: UI_COLORS.warning,
                      width: { xs: 40, sm: 45, md: 55 },
                      height: { xs: 40, sm: 45, md: 55 },
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <BuildIcon
                      sx={{
                        fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
                      }}
                    />
                  </Avatar>
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{
                      fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.8rem" },
                    }}
                  >
                    {stats.active}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="600"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    Active Repairs
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={4}>
            <Zoom in timeout={700}>
              <Card
                sx={{
                  borderRadius: "20px",
                  background: `linear-gradient(135deg, ${UI_COLORS.white} 0%, ${alpha(UI_COLORS.success, 0.05)} 100%)`,
                  border: `1px solid ${alpha(UI_COLORS.success, 0.2)}`,
                }}
              >
                <CardContent
                  sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(UI_COLORS.success, 0.1),
                      color: UI_COLORS.success,
                      width: { xs: 40, sm: 45, md: 55 },
                      height: { xs: 40, sm: 45, md: 55 },
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
                      }}
                    />
                  </Avatar>
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{
                      fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.8rem" },
                    }}
                  >
                    {stats.completed}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="600"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    Completed
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Search & Filters */}
        <Paper
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: { xs: 3, sm: 4 },
            borderRadius: "20px",
            bgcolor: UI_COLORS.white,
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              fullWidth
              placeholder={
                isMobile ? "Search..." : "Search by customer, phone or model..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: UI_COLORS.light,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: UI_COLORS.primary,
                        fontSize: { xs: "1.2rem", sm: "1.3rem" },
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
            <Tooltip title="Refresh">
              <IconButton
                onClick={loadRepairs}
                sx={{
                  bgcolor: UI_COLORS.light,
                  borderRadius: "12px",
                  "&:hover": { bgcolor: UI_COLORS.primary, color: "white" },
                }}
              >
                <RefreshIcon
                  sx={{ fontSize: { xs: "1.2rem", sm: "1.3rem" } }}
                />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Status Filter Chips */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
            <Chip
              label="All"
              onClick={() => setStatusFilter("all")}
              size="small"
              sx={{
                bgcolor:
                  statusFilter === "all" ? UI_COLORS.primary : "transparent",
                color: statusFilter === "all" ? "white" : UI_COLORS.gray,
                fontWeight: 600,
              }}
            />
            {Object.entries(statusConfig).map(([key, value]) => (
              <Chip
                key={key}
                label={`${value.icon} ${value.label}`}
                onClick={() => setStatusFilter(key)}
                size="small"
                sx={{
                  bgcolor:
                    statusFilter === key ? UI_COLORS.primary : "transparent",
                  color: statusFilter === key ? "white" : UI_COLORS.gray,
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Repairs List - Mobile First Cards */}
        {paginatedRepairs.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "20px" }}>
            <BuildIcon
              sx={{ fontSize: 64, color: UI_COLORS.gray, mb: 2, opacity: 0.5 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No repair tickets found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start by creating your first repair ticket
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                bgcolor: UI_COLORS.primary,
                "&:hover": { bgcolor: UI_COLORS.secondary },
              }}
            >
              Create New Repair
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {paginatedRepairs.map((repair, idx) => (
              <Grow in timeout={idx * 100} key={repair.id}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      borderRadius: "20px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(
                              statusConfig[repair.status]?.color ||
                                UI_COLORS.gray,
                              0.1,
                            ),
                            color:
                              statusConfig[repair.status]?.color ||
                              UI_COLORS.gray,
                            width: 48,
                            height: 48,
                          }}
                        >
                          {repair.device_type === "phone" ? (
                            <PhoneIcon />
                          ) : repair.device_type === "laptop" ? (
                            <LaptopIcon />
                          ) : (
                            <TabletIcon />
                          )}
                        </Avatar>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            label={`${statusConfig[repair.status]?.icon} ${statusConfig[repair.status]?.label}`}
                            size="small"
                            sx={{
                              bgcolor: alpha(
                                statusConfig[repair.status]?.color ||
                                  UI_COLORS.gray,
                                0.1,
                              ),
                              color:
                                statusConfig[repair.status]?.color ||
                                UI_COLORS.gray,
                              fontWeight: 600,
                            }}
                          />
                          {user?.role === "admin" && (
                            <Tooltip title="Delete Repair">
                              <IconButton
                                size="small"
                                onClick={(e) => handleDeleteClick(repair, e)}
                                sx={{ color: UI_COLORS.error }}
                              >
                                <DeleteIcon sx={{ fontSize: "1rem" }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        fontWeight="800"
                        sx={{ mb: 0.5, fontSize: { xs: "1rem", sm: "1.1rem" } }}
                      >
                        {repair.device_brand} {repair.device_model}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                      >
                        {new Date(repair.created_at).toLocaleString()}
                      </Typography>

                      <Divider sx={{ my: 1.5 }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PersonIcon
                            sx={{ fontSize: 14, color: UI_COLORS.gray }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                          >
                            {repair.customer_name || "Unknown"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="View Receipt">
                            <IconButton
                              size="small"
                              onClick={(e) => handleGenerateReceipt(repair, e)}
                              sx={{ color: UI_COLORS.info }}
                            >
                              <ReceiptIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </Tooltip>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                          >
                            {repair.customer_phone || "No phone"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 1.5,
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Est. Cost
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            sx={{ color: UI_COLORS.primary }}
                          >
                            ETB{" "}
                            {repair.estimated_cost?.toLocaleString() || "TBD"}
                          </Typography>
                        </Box>
                        {repair.final_cost && (
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Final Cost
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="800"
                              sx={{ color: UI_COLORS.success }}
                            >
                              ETB {repair.final_cost?.toLocaleString()}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Update Status Button - NOW VISIBLE */}
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenStatusDialog(repair)}
                        sx={{
                          mt: 2,
                          bgcolor: UI_COLORS.dark,
                          color: "white",
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 600,
                          "&:hover": { bgcolor: UI_COLORS.primary },
                        }}
                        startIcon={<EditIcon sx={{ fontSize: "1rem" }} />}
                      >
                        Update Status
                      </Button>

                      <Box
                        sx={{
                          mt: 1.5,
                          p: 1,
                          bgcolor: alpha(UI_COLORS.light, 0.5),
                          borderRadius: "12px",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          }}
                        >
                          {repair.issue_description?.substring(0, 100)}
                          {repair.issue_description?.length > 100 && "..."}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {paginatedRepairs.length > 0 && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <TablePagination
              component="div"
              count={filteredRepairs.length}
              page={page}
              onPageChange={(e, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25]}
              labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
            />
          </Box>
        )}
      </Box>

      {/* Create New Repair Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ background: UI_COLORS.gradient, color: "white" }}>
          <Typography variant="h6" component="div" fontWeight="800">
            New Repair Ticket
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3, maxHeight: "70vh", overflowY: "auto" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Name *"
                  value={formData.customer_name}
                  onChange={handleSearchCustomer}
                  placeholder="Enter customer name"
                  required
                />
                {searchResults.length > 0 && (
                  <Paper
                    sx={{
                      mt: 1,
                      maxHeight: 200,
                      overflow: "auto",
                      borderRadius: "12px",
                    }}
                  >
                    {searchResults.map((c) => (
                      <ListItem
                        key={c.id}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            customer_id: c.id,
                            customer_name: c.name,
                            customer_phone: c.phone,
                          });
                          setSearchResults([]);
                        }}
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: alpha(UI_COLORS.primary, 0.05),
                          },
                        }}
                      >
                        <ListItemIcon>
                          <PersonIcon sx={{ color: UI_COLORS.primary }} />
                        </ListItemIcon>
                        <ListItemText primary={c.name} secondary={c.phone} />
                      </ListItem>
                    ))}
                  </Paper>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  value={formData.customer_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_phone: e.target.value })
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: UI_COLORS.primary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Device Type *</InputLabel>
                  <Select
                    value={formData.device_type}
                    onChange={(e) =>
                      setFormData({ ...formData, device_type: e.target.value })
                    }
                    label="Device Type *"
                    required
                  >
                    <MenuItem value="phone">📱 Phone</MenuItem>
                    <MenuItem value="laptop">💻 Laptop</MenuItem>
                    <MenuItem value="tablet">📟 Tablet</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Brand *"
                  value={formData.device_brand}
                  onChange={(e) =>
                    setFormData({ ...formData, device_brand: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Model *"
                  value={formData.device_model}
                  onChange={(e) =>
                    setFormData({ ...formData, device_model: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Issue Description *"
                  multiline
                  rows={3}
                  value={formData.issue_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      issue_description: e.target.value,
                    })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Estimated Cost (ETB)"
                  type="number"
                  value={formData.estimated_cost}
                  onChange={(e) =>
                    setFormData({ ...formData, estimated_cost: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">ETB</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{ p: 3, gap: 1, flexDirection: isMobile ? "column" : "row" }}
          >
            <Button
              onClick={() => setOpenDialog(false)}
              fullWidth={isMobile}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              sx={{ background: UI_COLORS.gradient }}
            >
              Create Ticket
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Update Status</DialogTitle>
        <form onSubmit={handleUpdateStatus}>
          <DialogContent>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusData.status}
                  label="Status"
                  onChange={(e) =>
                    setStatusData({ ...statusData, status: e.target.value })
                  }
                >
                  {Object.entries(statusConfig).map(([k, v]) => (
                    <MenuItem key={k} value={k}>
                      {v.icon} {v.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Final Cost (ETB)"
                type="number"
                value={statusData.final_cost}
                onChange={(e) =>
                  setStatusData({ ...statusData, final_cost: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">ETB</InputAdornment>
                  ),
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: UI_COLORS.dark }}
            >
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <WarningIcon sx={{ fontSize: 48, color: UI_COLORS.error, mb: 1 }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              Delete Repair Ticket
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to delete this repair ticket?
            <br />
            <strong>
              Device: {repairToDelete?.device_brand}{" "}
              {repairToDelete?.device_model}
            </strong>
            <br />
            <strong>Customer: {repairToDelete?.customer_name}</strong>
            <br />
            This action cannot be undone.
          </Typography>

          {deleteError && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: "12px" }}>
              <Typography variant="body2">{deleteError}</Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{ borderRadius: "10px", px: 3 }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: "10px", px: 3 }}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : null}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog
        open={openReceiptDialog}
        onClose={() => setOpenReceiptDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: { borderRadius: isMobile ? 0 : "24px", overflow: "hidden" },
        }}
      >
        <DialogTitle
          sx={{
            background: UI_COLORS.gradient,
            color: "white",
            textAlign: "center",
            py: { xs: 3, sm: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <BuildIcon sx={{ fontSize: { xs: 40, sm: 48 }, mb: 1 }} />
            <Typography variant="h5" component="div" fontWeight="800">
              REPAIR RECEIPT
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
          {selectedRepair && (
            <Box>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ color: UI_COLORS.primary, fontWeight: 800 }}
                >
                  CHALA MOBILE
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  color="text.secondary"
                >
                  Repair Service
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Abosto, Shashemene, Ethiopia
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Chip
                    icon={<PhoneIcon />}
                    label="+251 98 231 0974"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Typography
                variant="h6"
                component="div"
                fontWeight="800"
                sx={{ mb: 2, color: UI_COLORS.dark }}
              >
                Repair Details
              </Typography>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 3, borderRadius: "12px" }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          bgcolor: UI_COLORS.light,
                          width: "40%",
                        }}
                      >
                        Repair ID
                      </TableCell>
                      <TableCell>
                        #{selectedRepair.id?.toString().padStart(6, "0")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: UI_COLORS.light }}
                      >
                        Date & Time
                      </TableCell>
                      <TableCell>
                        {new Date(selectedRepair.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: UI_COLORS.light }}
                      >
                        Status
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusConfig[selectedRepair.status]?.label}
                          size="small"
                          sx={{
                            bgcolor: alpha(
                              statusConfig[selectedRepair.status]?.color,
                              0.1,
                            ),
                            color: statusConfig[selectedRepair.status]?.color,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography
                variant="h6"
                component="div"
                fontWeight="800"
                sx={{ mb: 2, color: UI_COLORS.dark }}
              >
                Customer Information
              </Typography>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 3, borderRadius: "12px" }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          bgcolor: UI_COLORS.light,
                          width: "40%",
                        }}
                      >
                        Full Name
                      </TableCell>
                      <TableCell>
                        {selectedRepair.customer_name || "Unknown"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: UI_COLORS.light }}
                      >
                        Phone Number
                      </TableCell>
                      <TableCell>
                        {selectedRepair.customer_phone || "Not provided"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography
                variant="h6"
                component="div"
                fontWeight="800"
                sx={{ mb: 2, color: UI_COLORS.dark }}
              >
                Device Information
              </Typography>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 3, borderRadius: "12px" }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          bgcolor: UI_COLORS.light,
                          width: "40%",
                        }}
                      >
                        Device Type
                      </TableCell>
                      <TableCell>{selectedRepair.device_type}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: UI_COLORS.light }}
                      >
                        Brand & Model
                      </TableCell>
                      <TableCell>
                        {selectedRepair.device_brand}{" "}
                        {selectedRepair.device_model}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: UI_COLORS.light }}
                      >
                        Issue Description
                      </TableCell>
                      <TableCell>{selectedRepair.issue_description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, bgcolor: UI_COLORS.light }}
                      >
                        Estimated Cost
                      </TableCell>
                      <TableCell>
                        ETB{" "}
                        {selectedRepair.estimated_cost?.toLocaleString() ||
                          "TBD"}
                      </TableCell>
                    </TableRow>
                    {selectedRepair.final_cost && (
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: 600, bgcolor: UI_COLORS.light }}
                        >
                          Final Cost
                        </TableCell>
                        <TableCell>
                          <Typography
                            component="span"
                            sx={{ color: UI_COLORS.primary, fontWeight: 800 }}
                          >
                            ETB {selectedRepair.final_cost?.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography
                  variant="body2"
                  component="div"
                  color="text.secondary"
                >
                  Thank you for choosing Chala Mobile!
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  For inquiries, contact us at +251 98 231 0974
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },
            justifyContent: "center",
            gap: 2,
            borderTop: `1px solid ${UI_COLORS.lightGray}`,
          }}
        >
          <Button
            onClick={() => setOpenReceiptDialog(false)}
            variant="outlined"
          >
            Close
          </Button>
          <Button
            startIcon={<PrintIcon />}
            variant="contained"
            onClick={() => window.print()}
            sx={{ bgcolor: UI_COLORS.primary }}
          >
            Print Receipt
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            onClick={() => handleDownloadPDF(selectedRepair)}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Repairs;
