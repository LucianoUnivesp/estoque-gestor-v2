// src/components/common/Pagination.tsx
"use client";

import React from "react";
import {
//   Box,
  Pagination as MuiPagination,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Stack,
  Paper,
} from "@mui/material";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showResultsInfo?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [5, 10, 25, 50],
  showPageSizeSelector = true,
  showResultsInfo = true,
}) => {
  const { page, limit, total, totalPages } = pagination;

  const startItem = Math.min((page - 1) * limit + 1, total);
  const endItem = Math.min(page * limit, total);

  if (total === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 3,
        border: 1,
        borderColor: "grey.200",
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {/* Results Info */}
        {showResultsInfo && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ order: { xs: 2, sm: 1 } }}
          >
            Mostrando {startItem} a {endItem} de {total} resultados
          </Typography>
        )}

        {/* Pagination Controls */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ order: { xs: 1, sm: 2 } }}
        >
          {/* Page Size Selector */}
          {showPageSizeSelector && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Itens por página:
              </Typography>
              <FormControl size="small">
                <Select
                  value={limit}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                  sx={{
                    minWidth: 70,
                    "& .MuiOutlinedInput-input": {
                      py: 1,
                    },
                  }}
                >
                  {pageSizeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          )}

          {/* Page Navigation */}
          {totalPages > 1 && (
            <MuiPagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => onPageChange(newPage)}
              shape="rounded"
              size="medium"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 1.5,
                  fontWeight: 500,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                },
              }}
            />
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Pagination;
