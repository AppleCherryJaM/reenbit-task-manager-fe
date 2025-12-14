import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, FormControl, MenuItem, Select, Stack, useTheme, useMediaQuery } from "@mui/material";
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
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const hasActiveFilters = status !== "all" || priority !== "all";

	return (
		<Stack 
			direction={isMobile ? "column" : "row"} 
			spacing={isMobile ? 1 : 2} 
			alignItems={isMobile ? "stretch" : "center"}
			sx={{ width: '100%' }}
		>
			{/* Иконка фильтра — только на десктопе */}
			{!isMobile && (
				<FilterListIcon sx={{ color: "action.active", fontSize: 20, mt: 0.75 }} />
			)}

			{/* Селект статуса — всегда fullWidth на мобилках */}
			<FormControl size="small" fullWidth>
				<Select
					value={status}
					onChange={(e) => onStatusChange(e.target.value as TaskStatusFilter)}
					size="small"
					variant="outlined"
					fullWidth
					displayEmpty
					sx={{
						'& .MuiSelect-select': {
							fontSize: isMobile ? '0.8rem' : '0.875rem',
							padding: isMobile ? '6px 8px' : '8px 12px',
						},
						'& .MuiSvgIcon-root': {
							fontSize: isMobile ? '1rem' : '1.2rem',
						},
					}}
				>
					{STATUS_OPTIONS.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{/* Селект приоритета — всегда fullWidth на мобилках */}
			<FormControl size="small" fullWidth>
				<Select
					value={priority}
					onChange={(e) => onPriorityChange(e.target.value as TaskPriorityFilter)}
					size="small"
					variant="outlined"
					fullWidth
					displayEmpty
					sx={{
						'& .MuiSelect-select': {
							fontSize: isMobile ? '0.8rem' : '0.875rem',
							padding: isMobile ? '6px 8px' : '8px 12px',
						},
						'& .MuiSvgIcon-root': {
							fontSize: isMobile ? '1rem' : '1.2rem',
						},
					}}
				>
					{PRIORITY_OPTIONS.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{/* Кнопка "Clear" — компактная и только если есть активные фильтры */}
			{hasActiveFilters && (
				<Button
					size="small"
					variant="outlined"
					onClick={onClearFilters}
					startIcon={<ClearIcon />}
					sx={{ 
						height: 32,
						whiteSpace: 'nowrap',
						mt: isMobile ? 0 : 0,
						// На мобилках — компактнее
						...isMobile && {
							minWidth: 'auto',
							px: 0.5,
							py: 0.5,
							'& .MuiButton-startIcon': {
								marginRight: 0.25,
							},
						}
					}}
					fullWidth={isMobile}
				>
					{isMobile ? "×" : "Clear filters"}
				</Button>
			)}
		</Stack>
	);
}