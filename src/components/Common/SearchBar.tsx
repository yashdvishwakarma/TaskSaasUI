import React from 'react';
import {
  TextField,
  InputAdornment,
  TextFieldProps,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

interface SearchBarProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  onClear,
  placeholder = "Search...",
  ...props 
}) => {
  const theme = useTheme();

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      {...props}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          transition: theme.transitions.create(['box-shadow', 'background-color']),
          '&:hover': {
            backgroundColor: theme.palette.background.paper,
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
          }
        },
        ...props.sx
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={handleClear}
              edge="end"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: alpha(theme.palette.action.hover, 0.5)
                }
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
        ...props.InputProps
      }}
    />
  );
};

export default SearchBar;