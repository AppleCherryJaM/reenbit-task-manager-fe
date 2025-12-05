import { apiClient } from "@/lib/api-client";
import type { Task, TaskPriority, TaskStatus } from "@/types/types";

export interface CreateTaskData {
	title: string;
	description?: string | null;
	status?: TaskStatus;
	priority?: TaskPriority;
	deadline?: string | null;
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
}

export class TaskService {
	async createTask(taskData: CreateTaskData): Promise<Task> {
		return apiClient.post<Task>("/tasks/new", taskData);
	}

	async getTasks(filters?: TaskFilters): Promise<Task[]> {
		return apiClient.get<Task[]>("/tasks", filters);
	}

	async getTaskById(id: string): Promise<Task> {
		return apiClient.get<Task>(`/tasks/${id}`);
	}

	async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
		return apiClient.put<Task>(`/tasks/${id}`, taskData);
	}

	async deleteTask(id: string): Promise<void> {
		return apiClient.delete(`/tasks/${id}`);
	}

	async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
		return this.updateTask(id, { status });
	}

	async updateTaskPriority(id: string, priority: TaskPriority): Promise<Task> {
		return this.updateTask(id, { priority });
	}

	async addAssignee(taskId: string, userId: string): Promise<Task> {
		const task = await this.getTaskById(taskId);
		const newAssigneeIds = [...task.assignees.map((u) => u.id), userId];

		return this.updateTask(taskId, { assigneeIds: newAssigneeIds });
	}

	async removeAssignee(taskId: string, userId: string): Promise<Task> {
		const task = await this.getTaskById(taskId);
		const newAssigneeIds = task.assignees.map((u) => u.id).filter((id) => id !== userId);

		return this.updateTask(taskId, { assigneeIds: newAssigneeIds });
	}

	async searchTasks(query: string, filters?: TaskFilters): Promise<Task[]> {
		return apiClient.get<Task[]>("/tasks", {
			...filters,
			search: query,
		});
	}

	async getOverdueTasks(): Promise<Task[]> {
		const today = new Date().toISOString();
		return apiClient.get<Task[]>("/tasks", {
			toDate: today,
			status: ["pending", "in_progress"],
		});
	}

	async getTasksByPriority(priority: TaskPriority): Promise<Task[]> {
		return apiClient.get<Task[]>("/tasks", { priority });
	}

	async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
		return apiClient.get<Task[]>("/tasks", { status });
	}
}

export const taskService = new TaskService();
