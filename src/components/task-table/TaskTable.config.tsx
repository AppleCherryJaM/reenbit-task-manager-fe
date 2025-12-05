import { Avatar, Chip } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { PriorityColor, StatusColor } from "./TaskTable.types";

export const columns: GridColDef[] = [
	{
		field: "task",
		headerName: "Task",
		flex: 1,
		minWidth: 200,
	},
	{
		field: "priority",
		headerName: "Priority",
		flex: 1,
		minWidth: 130,
		renderCell: (params) => (
			<Chip
				label={params.value}
				color={PriorityColor[params.value as keyof typeof PriorityColor]}
				variant="outlined"
			/>
		),
	},
	{
		field: "status",
		headerName: "Status",
		flex: 1,
		minWidth: 150,
		renderCell: (params) => (
			<Chip
				label={params.value}
				color={StatusColor[params.value as keyof typeof StatusColor]}
				variant="outlined"
			/>
		),
	},
	{
		field: "deadline",
		headerName: "Deadline",
		flex: 1,
		minWidth: 120,
	},
	{
		field: "assignee",
		headerName: "Assignee",
		flex: 1,
		minWidth: 120,
		renderCell: (params) => (
			<Avatar sx={{ width: 28, height: 28, bgcolor: "grey.400", fontSize: 14 }}>
				{params.value?.slice(0, 1)}
			</Avatar>
		),
	},
	{
		field: "tag",
		headerName: "Tag",
		flex: 1,
		minWidth: 120,
		renderCell: (params) => <Chip label={params.value} size="small" />,
	},
];
