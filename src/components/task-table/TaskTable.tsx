import { Box, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { columns } from "./TaskTable.config";
import { TaskControls } from "./components/TaskControls";
import { TaskHeader } from "./components/TaskHeader";
import { TaskPagination } from "./components/TaskPagination";
import { TaskTableStrings, type TaskTableProps } from "./TaskTable.types";

export default function TaskTable({
  rows,
  totalCount,
  onAddTask,
  onEditTask,
  onDeleteTask,
  loading = false,
  onPageChange,
  onPageSizeChange,
  currentPage = 0,
  pageSize = 10,
  onSortChange,
  currentSort = { field: 'createdAt', direction: 'desc' },
  onFilterChange,
  currentFilters = { status: 'all', priority: 'all' },
}: TaskTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleRowDoubleClick = (params: any) => {
    if (onEditTask) {
      onEditTask(params.row);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const tableColumns = columns(onEditTask, onDeleteTask);

  return (
    <Box sx={{ 
      bgcolor: "#fff", 
      p: isMobile ? 2 : 3, 
      borderRadius: isMobile ? 2 : 3, 
      boxShadow: 1,
      display: "flex",
      flexDirection: "column",
      minHeight: isMobile ? 350 : 450,
    }}>

      <TaskHeader 
        totalCount={totalCount}
        onAddTask={onAddTask}
      />

      <TaskControls
        currentSort={currentSort}
        currentFilters={currentFilters}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
      />

      <Box sx={{ 
        flex: 1, 
        minHeight: isMobile ? 200 : 300, 
        mb: isMobile ? 1.5 : 2,
        position: 'relative'
      }}>
        <DataGrid
          rows={rows}
          columns={tableColumns}
          disableRowSelectionOnClick
          getRowId={(row) => row.id || `temp-${Math.random()}`}
          loading={loading}
          onRowDoubleClick={handleRowDoubleClick}
          hideFooterPagination
          hideFooter
          disableColumnMenu
          disableColumnResize
          disableColumnSelector
          sx={{
            border: "none",
            height: '100%',
            '& .MuiDataGrid-main': {
              overflow: 'auto',
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#F3F4F6",
              fontWeight: 600,
              fontSize: isMobile ? '0.825rem' : '0.875rem',
              lineHeight: 1.4,
            },
            "& .MuiDataGrid-cell": {
              fontSize: isMobile ? '0.825rem' : '0.875rem',
              py: isMobile ? 1 : 1.5,
              lineHeight: 1.4,
            },
            "& .MuiDataGrid-row": {
              cursor: "pointer",
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: 'none',
            },
          }}
        />
      </Box>

      <TaskPagination
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </Box>
  );
}