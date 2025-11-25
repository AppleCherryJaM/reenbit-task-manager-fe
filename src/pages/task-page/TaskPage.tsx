import { Box } from "@mui/material";
import AppHeader from "../../components/header/AppHeader";
import TaskTable from "../../components/task-table/TaskTable";

export default function TasksPage() {
	return (
		<Box sx={{ bgcolor: "#F7F8FA", minHeight: "100vh" }}>
			<AppHeader />
			<Box sx={{ p: 4 }}>
				<TaskTable />
			</Box>
		</Box>
	);
}
