import { Avatar, Chip } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import type { Task } from "@/types/types";
import { PriorityColor, StatusColor, StatusLabels, TaskTableStrings } from "./TaskTable.types";

const safeValue = <T,>(value: T | null | undefined, fallback: string = "-"): T | string => {
	return value ?? fallback;
};

export const columns: GridColDef<Task>[] = [
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
		valueFormatter: (value: string | null) => safeValue(value),
	},
	{
		field: "priority",
		headerName: TaskTableStrings.PRIORITY_LABEL,
		flex: 1,
		minWidth: 130,
		renderCell: (params) => (
			<Chip
				label={params.value as string}
				color={PriorityColor[params.value as keyof typeof PriorityColor] || "default"}
				variant="outlined"
				size="small"
			/>
		),
	},
	{
		field: "status",
		headerName: TaskTableStrings.STATUS_LABEL,
		flex: 1,
		minWidth: 150,
		renderCell: (params) => {
			const status = params.value as string;
			if (!status) {
				return "-";
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
		valueFormatter: (value: string | null) => {
			if (!value) {
				return "-";
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
				return "-";
			}
			return assignees.map((user) => user.name || user.email).join(", ");
		},
		renderCell: (params) => {
			const assignees = params.row.assignees || [];
			if (assignees.length === 0) {
				return "-";
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
];
