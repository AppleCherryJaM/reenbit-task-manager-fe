import TaskForm from "@components/task-form/TaskForm";
import { useEffect } from "react";
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

	useEffect(() => {
		if (!isEditTaskModalOpen) {
			// TO DO: add a reset if needed.
		}
	}, [isEditTaskModalOpen]);

	const handleSubmit = async (data: TaskFormValues): Promise<void> => {
		if (!editingTask) {
			return;
		}

		try {
			const updateData = {
				id: editingTask.id,
				...data,
			};
			await onUpdateTask(updateData);
			closeEditTaskModal();
		} catch (error) {
			console.error("Failed to update task:", error);
		}
	};

	const getInitialData = (): Partial<TaskFormValues> => {
		if (!editingTask) {
			return {};
		}

		return transformTaskToFormValues(editingTask);
	};

	if (!editingTask) {
		return null;
	}

	return (
		<ModalBase
			open={isEditTaskModalOpen}
			onClose={closeEditTaskModal}
			onSubmit={() => {}}
			title="Update task"
			primaryBtnText="Save"
			disableSubmit={false}
		>
			<TaskForm
				onSubmit={handleSubmit}
				initialData={getInitialData()}
				currentUserId={currentUserId}
				onClose={closeEditTaskModal}
			/>
		</ModalBase>
	);
}
