/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/products/page.tsx - Modern Design with Search & Pagination
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Chip,
  Stack,
  Card,
  CardContent,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/products/useProducts";
import { useAllProductTypes } from "@/hooks/product-types/useProductTypes";
import ProductForm from "@/components/products/ProductForm";
import SearchBar from "@/components/common/SearchBar";
import Pagination from "@/components/common/Pagination";
import { Product, isPaginatedResponse } from "@/interfaces";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [productTypeFilter, setProductTypeFilter] = useState<number | string>(
    ""
  );

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // React Query hooks
  const {
    data: productsResult,
    isLoading,
    error,
  } = useProducts({
    page,
    limit,
    search,
    productTypeId: productTypeFilter ? Number(productTypeFilter) : undefined,
  });

  const { data: allProductTypes = [] } = useAllProductTypes();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Handle pagination vs non-pagination response with proper type checking
  const isProductsPaginated =
    productsResult && isPaginatedResponse<Product>(productsResult);
  const products = isProductsPaginated
    ? productsResult.data
    : (productsResult as Product[]) || [];
  const pagination = isProductsPaginated ? productsResult.pagination : null;

  const handleOpenForm = (product?: Product) => {
    setEditingProduct(product || null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (values: Partial<Product>) => {
    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({
          id: editingProduct.id,
          data: values,
        });
        setSnackbar({
          open: true,
          message: "Produto atualizado com sucesso!",
          severity: "success",
        });
      } else {
        await createMutation.mutateAsync(values as Omit<Product, "id">);
        setSnackbar({
          open: true,
          message: "Produto criado com sucesso!",
          severity: "success",
        });
      }
      handleCloseForm();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Erro ao salvar produto. Tente novamente.",
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingProduct(null);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      await deleteMutation.mutateAsync(deletingProduct.id);
      setSnackbar({
        open: true,
        message: "Produto excluído com sucesso!",
        severity: "success",
      });
      handleCloseDeleteDialog();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Erro ao excluir produto. Tente novamente.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const isLowStock = (quantity: number) => quantity <= 5;

  const formatExpirationDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <Chip
          label={`Vencido há ${Math.abs(diffDays)} dias`}
          color="error"
          size="small"
          sx={{ fontWeight: 500 }}
        />
      );
    } else if (diffDays <= 30) {
      return (
        <Chip
          label={`${diffDays} dias`}
          color="warning"
          size="small"
          sx={{ fontWeight: 500 }}
        />
      );
    }

    return date.toLocaleDateString("pt-BR");
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { color: "error", label: "Sem estoque" };
    if (quantity <= 5) return { color: "warning", label: "Estoque baixo" };
    if (quantity <= 20) return { color: "info", label: "Estoque normal" };
    return { color: "success", label: "Estoque alto" };
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        Não foi possível carregar a lista de produtos. Tente novamente.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Produtos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie seu catálogo de produtos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          size="large"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            boxShadow: "0 4px 14px 0 rgb(99 102 241 / 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              boxShadow: "0 6px 20px 0 rgb(99 102 241 / 0.4)",
            },
          }}
        >
          Novo Produto
        </Button>
      </Stack>

      {/* Summary Cards */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                <InventoryIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  {products.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Produtos
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "warning.main", width: 48, height: 48 }}>
                <WarningIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  {products.filter((p) => isLowStock(p.quantity)).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estoque Baixo
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "success.main", width: 48, height: 48 }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  R${" "}
                  {products
                    .reduce((sum, p) => sum + p.price * p.quantity, 0)
                    .toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Valor Total do Estoque
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Search and Filters */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: 1,
          borderColor: "grey.200",
        }}
      >
        <SearchBar
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Buscar produtos por nome..."
          filterValue={productTypeFilter}
          onFilterChange={setProductTypeFilter}
          filterOptions={allProductTypes.map((type) => ({
            value: type.id,
            label: type.name,
          }))}
          filterLabel="Tipo"
        />
      </Paper>

      {/* Products Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          border: 1,
          borderColor: "grey.200",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                Produto
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                Tipo
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                Estoque
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                Preço
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                Fornecedor
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                Validade
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Stack alignItems="center" spacing={2}>
                    <InventoryIcon sx={{ fontSize: 48, color: "grey.400" }} />
                    <Typography variant="h6" color="text.secondary">
                      Nenhum produto encontrado
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {search || productTypeFilter
                        ? "Tente ajustar os filtros de busca"
                        : "Comece criando seu primeiro produto"}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const stockStatus = getStockStatus(product.quantity);
                return (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Stack spacing={1}>
                        <Typography variant="body1" fontWeight={500}>
                          {product.name}
                        </Typography>
                        {product.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {product.description}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.productType?.name || "Sem tipo"}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack alignItems="center" spacing={1}>
                        <Typography variant="body1" fontWeight={600}>
                          {product.quantity}
                        </Typography>
                        <Chip
                          label={stockStatus.label}
                          color={stockStatus.color as any}
                          size="small"
                          sx={{ fontSize: "0.75rem", height: 20 }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight={500}>
                        R$ {product.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.supplier || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatExpirationDate(product.expirationDate)}
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Editar produto">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenForm(product)}
                            sx={{
                              color: "primary.main",
                              "&:hover": { bgcolor: "primary.50" },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir produto">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteDialog(product)}
                            sx={{
                              color: "error.main",
                              "&:hover": { bgcolor: "error.50" },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}

      {/* Form Dialog */}
      <ProductForm
        open={formOpen}
        initialValues={editingProduct || undefined}
        productTypes={allProductTypes}
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
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Confirmar Exclusão
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "1rem", lineHeight: 1.6 }}>
            Tem certeza de que deseja excluir o produto{" "}
            <strong>{deletingProduct?.name}</strong>?
            <br />
            <br />
            Esta ação não pode ser desfeita e pode afetar as movimentações de
            estoque relacionadas.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            sx={{ borderRadius: 2 }}
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
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
