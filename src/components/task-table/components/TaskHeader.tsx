import { Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TaskTableStrings, type TaskHeaderProps } from "@components/task-table/TaskTable.types";

export function TaskHeader({ totalCount, onAddTask }: TaskHeaderProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5" fontWeight={600}>
        {TaskTableStrings.TASKS_LABEL} ({totalCount})
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
  );
}