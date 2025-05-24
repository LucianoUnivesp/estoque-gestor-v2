// src/components/products/ProductForm.tsx
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
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { Product, ProductType } from "@/interfaces";

interface ProductFormProps {
  open: boolean;
  initialValues?: Partial<Product>;
  productTypes: ProductType[];
  onSubmit: (values: any) => void;
  onClose: () => void;
  loading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  initialValues,
  productTypes,
  onSubmit,
  onClose,
  loading,
}) => {
  const [formValues, setFormValues] = React.useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    productTypeId: undefined,
    supplier: "",
    expirationDate: undefined,
  });

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...initialValues,
        expirationDate: initialValues.expirationDate
          ? new Date(initialValues.expirationDate)
          : undefined,
      });
    } else {
      setFormValues({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        productTypeId: undefined,
        supplier: "",
        expirationDate: undefined,
      });
    }
  }, [initialValues, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormValues((prev) => ({
      ...prev,
      expirationDate: date ? date.toISOString() : undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialValues?.id ? "Editar Produto" : "Novo Produto"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              name="name"
              label="Nome"
              value={formValues.name}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ maxLength: 100 }}
            />
            <TextField
              name="description"
              label="Descrição"
              value={formValues.description || ""}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              name="productTypeId"
              select
              label="Tipo de Produto"
              value={formValues.productTypeId || ""}
              onChange={handleChange}
              fullWidth
              required
            >
              {productTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="price"
              label="Preço"
              type="number"
              value={formValues.price}
              onChange={handleNumberChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              fullWidth
              required
            />
            <TextField
              name="quantity"
              label="Quantidade"
              type="number"
              value={formValues.quantity}
              onChange={handleNumberChange}
              fullWidth
              required
            />
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={ptBR}
            >
              <DatePicker
                label="Data de Validade"
                value={
                  formValues.expirationDate
                    ? new Date(formValues.expirationDate)
                    : null
                }
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <TextField
              name="supplier"
              label="Fornecedor"
              value={formValues.supplier || ""}
              onChange={handleChange}
              fullWidth
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

export default ProductForm;
