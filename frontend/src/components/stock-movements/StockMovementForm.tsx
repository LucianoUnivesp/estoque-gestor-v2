// src/components/stock-movements/StockMovementForm.tsx
"use client";
import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
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
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...initialValues,
        createdAt: initialValues.createdAt
          ? new Date(initialValues.createdAt).toISOString()
          : new Date().toISOString(),
      });
    } else {
      setFormValues({
        type: "entry",
        quantity: 1,
        productId: undefined,
        notes: "",
        createdAt: new Date().toISOString(),
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

  const handleDateChange = (date: Date | null) => {
    setFormValues((prev) => ({
      ...prev,
      createdAt: date ? date.toISOString() : new Date().toISOString(),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialValues?.id ? "Editar Movimentação" : "Nova Movimentação"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              name="productId"
              select
              label="Produto"
              value={formValues.productId || ""}
              onChange={handleChange}
              fullWidth
              required
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
            />
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={ptBR}
            >
              <DateTimePicker
                label="Data e Hora"
                value={
                  formValues.createdAt
                    ? new Date(formValues.createdAt)
                    : new Date()
                }
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <TextField
              name="notes"
              label="Observações"
              value={formValues.notes || ""}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {initialValues?.id ? "Atualizar" : "Salvar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StockMovementForm;
