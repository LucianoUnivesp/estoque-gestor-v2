/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Warning as WarningIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  useDashboardStats,
  useRecentMovements,
  useStockTrend,
  useProductTypeDistribution,
} from "@/hooks/dashboard/useDashboard";
import { formatCurrency } from "@/utils/currency";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering charts after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // React Query hooks
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats();

  const {
    data: recentMovements = [],
    isLoading: movementsLoading,
    error: movementsError,
    refetch: refetchMovements,
  } = useRecentMovements();

  const {
    data: trendData = [],
    isLoading: trendLoading,
    error: trendError,
    refetch: refetchTrend,
  } = useStockTrend();

  const {
    data: productTypeDistribution = [],
    isLoading: distributionLoading,
    error: distributionError,
    refetch: refetchDistribution,
  } = useProductTypeDistribution();

  const handleRefresh = () => {
    refetchStats();
    refetchMovements();
    refetchTrend();
    refetchDistribution();
  };

  const formatDate = (dateString: string) => {
    if (!mounted) return ""; // Prevent hydration mismatch

    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Data inválida";
    }
  };

  // Enhanced color palette for pie chart
  const PIE_COLORS = [
    "#6366F1", // Primary indigo
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#EC4899", // Pink
    "#84CC16", // Lime
  ];

  const isLoading =
    statsLoading || movementsLoading || trendLoading || distributionLoading;
  const hasError =
    statsError || movementsError || trendError || distributionError;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Alert severity="error">
        Erro ao carregar dados do dashboard. Tente novamente.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Tooltip title="Atualizar dados">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Produtos
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <InventoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">
                  {dashboardStats?.totalProducts || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tipos de Produto
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CategoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">
                  {dashboardStats?.totalProductTypes || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Produtos com Estoque Baixo
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WarningIcon sx={{ color: "#ff4d4f", mr: 1 }} />
                <Typography variant="h5" sx={{ color: "#ff4d4f" }}>
                  {dashboardStats?.lowStockProducts || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Saldo de Hoje
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {(dashboardStats?.todayBalance || 0) >= 0 ? (
                  <ArrowUpIcon sx={{ color: "#3f8600", mr: 1 }} />
                ) : (
                  <ArrowDownIcon sx={{ color: "#cf1322", mr: 1 }} />
                )}
                <Typography
                  variant="h5"
                  sx={{
                    color:
                      (dashboardStats?.todayBalance || 0) >= 0
                        ? "#3f8600"
                        : "#cf1322",
                  }}
                >
                  {Math.abs(dashboardStats?.todayBalance || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Daily Movement Stats */}
      <Typography variant="h5" gutterBottom>
        Movimentações de Hoje
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Compras
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowDownIcon sx={{ color: "#cf1322", mr: 1 }} />
                <Typography variant="h5" sx={{ color: "#cf1322" }}>
                  {dashboardStats?.todayPurchases || 0} unidades
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#cf1322", mt: 1 }}>
                {formatCurrency(dashboardStats?.todayPurchasesValue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Vendas
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowUpIcon sx={{ color: "#3f8600", mr: 1 }} />
                <Typography variant="h5" sx={{ color: "#3f8600" }}>
                  {dashboardStats?.todaySales || 0} unidades
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#3f8600", mt: 1 }}>
                {formatCurrency(dashboardStats?.todaySalesValue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Lucro do Dia
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {(dashboardStats?.todayProfit || 0) >= 0 ? (
                  <ArrowUpIcon sx={{ color: "#3f8600", mr: 1 }} />
                ) : (
                  <ArrowDownIcon sx={{ color: "#cf1322", mr: 1 }} />
                )}
                <Typography
                  variant="h5"
                  sx={{
                    color:
                      (dashboardStats?.todayProfit || 0) >= 0
                        ? "#3f8600"
                        : "#cf1322",
                  }}
                >
                  {formatCurrency(Math.abs(dashboardStats?.todayProfit || 0))}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color:
                    (dashboardStats?.todayProfit || 0) >= 0
                      ? "#3f8600"
                      : "#cf1322",
                }}
              >
                {(dashboardStats?.todayProfitMargin || 0).toFixed(1)}% margem
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Saldo
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {(dashboardStats?.todayBalance || 0) >= 0 ? (
                  <ArrowUpIcon sx={{ color: "#3f8600", mr: 1 }} />
                ) : (
                  <ArrowDownIcon sx={{ color: "#cf1322", mr: 1 }} />
                )}
                <Typography
                  variant="h5"
                  sx={{
                    color:
                      (dashboardStats?.todayBalance || 0) >= 0
                        ? "#3f8600"
                        : "#cf1322",
                  }}
                >
                  {dashboardStats?.todayBalance || 0} unidades
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row - Only render after mount to prevent SSR issues */}
      {mounted && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Stock Trend Chart */}
          <Grid item xs={12} lg={8}>
            <Typography variant="h5" gutterBottom>
              Tendência de Estoque (Últimos 7 dias)
            </Typography>
            <Card elevation={2} sx={{ p: 2 }}>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="entries"
                      name="Compras"
                      stroke="#f5222d"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="exits"
                      name="Vendas"
                      stroke="#52c41a"
                    />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      name="Saldo"
                      stroke="#1890ff"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          {/* Product Type Distribution */}
          <Grid item xs={12} lg={4}>
            <Typography variant="h5" gutterBottom>
              Distribuição por Tipo
            </Typography>
            <Card elevation={2} sx={{ p: 2 }}>
              <Box sx={{ height: 300 }}>
                {productTypeDistribution.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <CategoryIcon
                      sx={{ fontSize: 48, color: "grey.400", mb: 2 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      Nenhum produto cadastrado
                    </Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) =>
                          `${name} ${percentage}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productTypeDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: any, name: any) => [
                          `${value} produtos`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Recent Movements Table */}
      <Typography variant="h5" gutterBottom>
        Movimentações Recentes
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Quantidade</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="textSecondary">
                    Nenhuma movimentação recente
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              recentMovements.map((movement: any) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.product?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      label={movement.type === "entry" ? "Compra" : "Venda"}
                      color={movement.type === "entry" ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{movement.quantity}</TableCell>
                  <TableCell>{formatDate(movement.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
