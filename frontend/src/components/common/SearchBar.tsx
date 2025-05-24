// src/components/common/SearchBar.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Stack,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";

interface FilterOption {
  value: string | number;
  label: string;
}

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filterValue?: string | number;
  onFilterChange?: (value: string | number) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  showActiveFilters?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  onSearchChange,
  placeholder = "Buscar...",
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterLabel = "Filtrar por",
  showActiveFilters = true,
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchValue, onSearchChange]);

  // Update local state when prop changes
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  const handleClearSearch = () => {
    setLocalSearchValue("");
    onSearchChange("");
  };

  const handleClearFilter = () => {
    if (onFilterChange) {
      onFilterChange("");
    }
  };

  const getActiveFilters = () => {
    const filters = [];

    if (searchValue) {
      filters.push({
        type: "search",
        label: `Busca: "${searchValue}"`,
        onRemove: handleClearSearch,
      });
    }

    if (filterValue && onFilterChange) {
      const selectedOption = filterOptions.find(
        (opt) => opt.value === filterValue
      );
      if (selectedOption) {
        filters.push({
          type: "filter",
          label: `${filterLabel}: ${selectedOption.label}`,
          onRemove: handleClearFilter,
        });
      }
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: showActiveFilters && activeFilters.length > 0 ? 2 : 0 }}
      >
        <TextField
          value={localSearchValue}
          onChange={(e) => setLocalSearchValue(e.target.value)}
          placeholder={placeholder}
          size="medium"
          sx={{
            flexGrow: 1,
            minWidth: { xs: "100%", sm: "300px" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: localSearchValue && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  sx={{ padding: 0.5 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              bgcolor: "background.paper",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        {filterOptions.length > 0 && onFilterChange && (
          <TextField
            select
            value={filterValue || ""}
            onChange={(e) => onFilterChange(e.target.value)}
            size="medium"
            sx={{
              minWidth: { xs: "100%", sm: "200px" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                bgcolor: "background.paper",
              },
            }}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {filterOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Stack>

      {/* Active Filters */}
      {showActiveFilters && activeFilters.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
          {activeFilters.map((filter, index) => (
            <Chip
              key={index}
              label={filter.label}
              onDelete={filter.onRemove}
              size="small"
              variant="outlined"
              sx={{
                bgcolor: "background.paper",
                borderColor: "primary.main",
                color: "primary.main",
                "& .MuiChip-deleteIcon": {
                  color: "primary.main",
                  "&:hover": {
                    color: "primary.dark",
                  },
                },
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default SearchBar;
