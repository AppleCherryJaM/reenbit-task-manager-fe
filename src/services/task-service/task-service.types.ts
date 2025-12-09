import type { TaskStatus, Task } from "@/types/types";

export interface CreateTaskData {
	title: string;
	description?: string | null;
	status?: TaskStatus;
	priority?: TaskPriority;
	deadline?: string | null;
	authorId?: string;
	assigneeIds: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface TaskFilters {
	status?: TaskStatus;
	priority?: TaskPriority;
	assigneeId?: string;
	authorId?: string;
	search?: string;
	page?: number;
	limit?: number;
	fromDate?: string;
	toDate?: string;
	sortBy?: string;
  sortDirection?: 'asc' | 'desc'; 
}

export interface TasksResponse {
	tasks: Task[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}