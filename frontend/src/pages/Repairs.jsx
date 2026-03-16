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

// Simple status configuration
const statusConfig = {
  received: { label: "Received", color: "#2196f3", icon: <AssignmentIcon /> },
  diagnosing: {
    label: "Diagnosing",
    color: "#ff9800",
    icon: <BugReportIcon />,
  },
  in_progress: { label: "In Progress", color: "#9c27b0", icon: <BuildIcon /> },
  completed: {
    label: "Completed",
    color: "#4caf50",
    icon: <CheckCircleIcon />,
  },
  delivered: { label: "Delivered", color: "#607d8b", icon: <ReceiptIcon /> },
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
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
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

  const [statusData, setStatusData] = useState({ status: "", final_cost: "" });

  useEffect(() => {
    loadRepairs();
  }, []);

  useEffect(() => {
    statusFilter !== "all" ? loadRepairsByStatus() : loadRepairs();
  }, [statusFilter]);

  const loadRepairs = async () => {
    try {
      setLoading(true);
      const res = await getRepairs();
      setRepairs(res.data.data);
    } catch (error) {
      showSnackbar("Failed to load repairs", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadRepairsByStatus = async () => {
    try {
      setLoading(true);
      const res = await getRepairsByStatus(statusFilter);
      setRepairs(res.data.data);
    } catch (error) {
      showSnackbar("Failed to load repairs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (customerSearch) {
        const res = await searchCustomers(customerSearch);
        setSearchResults(res.data.data);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const filteredRepairs = repairs.filter(
    (r) =>
      (r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customer_phone?.includes(searchTerm)) &&
      (statusFilter === "all" || r.status === statusFilter),
  );

  const paginatedRepairs = filteredRepairs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_id || !formData.issue_description) {
      showSnackbar("Customer and issue required", "error");
      return;
    }
    try {
      await createRepair(formData);
      showSnackbar("Repair created", "success");
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
      loadRepairs();
    } catch (error) {
      showSnackbar("Failed to create repair", "error");
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await updateRepairStatus(selectedRepair.id, statusData);
      showSnackbar("Status updated", "success");
      setOpenStatusDialog(false);
      loadRepairs();
    } catch (error) {
      showSnackbar("Failed to update status", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "received":
        return "#2196f3";
      case "diagnosing":
        return "#ff9800";
      case "in_progress":
        return "#9c27b0";
      case "completed":
        return "#4caf50";
      case "delivered":
        return "#607d8b";
      default:
        return "#757575";
    }
  };

  if (loading)
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
        <Typography variant="h5" fontWeight="600">
          Repairs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ bgcolor: "#FF8500", "&:hover": { bgcolor: "#FFA33C" } }}
        >
          New Repair
        </Button>
      </Box>

      {/* Status Filter Chips */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        <Chip
          label={`All (${repairs.length})`}
          onClick={() => setStatusFilter("all")}
          color={statusFilter === "all" ? "primary" : "default"}
          sx={{ borderRadius: 2 }}
        />
        {Object.entries(statusConfig).map(([key, config]) => (
          <Chip
            key={key}
            label={`${config.label} (${repairs.filter((r) => r.status === key).length})`}
            onClick={() => setStatusFilter(key)}
            sx={{
              bgcolor:
                statusFilter === key ? config.color : alpha(config.color, 0.1),
              color: statusFilter === key ? "white" : config.color,
              fontWeight: 500,
              borderRadius: 2,
              "&:hover": {
                bgcolor:
                  statusFilter === key
                    ? config.color
                    : alpha(config.color, 0.2),
              },
            }}
          />
        ))}
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by customer name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <IconButton onClick={loadRepairs} size="small">
                <RefreshIcon />
              </IconButton>
            ),
          }}
        />
      </Paper>

      {/* Repairs List */}
      <Stack spacing={2}>
        {paginatedRepairs.map((repair) => (
          <Card key={repair.id} sx={{ borderRadius: 2 }}>
            <CardContent>
              {/* Header with Status */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: getStatusColor(repair.status),
                      width: 40,
                      height: 40,
                    }}
                  >
                    {statusConfig[repair.status]?.icon || <AssignmentIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600">
                      {repair.device_brand} {repair.device_model}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      #{repair.id} •{" "}
                      {new Date(repair.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={statusConfig[repair.status]?.label}
                  size="small"
                  sx={{
                    bgcolor: alpha(getStatusColor(repair.status), 0.1),
                    color: getStatusColor(repair.status),
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* Customer & Device Info */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
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
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DevicesIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {repair.device_type} • {repair.device_brand}{" "}
                      {repair.device_model}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Issue & Cost */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Issue:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {repair.issue_description}
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Chip
                    icon={<MoneyIcon />}
                    label={`Est: ETB ${repair.estimated_cost?.toLocaleString() || "TBD"}`}
                    size="small"
                    variant="outlined"
                  />
                  {repair.final_cost && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`Final: ETB ${repair.final_cost?.toLocaleString()}`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>

              {/* Parts Used (if any) */}
              {repair.parts_used?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Parts Used:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {repair.parts_used.map((p) => (
                      <Chip
                        key={p.id}
                        label={`${p.part_name} x${p.quantity}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              {(user?.role === "technician" || user?.role === "admin") && (
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setSelectedRepair(repair);
                      setStatusData({
                        status: repair.status,
                        final_cost: repair.final_cost || "",
                      });
                      setOpenStatusDialog(true);
                    }}
                    sx={{ borderColor: "#FF8500", color: "#FF8500" }}
                  >
                    Update Status
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Pagination */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
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
        />
      </Box>

      {/* New Repair Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#FF8500", color: "white" }}>
          New Repair Ticket
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              {/* Customer Search */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search Customer"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Type name or phone..."
                />
                {searchResults.length > 0 && (
                  <Paper sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
                    {searchResults.map((c) => (
                      <ListItem
                        key={c.id}
                        button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            customer_id: c.id,
                            customer_name: c.name,
                            customer_phone: c.phone,
                          });
                          setCustomerSearch("");
                          setSearchResults([]);
                        }}
                      >
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={c.name} secondary={c.phone} />
                      </ListItem>
                    ))}
                  </Paper>
                )}
              </Grid>

              {formData.customer_id && (
                <Grid item xs={12}>
                  <Alert severity="success" sx={{ borderRadius: 1 }}>
                    Selected: {formData.customer_name} (
                    {formData.customer_phone})
                  </Alert>
                </Grid>
              )}

              {/* Device Details */}
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Device Type</InputLabel>
                  <Select
                    name="device_type"
                    value={formData.device_type}
                    onChange={(e) =>
                      setFormData({ ...formData, device_type: e.target.value })
                    }
                    label="Device Type"
                  >
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="laptop">Laptop</MenuItem>
                    <MenuItem value="tablet">Tablet</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="device_brand"
                  label="Brand"
                  size="small"
                  fullWidth
                  value={formData.device_brand}
                  onChange={(e) =>
                    setFormData({ ...formData, device_brand: e.target.value })
                  }
                  placeholder="e.g., Samsung"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="device_model"
                  label="Model"
                  size="small"
                  fullWidth
                  value={formData.device_model}
                  onChange={(e) =>
                    setFormData({ ...formData, device_model: e.target.value })
                  }
                  placeholder="e.g., Galaxy S22"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="estimated_cost"
                  label="Est. Cost"
                  type="number"
                  size="small"
                  fullWidth
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

              <Grid item xs={12}>
                <TextField
                  name="issue_description"
                  label="Issue Description"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.issue_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      issue_description: e.target.value,
                    })
                  }
                  required
                  placeholder="Describe the problem..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!formData.customer_id}
              sx={{ bgcolor: "#FF8500", "&:hover": { bgcolor: "#FFA33C" } }}
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#FF8500", color: "white" }}>
          Update Status
        </DialogTitle>
        <form onSubmit={handleUpdateStatus}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={statusData.status}
                    onChange={(e) =>
                      setStatusData({ ...statusData, status: e.target.value })
                    }
                    label="Status"
                    required
                  >
                    {Object.entries(statusConfig).map(([k, v]) => (
                      <MenuItem key={k} value={k}>
                        {v.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="final_cost"
                  label="Final Cost"
                  type="number"
                  size="small"
                  fullWidth
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
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: "#FF8500", "&:hover": { bgcolor: "#FFA33C" } }}
            >
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 1 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Repairs;
