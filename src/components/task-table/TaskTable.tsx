import { Box } from "@mui/material";
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
      p: 3, 
      borderRadius: 3, 
      boxShadow: 1,
      display: "flex",
      flexDirection: "column"
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

      <Box sx={{ height: 400, mb: 2, flex: 1 }}>
        <DataGrid
          rows={rows}
          columns={tableColumns}
          disableRowSelectionOnClick
          getRowId={(row) => {
					  if (!row.id) {
						  return `temp-${Math.random()}`;
					  }
					  return row.id;
				  }}
          loading={loading}
          onRowDoubleClick={handleRowDoubleClick}
          hideFooterPagination={true}
          hideFooter={true}
          disableColumnMenu={true}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#F3F4F6",
              fontWeight: 600,
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
