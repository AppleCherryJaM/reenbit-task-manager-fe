import { Stack, Typography, Pagination, Select, MenuItem, FormControl, useTheme, useMediaQuery } from "@mui/material";
import type { TaskPaginationProps } from "@components/task-table/TaskTable.types";

export function TaskPagination({
  totalCount,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TaskPaginationProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      direction={isMobile ? "column" : "row"} 
      justifyContent={isMobile ? "flex-start" : "space-between"} 
      alignItems={isMobile ? "stretch" : "center"} 
      spacing={isMobile ? 1.5 : 0}
      sx={{ 
        mt: 'auto', 
        pt: isMobile ? 1.5 : 2, 
        borderTop: 1, 
        borderColor: 'divider' 
      }}
    >
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={isMobile ? 0.5 : 2} 
        alignItems={isMobile ? "flex-start" : "center"}
      >
        <Typography variant="body2" color="text.secondary">
          {isMobile ? `Showing ${startItem}–${endItem} of ${totalCount}` : `Showing ${startItem} to ${endItem} of ${totalCount}`}
        </Typography>
        
        <Stack direction="row" alignItems="center" spacing={1}>
          <FormControl size="small" sx={{ minWidth: isMobile ? 60 : 80 }}>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              size="small"
              sx={{
                '& .MuiSelect-select': {
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  py: isMobile ? 0.5 : undefined,
                }
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          
          {!isMobile && (
            <Typography variant="body2" color="text.secondary">
              per page
            </Typography>
          )}
        </Stack>
      </Stack>

      <Pagination
        count={totalPages}
        page={currentPage + 1}
        onChange={handlePageChange}
        color="primary"
        size={isMobile ? "small" : "medium"}
        showFirstButton={!isMobile}
        showLastButton={!isMobile}
        sx={{ 
          alignSelf: isMobile ? 'center' : 'auto',
          '& .MuiPaginationItem-root': {
            fontSize: isMobile ? '0.75rem' : '0.875rem',
          }
        }}
      />

      {!isMobile && (
        <Typography variant="body2" color="text.secondary">
          Page {currentPage + 1} of {totalPages || 1}
        </Typography>
      )}
    </Stack>
  );
}