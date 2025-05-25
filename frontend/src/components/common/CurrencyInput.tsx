/* eslint-disable @typescript-eslint/no-unused-vars */
// frontend/src/components/common/CurrencyInput.tsx
"use client";

import React, { useState, useEffect } from "react";
import { TextField, TextFieldProps, InputAdornment } from "@mui/material";

interface CurrencyInputProps
  extends Omit<TextFieldProps, "value" | "onChange"> {
  value: number;
  onChange: (value: number) => void;
  allowNegative?: boolean;
  maxValue?: number;
  minValue?: number;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  allowNegative = false,
  maxValue,
  minValue = 0,
  ...textFieldProps
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const [focused, setFocused] = useState(false);

  // Função para formatar valor como moeda brasileira
  const formatCurrency = (numValue: number): string => {
    if (numValue === 0) return "";

    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(numValue);
  };

  // Função para converter string formatada para número
  const parseCurrencyString = (str: string): number => {
    if (!str || str.trim() === "") return 0;

    // Remove tudo exceto números e vírgula
    const cleanStr = str.replace(/[^\d,]/g, "");

    if (!cleanStr) return 0;

    // Converte vírgula para ponto decimal
    const normalizedStr = cleanStr.replace(",", ".");
    const numValue = parseFloat(normalizedStr);

    return isNaN(numValue) ? 0 : numValue;
  };

  // Sincronizar valor inicial e quando não focado
  useEffect(() => {
    if (!focused) {
      const formattedValue = formatCurrency(value || 0);
      setDisplayValue(formattedValue);
    }
  }, [value, focused]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Se o input estiver vazio, permite
    if (!inputValue || inputValue.trim() === "") {
      setDisplayValue("");
      onChange(0);
      return;
    }

    // Permite apenas números, vírgula e ponto
    const allowedChars = /^[\d.,\s]*$/;
    if (!allowedChars.test(inputValue)) {
      return; // Não permite caracteres inválidos
    }

    // Remove espaços e pontos de separação de milhares, mantém apenas a última vírgula
    let cleanValue = inputValue.replace(/\s/g, ""); // Remove espaços

    // Se tem múltiplas vírgulas, mantém apenas a última
    const commaIndex = cleanValue.lastIndexOf(",");
    if (commaIndex !== -1) {
      const beforeComma = cleanValue
        .substring(0, commaIndex)
        .replace(/[,.]/g, "");
      const afterComma = cleanValue
        .substring(commaIndex + 1)
        .replace(/[,.]/g, "")
        .substring(0, 2);
      cleanValue = beforeComma + "," + afterComma;
    } else {
      // Remove pontos se não há vírgula (são separadores de milhares)
      cleanValue = cleanValue.replace(/\./g, "");
    }

    // Converte para número
    const numericValue = parseCurrencyString(cleanValue);

    // Validações
    if (!allowNegative && numericValue < 0) {
      return;
    }

    if (maxValue !== undefined && numericValue > maxValue) {
      return;
    }

    // Formata o valor para exibição durante a digitação
    let formattedForDisplay = cleanValue;

    // Se não está focado ou perdeu o foco, formata completamente
    if (!focused && numericValue > 0) {
      formattedForDisplay = formatCurrency(numericValue);
    }

    setDisplayValue(formattedForDisplay);
    onChange(numericValue);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    // No foco, mostra o valor limpo para edição mais fácil
    if (value > 0) {
      const cleanForEdit = value.toFixed(2).replace(".", ",");
      setDisplayValue(cleanForEdit);
    }
    textFieldProps.onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    // No blur, formata completamente
    const formattedValue = formatCurrency(value || 0);
    setDisplayValue(formattedValue);
    textFieldProps.onBlur?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite apenas números, backspace, delete, tab, escape, enter, vírgula e teclas de navegação
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "Home",
      "End",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      ",",
      ".",
    ];

    const isNumber = /^[0-9]$/.test(event.key);
    const isAllowedKey = allowedKeys.includes(event.key);
    const isCtrlCmd = event.ctrlKey || event.metaKey;

    if (!isNumber && !isAllowedKey && !isCtrlCmd) {
      event.preventDefault();
    }

    textFieldProps.onKeyDown?.(event);
  };

  return (
    <TextField
      {...textFieldProps}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        ...textFieldProps.InputProps,
      }}
      inputProps={{
        inputMode: "decimal",
        autoComplete: "off",
        ...textFieldProps.inputProps,
      }}
    />
  );
};

export default CurrencyInput;
