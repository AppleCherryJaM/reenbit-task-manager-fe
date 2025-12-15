import type { TaskPriority, TaskStatus } from "@/types/types";

export const mapFilterStatusToApi = (status: string): TaskStatus | undefined => {
	if (status === "all") {
		return undefined;
	}

	return status as TaskStatus;
};

export const mapFilterPriorityToApi = (priority: string): TaskPriority | undefined => {
	if (priority === "all") {
		return undefined;
	}

	return priority as TaskPriority;
};
