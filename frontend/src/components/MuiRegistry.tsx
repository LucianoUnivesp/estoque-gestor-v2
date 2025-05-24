// src/components/MuiRegistry.tsx - Modern Design System
"use client";

import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ptBR } from "@mui/material/locale";

// Modern color palette inspired by contemporary design systems
const theme = createTheme(
  {
    palette: {
      mode: "light",
      primary: {
        main: "#6366F1", // Modern indigo
        light: "#818CF8",
        dark: "#4F46E5",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#EC4899", // Modern pink
        light: "#F472B6",
        dark: "#DB2777",
        contrastText: "#FFFFFF",
      },
      error: {
        main: "#EF4444",
        light: "#F87171",
        dark: "#DC2626",
      },
      warning: {
        main: "#F59E0B",
        light: "#FBBF24",
        dark: "#D97706",
      },
      info: {
        main: "#3B82F6",
        light: "#60A5FA",
        dark: "#2563EB",
      },
      success: {
        main: "#10B981",
        light: "#34D399",
        dark: "#059669",
      },
      background: {
        default: "#F8FAFC", // Very light gray-blue
        paper: "#FFFFFF",
      },
      text: {
        primary: "#1E293B", // Slate 800
        secondary: "#64748B", // Slate 500
      },
      grey: {
        50: "#F8FAFC",
        100: "#F1F5F9",
        200: "#E2E8F0",
        300: "#CBD5E1",
        400: "#94A3B8",
        500: "#64748B",
        600: "#475569",
        700: "#334155",
        800: "#1E293B",
        900: "#0F172A",
      },
    },
    typography: {
      fontFamily: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      h1: {
        fontSize: "2.25rem",
        fontWeight: 700,
        letterSpacing: "-0.025em",
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "1.875rem",
        fontWeight: 700,
        letterSpacing: "-0.025em",
        lineHeight: 1.3,
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: 600,
        letterSpacing: "-0.025em",
        lineHeight: 1.4,
      },
      h4: {
        fontSize: "1.25rem",
        fontWeight: 600,
        letterSpacing: "-0.025em",
        lineHeight: 1.4,
      },
      h5: {
        fontSize: "1.125rem",
        fontWeight: 600,
        letterSpacing: "-0.025em",
        lineHeight: 1.5,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 600,
        letterSpacing: "-0.025em",
        lineHeight: 1.5,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
        color: "#475569",
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.6,
        color: "#64748B",
      },
      button: {
        fontWeight: 500,
        letterSpacing: "0.025em",
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      "none",
      "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 #F1F5F9",
            "&::-webkit-scrollbar": {
              width: 8,
            },
            "&::-webkit-scrollbar-track": {
              background: "#F1F5F9",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#CBD5E1",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#94A3B8",
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: "0.875rem",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            },
          },
          contained: {
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            },
          },
          outlined: {
            borderColor: "#E2E8F0",
            color: "#475569",
            "&:hover": {
              borderColor: "#CBD5E1",
              backgroundColor: "#F8FAFC",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            "&:hover": {
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            },
            transition: "all 0.2s ease-in-out",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: "1px solid #E2E8F0",
          },
          elevation1: {
            boxShadow:
              "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          },
          elevation2: {
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          },
          elevation3: {
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              backgroundColor: "#FFFFFF",
              "& fieldset": {
                borderColor: "#E2E8F0",
              },
              "&:hover fieldset": {
                borderColor: "#CBD5E1",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6366F1",
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: "#F8FAFC",
            fontWeight: 600,
            color: "#374151",
            borderBottom: "2px solid #E5E7EB",
          },
          root: {
            borderBottom: "1px solid #F3F4F6",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "#F8FAFC",
            },
            "&:last-child td, &:last-child th": {
              border: 0,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
          colorSuccess: {
            backgroundColor: "#DCFCE7",
            color: "#166534",
          },
          colorError: {
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
          },
          colorWarning: {
            backgroundColor: "#FEF3C7",
            color: "#92400E",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            "&:hover": {
              backgroundColor: "#F1F5F9",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#FFFFFF",
            color: "#1E293B",
            boxShadow:
              "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            borderBottom: "1px solid #E2E8F0",
          },
        },
      },
    },
  },
  ptBR
);

const MuiRegistry = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiRegistry;
