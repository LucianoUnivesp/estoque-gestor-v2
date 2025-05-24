/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/product-types/page.tsx - Modern Design with Search & Pagination
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
  Category as CategoryIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import {
  useProductTypes,
  useCreateProductType,
  useUpdateProductType,
  useDeleteProductType,
} from "@/hooks/product-types/useProductTypes";
import { useAllProducts } from "@/hooks/products/useProducts";
import ProductTypeForm from "@/components/product-types/ProductTypeForm";
import SearchBar from "@/components/common/SearchBar";
import Pagination from "@/components/common/Pagination";
import { ProductType, Product, isPaginatedResponse } from "@/interfaces";

export default function ProductTypesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProductType, setEditingProductType] =
    useState<ProductType | null>(null);
  const [deletingProductType, setDeletingProductType] =
    useState<ProductType | null>(null);
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
    data: productTypesResult,
    isLoading,
    error,
  } = useProductTypes({
    page,
    limit,
    search,
  });

  const { data: allProducts = [] } = useAllProducts();
  const createMutation = useCreateProductType();
  const updateMutation = useUpdateProductType();
  const deleteMutation = useDeleteProductType();

  // Handle pagination vs non-pagination response with proper type checking
  const isProductTypesPaginated =
    productTypesResult && isPaginatedResponse<ProductType>(productTypesResult);
  const productTypes = isProductTypesPaginated
    ? productTypesResult.data
    : (productTypesResult as ProductType[]) || [];
  const pagination = isProductTypesPaginated
    ? productTypesResult.pagination
    : null;

  const handleOpenForm = (productType?: ProductType) => {
    setEditingProductType(productType || null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingProductType(null);
  };

  const handleSubmit = async (values: Partial<ProductType>) => {
    try {
      if (editingProductType) {
        await updateMutation.mutateAsync({
          id: editingProductType.id,
          data: values,
        });
        setSnackbar({
          open: true,
          message: "Tipo de produto atualizado com sucesso!",
          severity: "success",
        });
      } else {
        await createMutation.mutateAsync(values as Omit<ProductType, "id">);
        setSnackbar({
          open: true,
          message: "Tipo de produto criado com sucesso!",
          severity: "success",
        });
      }
      handleCloseForm();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message:
          error.message || "Erro ao salvar tipo de produto. Tente novamente.",
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (productType: ProductType) => {
    setDeletingProductType(productType);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingProductType(null);
  };

  const handleDelete = async () => {
    if (!deletingProductType) return;

    try {
      await deleteMutation.mutateAsync(deletingProductType.id);
      setSnackbar({
        open: true,
        message: "Tipo de produto excluído com sucesso!",
        severity: "success",
      });
      handleCloseDeleteDialog();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message:
          error.message || "Erro ao excluir tipo de produto. Tente novamente.",
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
    setPage(1);
  };

  const getProductCountByType = (typeId: number): number => {
    return allProducts.filter(
      (product: Product) => product.productTypeId === typeId
    ).length;
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
        Não foi possível carregar a lista de tipos de produto. Tente novamente.
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
            Tipos de Produto
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize seus produtos por categorias
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
          Novo Tipo
        </Button>
      </Stack>

      {/* Summary Cards */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                <CategoryIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  {productTypes.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tipos de Produto
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "success.main", width: 48, height: 48 }}>
                <InventoryIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  {allProducts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Produtos Cadastrados
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "info.main", width: 48, height: 48 }}>
                📊
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  {productTypes.length > 0
                    ? Math.round(
                        (allProducts.length / productTypes.length) * 10
                      ) / 10
                    : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Média por Tipo
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Search */}
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
          placeholder="Buscar tipos de produto por nome..."
          showActiveFilters={true}
        />
      </Paper>

      {/* Product Types Table */}
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
                Nome
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                Descrição
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                Produtos
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
            {productTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <Stack alignItems="center" spacing={2}>
                    <CategoryIcon sx={{ fontSize: 48, color: "grey.400" }} />
                    <Typography variant="h6" color="text.secondary">
                      Nenhum tipo de produto encontrado
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {search
                        ? "Tente ajustar os filtros de busca"
                        : "Comece criando seu primeiro tipo de produto"}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              productTypes.map((type) => (
                <TableRow key={type.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight={500}>
                      {type.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {type.description || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor:
                          getProductCountByType(type.id) > 0
                            ? "primary.50"
                            : "grey.100",
                        color:
                          getProductCountByType(type.id) > 0
                            ? "primary.main"
                            : "grey.500",
                        fontWeight: 600,
                      }}
                    >
                      {getProductCountByType(type.id)}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Editar tipo">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenForm(type)}
                          sx={{
                            color: "primary.main",
                            "&:hover": { bgcolor: "primary.50" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir tipo">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteDialog(type)}
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
              ))
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
      <ProductTypeForm
        open={formOpen}
        initialValues={editingProductType || undefined}
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
            Tem certeza de que deseja excluir o tipo de produto{" "}
            <strong>{deletingProductType?.name}</strong>?
            <br />
            <br />
            {getProductCountByType(deletingProductType?.id || 0) > 0 && (
              <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                Este tipo possui{" "}
                {getProductCountByType(deletingProductType?.id || 0)} produto(s)
                associado(s). A exclusão só será possível se não houver produtos
                vinculados.
              </Alert>
            )}
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
