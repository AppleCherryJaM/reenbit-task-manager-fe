import { MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import type { AddTaskFormValues, AddTaskModalProps } from "./Modal.types";
import ModalBase from "./ModalBase";

export default function AddTaskModal({ open, onClose, onSubmit }: AddTaskModalProps) {
	const [form, setForm] = useState<AddTaskFormValues>({
		title: "",
		priority: "low",
		dueDate: "",
		tags: "",
		assignee: "",
	});

	const handleChange = (field: keyof AddTaskFormValues, value: string) =>
		setForm({ ...form, [field]: value });

	const handleSubmit = () => {
		onSubmit(form);
		onClose();
		setForm({
			title: "",
			priority: "low",
			dueDate: "",
			tags: "",
			assignee: "",
		});
	};

	return (
		<ModalBase
			open={open}
			onClose={onClose}
			onSubmit={handleSubmit}
			title="Add new task"
			primaryBtnText="Add task"
		>
			<TextField
				label="Task title"
				value={form.title}
				onChange={(e) => handleChange("title", e.target.value)}
				fullWidth
			/>

			<TextField
				label="Priority"
				select
				value={form.priority}
				onChange={(e) => handleChange("priority", e.target.value)}
			>
				<MenuItem value="Low">Low</MenuItem>
				<MenuItem value="Medium">Medium</MenuItem>
				<MenuItem value="High">High</MenuItem>
			</TextField>

			<TextField
				label="Due date"
				type="date"
				value={form.dueDate}
				onChange={(e) => handleChange("dueDate", e.target.value)}
				InputLabelProps={{ shrink: true }}
			/>

			<TextField
				label="Tags (comma separated)"
				value={form.tags}
				onChange={(e) => handleChange("tags", e.target.value)}
			/>

			<TextField
				label="Assignee"
				value={form.assignee}
				onChange={(e) => handleChange("assignee", e.target.value)}
			/>
		</ModalBase>
	);
}
