import AddIcon from "@mui/icons-material/Add";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import {
	Avatar,
	Box,
	Button,
	Chip,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useState } from "react";

type Task = {
	id: number;
	task: string;
	// priority: "High" | "Medium" | "Low";
	status: "To Do" | "In Progress" | "Done";
	// deadline: string;
	author: string;
	assignee: string;
	tag: string;
};

const initialTasks: Task[] = [
	{
		id: 1,
		task: "Design homepage",
		status: "To Do",
		author: "Test Author",
		assignee: "UI",
		tag: "UI",
	},
	{
		id: 2,
		task: "Implement authentication",
		status: "In Progress",
		author: "Test Author",
		assignee: "BE",
		tag: "Backend",
	},
	{
		id: 3,
		task: "Set up database",
		status: "Done",
		author: "Test Author",
		assignee: "DB",
		tag: "Database",
	},
	{
		id: 4,
		task: "Write documentation",
		status: "Done",
		author: "Test Author",
		assignee: "Docs",
		tag: "Docs",
	},
];

const priorityColor = {
	High: "error",
	Medium: "warning",
	Low: "success",
} as const;

const statusColor = {
	"To Do": "info",
	"In Progress": "warning",
	Done: "success",
} as const;

export default function TaskTable() {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);

	const addTask = () => {
		setTasks([
			...tasks,
			{
				id: Date.now(),
				task: "New task",
				// priority: "Medium",
				status: "To Do",
				author: "-",
				// deadline: "-",
				assignee: "-",
				tag: "-",
			},
		]);
	};

	return (
		<Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
			<Stack direction="row" justifyContent="space-between" mb={3}>
				<Typography variant="h5" fontWeight={600}>
					Task
				</Typography>
				<Button
					variant="contained"
					startIcon={<FilterAltOutlinedIcon />}
					sx={{
						bgcolor: "#E9EBEF",
						color: "#333",
						boxShadow: "none",
						":hover": { bgcolor: "#DDE0E3" },
					}}
				>
					Filter
				</Button>
			</Stack>

			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Task</TableCell>
							{/* <TableCell>Priority</TableCell> */}
							<TableCell>Status</TableCell>
							<TableCell>Author</TableCell>
							<TableCell>Assignee</TableCell>
							<TableCell>Tags</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{tasks.map((t) => (
							<TableRow key={t.id} hover>
								<TableCell>{t.task}</TableCell>
								{/* <TableCell>
                  <Chip label={t.priority} color={priorityColor[t.priority]} variant="outlined" />
									<Chip variant="outlined" />
                </TableCell> */}
								<TableCell>
									<Chip label={t.status} color={statusColor[t.status]} variant="outlined" />
								</TableCell>
								{/* <TableCell>{t.deadline}</TableCell> */}

								{/* Author */}
								<TableCell>
									<Avatar sx={{ width: 28, height: 28, bgcolor: "grey.400", fontSize: 14 }}>
										{t.assignee.slice(0, 1)}
									</Avatar>
								</TableCell>
								<TableCell>
									<Avatar sx={{ width: 28, height: 28, bgcolor: "grey.400", fontSize: 14 }}>
										{t.assignee.slice(0, 1)}
									</Avatar>
								</TableCell>
								<TableCell>
									<Chip label={t.tag} size="small" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Button startIcon={<AddIcon />} onClick={addTask} sx={{ mt: 2, textTransform: "none" }}>
				Add task
			</Button>
		</Paper>
	);
}
