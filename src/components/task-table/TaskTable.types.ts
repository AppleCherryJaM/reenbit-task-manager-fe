import type { Task } from "@/types/types";

export enum PriorityColor {
	High = "error",
	Medium = "warning",
	Low = "success",
}

export enum StatusColor {
	"To Do" = "info",
	"In Progress" = "warning",
	"Done" = "success",
} 

export interface TaskTableProps {
  rows: Task[];
  totalCount: number;
  onAddTask: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
  loading?: boolean;
  
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  
  currentPage?: number;
  pageSize?: number;
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
