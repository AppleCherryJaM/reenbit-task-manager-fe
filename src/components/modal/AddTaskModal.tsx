import { useState } from "react";
import { TextField, MenuItem } from "@mui/material";

import ModalBase from "./ModalBase";
import type { AddTaskModalProps, AddTaskFormValues } from "./Modal.types";

export default function AddTaskModal({ open, onClose, onSubmit }: AddTaskModalProps) {
  const [form, setForm] = useState<AddTaskFormValues>({
    title: "",
    priority: "Low",
    dueDate: "",
    tags: "",
    assignee: ""
  });

  const handleChange = (
    field: keyof AddTaskFormValues,
    value: string
  ) => setForm({ ...form, [field]: value });

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
    setForm({
      title: "",
      priority: "Low",
      dueDate: "",
      tags: "",
      assignee: ""
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
