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
  InputAdornment,
  CircularProgress,
  Collapse,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  InfoOutlined as InfoIcon,
  CheckCircleOutline as CheckIcon
} from '@mui/icons-material';

import { CreateOrganizationDto } from '../../api/organization/organizationApis';

interface AddOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrganizationDto) => Promise<void>;
}

const PLANS = [
  { value: 'Free', label: 'Free', description: 'Basic features for small teams' },
  { value: 'Starter', label: 'Starter', description: 'Enhanced features for growing teams' },
  { value: 'Professional', label: 'Professional', description: 'Advanced features for organizations' },
  { value: 'Enterprise', label: 'Enterprise', description: 'Full features with priority support' }
];

const AddOrganizationModal: React.FC<AddOrganizationModalProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<CreateOrganizationDto>({
    name: '',
    plan: 'Free',
    isActive: true
  });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slugPreview, setSlugPreview] = useState('');
  const [touched, setTouched] = useState<any>({});

  useEffect(() => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlugPreview(slug || 'organization-slug');
    } else {
      setSlugPreview('');
    }
  }, [formData.name]);

  const handleChange = (field: keyof CreateOrganizationDto) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'isActive' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: null }));
    setSubmitError(null);
    
    if (!touched[field]) {
      setTouched((prev: any) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field: keyof CreateOrganizationDto) => () => {
    setTouched((prev: any) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof CreateOrganizationDto) => {
    const newErrors: any = { ...errors };
    
    if (field === 'name') {
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

    setErrors(newErrors);
    return !newErrors[field];
  };

  const validate = () => {
    const newErrors: any = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Organization name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setTouched({ name: true, plan: true, isActive: true });
    
    if (!validate()) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      await onSubmit(formData);
      handleClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create organization');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFormData({ name: '', plan: 'Free', isActive: true });
      setErrors({});
      setSubmitError(null);
      setSlugPreview('');
      setTouched({});
      onClose();
    }
  };

  const isFormValid = formData.name?.trim() && !errors.name;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
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
            <BusinessIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight={600}>
              Add New Organization
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
          {/* Organization Name */}
          <Box>
            <TextField
              fullWidth
              label="Organization Name"
              value={formData.name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              error={touched.name && !!errors.name}
              helperText={touched.name ? errors.name : 'Choose a unique name for your organization'}
              autoFocus
              required
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Box>

          {/* Slug Preview */}
          <Collapse in={!!slugPreview}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                <Typography variant="caption" color="primary.main" fontWeight={500}>
                  URL SLUG
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                {slugPreview}
              </Typography>
            </Box>
          </Collapse>

          {/* Plan Selection */}
          <Box>
            <TextField
              fullWidth
              select
              label="Plan"
              value={formData.plan}
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
              backgroundColor: alpha(theme.palette.success.main, 0.05),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange('isActive')}
                  color="success"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Active Status
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active organizations can be accessed by their users
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Info Box */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}
          >
            <Stack direction="row" spacing={1}>
              <InfoIcon sx={{ color: 'info.main', fontSize: 20, mt: 0.2 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Organizations help you manage users and tasks separately. Each organization
                  has its own users, tasks, and activity logs.
                </Typography>
              </Box>
            </Stack>
          </Box>
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
          {submitting ? 'Creating...' : 'Create Organization'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrganizationModal;