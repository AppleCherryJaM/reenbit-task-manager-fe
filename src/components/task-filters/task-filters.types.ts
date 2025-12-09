export interface TaskFiltersProps {
	status: string;
	priority: string;
	onStatusChange: (value: string) => void;
	onPriorityChange: (value: string) => void;
	onClearFilters: () => void;
}

export enum TaskStatus {
	PENDING = "pending",
	IN_PROGRESS = "in_progress",
	COMPLETED = "completed",
}

export enum TaskPriority {
	HIGH = "high",
	MEDIUM = "medium",
	LOW = "low",
}

export type TaskStatusFilter = TaskStatus | "all";
export type TaskPriorityFilter = TaskPriority | "all";
