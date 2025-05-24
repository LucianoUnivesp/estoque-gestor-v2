// src/app/products/page.tsx
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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/products/useProducts";
import { useProductTypes } from "@/hooks/product-types/useProductTypes";
import ProductForm from "@/components/products/ProductForm";
import { Product } from "@/interfaces";

export default function ProductsPage() {
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
  const { data: products = [], isLoading, error } = useProducts();
  const { data: productTypes = [] } = useProductTypes();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao salvar produto. Tente novamente.",
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao excluir produto. Tente novamente.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        />
      );
    } else if (diffDays <= 30) {
      return <Chip label={`${diffDays} dias`} color="warning" size="small" />;
    }

    return date.toLocaleDateString("pt-BR");
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
        Não foi possível carregar a lista de produtos. Tente novamente.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Produtos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Novo Produto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Quantidade</TableCell>
              <TableCell align="right">Preço</TableCell>
              <TableCell>Fornecedor</TableCell>
              <TableCell>Validade</TableCell>
              <TableCell width="120">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    Nenhum produto cadastrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {product.name}
                      {isLowStock(product.quantity) && (
                        <WarningIcon color="warning" fontSize="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {product.productType?.name || "Sem tipo"}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={product.quantity}
                      color={
                        isLowStock(product.quantity) ? "warning" : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    R$ {product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>{product.supplier || "-"}</TableCell>
                  <TableCell>
                    {formatExpirationDate(product.expirationDate)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleOpenForm(product)}
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleOpenDeleteDialog(product)}
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
      <ProductForm
        open={formOpen}
        initialValues={editingProduct || undefined}
        productTypes={productTypes}
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
            Tem certeza de que deseja excluir o produto {deletingProduct?.name}?
            Esta ação não pode ser desfeita e pode afetar as movimentações de
            estoque relacionadas.
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
