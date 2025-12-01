import AppHeader from "@components/header/AppHeader";
import AddTaskModal from "@components/modal/AddTaskModal";
import type { AddTaskFormValues } from "@components/modal/Modal.types";
import TaskTable from "@components/task-table/TaskTable";
import { Box } from "@mui/material";
import { useState } from "react";
import { initialTasks } from "@/mockData/mock-data";

export default function TasksPage() {
	const [open, setOpen] = useState(false);
	const [tasks, setTasks] = useState<any[]>(initialTasks);

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
				status: "In progress",
			},
		]);
	};

	return (
		<Box sx={{ p: 3 }}>
			<AppHeader />
			<TaskTable rows={tasks} setOpen={setOpen} />

			<AddTaskModal open={open} onClose={() => setOpen(false)} onSubmit={handleAddTask} />
		</Box>
	);
}
