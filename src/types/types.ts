export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type UserRole = "user" | "admin";

export interface User {
	id: string;
	email: string;
	name: string | null;
	role: UserRole;
	createdAt: Date;
}

export interface Task {
	id: string;
	title: string;
	description: string | null;
	status: TaskStatus;
	priority: TaskPriority;
	deadline: Date | null;
	createdAt: Date;
	updatedAt: Date;
	authorId: string;
	author: User;
	assignees: User[];
}
