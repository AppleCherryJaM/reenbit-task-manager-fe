// services/user.service.ts
import { apiClient } from "../lib/api-client";
import type { User } from "../types/types";

export interface UpdateUserData {
	name?: string;
	email?: string;
	password?: string;
}

export class UserService {
	async getCurrentUser(): Promise<User> {
		return apiClient.get<User>("/users/profile");
	}

	async getAllUsers(): Promise<User[]> {
		return apiClient.get<User[]>("/users");
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
		const profile = await this.getCurrentUser();
		return this.updateUser(profile.id, userData);
	}

	async searchUsers(query: string): Promise<User[]> {
		return apiClient.get<User[]>("/users", { search: query });
	}
}

export const userService = new UserService();
