// src/components/layout/MainLayout.tsx (Fixed for SSR)
"use client";

import React, { ReactNode, useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  SwapHoriz as SwapHorizIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Navigation items used in both desktop and mobile views
  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { label: "Produtos", icon: <InventoryIcon />, path: "/products" },
    {
      label: "Tipos de Produto",
      icon: <CategoryIcon />,
      path: "/product-types",
    },
    {
      label: "Movimentações",
      icon: <SwapHorizIcon />,
      path: "/stock-movements",
    },
  ];

  // Get current active tab value based on pathname
  const getActiveTab = () => {
    const foundIndex = navItems.findIndex((item) => {
      if (item.path === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(item.path);
    });
    return foundIndex !== -1 ? foundIndex : 0;
  };

  // Drawer content for mobile
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Estoque Gestor
      </Typography>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem button selected={getActiveTab() === index}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  // Don't render responsive content until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Estoque Gestor
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              minHeight: "calc(100vh - 190px)",
            }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: isMobile ? 1 : 0, mr: 4 }}
          >
            Estoque Gestor
          </Typography>
          {!isMobile && (
            <Tabs
              value={getActiveTab()}
              textColor="inherit"
              indicatorColor="secondary"
              sx={{ flexGrow: 1 }}
            >
              {navItems.map((item, index) => (
                <Tab
                  key={index}
                  component={Link}
                  href={item.path}
                  icon={item.icon}
                  iconPosition="start"
                  label={item.label}
                />
              ))}
            </Tabs>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      {isMobile && (
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      {/* Main content */}
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            minHeight: {
              xs: "calc(100vh - 170px)",
              sm: "calc(100vh - 190px)",
            },
          }}
        >
          {children}
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: "center",
          bgcolor: theme.palette.grey[100],
          mt: "auto",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Estoque Gestor ©{new Date().getFullYear()} - Sistema de Gestão de
          Estoque
        </Typography>
      </Box>
    </Box>
  );
};

export default MainLayout;
