import {
	Box,
	Checkbox,
	Chip,
	FormControl,
	FormHelperText,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	TextField,
} from "@mui/material";
import { useTaskForm } from "../../hooks/useTaskForm";
import { useUsers } from "../../hooks/useUsers";
import type { TaskFormValues } from "../../schemas/task.schema";
import type { User } from "../../types/types";

interface TaskFormProps {
	initialData?: Partial<TaskFormValues>;
	onFormChange?: (data: TaskFormValues, isValid: boolean) => void;
	currentUserId: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

export default function TaskForm({ initialData = {}, onFormChange, currentUserId }: TaskFormProps) {
	const { form, errors, updateField, validateForm } = useTaskForm(initialData);
	const { users, isLoading } = useUsers();

	const handleChange = <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => {
		updateField(field, value);

		setTimeout(() => {
			const isValid = validateForm();
			const updatedForm = { ...form, [field]: value };
			onFormChange?.(updatedForm, isValid);
		}, 0);
	};

	const availableUsers = users.filter((user: User) => user.id !== currentUserId);

	const getUserDisplayName = (user: User): string => {
		return user.name || user.email;
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
			<TextField
				label="Название задачи *"
				value={form.title}
				onChange={(e) => handleChange("title", e.target.value)}
				error={!!errors.title}
				helperText={errors.title || " "}
				fullWidth
				variant="outlined"
			/>

			<TextField
				label="Описание"
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
					<InputLabel>Статус</InputLabel>
					<Select
						value={form.status}
						label="Статус"
						onChange={(e) => handleChange("status", e.target.value)}
					>
						<MenuItem value="pending">Ожидает</MenuItem>
						<MenuItem value="in_progress">В работе</MenuItem>
						<MenuItem value="completed">Завершена</MenuItem>
					</Select>
					{errors.status && <FormHelperText>{errors.status}</FormHelperText>}
				</FormControl>

				<FormControl fullWidth error={!!errors.priority}>
					<InputLabel>Приоритет</InputLabel>
					<Select
						value={form.priority}
						label="Приоритет"
						onChange={(e) => handleChange("priority", e.target.value)}
					>
						<MenuItem value="Low">Низкий</MenuItem>
						<MenuItem value="Medium">Средний</MenuItem>
						<MenuItem value="High">Высокий</MenuItem>
					</Select>
					{errors.priority && <FormHelperText>{errors.priority}</FormHelperText>}
				</FormControl>
			</Box>

			<FormControl fullWidth error={!!errors.deadline}>
				<TextField
					label="Deadline"
					type="datetime-local"
					value={form.deadline || ""}
					onChange={(e) => handleChange("deadline", e.target.value)}
					InputLabelProps={{ shrink: true }}
					helperText={errors.deadline || "Set deadline for task"}
					variant="outlined"
				/>
			</FormControl>

			<FormControl fullWidth error={!!errors.assigneeIds}>
				<InputLabel>Исполнители *</InputLabel>
				<Select
					multiple
					value={form.assigneeIds}
					onChange={(e) => handleChange("assigneeIds", e.target.value as string[])}
					input={<OutlinedInput label="Исполнители" />}
					renderValue={(selected: string[]) => (
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
							{selected.map((userId: string) => {
								const user = users.find((u: User) => u.id === userId);
								return (
									<Chip
										key={userId}
										label={user ? getUserDisplayName(user) : "Unknown"}
										size="small"
									/>
								);
							})}
						</Box>
					)}
					MenuProps={MenuProps}
					disabled={isLoading}
				>
					{isLoading ? (
						<MenuItem disabled>Загрузка пользователей...</MenuItem>
					) : (
						availableUsers.map((user: User) => (
							<MenuItem key={user.id} value={user.id}>
								<Checkbox checked={form.assigneeIds?.includes(user.id) ?? false} />
								<ListItemText
									primary={getUserDisplayName(user)}
									secondary={user.name ? user.email : ""}
								/>
							</MenuItem>
						))
					)}
				</Select>
				{errors.assigneeIds && <FormHelperText error>{errors.assigneeIds}</FormHelperText>}
				{!errors.assigneeIds && !isLoading && (
					<FormHelperText>Выберите хотя бы одного исполнителя</FormHelperText>
				)}
			</FormControl>
		</Box>
	);
}
