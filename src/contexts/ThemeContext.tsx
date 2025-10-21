// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext<{
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}>({
  toggleTheme: () => {},
  mode: 'light',
});

export const useThemeMode = () => useContext(ThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    // Add or remove dark class for Tailwind CSS
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode colors
            primary: {
              main: '#7C3AED', // Soft purple
              light: '#A78BFA',
              dark: '#6D28D9',
            },
            secondary: {
              main: '#EC4899', // Soft pink
              light: '#F472B6',
              dark: '#DB2777',
            },
            background: {
              default: '#FAF9FB', // Very light lavender
              paper: '#FFFFFF',
            },
            success: {
              main: '#10B981', // Soft green
              light: '#34D399',
              dark: '#059669',
            },
            warning: {
              main: '#F59E0B', // Soft amber
              light: '#FCD34D',
              dark: '#D97706',
            },
            error: {
              main: '#EF4444', // Soft red
              light: '#F87171',
              dark: '#DC2626',
            },
            grey: {
              50: '#F9FAFB',
              100: '#F3F4F6',
              200: '#E5E7EB',
              300: '#D1D5DB',
              400: '#9CA3AF',
              500: '#6B7280',
              600: '#4B5563',
              700: '#374151',
              800: '#1F2937',
              900: '#111827',
            },
          }
        : {
            // Dark mode colors
            primary: {
              main: '#A78BFA', // Lighter purple for dark mode
              light: '#C4B5FD',
              dark: '#7C3AED',
            },
            secondary: {
              main: '#F472B6', // Lighter pink for dark mode
              light: '#FBCFE8',
              dark: '#EC4899',
            },
            background: {
              default: '#0F0F0F', // Very dark background
              paper: '#1A1A1A',
            },
            success: {
              main: '#34D399', // Lighter green for dark mode
              light: '#6EE7B7',
              dark: '#10B981',
            },
            warning: {
              main: '#FCD34D', // Lighter amber for dark mode
              light: '#FDE68A',
              dark: '#F59E0B',
            },
            error: {
              main: '#F87171', // Lighter red for dark mode
              light: '#FCA5A5',
              dark: '#EF4444',
            },
            grey: {
              50: '#18181B',
              100: '#27272A',
              200: '#3F3F46',
              300: '#52525B',
              400: '#71717A',
              500: '#A1A1AA',
              600: '#D4D4D8',
              700: '#E4E4E7',
              800: '#F4F4F5',
              900: '#FAFAFA',
            },
          }),
    },
    typography: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            padding: '10px 20px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: theme.palette.mode === 'light' 
                ? '0 4px 12px rgba(124, 58, 237, 0.15)'
                : '0 4px 12px rgba(167, 139, 250, 0.25)',
            },
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: theme.palette.mode === 'light' 
                ? '#FAFAFA' 
                : alpha(theme.palette.background.paper, 0.5),
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' 
                  ? '#F5F5F5'
                  : alpha(theme.palette.background.paper, 0.7),
              },
              '&.Mui-focused': {
                backgroundColor: theme.palette.mode === 'light' 
                  ? '#FFFFFF'
                  : alpha(theme.palette.background.paper, 0.9),
              },
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            boxShadow: theme.palette.mode === 'light'
              ? '0 2px 8px rgba(0, 0, 0, 0.04)'
              : '0 2px 8px rgba(0, 0, 0, 0.3)',
            backgroundImage: 'none',
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            boxShadow: theme.palette.mode === 'light'
              ? '0 2px 8px rgba(0, 0, 0, 0.04)'
              : '0 2px 8px rgba(0, 0, 0, 0.3)',
            backgroundImage: 'none',
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.mode === 'light'
              ? theme.palette.background.paper
              : theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.palette.mode === 'light'
              ? '0 1px 3px rgba(0, 0, 0, 0.1)'
              : '0 1px 3px rgba(0, 0, 0, 0.3)',
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            backgroundImage: 'none',
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderBottom: `1px solid ${theme.palette.mode === 'light' 
              ? theme.palette.grey[200]
              : theme.palette.grey[800]}`,
          }),
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderColor: theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
          }),
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: theme.palette.mode === 'light'
              ? theme.palette.grey[800]
              : theme.palette.grey[700],
            fontSize: '0.75rem',
          }),
        },
      },
      // Add CssBaseline overrides for better dark mode support
            MuiCssBaseline: {
              styleOverrides: (theme: any) => ({
                body: {
                  scrollbarColor: theme.palette.mode === 'light'
                    ? `${theme.palette.grey[400]} ${theme.palette.grey[100]}`
                    : `${theme.palette.grey[600]} ${theme.palette.grey[900]}`,
                  '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                    width: 12,
                    height: 12,
                  },
                  '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  },
                  '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                    borderRadius: 6,
                    backgroundColor: theme.palette.mode === 'light'
                      ? theme.palette.grey[400]
                      : theme.palette.grey[600],
                    border: `2px solid ${theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900]}`,
                  },
                  '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? theme.palette.grey[500]
                      : theme.palette.grey[500],
                  },
                },
              }),
            },
    },
  });

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};