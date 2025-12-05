import { getDefaultDeadline } from "@utils/date.utils";
import { useState } from "react";
import { type TaskFormValues, taskSchema } from "@/schemas/task.schema";

const defaultDeadline = 24;

export const useTaskForm = (initialData: Partial<TaskFormValues> = {}) => {
	const [form, setForm] = useState<TaskFormValues>({
		title: "",
		description: "",
		status: "pending",
		priority: "medium",
		deadline: getDefaultDeadline(defaultDeadline),
		assigneeIds: [],
		...initialData,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const updateField = <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));

		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const validateForm = (): boolean => {
		try {
			taskSchema.parse(form);
			setErrors({});
			return true;
		} catch (error: any) {
			const newErrors: Record<string, string> = {};
			error.errors.forEach((err: any) => {
				const path = err.path[0];
				newErrors[path] = err.message;
			});
			setErrors(newErrors);
			return false;
		}
	};

	const resetForm = () => {
		setForm({
			title: "",
			description: "",
			status: "pending",
			priority: "medium",
			deadline: getDefaultDeadline(24),
			assigneeIds: [],
		});
		setErrors({});
	};

	const setFormData = (data: Partial<TaskFormValues>) => {
		setForm((prev) => ({ ...prev, ...data }));
	};

	return {
		form,
		errors,
		updateField,
		validateForm,
		resetForm,
		setFormData,
	};
};
