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
  const [statusData, setStatusData] = useState({ status: "", final_cost: "" });

  useEffect(() => {
    loadRepairs();
    loadProducts();
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

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.data);
    } catch (error) {}
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
      loadRepairs();
    } catch (error) {
      showSnackbar("Failed to create repair", "error");
    }
  };

  const handleAddPart = async (e) => {
    e.preventDefault();
    if (!partData.product_id) {
      showSnackbar("Select a part", "error");
      return;
    }
    try {
      await addRepairPart(selectedRepair.id, partData);
      showSnackbar("Part added", "success");
      setOpenPartsDialog(false);
      loadRepairs();
    } catch (error) {
      showSnackbar("Failed to add part", "error");
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
          onClick={() => setOpenDialog(true)}
        >
          New Repair
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Card
            sx={{
              cursor: "pointer",
              border: statusFilter === "all" ? 2 : 0,
              borderColor: "primary.main",
            }}
            onClick={() => setStatusFilter("all")}
          >
            <CardContent>
              <Typography variant="body2">All Repairs</Typography>
              <Typography variant="h4">{repairs.length}</Typography>
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
              }}
              onClick={() => setStatusFilter(key)}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body2">{config.label}</Typography>
                    <Typography variant="h5">
                      {repairs.filter((r) => r.status === key).length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: config.color }}>{config.icon}</Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search repairs..."
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
              <IconButton onClick={loadRepairs}>
                <RefreshIcon />
              </IconButton>
            ),
          }}
        />
      </Paper>

      <Stack spacing={2}>
        {paginatedRepairs.map((repair) => {
          const currentStatus = statusConfig[repair.status];
          return (
            <Card key={repair.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: currentStatus.color }}>
                      {currentStatus.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {repair.device_brand} {repair.device_model}
                      </Typography>
                      <Typography variant="caption">
                        Ticket #{repair.id}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Chip
                      label={currentStatus.label}
                      sx={{
                        bgcolor: alpha(currentStatus.color, 0.1),
                        color: currentStatus.color,
                        mr: 1,
                      }}
                    />
                    {(user?.role === "technician" ||
                      user?.role === "admin") && (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<SpeedIcon />}
                          onClick={() => {
                            setSelectedRepair(repair);
                            setStatusData({
                              status: repair.status,
                              final_cost: repair.final_cost || "",
                            });
                            setOpenStatusDialog(true);
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<BuildIcon />}
                          onClick={() => {
                            setSelectedRepair(repair);
                            setOpenPartsDialog(true);
                          }}
                        >
                          Add Part
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Box>
                        <Typography variant="body2">
                          {repair.customer_name}
                        </Typography>
                        <Typography variant="caption">
                          {repair.customer_phone}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <DevicesIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">
                        {repair.device_type} • {repair.device_brand}{" "}
                        {repair.device_model}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BugReportIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">
                        {repair.issue_description}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Stepper
                  activeStep={statusSteps.indexOf(repair.status)}
                  sx={{ mt: 2 }}
                >
                  {statusSteps.map((step) => (
                    <Step key={step}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              bgcolor: statusConfig[step].color,
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
                {repair.parts_used?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Parts Used:</Typography>
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
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <TablePagination
          component="div"
          count={filteredRepairs.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(e.target.value);
            setPage(0);
          }}
        />
      </Box>

      {/* Dialogs - Add New Repair, Add Parts, Update Status */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>New Repair</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Search Customer"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </Grid>
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
              {formData.customer_id && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="success">
                    Selected: {formData.customer_name}
                  </Alert>
                </Grid>
              )}
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Device Type</InputLabel>
                  <Select
                    name="device_type"
                    value={formData.device_type}
                    onChange={(e) =>
                      setFormData({ ...formData, device_type: e.target.value })
                    }
                  >
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="laptop">Laptop</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  name="device_brand"
                  label="Brand"
                  fullWidth
                  value={formData.device_brand}
                  onChange={(e) =>
                    setFormData({ ...formData, device_brand: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  name="device_model"
                  label="Model"
                  fullWidth
                  value={formData.device_model}
                  onChange={(e) =>
                    setFormData({ ...formData, device_model: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  name="estimated_cost"
                  label="Est. Cost"
                  type="number"
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
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="issue_description"
                  label="Issue"
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
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openPartsDialog}
        onClose={() => setOpenPartsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Parts</DialogTitle>
        <form onSubmit={handleAddPart}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Select Part</InputLabel>
                  <Select
                    name="product_id"
                    value={partData.product_id}
                    onChange={(e) => {
                      setPartData({ ...partData, product_id: e.target.value });
                      const p = products.find((p) => p.id === e.target.value);
                      if (p)
                        setPartData((prev) => ({
                          ...prev,
                          price_at_time: p.price,
                        }));
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {products
                      .filter((p) => p.stock_quantity > 0)
                      .map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name} - ETB {p.price}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  name="quantity"
                  label="Qty"
                  type="number"
                  fullWidth
                  value={partData.quantity}
                  onChange={(e) =>
                    setPartData({ ...partData, quantity: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  name="price_at_time"
                  label="Price"
                  type="number"
                  fullWidth
                  value={partData.price_at_time}
                  onChange={(e) =>
                    setPartData({ ...partData, price_at_time: e.target.value })
                  }
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
            <Button onClick={() => setOpenPartsDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Status</DialogTitle>
        <form onSubmit={handleUpdateStatus}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={statusData.status}
                    onChange={(e) =>
                      setStatusData({ ...statusData, status: e.target.value })
                    }
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
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="final_cost"
                  label="Final Cost"
                  type="number"
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
          <DialogActions>
            <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Repairs;
