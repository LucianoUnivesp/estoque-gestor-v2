/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/validation.ts (Enhanced with better validation)

export interface ValidationError {
    field: string;
    message: string;
}

export const validateProduct = (product: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!product.name || product.name.trim().length === 0) {
        errors.push({ field: 'name', message: 'Nome é obrigatório' });
    } else if (product.name.length > 100) {
        errors.push({ field: 'name', message: 'Nome deve ter no máximo 100 caracteres' });
    }

    // Validar preço de custo
    if (product.costPrice === undefined || product.costPrice === null || product.costPrice <= 0) {
        errors.push({ field: 'costPrice', message: 'Preço de custo deve ser maior que zero' });
    }

    // Validar preço de venda
    if (product.salePrice === undefined || product.salePrice === null || product.salePrice <= 0) {
        errors.push({ field: 'salePrice', message: 'Preço de venda deve ser maior que zero' });
    }

    // Validar se preço de venda é maior que preço de custo (aviso)
    if (product.costPrice > 0 && product.salePrice > 0 && product.salePrice < product.costPrice) {
        errors.push({
            field: 'salePrice',
            message: 'Preço de venda menor que custo resultará em prejuízo'
        });
    }

    if (product.quantity === undefined || product.quantity === null || product.quantity < 0) {
        errors.push({ field: 'quantity', message: 'Quantidade não pode ser negativa' });
    }

    if (!product.productTypeId) {
        errors.push({ field: 'productTypeId', message: 'Tipo de produto é obrigatório' });
    }

    if (product.expirationDate) {
        const expirationDate = new Date(product.expirationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare only dates

        if (expirationDate < today) {
            errors.push({
                field: 'expirationDate',
                message: 'Data de validade não pode ser anterior a hoje'
            });
        }
    }

    return errors;
};

export const validateProductType = (productType: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!productType.name || productType.name.trim().length === 0) {
        errors.push({ field: 'name', message: 'Nome é obrigatório' });
    } else if (productType.name.length > 100) {
        errors.push({ field: 'name', message: 'Nome deve ter no máximo 100 caracteres' });
    }

    if (productType.description && productType.description.length > 500) {
        errors.push({ field: 'description', message: 'Descrição deve ter no máximo 500 caracteres' });
    }

    return errors;
};

export const validateStockMovement = (movement: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!movement.productId) {
        errors.push({ field: 'productId', message: 'Produto é obrigatório' });
    }

    if (!movement.type || !['entry', 'exit'].includes(movement.type)) {
        errors.push({ field: 'type', message: 'Tipo de movimentação é obrigatório e deve ser "compra" ou "venda"' });
    }

    if (!movement.quantity || movement.quantity <= 0) {
        errors.push({ field: 'quantity', message: 'Quantidade deve ser maior que zero' });
    } else if (!Number.isInteger(Number(movement.quantity))) {
        errors.push({ field: 'quantity', message: 'Quantidade deve ser um número inteiro' });
    }

    if (movement.createdAt) {
        const movementDate = new Date(movement.createdAt);
        const now = new Date();

        if (movementDate > now) {
            errors.push({
                field: 'createdAt',
                message: 'Data da movimentação não pode ser no futuro'
            });
        }

        // Check if date is not too old (e.g., more than 1 year ago)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        if (movementDate < oneYearAgo) {
            errors.push({
                field: 'createdAt',
                message: 'Data da movimentação não pode ser anterior a 1 ano'
            });
        }
    }

    if (movement.notes && movement.notes.length > 500) {
        errors.push({ field: 'notes', message: 'Observações devem ter no máximo 500 caracteres' });
    }

    return errors;
};

export const formatValidationErrors = (errors: ValidationError[]): string => {
    return errors.map(error => error.message).join(', ');
};

// Helper function to validate required fields
export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        return { field: fieldName, message: `${fieldName} é obrigatório` };
    }
    return null;
};

// Helper function to validate string length
export const validateStringLength = (
    value: string,
    fieldName: string,
    minLength?: number,
    maxLength?: number
): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (minLength && value.length < minLength) {
        errors.push({
            field: fieldName,
            message: `${fieldName} deve ter pelo menos ${minLength} caracteres`
        });
    }

    if (maxLength && value.length > maxLength) {
        errors.push({
            field: fieldName,
            message: `${fieldName} deve ter no máximo ${maxLength} caracteres`
        });
    }

    return errors;
};

// Helper function to validate numeric values
export const validateNumber = (
    value: number,
    fieldName: string,
    min?: number,
    max?: number,
    mustBeInteger?: boolean
): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (isNaN(value)) {
        errors.push({ field: fieldName, message: `${fieldName} deve ser um número válido` });
        return errors;
    }

    if (min !== undefined && value < min) {
        errors.push({
            field: fieldName,
            message: `${fieldName} deve ser maior ou igual a ${min}`
        });
    }

    if (max !== undefined && value > max) {
        errors.push({
            field: fieldName,
            message: `${fieldName} deve ser menor ou igual a ${max}`
        });
    }

    if (mustBeInteger && !Number.isInteger(value)) {
        errors.push({
            field: fieldName,
            message: `${fieldName} deve ser um número inteiro`
        });
    }

    return errors;
};

export const calculateProfit = (costPrice: number, salePrice: number) => {
    const profitValue = salePrice - costPrice;
    const profitMargin = costPrice > 0 ? (profitValue / costPrice) * 100 : 0;
    return { profitValue, profitMargin };
};
