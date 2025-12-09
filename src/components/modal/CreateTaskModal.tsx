import { useEffect } from "react";
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

	const [formData, setFormData] = useState<TaskFormValues | null>(null);
	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		if (!isCreateTaskModalOpen) {
			setFormData(null);
			setIsFormValid(false);
		}
	}, [isCreateTaskModalOpen]);

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
			const apiData = transformFormToCreateData(formData, currentUserId);
			await onCreateTask(apiData);
			closeCreateTaskModal();
		} catch (error) {
			console.error("Failed to create task:", error);
		}
	};

	const getInitialData = (): TaskFormValues => {
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
			open={isCreateTaskModalOpen}
			onClose={closeCreateTaskModal}
			onSubmit={handleSubmit}
			title="Создать новую задачу"
			primaryBtnText="Создать"
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
