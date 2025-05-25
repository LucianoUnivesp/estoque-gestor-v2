/* eslint-disable @typescript-eslint/no-unused-vars */
// frontend/src/utils/currency.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

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
 * @param value - String formatada como R$ 0,00
 * @returns Número
 */
export const parseCurrency = (value: string): number => {
    if (!value || typeof value !== 'string') {
        return 0;
    }

    // Remove tudo exceto números, vírgula e ponto
    const cleanValue = value
        .replace(/[^\d,.-]/g, '') // Remove tudo exceto dígitos, vírgula, ponto e sinal negativo
        .replace(/\./g, '') // Remove pontos (separadores de milhares)
        .replace(',', '.'); // Substitui vírgula por ponto (separador decimal)

    const numericValue = parseFloat(cleanValue);
    return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Aplica máscara de moeda em tempo real - VERSÃO SUPER ROBUSTA
 * @param value - Valor a ser formatado
 * @returns String com máscara aplicada
 */
export const applyCurrencyMask = (value: string): string => {
    if (!value || value === '') return '';

    // Remove tudo exceto dígitos
    const onlyNumbers = value.replace(/\D/g, '');

    if (!onlyNumbers || onlyNumbers === '0') return '';

    // Converte para centavos (últimos 2 dígitos)
    const cents = parseInt(onlyNumbers, 10);

    // Evita valores muito grandes (máximo R$ 999.999.999,99)
    if (cents > 99999999999) {
        return applyCurrencyMask('99999999999');
    }

    // Divide por 100 para obter o valor em reais
    const reais = cents / 100;

    // Formata com separadores brasileiros sem símbolo de moeda
    try {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true
        }).format(reais);
    } catch (error) {
        // Fallback caso tenha problema com Intl
        return (reais).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
};

/**
 * Formata valor para input controlado
 * @param value - Valor do input
 * @returns Valor formatado para exibição
 */
export const formatCurrencyInput = (value: string | number): string => {
    if (typeof value === 'number') {
        if (value === 0) return '';
        return applyCurrencyMask(Math.round(value * 100).toString());
    }

    if (typeof value === 'string') {
        return applyCurrencyMask(value);
    }

    return '';
};

/**
 * Valida se um valor monetário é válido
 * @param value - Valor a ser validado
 * @returns true se válido, false caso contrário
 */
export const isValidCurrency = (value: string): boolean => {
    const numericValue = parseCurrency(value);
    return !isNaN(numericValue) && numericValue >= 0;
};

/**
 * Converte valor do input para número - VERSÃO MELHORADA
 * @param value - Valor do input formatado
 * @returns Número para salvar no banco
 */
export const currencyInputToNumber = (value: string): number => {
    if (!value || typeof value !== 'string') return 0;

    // Remove tudo exceto dígitos e vírgula
    const cleanValue = value.replace(/[^\d,]/g, '');

    if (!cleanValue) return 0;

    // Se tem vírgula, é o separador decimal brasileiro
    if (cleanValue.includes(',')) {
        const parts = cleanValue.split(',');
        const integerPart = parts[0] || '0';
        const decimalPart = (parts[1] || '00').substring(0, 2).padEnd(2, '0');

        const result = parseFloat(`${integerPart}.${decimalPart}`);
        return isNaN(result) ? 0 : result;
    }

    // Se não tem vírgula, trata como centavos
    const numericValue = parseInt(cleanValue, 10);
    return isNaN(numericValue) ? 0 : numericValue / 100;
};