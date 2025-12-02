// components/modal/CreateTaskModal.tsx
import { useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import type { TaskFormValues } from "@/schemas/task.schema";
import { useModalStore } from "@/store/modal.store";
import type { Task } from "@/types/types";
import { transformFormToCreateData, transformTaskToFormValues } from "@/utils/task-transform.utils";
import TaskForm from "../task-form/TaskForm";
import ModalBase from "./ModalBase";

interface CreateTaskModalProps {
	onCreateTask: (taskData: any) => Promise<void>;
	onUpdateTask: (taskData: any) => Promise<void>;
	currentUserId: string;
}

export default function CreateTaskModal({
	onCreateTask,
	onUpdateTask,
	currentUserId,
}: CreateTaskModalProps) {
	const { isTaskModalOpen, editingTask, closeTaskModal } = useModalStore();
	const { isLoading: usersLoading } = useUsers();

	const [formData, setFormData] = useState<TaskFormValues | null>(null);
	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		if (!isTaskModalOpen) {
			setFormData(null);
			setIsFormValid(false);
		}
	}, [isTaskModalOpen]);

	const handleFormChange = (data: TaskFormValues, isValid: boolean) => {
		setFormData(data);
		setIsFormValid(isValid);
	};

	const handleSubmit = async () => {
		if (!formData || !isFormValid) {
			console.error("Form is not valid");
			return;
		}

		try {
			if (editingTask && editingTask.id) {
				const updateData = {
					id: editingTask.id,
					...formData,
				};
				console.log("Updating task with:", updateData);
				await onUpdateTask(updateData);
			} else {
				const apiData = transformFormToCreateData(formData, currentUserId);
				console.log("Creating task with:", apiData);
				await onCreateTask(apiData);
			}

			closeTaskModal();
		} catch (error) {
			console.error("Failed to submit task:", error);
		}
	};

	const getInitialData = (): TaskFormValues => {
		if (editingTask) {
			return transformTaskToFormValues(editingTask);
		}
		return {
			title: "",
			description: "",
			status: "pending",
			priority: "medium",
			deadline: null,
			assigneeIds: [],
		};
	};

	return (
		<ModalBase
			open={isTaskModalOpen}
			onClose={closeTaskModal}
			onSubmit={handleSubmit}
			title={editingTask ? "Редактировать задачу" : "Создать новую задачу"}
			primaryBtnText={editingTask ? "Сохранить" : "Создать"}
			disableSubmit={usersLoading || !isFormValid}
		>
			<TaskForm
				initialData={getInitialData()}
				onFormChange={handleFormChange}
				currentUserId={currentUserId}
			/>
		</ModalBase>
	);
}
