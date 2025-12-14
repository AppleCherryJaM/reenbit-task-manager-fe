import { Button, Stack, Typography, useTheme, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TaskTableStrings, type TaskHeaderProps } from "@components/task-table/TaskTable.types";

export function TaskHeader({ totalCount, onAddTask }: TaskHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack 
      direction={isMobile ? "column" : "row"} 
      justifyContent={isMobile ? "flex-start" : "space-between"} 
      alignItems={isMobile ? "stretch" : "center"} 
      spacing={isMobile ? 1 : 0}
      mb={isMobile ? 1.5 : 2}
    >
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        fontWeight={600}
        noWrap={isMobile}
      >
        {TaskTableStrings.TASKS_LABEL} ({totalCount})
      </Typography>

      <Button
        startIcon={<AddIcon />}
        onClick={onAddTask}
        variant="contained"
        sx={{ 
          textTransform: "none",
          alignSelf: isMobile ? 'flex-start' : 'auto',
          minWidth: isMobile ? 'auto' : 120,
          px: isMobile ? 1 : 1.5,
        }}
      >
        {TaskTableStrings.ADD_TASK_BUTTON}
      </Button>
    </Stack>
  );
}