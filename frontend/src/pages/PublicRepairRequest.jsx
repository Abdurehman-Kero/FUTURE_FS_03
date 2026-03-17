import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  Divider,
} from "@mui/material";
import {
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

const steps = ["Device Details", "Issue Description", "Contact Info"];

const PublicRepairRequest = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    deviceType: "phone",
    deviceBrand: "",
    deviceModel: "",
    issueDescription: "",
    name: "",
    phone: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = () => {
    const msg = `🔧 Repair Request:\nDevice: ${formData.deviceBrand} ${formData.deviceModel}\nIssue: ${formData.issueDescription}\nCustomer: ${formData.name}\nPhone: ${formData.phone}`;
    window.open(
      `https://wa.me/251982310974?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
    setSnackbar({ open: true, message: "Redirecting to WhatsApp..." });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Device Type</InputLabel>
                <Select
                  value={formData.deviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, deviceType: e.target.value })
                  }
                >
                  <MenuItem value="phone">Smartphone</MenuItem>
                  <MenuItem value="laptop">Laptop</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Brand"
                value={formData.deviceBrand}
                onChange={(e) =>
                  setFormData({ ...formData, deviceBrand: e.target.value })
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Model"
                value={formData.deviceModel}
                onChange={(e) =>
                  setFormData({ ...formData, deviceModel: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Describe the Issue"
                multiline
                rows={6}
                value={formData.issueDescription}
                onChange={(e) =>
                  setFormData({ ...formData, issueDescription: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              fontWeight="600"
              align="center"
              gutterBottom
            >
              Request a Repair
            </Typography>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((l) => (
                <Step key={l}>
                  <StepLabel>{l}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <form>
              {getStepContent(activeStep)}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    startIcon={<WhatsAppIcon />}
                    sx={{
                      bgcolor: "#25D366",
                      "&:hover": { bgcolor: "#128C7E" },
                    }}
                  >
                    Submit via WhatsApp
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      bgcolor: "#BE3300",
                      "&:hover": { bgcolor: "#A02B00" },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </form>
            <Divider sx={{ my: 4 }} />
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" gutterBottom>
                Prefer to call?
              </Typography>
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                href="tel:+251982310974"
                sx={{ borderColor: "#BE3300", color: "#BE3300" }}
              >
                Call Us: +251 982310974
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity="success">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PublicRepairRequest;
