import type { TaskFormValues } from "@/schemas/task.schema";
import { useModalStore } from "@/store/modal.store";
import { transformFormToCreateData } from "@/utils/task-transform.utils";
import TaskForm from "../task-form/TaskForm";
import ModalBase from "./ModalBase";

interface CreateTaskModalProps {
	onCreateTask: (taskData: any) => Promise<void>;
	currentUserId: string;
}

export default function CreateTaskModal({ onCreateTask, currentUserId }: CreateTaskModalProps) {
	const { isCreateTaskModalOpen, closeCreateTaskModal } = useModalStore();

	const handleSubmit = async (formValues: TaskFormValues): Promise<void> => {
		try {
			const apiData = transformFormToCreateData(formValues, currentUserId);
			await onCreateTask(apiData);
			closeCreateTaskModal();
		} catch (error) {
			console.error("Failed to create task:", error);
		}
	};

	return (
		<ModalBase
			open={isCreateTaskModalOpen}
			onClose={closeCreateTaskModal}
			onSubmit={() => {}}
			title="Create New Task"
			primaryBtnText="Create"
			disableSubmit={false}
		>
			<TaskForm
				onSubmit={handleSubmit}
				currentUserId={currentUserId}
				onClose={closeCreateTaskModal}
			/>
		</ModalBase>
	);
}
