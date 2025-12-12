import { Stack, Typography, Pagination, Select, MenuItem, FormControl } from "@mui/material";
import type { TaskPaginationProps } from "@components/task-table/TaskTable.types";

export function TaskPagination({
  totalCount,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TaskPaginationProps) {
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange?.(page - 1);
  };

  const handlePageSizeChange = (event: any) => {
    const newSize = parseInt(event.target.value, 10);
    onPageSizeChange?.(newSize);
  };

  const startItem = (currentPage * pageSize) + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

  return (
    <Stack 
      direction="row" 
      justifyContent="space-between" 
      alignItems="center" 
      sx={{ 
        mt: 'auto', 
        pt: 2, 
        borderTop: 1, 
        borderColor: 'divider' 
      }}
    >
      {/* Левая часть */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Showing {startItem} to {endItem} of {totalCount}
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            size="small"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
        
        <Typography variant="body2" color="text.secondary">
          per page
        </Typography>
      </Stack>

      {/* Центральная часть */}
      <Pagination
        count={totalPages}
        page={currentPage + 1}
        onChange={handlePageChange}
        color="primary"
        size="medium"
        showFirstButton
        showLastButton
      />

      {/* Правая часть */}
      <Typography variant="body2" color="text.secondary">
        Page {currentPage + 1} of {totalPages || 1}
      </Typography>
    </Stack>
  );
}