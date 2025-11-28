import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { PriorityColor, StatusColor } from "./TaskTable.types";
import type { Task } from "../../types/types";
import { columns } from "./TaskTable.config";

export default function TaskTable({ rows, setOpen}: 
	{ rows: Task[]; setOpen: (open: boolean) => void}
) {

  return (
    <Box sx={{ bgcolor: "#fff", p: 3, borderRadius: 3, boxShadow: 1 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>Task</Typography>
      </Stack>

      <Box sx={{ height: 480 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#F3F4F6",
              fontWeight: 600
            }
          }}
        />
      </Box>

      <Button
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ mt: 2, textTransform: "none" }}
      >
        Add task
      </Button>
    </Box>
  );
}