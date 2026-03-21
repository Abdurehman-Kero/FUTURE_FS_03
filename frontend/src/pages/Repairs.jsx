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
  Avatar,
  Grid,
  Paper,
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
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Build as BuildIcon,
  Person as PersonIcon,
  Smartphone as PhoneIcon,
  Laptop as LaptopIcon,
  TabletMac as TabletIcon,
  Call as CallIcon,
} from "@mui/icons-material";
import {
  getRepairs,
  createRepair,
  updateRepairStatus,
  getRepairsByStatus,
  searchCustomers, // Ensure this is exported in your api.js
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const UI_COLORS = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  dark: "#1E1A3A",
  bg: "#F0F2F5",
  border: "rgba(30, 26, 58, 0.08)",
  gray: "#6B7280",
};

const statusConfig = {
  received: { label: "Received", color: "#3B82F6" },
  diagnosing: { label: "Diagnosing", color: "#F59E0B" },
  in_progress: { label: "In Progress", color: "#9c27b0" },
  completed: { label: "Completed", color: "#10B981" },
  delivered: { label: "Delivered", color: "#6B7280" },
};

const Repairs = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // --- States ---
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [searchResults, setSearchResults] = useState([]); // For customer search
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    customer_id: null, // null means New Customer
    customer_name: "",
    customer_phone: "",
    device_type: "phone",
    device_brand: "",
    device_model: "",
    issue_description: "",
    estimated_cost: "",
  });

  const [statusData, setStatusData] = useState({ status: "", final_cost: "" });

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

  useEffect(() => {
    loadRepairs();
  }, [statusFilter]);

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  // Handle name typing + searching
  const handleNameChange = async (e) => {
    const val = e.target.value;
    setFormData({ ...formData, customer_name: val, customer_id: null }); // Reset to New Customer while typing

    if (val.length > 2) {
      try {
        const res = await searchCustomers(val);
        setSearchResults(res.data.data);
      } catch (err) {
        console.error("Search failed", err);
      }
    } else {
      setSearchResults([]);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // 1. Internal Validation
  if (!formData.customer_name || !formData.customer_phone) {
    return showSnackbar("Customer Name and Phone are required!", "error");
  }
  if (
    !formData.device_type ||
    !formData.device_brand ||
    !formData.device_model
  ) {
    return showSnackbar("Please fill in all device details!", "error");
  }

  try {
    // 2. Prepare the Data
    // We create a clean object. If customer_id is null/0, we don't send it at all
    // so the backend knows to create a NEW customer record.
    const repairData = {
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      device_type: formData.device_type,
      device_brand: formData.device_brand,
      device_model: formData.device_model,
      issue_description: formData.issue_description,
      estimated_cost: formData.estimated_cost || 0,
    };

    // Only add customer_id if we actually picked an existing one
    if (formData.customer_id && formData.customer_id !== 0) {
      repairData.customer_id = formData.customer_id;
    }

    console.log("Submitting to backend:", repairData);

    const response = await createRepair(repairData);

    showSnackbar("Repair ticket created successfully!");
    setOpenDialog(false);

    // 3. Reset form to defaults
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
    console.error("Backend Error:", e.response?.data);
    const errorMsg =
      e.response?.data?.message || "Check required fields and try again.";
    showSnackbar(errorMsg, "error");
  }
};

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await updateRepairStatus(selectedRepair.id, statusData);
      showSnackbar("Status updated!");
      setOpenStatusDialog(false);
      loadRepairs();
    } catch (e) {
      showSnackbar("Update failed", "error");
    }
  };

  const filteredRepairs = repairs.filter(
    (r) =>
      r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_phone?.includes(searchTerm) ||
      r.device_model?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 4 },
        pb: 12,
        minHeight: "100vh",
        bgcolor: UI_COLORS.bg,
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="900"
          color={UI_COLORS.dark}
        >
          Repair Tickets
        </Typography>
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: UI_COLORS.primary,
              borderRadius: "12px",
              px: 3,
              py: 1,
              fontWeight: "bold",
            }}
          >
            New Ticket
          </Button>
        )}
      </Stack>

      {/* Global Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search by customer, phone or model..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 3,
          bgcolor: "white",
          borderRadius: "12px",
          "& .MuiOutlinedInput-root": { borderRadius: "12px" },
        }}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: UI_COLORS.primary, mr: 1 }} />
          ),
        }}
      />

      {/* Repair Cards */}
      <Grid container spacing={2}>
        {filteredRepairs.map((repair) => (
          <Grid item xs={12} sm={6} md={4} key={repair.id}>
            <Card
              sx={{
                borderRadius: "20px",
                border: `1px solid ${UI_COLORS.border}`,
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(UI_COLORS.primary, 0.1),
                      color: UI_COLORS.primary,
                      width: 44,
                      height: 44,
                    }}
                  >
                    {repair.device_type === "phone" ? (
                      <PhoneIcon />
                    ) : (
                      <LaptopIcon />
                    )}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                    <Typography noWrap variant="subtitle1" fontWeight="800">
                      {repair.device_brand} {repair.device_model}
                    </Typography>
                    <Typography
                      noWrap
                      variant="caption"
                      fontWeight="600"
                      color="text.secondary"
                    >
                      {repair.customer_name}
                    </Typography>
                  </Box>
                  <Chip
                    label={statusConfig[repair.status]?.label || repair.status}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: alpha(
                        statusConfig[repair.status]?.color || "#ccc",
                        0.1,
                      ),
                      color: statusConfig[repair.status]?.color,
                    }}
                  />
                </Stack>

                {/* DISPLAY PHONE NUMBER ON CARD */}
                <Box
                  sx={{
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: alpha(UI_COLORS.primary, 0.05),
                    p: 1,
                    borderRadius: "12px",
                  }}
                >
                  <CallIcon sx={{ fontSize: 14, color: UI_COLORS.primary }} />
                  <Typography
                    variant="body2"
                    fontWeight="700"
                    sx={{ fontSize: "0.85rem", color: UI_COLORS.dark }}
                  >
                    {repair.customer_phone || "No Phone"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.2,
                    bgcolor: alpha(UI_COLORS.bg, 0.5),
                    borderRadius: "12px",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      minHeight: "2.4em",
                    }}
                  >
                    {repair.issue_description}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.65rem" }}
                    >
                      TICKET TOTAL
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      sx={{ fontSize: "0.9rem", color: UI_COLORS.primary }}
                    >
                      ETB {repair.final_cost || repair.estimated_cost || "0"}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setSelectedRepair(repair);
                      setStatusData({
                        status: repair.status,
                        final_cost: repair.final_cost || "",
                      });
                      setOpenStatusDialog(true);
                    }}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      bgcolor: UI_COLORS.dark,
                      fontSize: "0.75rem",
                    }}
                  >
                    Update
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* FAB */}
      {isMobile && (
        <Fab
          onClick={() => setOpenDialog(true)}
          sx={{
            position: "fixed",
            bottom: 25,
            right: 25,
            zIndex: 9999,
            bgcolor: UI_COLORS.primary,
            color: "white",
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Hybrid New Repair Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "24px" } }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: "bold", color: UI_COLORS.dark }}>
            New Repair Ticket
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="Customer Name *"
                  placeholder="Type to search or add new..."
                  value={formData.customer_name}
                  onChange={handleNameChange}
                  required
                />

                {searchResults.length > 0 && (
                  <Paper
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      mt: 0.5,
                      border: `1px solid ${UI_COLORS.border}`,
                    }}
                  >
                    {searchResults.map((c) => (
                      <MenuItem
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
                      >
                        <Typography variant="body2">
                          {c.name} ({c.phone})
                        </Typography>
                      </MenuItem>
                    ))}
                  </Paper>
                )}
              </Box>

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
                      <CallIcon
                        sx={{ fontSize: 18, color: UI_COLORS.primary }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              {formData.customer_id ? (
                <Alert severity="info" sx={{ py: 0, fontSize: "0.75rem" }}>
                  Picking existing customer
                </Alert>
              ) : (
                formData.customer_name.length > 2 && (
                  <Alert severity="warning" sx={{ py: 0, fontSize: "0.75rem" }}>
                    Creating NEW customer
                  </Alert>
                )
              )}

              <Divider sx={{ my: 1 }}>Device Information</Divider>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Device Type *</InputLabel>
                    <Select
                      value={formData.device_type}
                      label="Device Type *"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          device_type: e.target.value,
                        })
                      }
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
                    rows={2}
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
                    label="Est. Cost (ETB)"
                    type="number"
                    value={formData.estimated_cost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimated_cost: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: UI_COLORS.primary }}
            >
              Create Ticket
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Status Dialog & Snackbar (Keep your existing versions) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
