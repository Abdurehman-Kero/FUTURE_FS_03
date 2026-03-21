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
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Tab,
  Tabs,
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
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  getRepairs,
  createRepair,
  updateRepairStatus,
  getRepairsByStatus,
  searchCustomers,
  createCustomer,
  getCustomers,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const UI_COLORS = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  dark: "#1E1A3A",
  bg: "#F0F2F5",
  border: "rgba(30, 26, 58, 0.08)",
  gray: "#6B7280",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
};

const statusConfig = {
  received: { label: "Received", color: "#3B82F6", icon: "📥" },
  diagnosing: { label: "Diagnosing", color: "#F59E0B", icon: "🔍" },
  in_progress: { label: "In Progress", color: "#9c27b0", icon: "⚙️" },
  completed: { label: "Completed", color: "#10B981", icon: "✅" },
  delivered: { label: "Delivered", color: "#6B7280", icon: "📦" },
};

const steps = ["Customer Information", "Device Details"];

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [repairForm, setRepairForm] = useState({
    device_type: "phone",
    device_brand: "",
    device_model: "",
    issue_description: "",
    estimated_cost: "",
  });

  const [statusData, setStatusData] = useState({ status: "", final_cost: "" });

  // --- API Calls ---
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

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const res = await getCustomers();
      setCustomers(res.data.data);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    loadRepairs();
    loadCustomers();
  }, [statusFilter]);

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  // Search customers locally
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerForm.name.toLowerCase()) ||
      customer.phone.includes(customerForm.name),
  );

  // Create new customer
  const handleCreateCustomer = async () => {
    if (!customerForm.name || !customerForm.phone) {
      showSnackbar("Name and Phone are required!", "error");
      return;
    }

    try {
      const response = await createCustomer(customerForm);
      setSelectedCustomer(response.data.data);
      // Refresh customer list
      await loadCustomers();
      showSnackbar("Customer created successfully!", "success");
      setActiveStep(1);
    } catch (error) {
      console.error("Create customer error:", error);
      if (error.response?.data?.message?.includes("duplicate")) {
        showSnackbar(
          "Phone number already exists! Please use a different phone number or search for existing customer.",
          "error",
        );
      } else {
        showSnackbar(
          error.response?.data?.message || "Failed to create customer",
          "error",
        );
      }
    }
  };

  // Create repair ticket
  const handleCreateRepair = async () => {
    if (
      !repairForm.device_brand ||
      !repairForm.device_model ||
      !repairForm.issue_description
    ) {
      showSnackbar("Please fill all required device fields!", "error");
      return;
    }

    try {
      const payload = {
        customer_id: selectedCustomer.id,
        device_type: repairForm.device_type,
        device_brand: repairForm.device_brand,
        device_model: repairForm.device_model,
        issue_description: repairForm.issue_description,
        estimated_cost: repairForm.estimated_cost || 0,
        status: "received",
      };

      console.log("Creating repair with payload:", payload);

      await createRepair(payload);
      showSnackbar("Repair ticket created successfully!");

      // Reset and close
      resetForm();
      setOpenDialog(false);
      loadRepairs();
    } catch (error) {
      console.error("Create repair error:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to create repair",
        "error",
      );
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setTabValue(0);
    setSelectedCustomer(null);
    setCustomerForm({
      name: "",
      phone: "",
      email: "",
      address: "",
    });
    setRepairForm({
      device_type: "phone",
      device_brand: "",
      device_model: "",
      issue_description: "",
      estimated_cost: "",
    });
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
        <CircularProgress sx={{ color: UI_COLORS.primary }} />
      </Box>
    );
  }

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
        sx={{ mb: 3, flexWrap: "wrap", gap: 2 }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="900"
          color={UI_COLORS.dark}
        >
          🔧 Repair Tickets
        </Typography>
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
            "&:hover": { background: UI_COLORS.secondary },
          }}
        >
          New Ticket
        </Button>
      </Stack>

      {/* Search and Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by customer, phone or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: "12px",
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: UI_COLORS.primary, mr: 1 }} />
              ),
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={4} md={2}>
          <Paper sx={{ p: 1.5, textAlign: "center", borderRadius: "16px" }}>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {repairs.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} md={2}>
          <Paper
            sx={{
              p: 1.5,
              textAlign: "center",
              borderRadius: "16px",
              bgcolor: alpha(UI_COLORS.warning, 0.05),
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Active
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={UI_COLORS.warning}
            >
              {
                repairs.filter(
                  (r) =>
                    r.status === "in_progress" ||
                    r.status === "diagnosing" ||
                    r.status === "received",
                ).length
              }
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} md={2}>
          <Paper
            sx={{
              p: 1.5,
              textAlign: "center",
              borderRadius: "16px",
              bgcolor: alpha(UI_COLORS.success, 0.05),
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Completed
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={UI_COLORS.success}
            >
              {
                repairs.filter(
                  (r) => r.status === "completed" || r.status === "delivered",
                ).length
              }
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Status Filter Tabs */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, overflowX: "auto", pb: 1 }}>
        {[
          "all",
          "received",
          "diagnosing",
          "in_progress",
          "completed",
          "delivered",
        ].map((status) => (
          <Chip
            key={status}
            label={
              status === "all"
                ? "All"
                : `${statusConfig[status]?.icon || ""} ${statusConfig[status]?.label || status}`
            }
            onClick={() => setStatusFilter(status)}
            sx={{
              bgcolor: statusFilter === status ? UI_COLORS.primary : "white",
              color: statusFilter === status ? "white" : UI_COLORS.dark,
              fontWeight: 600,
              px: 1,
              "&:hover": {
                bgcolor:
                  statusFilter === status
                    ? UI_COLORS.secondary
                    : alpha(UI_COLORS.primary, 0.1),
              },
            }}
          />
        ))}
      </Box>

      {/* Repair Cards */}
      {filteredRepairs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: "20px" }}>
          <BuildIcon
            sx={{ fontSize: 48, color: UI_COLORS.gray, mb: 1, opacity: 0.5 }}
          />
          <Typography color="text.secondary">
            No repair tickets found
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mt: 2, bgcolor: UI_COLORS.primary }}
          >
            Create New Ticket
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredRepairs.map((repair) => (
            <Grid item xs={12} sm={6} md={4} key={repair.id}>
              <Card
                sx={{
                  borderRadius: "20px",
                  border: `1px solid ${UI_COLORS.border}`,
                  boxShadow: "none",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  },
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
                      ) : repair.device_type === "laptop" ? (
                        <LaptopIcon />
                      ) : (
                        <TabletIcon />
                      )}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                      <Typography noWrap variant="subtitle1" fontWeight="800">
                        {repair.device_brand} {repair.device_model}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PersonIcon
                          sx={{ fontSize: 12, color: "text.secondary" }}
                        />
                        <Typography
                          noWrap
                          variant="caption"
                          fontWeight="600"
                          color="text.secondary"
                        >
                          {repair.customer_name}
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip
                      label={
                        statusConfig[repair.status]?.label || repair.status
                      }
                      size="small"
                      sx={{
                        fontSize: "0.65rem",
                        height: 24,
                        fontWeight: 700,
                        bgcolor: alpha(
                          statusConfig[repair.status]?.color || "#ccc",
                          0.1,
                        ),
                        color: statusConfig[repair.status]?.color,
                      }}
                    />
                  </Stack>

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
                      sx={{ fontSize: "0.85rem" }}
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
                        lineHeight: 1.4,
                      }}
                    >
                      {repair.issue_description?.substring(0, 80) ||
                        "No issue description"}
                      {repair.issue_description?.length > 80 && "..."}
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
                        TOTAL
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="800"
                        sx={{ fontSize: "0.9rem", color: UI_COLORS.primary }}
                      >
                        ETB{" "}
                        {repair.final_cost || repair.estimated_cost || "TBD"}
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
      )}

      {/* Mobile FAB */}
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
            "&:hover": { bgcolor: UI_COLORS.secondary },
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Create New Ticket Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          resetForm();
          setOpenDialog(false);
        }}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: "24px", minHeight: "550px" } }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: UI_COLORS.dark,
            pb: 1,
          }}
        >
          New Repair Ticket
        </DialogTitle>

        {/* Stepper */}
        <Box sx={{ px: 3, pt: 1 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <DialogContent dividers sx={{ pt: 3 }}>
          {/* Step 1: Customer Information */}
          {activeStep === 0 && (
            <Stack spacing={3}>
              <Paper sx={{ borderRadius: "16px" }}>
                <Tabs
                  value={tabValue}
                  onChange={(e, v) => setTabValue(v)}
                  sx={{ borderBottom: 1, borderColor: UI_COLORS.border }}
                >
                  <Tab label="🔍 Select Existing" />
                  <Tab label="➕ Create New" />
                </Tabs>

                {/* Select Existing Customer Tab */}
                {tabValue === 0 && (
                  <Box sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Search by name or phone"
                      value={customerForm.name}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Type to search..."
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: loadingCustomers && (
                          <CircularProgress size={20} />
                        ),
                      }}
                    />

                    {filteredCustomers.length > 0 ? (
                      <Grid container spacing={1}>
                        {filteredCustomers.map((customer) => (
                          <Grid item xs={12} key={customer.id}>
                            <Paper
                              sx={{
                                p: 1.5,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                                "&:hover": {
                                  bgcolor: alpha(UI_COLORS.primary, 0.05),
                                },
                                border:
                                  selectedCustomer?.id === customer.id
                                    ? `2px solid ${UI_COLORS.primary}`
                                    : "none",
                              }}
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Box>
                                <Typography fontWeight="600">
                                  {customer.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {customer.phone}
                                </Typography>
                                {customer.email && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                  >
                                    {customer.email}
                                  </Typography>
                                )}
                              </Box>
                              {selectedCustomer?.id === customer.id ? (
                                <CheckIcon sx={{ color: UI_COLORS.success }} />
                              ) : (
                                <Button size="small" variant="outlined">
                                  Select
                                </Button>
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      customerForm.name && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          No customers found. Switch to "Create New" tab to add
                          a new customer.
                        </Alert>
                      )
                    )}
                  </Box>
                )}

                {/* Create New Customer Tab */}
                {tabValue === 1 && (
                  <Box sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Full Name *"
                          value={customerForm.name}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Phone Number *"
                          value={customerForm.phone}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              phone: e.target.value,
                            })
                          }
                          required
                          helperText="Unique phone number"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                +251
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Email (Optional)"
                          value={customerForm.email}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              email: e.target.value,
                            })
                          }
                          type="email"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Address (Optional)"
                          value={customerForm.address}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              address: e.target.value,
                            })
                          }
                          multiline
                          rows={2}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>

              {selectedCustomer && tabValue === 0 && (
                <Alert severity="success" sx={{ borderRadius: "12px" }}>
                  Selected: <strong>{selectedCustomer.name}</strong> (
                  {selectedCustomer.phone})
                </Alert>
              )}
            </Stack>
          )}

          {/* Step 2: Device Details */}
          {activeStep === 1 && selectedCustomer && (
            <Stack spacing={3}>
              <Alert severity="success" sx={{ borderRadius: "12px" }}>
                Customer: <strong>{selectedCustomer.name}</strong> (
                {selectedCustomer.phone})
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Device Type *</InputLabel>
                    <Select
                      value={repairForm.device_type}
                      label="Device Type *"
                      onChange={(e) =>
                        setRepairForm({
                          ...repairForm,
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
                    value={repairForm.device_brand}
                    onChange={(e) =>
                      setRepairForm({
                        ...repairForm,
                        device_brand: e.target.value,
                      })
                    }
                    placeholder="e.g., Samsung, Apple, Dell"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Model *"
                    value={repairForm.device_model}
                    onChange={(e) =>
                      setRepairForm({
                        ...repairForm,
                        device_model: e.target.value,
                      })
                    }
                    placeholder="e.g., Galaxy S22, iPhone 14"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Issue Description *"
                    multiline
                    rows={4}
                    value={repairForm.issue_description}
                    onChange={(e) =>
                      setRepairForm({
                        ...repairForm,
                        issue_description: e.target.value,
                      })
                    }
                    placeholder="Describe the problem in detail..."
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Estimated Cost (ETB)"
                    type="number"
                    value={repairForm.estimated_cost}
                    onChange={(e) =>
                      setRepairForm({
                        ...repairForm,
                        estimated_cost: e.target.value,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">ETB</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={() => {
              if (activeStep === 0) {
                resetForm();
                setOpenDialog(false);
              } else {
                setActiveStep(0);
              }
            }}
          >
            {activeStep === 0 ? "Cancel" : "Back"}
          </Button>

          {activeStep === 0 ? (
            tabValue === 0 ? (
              <Button
                variant="contained"
                onClick={() => {
                  if (!selectedCustomer) {
                    showSnackbar("Please select a customer!", "warning");
                  } else {
                    setActiveStep(1);
                  }
                }}
                endIcon={<ArrowForwardIcon />}
                sx={{ bgcolor: UI_COLORS.primary }}
                disabled={!selectedCustomer}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleCreateCustomer}
                endIcon={<ArrowForwardIcon />}
                sx={{ bgcolor: UI_COLORS.success }}
              >
                Create & Continue
              </Button>
            )
          ) : (
            <Button
              variant="contained"
              onClick={handleCreateRepair}
              startIcon={<CheckIcon />}
              sx={{ bgcolor: UI_COLORS.success }}
            >
              Create Ticket
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <form onSubmit={handleUpdateStatus}>
          <DialogTitle sx={{ fontWeight: "bold" }}>Update Status</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
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
                placeholder="Enter final repair cost"
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Repairs;
