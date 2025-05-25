// src/app/stock-movements/page.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import {
  useStockMovements,
  useCreateStockMovement,
  useUpdateStockMovement,
  useDeleteStockMovement,
} from "@/hooks/stock-movements/useStockMovements";
import { useAllProducts } from "@/hooks/products/useProducts";
import StockMovementForm from "@/components/stock-movements/StockMovementForm";
import { StockMovement } from "@/interfaces";
import { formatCurrency } from "@/utils/currency";

export default function StockMovementsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<StockMovement | null>(
    null
  );
  const [deletingMovement, setDeletingMovement] =
    useState<StockMovement | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Format dates for API
  const formatDateForAPI = (date: Date | null) => {
    return date ? date.toISOString().split("T")[0] : undefined;
  };

  // React Query hooks
  const {
    data: movementsData,
    isLoading,
    error,
  } = useStockMovements(formatDateForAPI(startDate), formatDateForAPI(endDate));

  const { data: products = [] } = useAllProducts();
  const createMutation = useCreateStockMovement();
  const updateMutation = useUpdateStockMovement();
  const deleteMutation = useDeleteStockMovement();

  const movements = movementsData?.movements || [];
  const summary = movementsData?.summary || {
    entries: 0,
    exits: 0,
    balance: 0,
    entriesValue: 0,
    exitsValue: 0,
  };

  const handleOpenForm = (movement?: StockMovement) => {
    setEditingMovement(movement || null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingMovement(null);
  };

  const handleSubmit = async (values: Partial<StockMovement>) => {
    try {
      if (editingMovement) {
        await updateMutation.mutateAsync({
          id: editingMovement.id,
          data: values,
        });
        setSnackbar({
          open: true,
          message: "Movimentação atualizada com sucesso!",
          severity: "success",
        });
      } else {
        await createMutation.mutateAsync(
          values as Omit<StockMovement, "id" | "createdAt">
        );
        setSnackbar({
          open: true,
          message: "Movimentação criada com sucesso!",
          severity: "success",
        });
      }
      handleCloseForm();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao salvar movimentação. Tente novamente.",
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (movement: StockMovement) => {
    setDeletingMovement(movement);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingMovement(null);
  };

  const handleDelete = async () => {
    if (!deletingMovement) return;

    try {
      await deleteMutation.mutateAsync(deletingMovement.id);
      setSnackbar({
        open: true,
        message: "Movimentação excluída com sucesso!",
        severity: "success",
      });
      handleCloseDeleteDialog();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao excluir movimentação. Tente novamente.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  // Função para calcular o valor da movimentação
  const calculateMovementValue = (movement: StockMovement): number => {
    if (!movement.product) return 0;

    // Para vendas (exit), usa preço de venda
    // Para compras (entry), usa preço de custo
    const unitPrice =
      movement.type === "exit"
        ? movement.product.salePrice
        : movement.product.costPrice;

    return movement.quantity * (unitPrice || 0);
  };

  // Função para formatar data brasileira
  const formatDateBR = (dateString: string): string => {
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

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Não foi possível carregar a lista de movimentações. Tente novamente.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Movimentações de Estoque</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Nova Movimentação
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6">Filtros</Typography>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={setStartDate}
              slotProps={{
                textField: { size: "small", sx: { minWidth: 150 } },
              }}
            />
            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={setEndDate}
              slotProps={{
                textField: { size: "small", sx: { minWidth: 150 } },
              }}
            />
            <Button variant="outlined" onClick={clearFilters} size="small">
              Limpar Filtros
            </Button>
          </Box>
        </LocalizationProvider>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Compras
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowDownIcon sx={{ color: "#cf1322", mr: 1 }} />
                <Typography variant="h5" sx={{ color: "#cf1322" }}>
                  {summary.entries} unidades
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 1, color: "#cf1322" }}>
                {formatCurrency(summary.entriesValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Vendas
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowUpIcon sx={{ color: "#3f8600", mr: 1 }} />
                <Typography variant="h5" sx={{ color: "#3f8600" }}>
                  {summary.exits} unidades
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 1, color: "#3f8600" }}>
                {formatCurrency(summary.exitsValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Saldo
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {summary.balance >= 0 ? (
                  <ArrowUpIcon sx={{ color: "#3f8600", mr: 1 }} />
                ) : (
                  <ArrowDownIcon sx={{ color: "#cf1322", mr: 1 }} />
                )}
                <Typography
                  variant="h5"
                  sx={{
                    color: summary.balance >= 0 ? "#3f8600" : "#cf1322",
                  }}
                >
                  {summary.balance} unidades
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  color:
                    summary.exitsValue - summary.entriesValue >= 0
                      ? "#3f8600"
                      : "#cf1322",
                }}
              >
                {formatCurrency(summary.exitsValue - summary.entriesValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Movements Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Quantidade</TableCell>
              <TableCell align="right">Valor</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell width="120">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    Nenhuma movimentação encontrada
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.product?.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={movement.type === "entry" ? "Compra" : "Venda"}
                      color={movement.type === "entry" ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{movement.quantity}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(calculateMovementValue(movement))}
                  </TableCell>
                  <TableCell>{formatDateBR(movement.createdAt)}</TableCell>
                  <TableCell>{movement.notes || "-"}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleOpenForm(movement)}
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleOpenDeleteDialog(movement)}
                      title="Excluir"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <StockMovementForm
        open={formOpen}
        initialValues={editingMovement || undefined}
        products={products}
        onSubmit={handleSubmit}
        onClose={handleCloseForm}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir esta movimentação? Esta ação não
            pode ser desfeita e afetará o estoque do produto.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
