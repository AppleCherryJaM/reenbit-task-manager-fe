import { useEffect, useState } from "react";
import type { TaskFormValues } from "@/schemas/task.schema";
import { useModalStore } from "@/store/modal.store";
import { transformTaskToFormValues } from "@/utils/task-transform.utils";
import TaskForm from "../task-form/TaskForm";
import ModalBase from "./ModalBase";

interface EditTaskModalProps {
	onUpdateTask: (taskData: any) => Promise<void>;
	currentUserId: string;
}

export default function EditTaskModal({ onUpdateTask, currentUserId }: EditTaskModalProps) {
	const { isEditTaskModalOpen, editingTask, closeEditTaskModal } = useModalStore();

	const [formData, setFormData] = useState<TaskFormValues | null>(null);
	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		if (!isEditTaskModalOpen) {
			setFormData(null);
			setIsFormValid(false);
		}
	}, [isEditTaskModalOpen]);

	const handleFormChange = (data: TaskFormValues, isValid: boolean) => {
		setFormData(data);
		setIsFormValid(isValid);
	};

	const handleSubmit = async () => {
		if (!formData || !isFormValid || !editingTask) {
			console.error("Form is not valid or no task to update");
			return;
		}

		try {
			const updateData = {
				id: editingTask.id,
				...formData,
			};
			await onUpdateTask(updateData);
			closeEditTaskModal();
		} catch (error) {
			console.error("Failed to update task:", error);
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

	if (!editingTask) {
		return null;
	}

	return (
		<ModalBase
			open={isEditTaskModalOpen}
			onClose={closeEditTaskModal}
			onSubmit={handleSubmit}
			title="Редактировать задачу"
			primaryBtnText="Сохранить"
			disableSubmit={!isFormValid}
		>
			<TaskForm
				initialData={getInitialData()}
				onFormChange={handleFormChange}
				currentUserId={currentUserId}
			/>
		</ModalBase>
	);
}
