import { useTaskForm } from "@hooks/useTaskForm";
import { useUsers } from "@hooks/useUsers";
import { Alert, Box, Button, CircularProgress, Typography, useTheme, useMediaQuery } from "@mui/material";
import { FormMultiSelect } from "@/components/forms/FormMultiSelect";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextField } from "@/components/forms/FormTextField";
import type { TaskFormValues } from "@/schemas/task.schema";
import {
  FORM_HELPER_TEXT,
  LOADING_USERS_PLACEHOLDER,
  PriorityOptions,
  StatusOptions,
  type TaskFormProps,
  TaskFormStrings,
} from "./task-form.utils";

const STATUS_OPTIONS = Object.values(StatusOptions).map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1).replace("_", " "),
}));

const PRIORITY_OPTIONS = Object.values(PriorityOptions).map((value) => ({
  value: value.toLowerCase(),
  label: value,
}));

interface ExtendedTaskFormProps extends TaskFormProps {
  showFormActions?: boolean;
}

export default function TaskForm({
  onSubmit,
  initialData = {},
  currentUserId,
  isSubmitting = false,
  onClose,
  showFormActions = true,
}: ExtendedTaskFormProps) {
  const { form, errors, updateField, validateForm, resetForm } = useTaskForm(initialData);
  const { users, isLoading: usersLoading } = useUsers();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (field: keyof TaskFormValues, value: any): void => {
    updateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const isValid = validateForm();
    
    if (!isValid) { return; }

    try {
      await onSubmit(form);
      resetForm();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleCancel = (): void => {
    if (onClose) { onClose(); }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: isMobile ? 2 : 3, 
        pt: isMobile ? 0.5 : 1 
      }}
    >
      <FormTextField
        field="title"
        value={form.title || ""}
        onChange={handleChange}
        label={TaskFormStrings.TITLE_LABEL}
        error={errors.title}
        helperText="Enter task title"
        required
        disabled={isSubmitting}
        fullWidth
      />

      <FormTextField
        field="description"
        value={form.description || ""}
        onChange={handleChange}
        label={TaskFormStrings.DESCRIPTION_LABEL}
        error={errors.description}
        multiline
        rows={isMobile ? 4 : 3}
        disabled={isSubmitting}
        fullWidth
      />

      <Box sx={{ 
        display: "flex", 
        gap: 2, 
        flexDirection: "column" 
      }}>
        <FormSelect
          field="status"
          value={form.status || ""}
          onChange={handleChange}
          options={STATUS_OPTIONS}
          label={TaskFormStrings.STATUS_LABEL}
          error={errors.status}
          disabled={isSubmitting}
        />

        <FormSelect
          field="priority"
          value={form.priority || ""}
          onChange={handleChange}
          options={PRIORITY_OPTIONS}
          label={TaskFormStrings.PRIORITY_LABEL}
          error={errors.priority}
          disabled={isSubmitting}
        />
      </Box>

      <FormTextField
        field="deadline"
        value={form.deadline || ""}
        onChange={handleChange}
        label={TaskFormStrings.DEADLINE_LABEL}
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
        error={errors.deadline}
        helperText="Set deadline for task (optional)"
        disabled={isSubmitting}
        fullWidth
      />

      <FormMultiSelect
        field="assigneeIds"
        value={form.assigneeIds || []}
        onChange={handleChange}
        label={TaskFormStrings.ASSIGNEES_LABEL}
        users={users}
        isLoading={usersLoading}
        currentUserId={currentUserId}
        error={errors.assigneeIds}
        helperText={usersLoading ? LOADING_USERS_PLACEHOLDER : FORM_HELPER_TEXT}
        disabled={isSubmitting}
      />

      {!usersLoading && users.filter((u) => u.id !== currentUserId).length > 0 && (
        <Alert severity="info" sx={{ mt: 1, fontSize: isMobile ? "0.85rem" : "0.875rem" }}>
          <Typography variant="body2">
            Available users for assignment: {users.filter((u) => u.id !== currentUserId).length}
          </Typography>
        </Alert>
      )}

      {showFormActions && (
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "flex-end",
            gap: isMobile ? 1 : 2,
            mt: isMobile ? 2 : 3,
            pt: isMobile ? 1 : 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          {onClose && (
            <Button 
              type="button" 
              onClick={handleCancel} 
              variant="outlined" 
              disabled={isSubmitting}
              fullWidth={isMobile}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            fullWidth={isMobile}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      )}
    </Box>
  );
}