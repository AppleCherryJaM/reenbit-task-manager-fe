import { useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Chip, Avatar, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { initialTasks } from "../../mockData/mock-data";
import { PriorityColor, StatusColor } from "./TaskTable.types";
import type { Task } from "../../types/types";

export default function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = () => {
		// заглушка (should be replaced by modal form)
    const newTask: Task = {
      id: Date.now(),
      task: "New task",
      priority: "Medium",
      status: "To Do",
      deadline: "-",
      assignee: "-",
      tag: "-",
			author: "Test Author"
    };
    
    setTasks((prev) => [...prev, newTask]);
  };

  const columns: GridColDef[] = [
    { field: "task", headerName: "Task", flex: 1, minWidth: 200 },
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={PriorityColor[params.value as keyof typeof PriorityColor]} 
          variant="outlined" 
        />
      )
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={StatusColor[params.value as keyof typeof StatusColor]} 
          variant="outlined" 
        />
      )
    },
    { field: "deadline", headerName: "Deadline", flex: 1, minWidth: 120 },
    {
      field: "assignee",
      headerName: "Assignee",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Avatar sx={{ width: 28, height: 28, bgcolor: "grey.400", fontSize: 14 }}>
          {params.value?.slice(0, 1)}
        </Avatar>
      )
    },
    {
      field: "tag",
      headerName: "Tag",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <Chip label={params.value} size="small" />
    }
  ];

  return (
    <Box sx={{ bgcolor: "#fff", p: 3, borderRadius: 3, boxShadow: 1 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>Task</Typography>
      </Stack>

      <Box sx={{ height: 480 }}>
        <DataGrid
          rows={tasks}
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
        onClick={addTask}
        sx={{ mt: 2, textTransform: "none" }}
      >
        Add task
      </Button>
    </Box>
  );
}