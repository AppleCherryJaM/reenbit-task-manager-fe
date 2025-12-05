import { AccessTime, ArrowBack, Delete, Edit, Person } from "@mui/icons-material";
import {
	Alert,
	Avatar,
	Box,
	Button,
	Chip,
	CircularProgress,
	Container,
	Divider,
	Paper,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditTaskModal from "@/components/modal/EditTaskModal";
import { PriorityColor, StatusColor, StatusLabels } from "@/components/task-table/TaskTable.types";
import { useDeleteTask, useUpdateTask } from "@/hooks/api/use-tasks";
import { taskService } from "@/services/task.service";
import { useModalStore } from "@/store/modal.store";
import type { Task } from "@/types/types";

export default function TaskDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { openEditTaskModal } = useModalStore();

	const [task, setTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const updateTaskMutation = useUpdateTask();
	const deleteTaskMutation = useDeleteTask();

	const fetchTask = useCallback(async (taskId: string) => {
		try {
			setLoading(true);
			const data = await taskService.getTaskById(taskId);
			setTask(data);
		} catch (err) {
			console.error("Error fetching task:", err);
			setError("Failed to load task");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (id) {
			fetchTask(id);
		}
	}, [id, fetchTask]);

	const handleEdit = () => {
		if (task) {
			openEditTaskModal(task);
		}
	};

	const handleDelete = async () => {
		if (task && window.confirm("Are you sure you want to delete this task?")) {
			try {
				await deleteTaskMutation.mutateAsync(task.id);
				navigate("/tasks");
			} catch (err) {
				console.error("Error deleting task:", err);
				alert("Failed to delete task");
			}
		}
	};

	const handleUpdateTask = async (taskData: any) => {
		try {
			const { id, ...updateData } = taskData;
			await updateTaskMutation.mutateAsync({
				id: id,
				data: updateData,
			});
			// После обновления перезагружаем задачу
			fetchTask(id);
		} catch (error) {
			console.error("Update task error:", error);
			throw error;
		}
	};

	const formatDate = (dateInput: string | Date | null | undefined): string => {
		if (!dateInput) {
			return "No deadline";
		}

		let date: Date;

		if (dateInput instanceof Date) {
			date = dateInput;
		} else if (typeof dateInput === "string") {
			date = new Date(dateInput);
		} else {
			return "No deadline";
		}

		// Проверяем что дата валидна
		if (isNaN(date.getTime())) {
			return "Invalid date";
		}

		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<Container maxWidth="md">
				<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}

	if (error || !task) {
		return (
			<Container maxWidth="md">
				<Box sx={{ p: 3 }}>
					<Alert severity="error" sx={{ mb: 2 }}>
						{error || "Task not found"}
					</Alert>
					<Button startIcon={<ArrowBack />} onClick={() => navigate("/tasks")}>
						Back to Tasks
					</Button>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth="md" sx={{ py: 3 }}>
			{/* Кнопка назад */}
			<Button startIcon={<ArrowBack />} onClick={() => navigate("/tasks")} sx={{ mb: 3 }}>
				Back to Tasks
			</Button>

			{/* Заголовок и кнопки действий */}
			<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						mb: 3,
						flexWrap: "wrap",
						gap: 2,
					}}
				>
					<Typography variant="h4" component="h1">
						{task.title}
					</Typography>

					<Box sx={{ display: "flex", gap: 1 }}>
						<Button startIcon={<Edit />} onClick={handleEdit} variant="contained">
							Edit
						</Button>
						<Button
							startIcon={<Delete />}
							onClick={handleDelete}
							variant="outlined"
							color="error"
							disabled={deleteTaskMutation.isPending}
						>
							{deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
						</Button>
					</Box>
				</Box>

				{/* Статус и приоритет */}
				<Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
					<Chip
						label={StatusLabels[task.status as keyof typeof StatusLabels] || task.status}
						color={StatusColor[task.status as keyof typeof StatusColor] || "default"}
						size="medium"
					/>
					<Chip
						label={`Priority: ${task.priority}`}
						color={PriorityColor[task.priority as keyof typeof PriorityColor] || "default"}
						variant="outlined"
					/>
				</Box>

				{/* Дедлайн */}
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
					<AccessTime fontSize="small" />
					<Typography>
						<strong>Deadline:</strong> {formatDate(task.deadline)}
					</Typography>
				</Box>

				<Divider sx={{ my: 3 }} />

				{/* Описание */}
				<Box sx={{ mb: 4 }}>
					<Typography variant="h6" gutterBottom>
						Description
					</Typography>
					<Paper variant="outlined" sx={{ p: 2 }}>
						<Typography sx={{ whiteSpace: "pre-wrap" }}>
							{task.description || "No description provided"}
						</Typography>
					</Paper>
				</Box>

				{/* Исполнители */}
				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h6"
						gutterBottom
						sx={{ display: "flex", alignItems: "center", gap: 1 }}
					>
						<Person fontSize="small" />
						Assignees ({task.assignees.length})
					</Typography>
					{task.assignees.length > 0 ? (
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
							{task.assignees.map((user) => (
								<Box key={user.id} sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
									<Avatar sx={{ width: 40, height: 40 }}>
										{user.name?.charAt(0) || user.email.charAt(0)}
									</Avatar>
									<Box>
										<Typography>{user.name || "No name"}</Typography>
										<Typography variant="body2" color="text.secondary">
											{user.email}
										</Typography>
									</Box>
								</Box>
							))}
						</Box>
					) : (
						<Typography color="text.secondary">No assignees</Typography>
					)}
				</Box>

				{/* Автор */}
				<Box>
					<Typography variant="h6" gutterBottom>
						Created By
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<Avatar sx={{ width: 48, height: 48 }}>
							{task.author?.name?.charAt(0) || task.author?.email.charAt(0) || "U"}
						</Avatar>
						<Box>
							<Typography variant="body1">{task.author?.name || task.author?.email}</Typography>
							<Typography variant="body2" color="text.secondary">
								{task.author?.email}
							</Typography>
						</Box>
					</Box>
				</Box>

				{/* Дополнительная информация */}
				<Divider sx={{ my: 3 }} />
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						color: "text.secondary",
						fontSize: "0.875rem",
					}}
				>
					<Typography variant="body2">Created: {formatDate(task.createdAt)}</Typography>
					<Typography variant="body2">ID: {task.id.substring(0, 8)}...</Typography>
				</Box>
			</Paper>

			{/* Модалка редактирования */}
			<EditTaskModal onUpdateTask={handleUpdateTask} currentUserId={task.authorId} />
		</Container>
	);
}
