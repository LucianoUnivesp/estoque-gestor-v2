/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import {
  // Box,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
} from "@mui/material";
import { StockMovement, Product } from "@/interfaces";

interface StockMovementFormProps {
  open: boolean;
  initialValues?: Partial<StockMovement>;
  products: Product[];
  onSubmit: (values: any) => void;
  onClose: () => void;
  loading: boolean;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({
  open,
  initialValues,
  products,
  onSubmit,
  onClose,
  loading,
}) => {
  const [formValues, setFormValues] = React.useState<Partial<StockMovement>>({
    type: "entry",
    quantity: 1,
    productId: undefined,
    notes: "",
  });

  const isEditing = !!initialValues?.id;

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        type: initialValues.type || "entry",
        quantity: initialValues.quantity || 1,
        productId: initialValues.productId,
        notes: initialValues.notes || "",
      });
    } else {
      setFormValues({
        type: "entry",
        quantity: 1,
        productId: undefined,
        notes: "",
      });
    }
  }, [initialValues, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: parseInt(value) || 1 }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  const selectedProduct = products.find(p => p.id === formValues.productId);
  const isExitWithInsufficientStock = 
    formValues.type === 'exit' && 
    selectedProduct && 
    (formValues.quantity || 0) > selectedProduct.quantity;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? "Editar Movimentação" : "Nova Movimentação"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {isEditing && (
              <Alert severity="info">
                Ao editar uma movimentação, o estoque do produto será ajustado automaticamente.
              </Alert>
            )}
            
            <TextField
              name="productId"
              select
              label="Produto"
              value={formValues.productId || ""}
              onChange={handleChange}
              fullWidth
              required
              disabled={isEditing} // Não permitir mudança de produto ao editar
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} - Estoque: {product.quantity}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              name="type"
              select
              label="Tipo de Movimentação"
              value={formValues.type || "entry"}
              onChange={handleChange}
              fullWidth
              required
              disabled={isEditing} // Não permitir mudança de tipo ao editar
            >
              <MenuItem value="entry">Entrada</MenuItem>
              <MenuItem value="exit">Saída</MenuItem>
            </TextField>
            
            <TextField
              name="quantity"
              label="Quantidade"
              type="number"
              value={formValues.quantity}
              onChange={handleNumberChange}
              fullWidth
              required
              inputProps={{ min: 1 }}
              error={isExitWithInsufficientStock}
              helperText={
                isExitWithInsufficientStock 
                  ? `Estoque insuficiente. Disponível: ${selectedProduct?.quantity}`
                  : ""
              }
            />
            
            <TextField
              name="notes"
              label="Observações"
              value={formValues.notes || ""}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              placeholder="Adicione observações sobre esta movimentação..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || isExitWithInsufficientStock}
          >
            {loading 
              ? (isEditing ? "Atualizando..." : "Salvando...") 
              : (isEditing ? "Atualizar" : "Salvar")
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StockMovementForm;