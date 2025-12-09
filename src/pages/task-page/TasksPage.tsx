import AppHeader from "@components/header/AppHeader";
import TaskTable from "@components/task-table/TaskTable";
import { Alert, Box, Button, CircularProgress, Snackbar } from "@mui/material";
import { useState } from "react";
import CreateTaskModal from "@/components/modal/CreateTaskModal";
import EditTaskModal from "@/components/modal/EditTaskModal";
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from "@/hooks/api/use-tasks";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useModalStore } from "@/store/modal.store";
import type { Task } from "@/types/types";
import { TaskPageStrings } from "./task-page.types";

export default function TasksPage() {
	const navigate = useNavigate();
	const { openCreateTaskModal, openEditTaskModal } = useModalStore();
	const { getCurrentUserId, logout: logoutFromStore } = useAuthStore();

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
		try {
			
			if (!currentUserId) {
				throw new Error("User ID is required to create a task");
			}

			const taskDataWithAuthor = {
				...taskData,
				authorId: currentUserId,
			};

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
		openEditTaskModal(task);
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

	const handleLogout = async () => {
		try {
			await authService.logout();

			logoutFromStore();

			navigate("/auth");
		} catch (error) {
			console.error("Logout failed:", error);
			logoutFromStore();
			navigate("/auth");
		}
	};

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
				<AppHeader onLogout={handleLogout} />

				<Alert
					severity="error"
					sx={{ mb: 2 }}
					action={
						<Button color="inherit" size="small" onClick={handleRetry}>
							{TaskPageStrings.REPEAT}
						</Button>
					}
				>
					{TaskPageStrings.LOAD_TASKS_ERROR} {(error as Error).message}
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
			<AppHeader onLogout={handleLogout} />

			<TaskTable
				rows={tasks}
				onAddTask={openCreateTaskModal}
				onEditTask={handleEditTask}
				onDeleteTask={handleDeleteTask}
				loading={deleteTaskMutation.isPending}
			/>

			<CreateTaskModal onCreateTask={handleCreateTask} currentUserId={currentUserId || ""} />

			<EditTaskModal onUpdateTask={handleUpdateTask} currentUserId={currentUserId || ""} />

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
