import { useState, useRef } from "react";
import type { TaskFormValues } from "@/schemas/task.schema";
import { useModalStore } from "@/store/modal.store";
import { transformFormToCreateData } from "@/utils/task-transform.utils";
import TaskForm from "@components/task-form/TaskForm";
import ModalBase from "./ModalBase";
import { 
  Box, 
  Alert,
  Typography,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import { useBulkCreateTasks } from "@/hooks/useBulkCreateTasks";
import { CSVImportView } from "@components/task-form/CSVImportView";
import type { CSVImportViewRef } from "@components/task-form/task-form.utils";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvFileSelected, setCsvFileSelected] = useState(false);
  const csvImportRef = useRef<CSVImportViewRef>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const bulkCreateMutation = useBulkCreateTasks({
    onSuccess: () => {
      closeCreateTaskModal();
      setUseCSV(false);
      setCsvFileSelected(false);
    },
  });

  const handleSubmit = async (formValues: TaskFormValues): Promise<void> => {
    setIsSubmitting(true);
    try {
      const apiData = transformFormToCreateData(formValues, currentUserId);
      await onCreateTask(apiData);
      closeCreateTaskModal();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkCreate = async (tasks: any[]) => {
    await bulkCreateMutation.mutateAsync(tasks);
  };

  const handleCloseModal = () => {
    closeCreateTaskModal();
    setUseCSV(false);
    setIsSubmitting(false);
    setCsvFileSelected(false);
  };

  const handleCsvSubmit = async () => {
    if (!csvFileSelected) {
      const fileInput = document.getElementById('csv-upload-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
      return;
    }
    if (csvImportRef.current) {
      await csvImportRef.current.triggerUpload();
    }
  };

  return (
    <ModalBase
      open={isCreateTaskModalOpen}
      onClose={handleCloseModal}
      title={useCSV ? "Bulk Create from CSV" : "Create New Task"}
      showActions={true}
      primaryBtnText={useCSV ? "Upload CSV" : "Create Task"}
      secondaryBtnText="Cancel"
      onPrimaryAction={useCSV ? handleCsvSubmit : () => document.querySelector('form')?.requestSubmit()}
      onSecondaryAction={handleCloseModal}
      disablePrimary={useCSV ? bulkCreateMutation.isPending : isSubmitting}
      isLoading={isSubmitting || bulkCreateMutation.isPending}
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ mb: isMobile ? 2 : 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={useCSV}
                onChange={(e) => setUseCSV(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {useCSV ? (
                  <>
                    <CloudUploadIcon fontSize="small" />
                    <Typography variant="body1">
                      Bulk Create from CSV
                    </Typography>
                  </>
                ) : (
                  <>
                    <AddIcon fontSize="small" />
                    <Typography variant="body1">
                      Create Single Task
                    </Typography>
                  </>
                )}
              </Box>
            }
          />
        </Box>

        {useCSV ? (
          <CSVImportView
            ref={csvImportRef}
            currentUserId={currentUserId}
            onBulkCreate={handleBulkCreate}
            isLoading={bulkCreateMutation.isPending}
            onFileSelected={(hasFile) => setCsvFileSelected(hasFile)}
          />
        ) : (
          <TaskForm
            onSubmit={handleSubmit}
            currentUserId={currentUserId}
            isSubmitting={isSubmitting}
            showFormActions={false}
          />
        )}

        {bulkCreateMutation.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {bulkCreateMutation.error.message}
          </Alert>
        )}
      </Box>
    </ModalBase>
  );
}