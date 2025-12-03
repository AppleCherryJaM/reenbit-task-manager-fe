import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { columns } from "./TaskTable.config";
import { type TaskTableProps, TaskTableStrings } from "./TaskTable.types";

export default function TaskTable({
	rows,
	onAddTask,
	onEditTask,
	onDeleteTask,
	loading = false,
}: TaskTableProps) {
	const enhancedColumns = columns;

	return (
		<Box sx={{ bgcolor: "#fff", p: 3, borderRadius: 3, boxShadow: 1 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
				<Typography variant="h5" fontWeight={600}>
					{TaskTableStrings.TASKS_LABEL} ({rows.length})
				</Typography>

				<Button
					startIcon={<AddIcon />}
					onClick={onAddTask}
					variant="contained"
					sx={{ textTransform: "none" }}
				>
					{TaskTableStrings.ADD_TASK_BUTTON}
				</Button>
			</Stack>

			<Box sx={{ height: 480 }}>
				<DataGrid
					rows={rows}
					columns={enhancedColumns}
					disableRowSelectionOnClick
					loading={loading}
					sx={{
						border: "none",
						"& .MuiDataGrid-columnHeaders": {
							backgroundColor: "#F3F4F6",
							fontWeight: 600,
						},
					}}
				/>
			</Box>
		</Box>
	);
}
