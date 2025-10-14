import React from 'react';
import { Chip, ChipProps, alpha, useTheme } from '@mui/material';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: 'active' | 'inactive' | 'pending' | 'disabled';
}

const StatusChip: React.FC<StatusChipProps> = ({ status, ...props }) => {
  const theme = useTheme();
  
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          label: 'Active',
          color: theme.palette.success.main,
          bgColor: alpha(theme.palette.success.main, 0.1)
        };
      case 'inactive':
      case 'disabled':
        return {
          label: 'Disabled',
          color: theme.palette.grey[600],
          bgColor: alpha(theme.palette.grey[500], 0.1)
        };
      case 'pending':
        return {
          label: 'Pending',
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1)
        };
      default:
        return {
          label: status,
          color: theme.palette.grey[600],
          bgColor: alpha(theme.palette.grey[500], 0.1)
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={config.label}
      size="small"
      {...props}
      sx={{
        borderRadius: 1.5,
        fontWeight: 500,
        color: config.color,
        backgroundColor: config.bgColor,
        border: 'none',
        ...props.sx
      }}
    />
  );
};

export default StatusChip;