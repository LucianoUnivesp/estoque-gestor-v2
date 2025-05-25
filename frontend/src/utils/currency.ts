// frontend/src/utils/currency.ts
/**
 * Formata um número para exibição em Real brasileiro
 * @param value - Valor numérico
 * @returns String formatada como R$ 0,00
 */
export const formatCurrency = (value: number): string => {
    if (isNaN(value) || value === null || value === undefined) {
        return 'R$ 0,00';
    }

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

/**
 * Remove formatação de moeda e retorna apenas o número
 * @param value - String formatada
 * @returns Número
 */
export const parseCurrency = (value: string): number => {
    if (!value || typeof value !== 'string') {
        return 0;
    }

    // Remove símbolos de moeda e espaços
    let cleanValue = value
        .replace(/R\$\s?/g, '') // Remove R$ 
        .replace(/\s/g, '') // Remove espaços
        .trim();

    // Se está vazio após limpeza
    if (!cleanValue) return 0;

    // Trata o formato brasileiro (ponto para milhares, vírgula para decimais)
    // Ex: 1.234,56 -> 1234.56
    if (cleanValue.includes(',')) {
        // Se tem vírgula, é o separador decimal
        const parts = cleanValue.split(',');
        if (parts.length === 2) {
            // Remove pontos da parte inteira (separadores de milhares)
            const integerPart = parts[0].replace(/\./g, '');
            const decimalPart = parts[1].substring(0, 2); // Máximo 2 casas decimais
            cleanValue = `${integerPart}.${decimalPart}`;
        }
    } else {
        // Se não tem vírgula, remove todos os pontos (podem ser separadores de milhares)
        cleanValue = cleanValue.replace(/\./g, '');
    }

    const numericValue = parseFloat(cleanValue);
    return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Aplica máscara de moeda em tempo real durante digitação
 * @param value - Valor a ser formatado
 * @returns String com máscara aplicada
 */
export const applyCurrencyMask = (value: string): string => {
    if (!value || value === '') return '';

    // Remove tudo exceto dígitos
    const onlyNumbers = value.replace(/\D/g, '');

    if (!onlyNumbers || onlyNumbers === '0') return '';

    // Converte para centavos
    const cents = parseInt(onlyNumbers, 10);

    // Evita valores muito grandes
    if (cents > 99999999999) return '999.999.999,99';

    // Converte centavos para reais
    const reais = cents / 100;

    // Formata sem símbolo de moeda
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(reais);
};

/**
 * Converte valor formatado do input para número
 * @param value - Valor formatado do input
 * @returns Número para usar na aplicação
 */
export const currencyInputToNumber = (value: string): number => {
    if (!value || typeof value !== 'string') return 0;

    // Remove espaços e caracteres especiais, mantém apenas números e vírgula
    const cleanValue = value
        .replace(/[^\d,]/g, '') // Mantém apenas dígitos e vírgula
        .trim();

    if (!cleanValue) return 0;

    // Se tem vírgula, trata como separador decimal brasileiro
    if (cleanValue.includes(',')) {
        const parts = cleanValue.split(',');
        const integerPart = parts[0] || '0';
        const decimalPart = (parts[1] || '00').substring(0, 2).padEnd(2, '0');

        const result = parseFloat(`${integerPart}.${decimalPart}`);
        return isNaN(result) ? 0 : result;
    }

    // Se não tem vírgula, trata como valor inteiro
    const intValue = parseInt(cleanValue, 10);
    return isNaN(intValue) ? 0 : intValue;
};

/**
 * Formata valor para input controlado
 * @param value - Valor numérico
 * @returns Valor formatado para exibição no input
 */
export const formatCurrencyInput = (value: number): string => {
    if (!value || value === 0) return '';

    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(value);
};

/**
 * Valida se um valor monetário é válido
 * @param value - Valor a ser validado  
 * @returns true se válido
 */
export const isValidCurrency = (value: string | number): boolean => {
    if (typeof value === 'number') {
        return !isNaN(value) && value >= 0;
    }

    if (typeof value === 'string') {
        const numericValue = parseCurrency(value);
        return !isNaN(numericValue) && numericValue >= 0;
    }

    return false;
};

/**
 * Formata para exibição em tabelas (mais compacto)
 * @param value - Valor numérico
 * @returns String formatada compacta
 */
export const formatCurrencyCompact = (value: number): string => {
    if (isNaN(value) || value === null || value === undefined) {
        return 'R$ 0,00';
    }

    // Para valores grandes, usa abreviações
    if (value >= 1000000) {
        return `R$ ${(value / 1000000).toFixed(1).replace('.', ',')}M`;
    } else if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}K`;
    }

    return formatCurrency(value);
};