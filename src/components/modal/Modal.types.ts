import type { ReactNode } from "react";

export interface ModalBaseProps {
	open: boolean;
	title: string;
	children: ReactNode;
	primaryBtnText?: string;
	onClose: () => void;
	onSubmit?: () => void;
	disableSubmit?: boolean;
}

export interface AddTaskFormValues {
	title: string;
	priority: TaskPriority;
	dueDate: string;
	tags: string;
	assignee: string[];
}

export interface AddTaskModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (task: AddTaskFormValues) => void;
}

export interface TaskFormData {
	title: string;
	priority: TaskPriority;
	deadline: string | null;
	tags: string;
	assignee: string[];
}
