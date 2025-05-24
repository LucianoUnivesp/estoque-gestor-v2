/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "@mui/material";
import { ProductType } from "@/interfaces";

interface ProductTypeFormProps {
  open: boolean;
  initialValues?: Partial<ProductType>;
  onSubmit: (values: any) => void;
  onClose: () => void;
  loading: boolean;
}

const ProductTypeForm: React.FC<ProductTypeFormProps> = ({
  open,
  initialValues,
  onSubmit,
  onClose,
  loading,
}) => {
  const [formValues, setFormValues] = React.useState<Partial<ProductType>>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    } else {
      setFormValues({ name: "", description: "" });
    }
  }, [initialValues, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialValues?.id ? "Editar Tipo de Produto" : "Novo Tipo de Produto"}
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

export default ProductTypeForm;
