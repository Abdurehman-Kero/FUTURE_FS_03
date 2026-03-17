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
  useMediaQuery,
  useTheme,
  Drawer,
  BottomNavigation,
  BottomNavigationAction,
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
  Close as CloseIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import {
  getRepairs,
  createRepair,
  updateRepairStatus,
  getRepairsByStatus,
} from "../services/api";
import { searchCustomers } from "../services/api";
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

// Color scheme
const colors = {
  primary: "#FF8500",
  secondary: "#FFA33C",
  gradient: "linear-gradient(135deg, #FF8500 0%, #FFA33C 100%)",
  light: "#F8F9FA",
  dark: "#1E1A3A",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  white: "#FFFFFF",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
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
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
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

  // Update rows per page on screen size change
  useEffect(() => {
    setRowsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

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
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const filteredRepairs = repairs.filter(
    (r) =>
      (r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customer_phone?.includes(searchTerm) ||
        r.device_model?.toLowerCase().includes(searchTerm.toLowerCase())) &&
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
        return colors.info;
      case "diagnosing":
        return colors.warning;
      case "in_progress":
        return "#9c27b0";
      case "completed":
        return colors.success;
      case "delivered":
        return colors.gray;
      default:
        return colors.gray;
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setStatusFilter("all");
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
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: "100%", overflow: "hidden" }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 2, sm: 0 },
          mb: 3,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h5"}
          fontWeight="600"
          color={colors.dark}
          sx={{ textAlign: { xs: "center", sm: "left" } }}
        >
          Repairs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          fullWidth={isMobile}
          sx={{
            background: colors.gradient,
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: { xs: 1.5, sm: 1 },
            "&:hover": { background: colors.secondary },
          }}
        >
          New Repair
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={
              isMobile ? "Search repairs..." : "Search by customer or device..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: colors.primary }}
                    fontSize={isMobile ? "small" : "medium"}
                  />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: colors.light, borderRadius: 1 }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={loadRepairs} sx={{ bgcolor: colors.light }}>
              <RefreshIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter">
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                bgcolor: statusFilter !== "all" ? colors.primary : colors.light,
                color: statusFilter !== "all" ? colors.white : colors.gray,
              }}
            >
              <FilterIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Filter Chips - Collapsible */}
        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Filter by status:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={`All (${repairs.length})`}
                onClick={() => setStatusFilter("all")}
                color={statusFilter === "all" ? "primary" : "default"}
                size="small"
                sx={{ borderRadius: 2 }}
              />
              {Object.entries(statusConfig).map(([key, config]) => (
                <Chip
                  key={key}
                  label={`${config.label} (${repairs.filter((r) => r.status === key).length})`}
                  onClick={() => setStatusFilter(key)}
                  size="small"
                  sx={{
                    bgcolor:
                      statusFilter === key
                        ? config.color
                        : alpha(config.color, 0.1),
                    color: statusFilter === key ? "white" : config.color,
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
          </Box>
        )}
      </Paper>

      {/* Repairs List */}
      {paginatedRepairs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <BuildIcon sx={{ fontSize: 48, color: colors.gray, mb: 2 }} />
          <Typography color={colors.gray}>No repairs found</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              mt: 2,
              bgcolor: colors.primary,
              "&:hover": { bgcolor: colors.secondary },
            }}
          >
            Create First Repair
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {paginatedRepairs.map((repair) => (
            <Card key={repair.id} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                {/* Header with Status */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor: getStatusColor(repair.status),
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                      }}
                    >
                      {statusConfig[repair.status]?.icon || <AssignmentIcon />}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}
                      >
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
                      height: 24,
                    }}
                  />
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Customer & Device Info */}
                <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 18, color: colors.gray }} />
                      <Box>
                        <Typography variant="body2" fontWeight="500">
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
                      <DevicesIcon sx={{ fontSize: 18, color: colors.gray }} />
                      <Typography variant="body2" color="text.secondary">
                        {repair.device_type} • {repair.device_brand}{" "}
                        {repair.device_model}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Issue */}
                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    Issue:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ bgcolor: colors.light, p: 1, borderRadius: 1 }}
                  >
                    {repair.issue_description}
                  </Typography>
                </Box>

                {/* Cost & Parts */}
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}
                >
                  <Chip
                    icon={<MoneyIcon />}
                    label={`Est: ETB ${repair.estimated_cost?.toLocaleString() || "TBD"}`}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: colors.primary, color: colors.primary }}
                  />
                  {repair.final_cost && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`Final: ETB ${repair.final_cost?.toLocaleString()}`}
                      size="small"
                      sx={{
                        bgcolor: alpha(colors.success, 0.1),
                        color: colors.success,
                      }}
                    />
                  )}
                </Box>

                {/* Parts Used */}
                {repair.parts_used?.length > 0 && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      gutterBottom
                    >
                      Parts Used:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {repair.parts_used.map((p) => (
                        <Chip
                          key={p.id}
                          label={`${p.part_name} x${p.quantity}`}
                          size="small"
                          variant="outlined"
                          sx={{ height: 24 }}
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
                      variant="contained"
                      fullWidth={isMobile}
                      onClick={() => {
                        setSelectedRepair(repair);
                        setStatusData({
                          status: repair.status,
                          final_cost: repair.final_cost || "",
                        });
                        setOpenStatusDialog(true);
                      }}
                      sx={{
                        background: colors.gradient,
                        "&:hover": { background: colors.secondary },
                        textTransform: "none",
                      }}
                    >
                      Update Status
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {filteredRepairs.length > 0 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
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

      {/* New Repair Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            background: colors.gradient,
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          New Repair Ticket
          {isMobile && (
            <IconButton
              onClick={() => setOpenDialog(false)}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          )}
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
                  size={isMobile ? "small" : "medium"}
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
                          <PersonIcon sx={{ color: colors.primary }} />
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
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
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
                  size={isMobile ? "small" : "medium"}
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
                  size={isMobile ? "small" : "medium"}
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
                  size={isMobile ? "small" : "medium"}
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
                  rows={isMobile ? 2 : 3}
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
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{ p: 2, flexDirection: isMobile ? "column" : "row", gap: 1 }}
          >
            {!isMobile && (
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              disabled={!formData.customer_id}
              sx={{
                background: colors.gradient,
                "&:hover": { background: colors.secondary },
                py: isMobile ? 1.5 : 1,
              }}
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
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            background: colors.gradient,
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Update Status
          {isMobile && (
            <IconButton
              onClick={() => setOpenStatusDialog(false)}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <form onSubmit={handleUpdateStatus}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
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
                  size={isMobile ? "small" : "medium"}
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
          <DialogActions
            sx={{ p: 2, flexDirection: isMobile ? "column" : "row", gap: 1 }}
          >
            {!isMobile && (
              <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              sx={{
                background: colors.gradient,
                "&:hover": { background: colors.secondary },
                py: isMobile ? 1.5 : 1,
              }}
            >
              Update Status
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: isMobile ? "center" : "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: 1, width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Repairs;
