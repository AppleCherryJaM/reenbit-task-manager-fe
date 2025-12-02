import type { TaskCreateInput, TaskFormValues } from "../schemas/task.schema";
import type { Task } from "../types/types";
import { formatDateForInput, parseDateFromInput } from "./date.utils";

export const transformFormToCreateData = (
	formData: TaskFormValues,
	authorId: string
): TaskCreateInput => {
	const assignees = formData.assigneeIds || [];
	return {
		title: formData.title,
		description: formData.description,
		status: formData.status,
		priority: formData.priority,
		deadline: parseDateFromInput(formData.deadline),
		authorId,
		assignees: {
			connect: assignees.map((id) => ({ id })),
		},
	};
};

export const transformTaskToFormValues = (task: Task | null | undefined): TaskFormValues => {
	if (!task || Object.keys(task).length === 0 || typeof task !== "object") {
		return {
			title: "",
			description: "",
			status: "pending",
			priority: "medium",
			deadline: null,
			assigneeIds: [],
		};
	}

	const assigneeIds = task.assignees ? task.assignees.map((user) => user.id) : [];

	return {
		title: task.title,
		description: task.description,
		status: task.status,
		priority: task.priority,
		deadline: formatDateForInput(task.deadline),
		assigneeIds,
	};
};
