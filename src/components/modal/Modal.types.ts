import type { ReactNode } from "react";

export interface ModalBaseProps {
	open: boolean;
	title: string;
	children: ReactNode;
	primaryBtnText?: string;
	onClose: () => void;
	onSubmit?: () => void;
}

export interface AddTaskFormValues {
	title: string;
	priority: "Low" | "Medium" | "High";
	dueDate: string;
	tags: string;
	assignee: string;
}

export interface AddTaskModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (task: AddTaskFormValues) => void;
}
