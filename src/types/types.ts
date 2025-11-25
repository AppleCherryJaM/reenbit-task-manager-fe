export type Task = {
	id: number;
	task: string;
	status: "To Do" | "In Progress" | "Done";
	author: string;
	assignee: string;
	tag: string;
	priority: string;
	deadline: string;
};

