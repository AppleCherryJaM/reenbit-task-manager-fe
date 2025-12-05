// services/user.service.ts
import { apiClient } from "../lib/api-client";
import type { User } from "../types/types";

export interface UpdateUserData {
	name?: string;
	email?: string;
	password?: string;
}

export interface UserFilters {
	role?: string;
	search?: string;
	page?: number;
	limit?: number;
}

export class UserService {
	async getProfile(): Promise<User> {
		return apiClient.get<User>("/users/profile");
	}

	async getAllUsers(filters?: UserFilters): Promise<User[]> {
		return apiClient.get<User[]>("/users", filters);
	}

	async getUserById(id: string): Promise<User> {
		return apiClient.get<User>(`/users/${id}`);
	}

	async getUserTasks(userId: string): Promise<any[]> {
		return apiClient.get<any[]>(`/users/${userId}/tasks`);
	}

	async updateUser(id: string, userData: UpdateUserData): Promise<User> {
		return apiClient.put<User>(`/users/${id}`, userData);
	}

	async deleteUser(id: string): Promise<void> {
		return apiClient.delete(`/users/${id}`);
	}

	async updateProfile(userData: UpdateUserData): Promise<User> {
		const profile = await this.getProfile();
		return this.updateUser(profile.id, userData);
	}

	async searchUsers(query: string): Promise<User[]> {
		return apiClient.get<User[]>("/users", { search: query });
	}
}

export const userService = new UserService();
