import type { Task } from "../types/types";

export const initialTasks: Task[] = [
	{
		id: 1,
		task: "Design homepage",
		priority: "High",
		status: "To Do",
		deadline: "Apr 11",
		assignee: "UI",
		tag: "UI",
		author: "Test Author",
	},
	{
		id: 2,
		task: "Implement authentication",
		priority: "Medium",
		status: "In Progress",
		deadline: "Apr 14",
		assignee: "BE",
		tag: "Backend",
		author: "Test Author",
	},
	{
		id: 3,
		task: "Set up database",
		priority: "Low",
		status: "Done",
		deadline: "Apr 18",
		assignee: "DB",
		tag: "Database",
		author: "Test Author",
	},
	{
		id: 4,
		task: "Write documentation",
		priority: "Medium",
		status: "Done",
		deadline: "Apr 20",
		assignee: "Docs",
		tag: "Docs",
		author: "Test Author",
	},
];
