import { useState } from "react";
import { Box } from "@mui/material";

import AddTaskModal from "../../components/modal/AddTaskModal";
import TaskTable from "../../components/task-table/TaskTable";
import AppHeader from "../../components/header/AppHeader";

import { initialTasks } from "../../mockData/mock-data";
import type { AddTaskFormValues } from "../../components/modal/Modal.types";
import { useToast } from "../../providers/ToastProvider";

export default function TasksPage() {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const { showToast } = useToast();

  const handleAddTask = (task: AddTaskFormValues) => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate,
        tags: task.tags,
        assignee: task.assignee,
        status: "In progress"
      }
    ]);

    showToast("Task added successfully", "success");
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppHeader />
      <TaskTable rows={tasks} setOpen={setOpen}/>

      <AddTaskModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAddTask}
      />
    </Box>
  );
}
