import { useCallback, useState } from "react";
import { useCreateTask, useDeleteTask, useUpdateTask } from "@/hooks/api/use-tasks";
import { useAuthStore } from "@/store/auth.store";
import { useModalStore } from "@/store/modal.store";
import type { Task } from "@/types/types";

export function useTasksOperations() {
	const { openCreateTaskModal, openEditTaskModal } = useModalStore();
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

	const createTaskMutation = useCreateTask();
	const updateTaskMutation = useUpdateTask();
	const deleteTaskMutation = useDeleteTask();

	const showNotification = useCallback((message: string, severity: "success" | "error") => {
		setNotification({ open: true, message, severity });
	}, []);

	const closeNotification = useCallback(() => {
		setNotification((prev) => ({ ...prev, open: false }));
	}, []);

	const handleCreateTask = useCallback(
		async (taskData: any) => {
			try {
				const userId = getCurrentUserId();

				if (!userId) {
					showNotification("User ID is required to create a task", "error");
					return;
				}

				await createTaskMutation.mutateAsync({
					...taskData,
					authorId: userId,
				});
				showNotification("Task created successfully", "success");
			} catch (error: any) {
				showNotification(error.message || "Error creating task", "error");
			}
		},
		[getCurrentUserId, createTaskMutation, showNotification]
	);

	const handleUpdateTask = useCallback(
		async (taskData: any) => {
			try {
				const { id, ...data } = taskData;
				await updateTaskMutation.mutateAsync({ id, data });
				showNotification("Task updated successfully", "success");
			} catch (error: any) {
				showNotification(error.message || "Error updating task", "error");
			}
		},
		[updateTaskMutation, showNotification]
	);

	const handleDeleteTask = useCallback(
		async (id: string) => {
			if (window.confirm("Are you sure you want to delete this task?")) {
				try {
					await deleteTaskMutation.mutateAsync(id);
					showNotification("Task deleted successfully", "success");
				} catch (error: any) {
					showNotification(error.message || "Error deleting task", "error");
				}
			}
		},
		[deleteTaskMutation, showNotification]
	);

	const handleEditTask = useCallback(
		(task: Task) => {
			openEditTaskModal(task);
		},
		[openEditTaskModal]
	);

	return {
		createTaskMutation,
		updateTaskMutation,
		deleteTaskMutation,

		openCreateTaskModal,
		handleEditTask,
		handleDeleteTask,
		handleCreateTask,
		handleUpdateTask,

		notification,
		showNotification,
		closeNotification,
	};
}
