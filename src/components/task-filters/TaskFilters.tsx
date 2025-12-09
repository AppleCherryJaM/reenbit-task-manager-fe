import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, FormControl, MenuItem, Select, Stack } from "@mui/material";
import {
	type TaskFiltersProps,
	TaskPriority,
	type TaskPriorityFilter,
	TaskStatus,
	type TaskStatusFilter,
} from "./task-filters.types";

const STATUS_OPTIONS: { value: TaskStatusFilter; label: string }[] = [
	{ value: "all", label: "All Status" },
	{ value: TaskStatus.PENDING, label: "Pending" },
	{ value: TaskStatus.IN_PROGRESS, label: "In Progress" },
	{ value: TaskStatus.COMPLETED, label: "Completed" },
];

const PRIORITY_OPTIONS: { value: TaskPriorityFilter; label: string }[] = [
	{ value: "all", label: "All Priority" },
	{ value: TaskPriority.HIGH, label: "High" },
	{ value: TaskPriority.MEDIUM, label: "Medium" },
	{ value: TaskPriority.LOW, label: "Low" },
];

export function TaskFilters({
	status,
	priority,
	onStatusChange,
	onPriorityChange,
	onClearFilters,
}: TaskFiltersProps) {
	const hasActiveFilters = status !== "all" || priority !== "all";

	return (
		<Stack direction="row" spacing={1} alignItems="center">
			<FilterListIcon sx={{ color: "action.active", fontSize: 20 }} />

			<FormControl size="small" sx={{ minWidth: 110 }}>
				<Select
					value={status}
					onChange={(e) => onStatusChange(e.target.value)}
					size="small"
					variant="outlined"
				>
					{STATUS_OPTIONS.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl size="small" sx={{ minWidth: 110 }}>
				<Select
					value={priority}
					onChange={(e) => onPriorityChange(e.target.value)}
					size="small"
					variant="outlined"
				>
					{PRIORITY_OPTIONS.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{hasActiveFilters && (
				<Button
					size="small"
					variant="outlined"
					onClick={onClearFilters}
					startIcon={<ClearIcon />}
					sx={{ height: 32 }}
				>
					Clear
				</Button>
			)}
		</Stack>
	);
}
