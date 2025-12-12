import { useState } from "react";
import { 
  Box, 
  Button, 
  Stack, 
  Typography, 
  LinearProgress,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box as MuiBox
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { columns } from "./TaskTable.config";
import type { TaskTableProps } from "./TaskTable.types";

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
}: TaskTableProps) {

  const totalPages = Math.ceil(totalCount / pageSize);
  const tableColumns = columns(onEditTask, onDeleteTask);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange?.(page - 1);
  };

  const handlePageSizeChange = (event: any) => {
    const newSize = parseInt(event.target.value, 10);
    onPageSizeChange?.(newSize);
  };

  return (
    <Box sx={{ 
      bgcolor: "#fff", 
      p: 3, 
      borderRadius: 3, 
      boxShadow: 1,
      display: "flex",
      flexDirection: "column"
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          {TaskTableStrings.TASKS_LABEL} ({totalCount})
        </Typography>

        <Button
          startIcon={<AddIcon />}
          onClick={onAddTask}
          variant="contained"
          sx={{ textTransform: "none" }}
        >
          {TaskTableStrings.ADD_TASK_BUTTON}
        </Button>
      </Stack>

      {loading && <LinearProgress sx={{ mb: 1 }} />}

      <Box sx={{ height: 400, mb: 2 }}> 
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
          onRowDoubleClick={(params) => onEditTask?.(params.row)}
          hideFooterPagination={true}
          hideFooter={true}
          
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#F3F4F6",
              fontWeight: 600,
            },
            "& .MuiDataGrid-virtualScroller": {
              minHeight: 200,
            },
          }}
        />
      </Box>

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
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Total: {totalCount} tasks
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

        <Pagination
          count={totalPages}
          page={currentPage + 1} 
          onChange={handlePageChange}
          color="primary"
          size="medium"
          showFirstButton
          showLastButton
        />

        <Typography variant="body2" color="text.secondary">
          Page {currentPage + 1} of {totalPages || 1}
        </Typography>
      </Stack>
    </Box>
  );
}
