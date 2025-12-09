export enum TaskPageStrings {
	CREATE_TASK_SUCCESS = "Task created successfully",
	UPDATE_TASK_SUCCESS = "Task updated successfully",
	DELETE_TASK_SUCCESS = "Task deleted successfully",
	CREATE_TASK_ERROR = "Error while creating task",
	UPDATE_TASK_ERROR = "Error while updating task",
	DELETE_TASK_ERROR = "Error while deleting task",
	DELETE_TASK_CONFIRMATION = "Are you sure you want to delete this task?",
	REPEAT = "Repeat",
	LOAD_TASKS_ERROR = "Error loading tasks:",
}

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum TaskPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export type TaskStatusFilter = TaskStatus | "all";
export type TaskPriorityFilter = TaskPriority | "all";
