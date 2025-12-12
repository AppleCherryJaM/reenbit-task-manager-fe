import { Delete, Edit } from "@mui/icons-material";
import { Avatar, Chip, IconButton } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import type { Task } from "@/types/types";
import { PriorityColor, StatusColor, StatusLabels, TaskTableStrings } from "./TaskTable.types";

export const columns: (
	onEdit?: (task: Task) => void,
	onDelete?: (id: string) => void
) => GridColDef[] = (onEdit, onDelete) => [
	{
		field: "title",
		headerName: TaskTableStrings.TITLE_LABEL,
		flex: 1,
		minWidth: 200,
	},
	{
		field: "description",
		headerName: TaskTableStrings.DESCRIPTION_LABEL,
		flex: 1,
		minWidth: 250,
		valueFormatter: (value) => value || "-",
	},
	{
		field: "priority",
		headerName: TaskTableStrings.PRIORITY_LABEL,
		flex: 1,
		minWidth: 130,
		renderCell: ({ row }) => {
			const priority = row?.priority;
			if (!priority) {
				return "-";
			}

			return (
				<Chip
					label={priority}
					color={PriorityColor[priority as keyof typeof PriorityColor] || "default"}
					variant="outlined"
					size="small"
				/>
			);
		},
	},
	{
		field: "status",
		headerName: TaskTableStrings.STATUS_LABEL,
		flex: 1,
		minWidth: 150,
		renderCell: (params) => {
			const status = params.value as string;

			if (!status) {
				return TaskTableStrings.NONE;
			}

			const statusText = StatusLabels[status as keyof typeof StatusLabels] || status;

			return (
				<Chip
					label={statusText}
					color={StatusColor[status as keyof typeof StatusColor] || "default"}
					variant="outlined"
					size="small"
				/>
			);
		},
	},
	{
		field: "deadline",
		headerName: TaskTableStrings.DEADLINE_LABEL,
		flex: 1,
		minWidth: 120,
		valueFormatter: (value) => {
			if (!value) {
				return TaskTableStrings.NONE;
			}

			return new Date(value).toLocaleDateString();
		},
	},
	{
		field: "assignees",
		headerName: TaskTableStrings.ASSIGNEES_LABEL,
		flex: 1,
		minWidth: 120,
		valueFormatter: (assignees: Array<{ name?: string; email: string }> | null) => {
			if (!assignees || assignees.length === 0) {
				return TaskTableStrings.NONE;
			}

			return assignees.map((user) => user.name || user.email).join(", ");
		},
		renderCell: (params) => {
			const assignees = params.row.assignees || [];

			if (assignees.length === 0) {
				return TaskTableStrings.NONE;
			}

			return (
				<Avatar
					sx={{
						width: 28,
						height: 28,
						bgcolor: "grey.400",
						fontSize: 14,
					}}
				>
					{assignees[0]?.name?.charAt(0) || assignees[0]?.email?.charAt(0) || "U"}
				</Avatar>
			);
		},
	},
	{
		field: "actions",
		headerName: "Actions",
		flex: 0.8,
		minWidth: 120,
		sortable: false,
		filterable: false,
		renderCell: ({ row }) => (
			<div style={{ display: "flex", gap: "8px" }}>
				<IconButton
					size="small"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onEdit?.(row as Task);
					}}
					color="primary"
					aria-label="edit"
				>
					<Edit fontSize="small" />
				</IconButton>

				<IconButton
					size="small"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						if (row?.id) {
							onDelete?.(row.id);
						}
					}}
					color="error"
					aria-label="delete"
				>
					<Delete fontSize="small" />
				</IconButton>
			</div>
		),
	},
];
