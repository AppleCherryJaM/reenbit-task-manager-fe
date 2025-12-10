import type { Task } from "@/types/types";

export const PriorityColor = {
	High: "error",
	Medium: "warning",
	Low: "success",
} as const;

export const StatusColor = {
	"To Do": "info",
	"In Progress": "warning",
	Done: "success",
} as const;

export interface TaskTableProps {
	rows: Task[];
	onAddTask: () => void;
	onEditTask?: (task: Task) => void;
	onDeleteTask?: (id: string) => void;
	loading?: boolean;
}

export enum TaskTableStrings {
	TASKS_LABEL = "Tasks",
	ADD_TASK_BUTTON = "Add Task",
	ASSIGNEES_LABEL = "Assignees",
	DEADLINE_LABEL = "Deadline",
	PRIORITY_LABEL = "Priority",
	STATUS_LABEL = "Status",
	DESCRIPTION_LABEL = "Description",
	TITLE_LABEL = "Title",
	NONE = "-",
}

export enum StatusLabels {
	PENDING = "Pending",
	IN_PROGRESS = "In Progress",
	COMPLETED = "Completes",
}

export type PriorityType = keyof typeof PriorityColor;

export type StatusType = keyof typeof StatusColor;
