// frontend/src/components/common/CurrencyInput.tsx
"use client";

import React, { useState, useEffect } from "react";
import { TextField, TextFieldProps, InputAdornment } from "@mui/material";
import { applyCurrencyMask, currencyInputToNumber } from "@/utils/currency";

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

  // Sincronizar valor inicial
  useEffect(() => {
    if (!focused && value !== undefined) {
      const formattedValue =
        value === 0 ? "" : applyCurrencyMask((value * 100).toString());
      setDisplayValue(formattedValue);
    }
  }, [value, focused]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Se o input estiver vazio, permite
    if (!inputValue) {
      setDisplayValue("");
      onChange(0);
      return;
    }

    // Aplica a máscara
    const maskedValue = applyCurrencyMask(inputValue);

    // Converte para número
    const numericValue = currencyInputToNumber(maskedValue);

    // Validações
    if (!allowNegative && numericValue < 0) {
      return;
    }

    if (maxValue !== undefined && numericValue > maxValue) {
      return;
    }

    if (minValue !== undefined && numericValue < minValue) {
      // Permite digitação mesmo se for menor que o mínimo
      // A validação final será feita no submit
    }

    setDisplayValue(maskedValue);
    onChange(numericValue);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    textFieldProps.onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);

    // Reaplica a formatação ao perder o foco
    if (value !== undefined && value !== 0) {
      const formattedValue = applyCurrencyMask((value * 100).toString());
      setDisplayValue(formattedValue);
    }

    textFieldProps.onBlur?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite apenas números, backspace, delete, tab, escape, enter, e teclas de navegação
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
        inputMode: "numeric",
        pattern: "[0-9]*",
        ...textFieldProps.inputProps,
      }}
    />
  );
};

export default CurrencyInput;
