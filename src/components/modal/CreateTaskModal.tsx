import { useState } from "react";
import type { TaskFormValues } from "@/schemas/task.schema";
import { useModalStore } from "@/store/modal.store";
import { transformFormToCreateData } from "@/utils/task-transform.utils";
import TaskForm from "@components/task-form/TaskForm";
import ModalBase from "./ModalBase";
import { ImportCSVSection } from "@/components/task-form/ImportCSVSection";
import { 
  Box, 
  Alert, 
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
  Button,
  Stack,
  Paper
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";

interface CreateTaskModalProps {
  onCreateTask: (taskData: any) => Promise<void>;
  currentUserId: string;
}

export default function CreateTaskModal({ 
  onCreateTask, 
  currentUserId 
}: CreateTaskModalProps) {
  const { isCreateTaskModalOpen, closeCreateTaskModal } = useModalStore();
  const [useCSV, setUseCSV] = useState(false);
  const [importedTask, setImportedTask] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formValues: TaskFormValues): Promise<void> => {
    setIsSubmitting(true);
    try {
      const apiData = transformFormToCreateData(formValues, currentUserId);
      await onCreateTask(apiData);
      closeCreateTaskModal();
      resetForm();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTasksImported = (tasks: any[]) => {
    
		if (tasks.length === 0) {
      setError("No tasks found in CSV file");
      return;
    }

    const firstTask = tasks[0];
    const taskWithAuthor = {
      ...firstTask,
      authorId: currentUserId,
    };
    
    setImportedTask(taskWithAuthor);
    setError(null);
  };

  const handleCreateFromCSV = async () => {
    
		if (!importedTask) {return;}
    
    setIsSubmitting(true);
    setError(null);

    try {
      await onCreateTask(importedTask);
      closeCreateTaskModal();
      resetForm();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create task from CSV");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setImportedTask(null);
    setUseCSV(false);
    setError(null);
  };

  const handleCSVSwitch = () => {
    const newUseCSV = !useCSV;
    setUseCSV(newUseCSV);

    if (!newUseCSV) {
      setImportedTask(null);
    }
		
    setError(null);
  };

  const getTitle = () => useCSV ? "Create Task from CSV" : "Create New Task";
  
  const getPrimaryButtonText = () => {
    if (useCSV) {
      if (isSubmitting) {return "Creating...";}
      return importedTask ? "Create Task from CSV" : "Upload CSV";
    }
    return "Create Task";
  };

  const handlePrimaryAction = () => {
    if (useCSV) {
      if (importedTask) {
        handleCreateFromCSV();
      } else {
        document.getElementById('csv-upload')?.click();
      }
    } else {
      document.querySelector('form')?.requestSubmit();
    }
  };

  const isPrimaryDisabled = () => {
    if (useCSV) {
      return isSubmitting || (!importedTask && !error);
    }
    return isSubmitting;
  };

  return (
    <ModalBase
			open={isCreateTaskModalOpen}
			onClose={() => {
				closeCreateTaskModal();
				resetForm();
			}}
			title={getTitle()}
			showActions={useCSV} 
			primaryBtnText={getPrimaryButtonText()}
			onPrimaryAction={useCSV ? handlePrimaryAction : undefined}
			disablePrimary={useCSV ? isPrimaryDisabled() : false}
		>
      <Box sx={{ width: "100%" }}>
  
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={useCSV}
                onChange={handleCSVSwitch}
                color="primary"
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                {useCSV ? (
                  <>
                    <CloudUploadIcon fontSize="small" />
                    <Typography>Import from CSV</Typography>
                  </>
                ) : (
                  <>
                    <AddIcon fontSize="small" />
                    <Typography>Create Manually</Typography>
                  </>
                )}
              </Stack>
            }
          />
        </Box>

        {useCSV ? (
          <>
            {!importedTask ? (
              <ImportCSVSection onTasksImported={handleTasksImported} />
            ) : (
              <Box>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <DescriptionIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={500}>
                      Task from CSV
                    </Typography>
                  </Stack>
                  
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <strong>Title:</strong> {importedTask.title}
                    </Typography>
                    {importedTask.description && (
                      <Typography variant="body2">
                        <strong>Description:</strong> {importedTask.description}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      <strong>Priority:</strong> {importedTask.priority}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {importedTask.status}
                    </Typography>
                    {importedTask.deadline && (
                      <Typography variant="body2">
                        <strong>Deadline:</strong> {importedTask.deadline}
                      </Typography>
                    )}
                  </Stack>
                  
                  <Button
                    size="small"
                    onClick={() => setImportedTask(null)}
                    sx={{ mt: 2 }}
                  >
                    Upload different file
                  </Button>
                </Paper>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </>
        ) : (
          <TaskForm
            onSubmit={handleSubmit}
            currentUserId={currentUserId}
            onClose={() => {
              closeCreateTaskModal();
              resetForm();
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </Box>
    </ModalBase>
  );
}