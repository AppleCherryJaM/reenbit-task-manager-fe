import { useTaskForm } from "@hooks/useTaskForm";
import { useUsers } from "@hooks/useUsers";
import {
	Alert,
	Box,
	Button,
	Checkbox,
	Chip,
	CircularProgress,
	FormControl,
	FormHelperText,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import type { TaskFormValues } from "@/schemas/task.schema";
import type { User } from "@/types/types";
import {
	FORM_HELPER_TEXT,
	LOADING_USERS_PLACEHOLDER,
	MenuProps,
	PriorityOptions,
	StatusOptions,
	type TaskFormProps,
	TaskFormStrings,
} from "./task-form.types";

export default function TaskForm({
	initialData = {},
	onSubmit,
	currentUserId,
	onClose,
}: TaskFormProps) {
	const { form, errors, updateField, validateForm, resetForm } = useTaskForm(initialData);
	const { users, isLoading: usersLoading } = useUsers();

	const handleChange = <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => {
		updateField(field, value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			onSubmit?.(form);
		}
	};

	const handleCancel = () => {
		resetForm();
		onClose?.();
	};

	const availableUsers = users.filter((user: User) => user.id !== currentUserId);

	const renderUsersSelectContent = () => {
		if (usersLoading) {
			return (
				<MenuItem disabled>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<CircularProgress size={20} />
						<Typography>Loading users...</Typography>
					</Box>
				</MenuItem>
			);
		}

		if (availableUsers.length === 0) {
			return (
				<MenuItem disabled>
					<Typography variant="body2" color="textSecondary">
						No other users available
					</Typography>
				</MenuItem>
			);
		}

		return availableUsers.map((user: User) => (
			<MenuItem key={user.id} value={user.id}>
				<Checkbox checked={form.assigneeIds?.includes(user.id) ?? false} />
				<ListItemText primary={user.name || user.email} secondary={user.name ? user.email : ""} />
			</MenuItem>
		));
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
		>
			<TextField
				label={TaskFormStrings.TITLE_LABEL}
				value={form.title || ""}
				onChange={(e) => handleChange("title", e.target.value)}
				error={!!errors.title}
				helperText={errors.title || " "}
				fullWidth
				variant="outlined"
				required
			/>

			<TextField
				label={TaskFormStrings.DESCRIPTION_LABEL}
				value={form.description || ""}
				onChange={(e) => handleChange("description", e.target.value)}
				error={!!errors.description}
				helperText={errors.description || " "}
				multiline
				rows={3}
				fullWidth
				variant="outlined"
			/>

			<Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
				<FormControl fullWidth error={!!errors.status}>
					<InputLabel>{TaskFormStrings.STATUS_LABEL}</InputLabel>
					<Select
						value={form.status || ""}
						label={TaskFormStrings.STATUS_LABEL}
						onChange={(e) => handleChange("status", e.target.value)}
					>
						<MenuItem value="pending">{StatusOptions.PENDING}</MenuItem>
						<MenuItem value="in_progress">{StatusOptions.IN_PROGRESS}</MenuItem>
						<MenuItem value="completed">{StatusOptions.COMPLETED}</MenuItem>
					</Select>
					{errors.status && <FormHelperText>{errors.status}</FormHelperText>}
				</FormControl>

				<FormControl fullWidth error={!!errors.priority}>
					<InputLabel>{TaskFormStrings.PRIORITY_LABEL}</InputLabel>
					<Select
						value={form.priority || ""}
						label={TaskFormStrings.PRIORITY_LABEL}
						onChange={(e) => handleChange("priority", e.target.value)}
					>
						<MenuItem value="low">{PriorityOptions.LOW}</MenuItem>
						<MenuItem value="medium">{PriorityOptions.MEDIUM}</MenuItem>
						<MenuItem value="high">{PriorityOptions.HIGH}</MenuItem>
					</Select>
					{errors.priority && <FormHelperText>{errors.priority}</FormHelperText>}
				</FormControl>
			</Box>

			<FormControl fullWidth error={!!errors.deadline}>
				<TextField
					label={TaskFormStrings.DEADLINE_LABEL}
					type="datetime-local"
					value={form.deadline || ""}
					onChange={(e) => handleChange("deadline", e.target.value)}
					InputLabelProps={{ shrink: true }}
					helperText={errors.deadline || "Set deadline for task (optional)"}
					variant="outlined"
				/>
			</FormControl>

			<FormControl fullWidth error={!!errors.assigneeIds}>
				<InputLabel>{TaskFormStrings.ASSIGNEES_LABEL}</InputLabel>
				<Select
					multiple
					value={form.assigneeIds || []}
					onChange={(e) => {
						const value = e.target.value;
						const assigneeIds = Array.isArray(value) ? value : [value];
						handleChange("assigneeIds", assigneeIds);
					}}
					input={<OutlinedInput label={TaskFormStrings.ASSIGNEES_LABEL} />}
					renderValue={(selected: string[]) => {
						return (
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
								{selected.map((userId: string) => {
									const user = users.find((u: User) => u.id === userId);
									return (
										<Chip
											key={userId}
											label={user ? user.name || user.email : `User ${userId.substring(0, 8)}...`}
											size="small"
											onDelete={(e) => {
												e.stopPropagation();
												const newAssigneeIds = (form.assigneeIds || []).filter(
													(id) => id !== userId
												);
												handleChange("assigneeIds", newAssigneeIds);
											}}
											deleteIcon={<span>×</span>}
										/>
									);
								})}
							</Box>
						);
					}}
					MenuProps={MenuProps}
					disabled={usersLoading}
				>
					{renderUsersSelectContent()}
				</Select>
				{errors.assigneeIds ? (
					<FormHelperText error>{errors.assigneeIds}</FormHelperText>
				) : (
					<FormHelperText>
						{usersLoading
							? "Loading users..."
							: availableUsers.length > 0
								? "Select one or more assignees (optional)"
								: "No other users available"}
					</FormHelperText>
				)}
			</FormControl>

			{!usersLoading && availableUsers.length > 0 && (
				<Alert severity="info" sx={{ mt: 1 }}>
					<Typography variant="body2">
						Available users for assignment: {availableUsers.length}
					</Typography>
				</Alert>
			)}
			
			<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
				<Button onClick={handleCancel} color="inherit">
					Cancel
				</Button>
				<Button
					type="submit"
					variant="contained"
					disabled={!form.title || form.title.trim() === ""}
				>
					{initialData.title ? "Save Changes" : "Create Task"}
				</Button>
			</Box>
		</Box>
	);
}
