import { apiClient } from "@/lib/api-client";
import type { Task, TaskPriority, TaskStatus } from "@/types/types";
import type {
	BulkCreateTaskData,
	BulkTaskResult,
	CreateTaskData,
	TaskFilters,
	TasksResponse,
	UpdateTaskData,
} from "./task-service.types";

export class TaskService {
	async createTask(taskData: CreateTaskData): Promise<Task> {
		const backendData = {
			title: taskData.title,
			description: taskData.description,
			status: taskData.status,
			priority: taskData.priority,
			deadline: taskData.deadline,
			authorId: taskData.authorId,
			assigneeIds: taskData.assigneeIds || [],
		};

		return apiClient.post<Task>("/tasks/new", backendData);
	}

	async bulkCreateTasks(tasks: CreateTaskData[]): Promise<BulkTaskResult> {
		const backendData: BulkCreateTaskData = { tasks };

		return apiClient.post<BulkTaskResult>("/tasks/bulk", backendData);
	}

	async getTasks(filters?: TaskFilters): Promise<TasksResponse> {
		return apiClient.get<TasksResponse>("/tasks", filters);
	}

	async getTaskById(id: string): Promise<Task> {
		return apiClient.get<Task>(`/tasks/${id}`);
	}

	async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
		const backendData = {
			title: taskData.title,
			description: taskData.description,
			status: taskData.status,
			priority: taskData.priority,
			deadline: taskData.deadline,
			assigneeIds: taskData.assigneeIds,
		};

		return apiClient.put<Task>(`/tasks/${id}`, backendData);
	}

	async deleteTask(id: string): Promise<void> {
		return apiClient.delete(`/tasks/${id}`);
	}

	async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
		return this.updateTask(id, { status });
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
