import type { TaskFormValues } from "@/schemas/task.schema";

export interface TaskFormProps {
	initialData?: Partial<TaskFormValues>;
	onFormChange?: (data: TaskFormValues, isValid: boolean) => void;
	currentUserId: string;
}

export const ITEM_HEIGHT = 48;

export const ITEM_PADDING_TOP = 8;

export const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

export const LOADING_USERS_PLACEHOLDER = "Loading users...";

export const FORM_HELPER_TEXT = "Select at least one assignee";

export enum TaskFormStrings {
	TITLE_LABEL = "Task Title",
	DESCRIPTION_LABEL = "Description",
	STATUS_LABEL = "Status",
	PRIORITY_LABEL = "Priority",
	DEADLINE_LABEL = "Deadline",
	ASSIGNEES_LABEL = "Assignees",
}

export enum StatusOptions {
	PENDING = "pending",
	IN_PROGRESS = "in_progress",
	COMPLETED = "completed",
}

export enum PriorityOptions {
	LOW = "Low",
	MEDIUM = "Medium",
	HIGH = "High",
}
