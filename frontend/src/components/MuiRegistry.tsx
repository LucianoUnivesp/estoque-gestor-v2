// src/components/MuiRegistry.tsx (Simple version without extra dependencies)
"use client";

import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ptBR } from "@mui/material/locale";

// Create a custom theme with primary and secondary colors
const theme = createTheme(
  {
    palette: {
      primary: {
        main: "#1976d2", // Blue color similar to what was used in Ant Design
        light: "#42a5f5",
        dark: "#1565c0",
      },
      secondary: {
        main: "#dc004e", // Pink/red for accent color
        light: "#ff4081",
        dark: "#c51162",
      },
      error: {
        main: "#f44336",
      },
      warning: {
        main: "#ff9800",
      },
      info: {
        main: "#2196f3",
      },
      success: {
        main: "#4caf50",
      },
      background: {
        default: "#f5f5f5", // Light grey background
        paper: "#ffffff",
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
        fontSize: "2.5rem",
        fontWeight: 600,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 600,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 600,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 600,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 600,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none", // Buttons use sentence case instead of ALL CAPS
            borderRadius: 8,
          },
          contained: {
            boxShadow: "none", // Remove default shadow
            "&:hover": {
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            overflow: "hidden",
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
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:last-child td, &:last-child th": {
              border: 0,
            },
          },
        },
      },
    },
  },
  ptBR // Add Brazilian Portuguese localization
);

// MUI Registry component that provides the theme to the entire application
const MuiRegistry = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiRegistry;
