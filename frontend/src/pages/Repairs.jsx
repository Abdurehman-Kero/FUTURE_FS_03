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
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Stack,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  BugReport as BugReportIcon,
  Person as PersonIcon,
  Devices as DevicesIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Assignment as AssignmentIcon,
  Speed as SpeedIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  History as HistoryIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import {
  getRepairs,
  createRepair,
  updateRepairStatus,
  addRepairPart,
  getRepairsByStatus,
} from "../services/api";
import { searchCustomers } from "../services/api";
import { getProducts } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Status configuration
const statusConfig = {
  received: {
    label: "Received",
    color: "#2196f3",
    icon: <AssignmentIcon />,
    bgColor: "#e3f2fd",
  },
  diagnosing: {
    label: "Diagnosing",
    color: "#ff9800",
    icon: <BugReportIcon />,
    bgColor: "#fff3e0",
  },
  in_progress: {
    label: "In Progress",
    color: "#9c27b0",
    icon: <BuildIcon />,
    bgColor: "#f3e5f5",
  },
  completed: {
    label: "Completed",
    color: "#4caf50",
    icon: <CheckCircleIcon />,
    bgColor: "#e8f5e9",
  },
  delivered: {
    label: "Delivered",
    color: "#607d8b",
    icon: <ReceiptIcon />,
    bgColor: "#eceff1",
  },
};

const statusSteps = [
  "received",
  "diagnosing",
  "in_progress",
  "completed",
  "delivered",
];

const Repairs = () => {
  const { user } = useAuth();
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPartsDialog, setOpenPartsDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [products, setProducts] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    customer_phone: "",
    device_type: "phone",
    device_brand: "",
    device_model: "",
    issue_description: "",
    estimated_cost: "",
  });

  const [partData, setPartData] = useState({
    product_id: "",
    quantity: 1,
    price_at_time: "",
  });

  const [statusData, setStatusData] = useState({
    status: "",
    final_cost: "",
  });

  useEffect(() => {
    loadRepairs();
    loadProducts();
  }, []);

  useEffect(() => {
    if (statusFilter !== "all") {
      loadRepairsByStatus();
    } else {
      loadRepairs();
    }
  }, [statusFilter]);

  const loadRepairs = async () => {
    try {
      setLoading(true);
      const response = await getRepairs();
      setRepairs(response.data.data);
    } catch (error) {
      showSnackbar("Failed to load repairs", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadRepairsByStatus = async () => {
    try {
      setLoading(true);
      const response = await getRepairsByStatus(statusFilter);
      setRepairs(response.data.data);
    } catch (error) {
      showSnackbar("Failed to load repairs", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.data);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const handleCustomerSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await searchCustomers(query);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Customer search failed:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (customerSearch) handleCustomerSearch(customerSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  const selectCustomer = (customer) => {
    setFormData((prev) => ({
      ...prev,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_phone: customer.phone,
    }));
    setCustomerSearch("");
    setSearchResults([]);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      customer_id: "",
      customer_name: "",
      customer_phone: "",
      device_type: "phone",
      device_brand: "",
      device_model: "",
      issue_description: "",
      estimated_cost: "",
    });
    setCustomerSearch("");
    setSearchResults([]);
  };

  const handleOpenPartsDialog = (repair) => {
    setSelectedRepair(repair);
    setPartData({ product_id: "", quantity: 1, price_at_time: "" });
    setOpenPartsDialog(true);
  };

  const handleClosePartsDialog = () => {
    setOpenPartsDialog(false);
    setSelectedRepair(null);
  };

  const handleOpenStatusDialog = (repair) => {
    setSelectedRepair(repair);
    setStatusData({
      status: repair.status,
      final_cost: repair.final_cost || "",
    });
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedRepair(null);
  };

 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setFormData((prev) => ({ ...prev, [name]: value }));
 };

 const handlePartInputChange = (e) => {
   const { name, value } = e.target;
   setPartData((prev) => ({ ...prev, [name]: value }));
   if (name === "product_id") {
     const product = products.find((p) => p.id === parseInt(value));
     if (product)
       setPartData((prev) => ({ ...prev, price_at_time: product.price }));
   }
 };

 const handleStatusChange = (e) => {
   const { name, value } = e.target;
   setStatusData((prev) => ({ ...prev, [name]: value }));
 };

 const handleSubmit = async (e) => {
   e.preventDefault();
   if (!formData.customer_id || !formData.issue_description) {
     showSnackbar("Customer and issue description are required", "error");
     return;
   }
   try {
     await createRepair(formData);
     showSnackbar("Repair ticket created successfully", "success");
     handleCloseDialog();
     loadRepairs();
   } catch (error) {
     showSnackbar(
       error.response?.data?.message || "Failed to create repair",
       "error",
     );
   }
 };

 const handleAddPart = async (e) => {
   e.preventDefault();
   if (!partData.product_id) {
     showSnackbar("Please select a part", "error");
     return;
   }
   try {
     await addRepairPart(selectedRepair.id, partData);
     showSnackbar("Part added successfully", "success");
     handleClosePartsDialog();
     loadRepairs();
   } catch (error) {
     showSnackbar("Failed to add part", "error");
   }
 };

 const handleUpdateStatus = async (e) => {
   e.preventDefault();
   try {
     await updateRepairStatus(selectedRepair.id, statusData);
     showSnackbar("Status updated successfully", "success");
     handleCloseStatusDialog();
     loadRepairs();
   } catch (error) {
     showSnackbar("Failed to update status", "error");
   }
 };
  const getActiveStep = (status) => statusSteps.indexOf(status);

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch =
      repair.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.customer_phone?.includes(searchTerm) ||
      repair.device_brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.device_model?.toLowerCase().includes(searchTerm.toLowerCase());
    return (
      matchesSearch &&
      (statusFilter === "all" || repair.status === statusFilter)
    );
  });

  const paginatedRepairs = filteredRepairs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

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
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="500">
          Repair Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          New Repair Ticket
        </Button>
      </Box>

      {/* Status Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Card
            sx={{
              cursor: "pointer",
              border: statusFilter === "all" ? 2 : 0,
              borderColor: "primary.main",
              bgcolor: statusFilter === "all" ? alpha("#667eea", 0.1) : "white",
              transition: "all 0.2s",
              "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
            }}
            onClick={() => setStatusFilter("all")}
          >
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                All Repairs
              </Typography>
              <Typography variant="h4" fontWeight="500">
                {repairs.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {Object.entries(statusConfig).map(([key, config]) => (
          <Grid size={{ xs: 6, sm: 2.4 }} key={key}>
            <Card
              sx={{
                cursor: "pointer",
                border: statusFilter === key ? 2 : 0,
                borderColor: config.color,
                bgcolor:
                  statusFilter === key ? alpha(config.color, 0.1) : "white",
                transition: "all 0.2s",
                "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
              }}
              onClick={() => setStatusFilter(key)}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      gutterBottom
                    >
                      {config.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="500">
                      {repairs.filter((r) => r.status === key).length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: config.color, width: 40, height: 40 }}>
                    {config.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by customer name, phone, or device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: "#f8f9fa", borderRadius: 1 }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={loadRepairs} sx={{ bgcolor: "#f8f9fa" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Repairs List */}
      <Stack spacing={2}>
        {paginatedRepairs.map((repair) => {
          const currentStatus =
            statusConfig[repair.status] || statusConfig.received;
          const activeStep = getActiveStep(repair.status);

          return (
            <Card
              key={repair.id}
              sx={{ borderRadius: 2, "&:hover": { boxShadow: 3 } }}
            >
              <CardContent>
                {/* Header with Status */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: currentStatus.color,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {currentStatus.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {repair.device_brand} {repair.device_model}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ticket #{repair.id} • Created{" "}
                        {new Date(repair.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={currentStatus.label}
                      sx={{
                        bgcolor: currentStatus.bgColor,
                        color: currentStatus.color,
                        fontWeight: 500,
                      }}
                    />
                    {(user?.role === "technician" ||
                      user?.role === "admin") && (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<SpeedIcon />}
                          onClick={() => handleOpenStatusDialog(repair)}
                          sx={{ textTransform: "none" }}
                        >
                          Update
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<BuildIcon />}
                          onClick={() => handleOpenPartsDialog(repair)}
                          sx={{ textTransform: "none" }}
                        >
                          Add Part
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>

                {/* Customer & Device Info */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon
                        sx={{ color: "text.secondary", fontSize: 20 }}
                      />
                      <Box>
                        <Typography variant="body2">
                          {repair.customer_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {repair.customer_phone}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DevicesIcon
                        sx={{ color: "text.secondary", fontSize: 20 }}
                      />
                      <Typography variant="body2">
                        {repair.device_type} • {repair.device_brand}{" "}
                        {repair.device_model}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BugReportIcon
                        sx={{ color: "text.secondary", fontSize: 20 }}
                      />
                      <Typography variant="body2" noWrap>
                        {repair.issue_description}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Cost Info */}
                <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MoneyIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Typography variant="body2">
                      Est:{" "}
                      <strong>
                        ETB {repair.estimated_cost?.toLocaleString() || "TBD"}
                      </strong>
                    </Typography>
                  </Box>
                  {repair.final_cost && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckCircleIcon
                        sx={{ color: "success.main", fontSize: 20 }}
                      />
                      <Typography variant="body2" color="success.main">
                        Final:{" "}
                        <strong>
                          ETB {repair.final_cost?.toLocaleString()}
                        </strong>
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Progress Stepper */}
                <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 2 }}>
                  {statusSteps.map((step, index) => (
                    <Step key={step}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              bgcolor:
                                index <= activeStep
                                  ? statusConfig[step].color
                                  : "#e0e0e0",
                              color: "white",
                              fontSize: "0.9rem",
                            }}
                          >
                            {statusConfig[step].icon}
                          </Avatar>
                        )}
                      >
                        <Typography variant="caption">
                          {statusConfig[step].label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Parts Used */}
                {repair.parts_used?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Parts Used:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {repair.parts_used.map((part) => (
                        <Chip
                          key={part.id}
                          label={`${part.part_name} x${part.quantity} - ETB ${part.price_at_time}`}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/* Pagination */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <TablePagination
          component="div"
          count={filteredRepairs.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>

      {/* New Repair Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Repair Ticket</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Search Customer"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Type name or phone number..."
                />
                {searchResults.length > 0 && (
                  <Paper sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
                    {searchResults.map((customer) => (
                      <ListItem
                        key={customer.id}
                        button
                        onClick={() => selectCustomer(customer)}
                      >
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={customer.name}
                          secondary={customer.phone}
                        />
                      </ListItem>
                    ))}
                  </Paper>
                )}
              </Grid>

              {formData.customer_id && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <Alert severity="success" sx={{ borderRadius: 1 }}>
                      Selected: {formData.customer_name} (
                      {formData.customer_phone})
                    </Alert>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Device Type</InputLabel>
                      <Select
                        name="device_type"
                        value={formData.device_type}
                        label="Device Type"
                        onChange={handleInputChange}
                        required
                      >
                        <MenuItem value="phone">Phone</MenuItem>
                        <MenuItem value="laptop">Laptop</MenuItem>
                        <MenuItem value="tablet">Tablet</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <TextField
                      name="device_brand"
                      label="Brand"
                      fullWidth
                      value={formData.device_brand}
                      onChange={handleInputChange}
                      placeholder="e.g., Samsung, iPhone"
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <TextField
                      name="device_model"
                      label="Model"
                      fullWidth
                      value={formData.device_model}
                      onChange={handleInputChange}
                      placeholder="e.g., Galaxy S22"
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <TextField
                      name="estimated_cost"
                      label="Estimated Cost (ETB)"
                      type="number"
                      fullWidth
                      value={formData.estimated_cost}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">ETB</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      name="issue_description"
                      label="Issue Description"
                      multiline
                      rows={3}
                      fullWidth
                      value={formData.issue_description}
                      onChange={handleInputChange}
                      required
                      placeholder="Describe the problem in detail..."
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!formData.customer_id}
            >
              Create Ticket
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Parts Dialog */}
      <Dialog
        open={openPartsDialog}
        onClose={handleClosePartsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Parts to Repair</DialogTitle>
        <form onSubmit={handleAddPart}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Select Part</InputLabel>
                  <Select
                    name="product_id"
                    value={partData.product_id}
                    label="Select Part"
                    onChange={handlePartInputChange}
                    required
                  >
                    {products
                      .filter(
                        (p) =>
                          p.category === "accessory" || p.stock_quantity > 0,
                      )
                      .map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name} - ETB {product.price} (
                          {product.stock_quantity} in stock)
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  name="quantity"
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={partData.quantity}
                  onChange={handlePartInputChange}
                  required
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  name="price_at_time"
                  label="Price (ETB)"
                  type="number"
                  fullWidth
                  value={partData.price_at_time}
                  onChange={handlePartInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">ETB</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePartsDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add Part
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Repair Status</DialogTitle>
        <form onSubmit={handleUpdateStatus}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={statusData.status}
                    label="Status"
                    onChange={handleStatusChange}
                    required
                  >
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <MenuItem key={key} value={key}>
                        {config.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="final_cost"
                  label="Final Cost (ETB)"
                  type="number"
                  fullWidth
                  value={statusData.final_cost}
                  onChange={handleStatusChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">ETB</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {selectedRepair && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="info" sx={{ borderRadius: 1 }}>
                    Current Status: {statusConfig[selectedRepair.status]?.label}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStatusDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update Status
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ borderRadius: 1 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default Repairs;
