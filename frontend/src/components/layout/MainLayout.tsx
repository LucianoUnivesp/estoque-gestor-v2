"use client";

import React, { ReactNode, useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  SwapHoriz as SwapHorizIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
      description: "Visão geral do sistema",
    },
    {
      label: "Produtos",
      icon: <InventoryIcon />,
      path: "/products",
      description: "Gerenciar produtos",
    },
    {
      label: "Tipos de Produto",
      icon: <CategoryIcon />,
      path: "/product-types",
      description: "Categorias de produtos",
    },
    {
      label: "Movimentações",
      icon: <SwapHorizIcon />,
      path: "/stock-movements",
      description: "Entrada e saída de estoque",
    },
  ];

  const getActiveTab = () => {
    const foundIndex = navItems.findIndex((item) => {
      if (item.path === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(item.path);
    });
    return foundIndex !== -1 ? foundIndex : 0;
  };

  const drawer = (
    <Box sx={{ width: 280, height: "100%", bgcolor: "background.paper" }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            }}
          >
            📦
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Estoque Gestor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sistema de Gestão
            </Typography>
          </Box>
        </Stack>
      </Box>

      <List sx={{ px: 2, py: 1 }}>
        {navItems.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <ListItem
              button
              selected={getActiveTab() === index}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "primary.50",
                  borderLeft: 3,
                  borderLeftColor: "primary.main",
                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                  "& .MuiListItemText-primary": {
                    color: "primary.main",
                    fontWeight: 600,
                  },
                },
                "&:hover": {
                  bgcolor: "grey.50",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
                secondaryTypographyProps={{
                  fontSize: "0.75rem",
                }}
              />
            </ListItem>
          </Link>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2, borderTop: 1, borderColor: "divider" }}>
        <Chip
          label="v1.0.0"
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.75rem" }}
        />
      </Box>
    </Box>
  );

  if (!mounted) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ minHeight: 72 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Estoque Gestor
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              minHeight: "calc(100vh - 200px)",
              border: 1,
              borderColor: "grey.200",
            }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          component="nav"
          sx={{
            width: 280,
            flexShrink: 0,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: 280,
              height: "100vh",
              position: "fixed",
              borderRight: 1,
              borderColor: "divider",
              borderRadius: 0,
            }}
          >
            {drawer}
          </Paper>
        </Box>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 280px)` },
        }}
      >
        {/* Top Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
        </AppBar>

        {/* Page Content */}
        <Container
          maxWidth={false}
          sx={{
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              minHeight: "calc(100vh - 160px)",
              border: 1,
              borderColor: "grey.200",
              bgcolor: "background.paper",
            }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
