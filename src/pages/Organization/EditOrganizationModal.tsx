import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Alert,
  Chip,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
  Collapse,
  useTheme,
  alpha,
  Fade
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  EditOutlined as EditIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { Organization, UpdateOrganizationDto } from '../../api/organization/organizationApis';

interface EditOrganizationModalProps {
  open: boolean;
  organization: Organization | null;
  onClose: () => void;
  onSubmit: (data: UpdateOrganizationDto) => Promise<void>;
}

const PLANS = [
  { value: 'Free', label: 'Free', description: 'Basic features for small teams' },
  { value: 'Starter', label: 'Starter', description: 'Enhanced features for growing teams' },
  { value: 'Professional', label: 'Professional', description: 'Advanced features for organizations' },
  { value: 'Enterprise', label: 'Enterprise', description: 'Full features with priority support' }
];

const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({
  open,
  organization,
  onClose,
  onSubmit
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<UpdateOrganizationDto>({});
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        plan: organization.plan,
        isActive: organization.isActive
      });
      setHasChanges(false);
    }
  }, [organization]);

  const handleChange = (field: keyof UpdateOrganizationDto) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'isActive' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: null }));
    setSubmitError(null);
    
    if (!touched[field]) {
      setTouched((prev: any) => ({ ...prev, [field]: true }));
    }

    // Check if there are changes
    const changed = value !== organization?.[field];
    setHasChanges(changed || Object.keys(formData).some(key => 
      key !== field && formData[key as keyof UpdateOrganizationDto] !== organization?.[key as keyof Organization]
    ));
  };

  const handleBlur = (field: keyof UpdateOrganizationDto) => () => {
    setTouched((prev: any) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof UpdateOrganizationDto) => {
    const newErrors: any = { ...errors };
    
    if (field === 'name') {
      if (formData.name !== undefined) {
        if (!formData.name?.trim()) {
          newErrors.name = 'Organization name is required';
        } else if (formData.name.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else if (formData.name.length > 100) {
          newErrors.name = 'Name must be less than 100 characters';
        } else {
          delete newErrors.name;
        }
      }
    }

    setErrors(newErrors);
    return !newErrors[field];
  };

  const validate = () => {
    const newErrors: any = {};
    
    if (formData.name !== undefined) {
      if (!formData.name?.trim()) {
        newErrors.name = 'Organization name is required';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      } else if (formData.name.length > 100) {
        newErrors.name = 'Name must be less than 100 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !hasChanges) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      
      // Only send changed fields
      const changedData: UpdateOrganizationDto = {};
      if (formData.name !== organization?.name) changedData.name = formData.name;
      if (formData.plan !== organization?.plan) changedData.plan = formData.plan;
      if (formData.isActive !== organization?.isActive) changedData.isActive = formData.isActive;
      
      await onSubmit(changedData);
      handleClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to update organization');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFormData({});
      setErrors({});
      setSubmitError(null);
      setTouched({});
      setHasChanges(false);
      onClose();
    }
  };

  if (!organization) return null;

  const isFormValid = !Object.keys(errors).length && hasChanges;
  console.log("Render EditOrganizationModal", { formData, errors, touched, hasChanges });
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <EditIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight={600}>
              Edit Organization
            </Typography>
          </Stack>
          <IconButton
            onClick={handleClose}
            disabled={submitting}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: alpha(theme.palette.text.secondary, 0.1)
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Collapse in={!!submitError}>
          <Alert 
            severity="error" 
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setSubmitError(null)}
          >
            {submitError}
          </Alert>
        </Collapse>

        <Stack spacing={3}>
          {/* Organization Info Card */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <BusinessIcon sx={{ color: 'info.main', fontSize: 32 }} />
              <Box flex={1}>
                <Typography variant="body2" fontWeight={500} color="info.main">
                  Organization Details
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {organization.id} • Created: {new Date(organization.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Organization Name */}
          <Box>
            <TextField
              fullWidth
              label="Organization Name"
              value={formData.name || ''}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              error={touched.name && !!errors.name}
              helperText={touched.name ? errors.name : 'Choose a unique name for your organization'}
              required
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Box>

          {/* Slug Display */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.grey[500], 0.05),
              border: `1px dashed ${theme.palette.divider}`
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              CURRENT SLUG
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
              {organization.slug}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              The slug will be automatically updated if you change the organization name
            </Typography>
          </Box>

          {/* Plan Selection */}
          <Box
          >
            <TextField
              disabled={true}
              fullWidth
              select
              label="Plan"
              value={formData.plan || ''}
              onChange={handleChange('plan')}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
              helperText="Select the subscription plan for this organization"
            >
              {PLANS.map((plan) => (
                <MenuItem key={plan.value} value={plan.value}>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {plan.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {plan.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Active Status */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: formData.isActive 
                ? alpha(theme.palette.success.main, 0.05)
                : alpha(theme.palette.error.main, 0.05),
              border: `1px solid ${formData.isActive 
                ? alpha(theme.palette.success.main, 0.2)
                : alpha(theme.palette.error.main, 0.2)}`
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive ?? true}
                  onChange={handleChange('isActive')}
                  color={formData.isActive ? 'success' : 'error'}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Organization Status
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.isActive 
                      ? 'Organization is active and accessible by users'
                      : 'Organization is disabled and users cannot access it'}
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Warning for status change */}
          <Collapse in={formData.isActive !== organization.isActive}>
            <Alert 
              severity="warning" 
              icon={<InfoIcon />}
              sx={{ borderRadius: 2 }}
            >
              {formData.isActive 
                ? 'Enabling this organization will allow all users to access it again.'
                : 'Disabling this organization will prevent all users from accessing it.'}
            </Alert>
          </Collapse>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button 
          onClick={handleClose} 
          disabled={submitting}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !isFormValid}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            minWidth: 120
          }}
          startIcon={submitting && <CircularProgress size={16} color="inherit" />}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrganizationModal;