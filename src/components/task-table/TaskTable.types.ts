import type { Task } from "@/types/types";

export interface BaseTaskTableProps {
  rows: Task[];
  totalCount: number;
  onAddTask: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
  loading?: boolean;
}

export interface PaginationProps {
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  currentPage?: number;
  pageSize?: number;
}

export interface SortProps {
  onSortChange?: (field: string, direction: 'asc' | 'desc') => void;
  currentSort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface FilterProps {
  onFilterChange?: (key: string, value: string) => void;
  currentFilters?: {
    status: string;
    priority: string;
  };
}

export interface TaskHeaderProps {
  totalCount: number;
  onAddTask: () => void;
}

export interface TaskControlsProps {
  currentSort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  currentFilters: {
    status: string;
    priority: string;
  };
  onSortChange?: (field: string, direction: 'asc' | 'desc') => void;
  onFilterChange?: (key: string, value: string) => void;
}

export interface TaskPaginationProps {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface TaskTableProps extends 
  BaseTaskTableProps, 
  PaginationProps, 
  SortProps, 
  FilterProps {}

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