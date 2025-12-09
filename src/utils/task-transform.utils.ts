import type { TaskCreateInput, TaskFormValues, TaskUpdateInput } from "../schemas/task.schema";
import type { Task } from "../types/types";
import { formatDateForInput, parseDateFromInput } from "./date.utils";

export const transformFormToCreateData = (
	formData: TaskFormValues,
	authorId: string
): TaskCreateInput => {
	const assignees = formData.assigneeIds || [];

	return {
		title: formData.title || "",
		description: formData.description,
		status: formData.status,
		priority: formData.priority,
		deadline: parseDateFromInput(formData.deadline),
		authorId,
		assigneeIds: assignees,
	};
};

export const transformFormToUpdateData = (formData: TaskFormValues): TaskUpdateInput => {
	const assigneeIds = formData.assigneeIds || [];

	return {
		title: formData.title || "",
		description: formData.description || null,
		status: formData.status || "pending",
		priority: formData.priority || "medium",
		deadline: parseDateFromInput(formData.deadline),
		assigneeIds: assigneeIds,
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
		title: task.title || "",
		description: task.description || "",
		status: task.status || "pending",
		priority: task.priority || "medium",
		deadline: formatDateForInput(task.deadline),
		assigneeIds,
	};
};
