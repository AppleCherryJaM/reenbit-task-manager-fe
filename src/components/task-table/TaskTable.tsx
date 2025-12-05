import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { columns } from "./TaskTable.config";
import type { TaskTableProps } from "./TaskTable.types";

export default function TaskTable({
	rows,
	onAddTask,
	onEditTask,
	onDeleteTask,
	loading,
}: TaskTableProps) {
	const tableColumns = columns(onEditTask, onDeleteTask);

	return (
		<Box sx={{ height: 600, width: "100%" }}>
			<Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
				<Button variant="contained" onClick={onAddTask}>
					Add New Task
				</Button>
			</Box>

			<DataGrid
				rows={rows}
				columns={tableColumns}
				loading={loading}
				pageSizeOptions={[5, 10, 25]}
				initialState={{
					pagination: {
						paginationModel: { pageSize: 10 },
					},
				}}
				getRowId={(row) => {
					if (!row.id) {
						return `temp-${Math.random()}`;
					}
					return row.id;
				}}
				sx={{
					"& .MuiDataGrid-cell:focus": {
						outline: "none",
					},
				}}
			/>
		</Box>
	);
}
