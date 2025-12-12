import { getDefaultDeadline } from "@utils/date.utils";
import { useCallback, useState } from "react";
import type { TaskFormValues } from "@/schemas/task.schema";

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

	const [errors, setErrors] = useState<Partial<Record<keyof TaskFormValues, string>>>({});

	const updateField = useCallback(
		<K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => {
			setForm((prev) => ({ ...prev, [field]: value }));
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		},
		[]
	);

	const validateForm = useCallback((): boolean => {
		const newErrors: Partial<Record<keyof TaskFormValues, string>> = {};
		// let isValid = true;

		if (!form.title?.trim()) {
			newErrors.title = "Title is required";
			// isValid = false;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [form]);

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
