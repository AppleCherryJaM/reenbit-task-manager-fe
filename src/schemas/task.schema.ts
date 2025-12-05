import { z } from "zod";

const validateFutureDateTime = (datetime: string | null | undefined): boolean => {
	if (!datetime) {
		return true;
	}

	const selectedDateTime = new Date(datetime);
	const now = new Date();

	return selectedDateTime.getTime() >= now.getTime();
};

export const taskSchema = z.object({
	title: z
		.string()
		.min(1, "Task name is required")
		.max(100, "Task name should be less than 100 symbols"),
	description: z
		.string()
		.max(500, "Task description should be less than 500 symbols")
		.optional()
		.nullable(),
	status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
	priority: z.enum(["low", "medium", "high"]).default("low"),
	deadline: z.string().optional().nullable().refine(validateFutureDateTime, {
		message: "Deadline cannot be in the past",
	}),
	assigneeIds: z.array(z.string()).optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export type TaskCreateInput = {
	title: string;
	description?: string | null;
	status: "pending" | "in_progress" | "completed";
	priority: "low" | "medium" | "high";
	deadline?: Date | null;
	authorId: string;
	assignees: { connect: { id: string }[] };
};

export type TaskUpdateInput = Partial<Omit<TaskCreateInput, "authorId">>;
