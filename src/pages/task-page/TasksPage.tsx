import AppHeader from "@components/header/AppHeader";
import TaskTable from "@components/task-table/TaskTable";
import { Alert, Box, Button, CircularProgress, Snackbar } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateTaskModal from "@/components/modal/CreateTaskModal";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from "@/hooks/api/use-tasks";
import { useAuthStore } from "@/store/auth.store";
import { useModalStore } from "@/store/modal.store";

import type { Task } from "@/types/types";
import { TaskPageStrings } from "./task-page.types";

export default function TasksPage() {
	// const navigate = useNavigate();
	const { openTaskModal } = useModalStore();
	const { getCurrentUserId } = useAuthStore();

	const [notification, setNotification] = useState<{
		open: boolean;
		message: string;
		severity: "success" | "error";
	}>({
		open: false,
		message: "",
		severity: "success",
	});

	const { data: tasks = [], isLoading, error, refetch } = useTasks();

	const createTaskMutation = useCreateTask();
	const updateTaskMutation = useUpdateTask();
	const deleteTaskMutation = useDeleteTask();

	const currentUserId = getCurrentUserId();

	const handleCreateTask = async (taskData: any) => {
		console.log("handleCreateTask called with:", taskData);
		try {
			if (!currentUserId) {
				throw new Error("User ID is required to create a task");
			}

			const taskDataWithAuthor = {
				...taskData,
				authorId: currentUserId,
			};

			console.log("Sending to API: ", taskDataWithAuthor);

			await createTaskMutation.mutateAsync(taskDataWithAuthor);
			showNotification(TaskPageStrings.CREATE_TASK_SUCCESS, "success");
		} catch (error) {
			showNotification(TaskPageStrings.CREATE_TASK_ERROR, "error");
			console.error(`${TaskPageStrings.CREATE_TASK_ERROR}:`, error);
		}
	};

	const handleUpdateTask = async (taskData: any) => {
		try {
			const { id, ...updateData } = taskData;

			console.log("Updating task:", id, updateData);

			await updateTaskMutation.mutateAsync({
				id: id,
				data: updateData,
			});
			showNotification(TaskPageStrings.UPDATE_TASK_SUCCESS, "success");
		} catch (error) {
			showNotification(TaskPageStrings.UPDATE_TASK_ERROR, "error");
			console.error(`${TaskPageStrings.UPDATE_TASK_ERROR}:`, error);
		}
	};

	const handleDeleteTask = async (id: string) => {
		if (window.confirm(TaskPageStrings.DELETE_TASK_CONFIRMATION)) {
			try {
				await deleteTaskMutation.mutateAsync(id);
				showNotification(TaskPageStrings.DELETE_TASK_SUCCESS, "success");
			} catch (error) {
				showNotification(TaskPageStrings.DELETE_TASK_ERROR, "error");
				console.error(`${TaskPageStrings.DELETE_TASK_ERROR}: ${error}`);
			}
		}
	};

	const handleEditTask = (task: Task) => {
		openTaskModal(task);
	};

	const showNotification = (message: string, severity: "success" | "error") => {
		setNotification({ open: true, message, severity });
	};

	const handleCloseNotification = () => {
		setNotification((prev) => ({ ...prev, open: false }));
	};

	const handleRetry = () => {
		refetch();
	};

	// const handleLogout = () => {
	//   logout();
	//   navigate('/auth');
	// };

	if (isLoading) {
		return (
			<Box
				sx={{
					p: 3,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 3 }}>
				{/* <AppHeader onLogout={handleLogout} /> */}
				<AppHeader />

				<Alert
					severity="error"
					sx={{ mb: 2 }}
					action={
						<Button color="inherit" size="small" onClick={handleRetry}>
							Повторить
						</Button>
					}
				>
					Ошибка загрузки задач: {(error as Error).message}
				</Alert>
				<TaskTable
					rows={[]}
					onAddTask={openTaskModal}
					onEditTask={handleEditTask}
					onDeleteTask={handleDeleteTask}
					loading={false}
				/>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			{/* <AppHeader onLogout={handleLogout} /> */}

			<AppHeader />
			<TaskTable
				rows={tasks}
				onAddTask={openTaskModal}
				onEditTask={handleEditTask}
				onDeleteTask={handleDeleteTask}
				loading={deleteTaskMutation.isPending}
			/>

			{/* <ErrorBoundary> */}
			<CreateTaskModal
				onCreateTask={handleCreateTask}
				onUpdateTask={handleUpdateTask}
				currentUserId={currentUserId || ""}
			/>
			{/* </ErrorBoundary> */}

			<Snackbar
				open={notification.open}
				autoHideDuration={3000}
				onClose={handleCloseNotification}
				message={notification.message}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			/>
		</Box>
	);
}
