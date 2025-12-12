import TaskForm from "@components/task-form/TaskForm";
import { useState, useRef } from "react";
import type { TaskFormValues } from "@/schemas/task.schema";
import { useModalStore } from "@/store/modal.store";
import { transformTaskToFormValues } from "@/utils/task-transform.utils";
import ModalBase from "./ModalBase";

interface EditTaskModalProps {
	onUpdateTask: (taskData: any) => Promise<void>;
	currentUserId: string;
}

export default function EditTaskModal({ onUpdateTask, currentUserId }: EditTaskModalProps) {
	const { isEditTaskModalOpen, editingTask, closeEditTaskModal } = useModalStore();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (formData: TaskFormValues) => {

		if (!editingTask) {
			console.error("Form is not valid or no task to update");
			return;
		}

		try {
			setIsSubmitting(true);
			const updateData = {
				id: editingTask.id,
				...formData,
			};
			await onUpdateTask(updateData);
			closeEditTaskModal();
		} catch (error) {
			console.error("Failed to update task:", error);
		} finally {
			setIsSubmitting(false);
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
			onClose={(closeEditTaskModal)}
			showActions={false}
			title="Update Task"
		>
			<TaskForm
				initialData={getInitialData()}
				onSubmit={handleSubmit}
				currentUserId={currentUserId}
				isSubmitting={isSubmitting}
				onClose={closeEditTaskModal}
			/>
		</ModalBase>
	);
}
