import { createTheme } from '@mui/material/styles';

// Create a theme instance with light and dark mode
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#2D7AF6',
      light: '#5392F7',
      dark: '#1D63D1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0ECA90',
      light: '#36D5A5',
      dark: '#0BA97A',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F44336',
      light: '#F77066',
      dark: '#D32F2F',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB547',
      dark: '#ED8C00',
    },
    info: {
      main: '#29B6F6',
      light: '#4ECBFF',
      dark: '#0693E3',
    },
    success: {
      main: '#66BB6A',
      light: '#8CC990',
      dark: '#43A047',
    },
    ...(mode === 'light'
      ? {
          background: {
            default: '#F8F9FA',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#3A3541',
            secondary: '#6C757D',
            disabled: '#9EA0A5',
          },
        }
      : {
          background: {
            default: '#1A1E2D',
            paper: '#24293E',
          },
          text: {
            primary: '#EDEEF2',
            secondary: '#B4B7BD',
            disabled: '#646674',
          },
        }),
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.12)',
    '0px 16px 32px rgba(0, 0, 0, 0.16)',
    '0px 20px 40px rgba(0, 0, 0, 0.2)',
    '0px 24px 48px rgba(0, 0, 0, 0.24)',
    ...Array(16).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          display: 'block',
          maxWidth: '100%',
        },
        '.scrollbar-hidden::-webkit-scrollbar': {
          width: '0.4em',
        },
        '.scrollbar-hidden::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '.scrollbar-hidden::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,.1)',
          borderRadius: '10px',
        },
        '.scrollbar-hidden': {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,.1) transparent',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '0',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: '8px',
          paddingTop: '8px',
          paddingBottom: '8px',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
          },
        },
        sizeLarge: {
          height: 48,
        },
        containedPrimary: {
          boxShadow: '0px 4px 12px rgba(45, 122, 246, 0.2)',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(45, 122, 246, 0.3)',
          },
        },
        containedSecondary: {
          boxShadow: '0px 4px 12px rgba(14, 202, 144, 0.2)',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(14, 202, 144, 0.3)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: mode === 'light' ? 'rgba(45, 122, 246, 0.1)' : 'rgba(45, 122, 246, 0.15)',
            color: '#2D7AF6',
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(45, 122, 246, 0.15)' : 'rgba(45, 122, 246, 0.25)',
            },
            '& .MuiListItemIcon-root': {
              color: '#2D7AF6',
            },
          },
          '&:hover': {
            backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)',
          },
          marginBottom: '4px',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        standard: {
          minWidth: 20,
          height: 20,
          borderRadius: 10,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default getTheme; 