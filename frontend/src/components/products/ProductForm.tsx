"use client";
import React, { useEffect } from "react";
import {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any) => void;
  onClose: () => void;
  loading: boolean;
}

// Internal form state interface
interface ProductFormState {
  name: string;
  description: string;
  price: number;
  quantity: number;
  productTypeId: number | undefined;
  supplier: string;
  expirationDate: Date | null; // This is Date for the DatePicker component
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  initialValues,
  productTypes,
  onSubmit,
  onClose,
  loading,
}) => {
  const [formValues, setFormValues] = React.useState<ProductFormState>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    productTypeId: undefined,
    supplier: "",
    expirationDate: null,
  });

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        name: initialValues.name || "",
        description: initialValues.description || "",
        price: initialValues.price || 0,
        quantity: initialValues.quantity || 0,
        productTypeId: initialValues.productTypeId,
        supplier: initialValues.supplier || "",
        expirationDate: initialValues.expirationDate
          ? new Date(initialValues.expirationDate)
          : null,
      });
    } else {
      setFormValues({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        productTypeId: undefined,
        supplier: "",
        expirationDate: null,
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
      expirationDate: date,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert form state to API format
    const submitData: Partial<Product> = {
      name: formValues.name,
      description: formValues.description,
      price: formValues.price,
      quantity: formValues.quantity,
      productTypeId: formValues.productTypeId,
      supplier: formValues.supplier,
      expirationDate: formValues.expirationDate
        ? formValues.expirationDate.toISOString()
        : undefined,
    };

    onSubmit(submitData);
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
              value={formValues.description}
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
                value={formValues.expirationDate}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <TextField
              name="supplier"
              label="Fornecedor"
              value={formValues.supplier}
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
