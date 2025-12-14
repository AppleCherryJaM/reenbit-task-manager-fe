import TaskForm from "@components/task-form/TaskForm";
import { useState, useRef } from "react";
import type { TaskFormValues } from "@/schemas/task.schema";
import { useModalStore } from "@/store/modal.store";
import { transformTaskToFormValues } from "@/utils/task-transform.utils";
import ModalBase from "./ModalBase";
import { useToast } from "@/providers/ToastProvider";

interface EditTaskModalProps {
	onUpdateTask: (taskData: any) => Promise<void>;
	currentUserId: string;
}

export default function EditTaskModal({ onUpdateTask, currentUserId }: EditTaskModalProps) {
	const { isEditTaskModalOpen, editingTask, closeEditTaskModal } = useModalStore();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { showToast } = useToast();

	const handleSubmit = async (formData: TaskFormValues) => {

		if (!editingTask) {
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
			showToast("Task updated successfully", "success");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to update task";
      showToast(message, "error");
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
