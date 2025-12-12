import { useTaskForm } from "@hooks/useTaskForm";
import { useUsers } from "@hooks/useUsers";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { FormMultiSelect } from "@/components/forms/FormMultiSelect";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextField } from "@/components/forms/FormTextField";
import type { TaskFormValues } from "@/schemas/task.schema";
import {
	FORM_HELPER_TEXT,
	LOADING_USERS_PLACEHOLDER,
	PriorityOptions,
	StatusOptions,
	type TaskFormProps,
	TaskFormStrings,
} from "./task-form.utils";

const STATUS_OPTIONS = Object.values(StatusOptions).map((value) => ({
	value,
	label: value.charAt(0).toUpperCase() + value.slice(1).replace("_", " "),
}));

const PRIORITY_OPTIONS = Object.values(PriorityOptions).map((value) => ({
	value: value.toLowerCase(),
	label: value,
}));

export default function TaskForm({
	onSubmit,
	initialData = {},
	currentUserId,
	isSubmitting = false,
	onClose,
}: TaskFormProps) {
	const { form, errors, updateField, validateForm, resetForm } = useTaskForm(initialData);
	const { users, isLoading: usersLoading } = useUsers();

	const handleChange = (field: keyof TaskFormValues, value: any): void => {
		updateField(field, value);
	};

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();

		const isValid = validateForm();

		if (!isValid) {
			return;
		}

		try {
			await onSubmit(form);
			resetForm();
		} catch (error) {
			console.error("Form submission error:", error);
		}
	};

	const handleCancel = (): void => {
		if (onClose) {
			onClose();
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
		>
			<FormTextField
				field="title"
				value={form.title || ""}
				onChange={handleChange}
				label={TaskFormStrings.TITLE_LABEL}
				error={errors.title}
				helperText="Enter task title"
				required
				disabled={isSubmitting}
			/>

			<FormTextField
				field="description"
				value={form.description || ""}
				onChange={handleChange}
				label={TaskFormStrings.DESCRIPTION_LABEL}
				error={errors.description}
				multiline
				rows={3}
				disabled={isSubmitting}
			/>

			<Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
				<FormSelect
					field="status"
					value={form.status || ""}
					onChange={handleChange}
					options={STATUS_OPTIONS}
					label={TaskFormStrings.STATUS_LABEL}
					error={errors.status}
					disabled={isSubmitting}
				/>

				<FormSelect
					field="priority"
					value={form.priority || ""}
					onChange={handleChange}
					options={PRIORITY_OPTIONS}
					label={TaskFormStrings.PRIORITY_LABEL}
					error={errors.priority}
					disabled={isSubmitting}
				/>
			</Box>

			<FormTextField
				field="deadline"
				value={form.deadline || ""}
				onChange={handleChange}
				label={TaskFormStrings.DEADLINE_LABEL}
				type="datetime-local"
				InputLabelProps={{ shrink: true }}
				error={errors.deadline}
				helperText="Set deadline for task (optional)"
				disabled={isSubmitting}
			/>

			<FormMultiSelect
				field="assigneeIds"
				value={form.assigneeIds || []}
				onChange={handleChange}
				label={TaskFormStrings.ASSIGNEES_LABEL}
				users={users}
				isLoading={usersLoading}
				currentUserId={currentUserId}
				error={errors.assigneeIds}
				helperText={usersLoading ? LOADING_USERS_PLACEHOLDER : FORM_HELPER_TEXT}
				disabled={isSubmitting}
			/>

			{!usersLoading && users.filter((u) => u.id !== currentUserId).length > 0 && (
				<Alert severity="info" sx={{ mt: 1 }}>
					<Typography variant="body2">
						Available users for assignment: {users.filter((u) => u.id !== currentUserId).length}
					</Typography>
				</Alert>
			)}

			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-end",
					gap: 2,
					mt: 3,
					pt: 2,
					borderTop: 1,
					borderColor: "divider",
				}}
			>
				{onClose && (
					<Button type="button" onClick={handleCancel} variant="outlined" disabled={isSubmitting}>
						Cancel
					</Button>
				)}
				<Button
					type="submit"
					variant="contained"
					disabled={isSubmitting}
					startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
				>
					{isSubmitting ? "Submitting..." : "Submit"}
				</Button>
			</Box>
		</Box>
	);
}
