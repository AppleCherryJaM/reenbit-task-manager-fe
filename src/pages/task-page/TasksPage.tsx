import { useCallback, useState } from "react";
import { 
  Alert, 
  Box, 
  Button, 
  CircularProgress, 
  Snackbar 
} from "@mui/material";
import AppHeader from "@components/header/AppHeader";
import TaskTable from "@components/task-table/TaskTable";
import CreateTaskModal from "@/components/modal/CreateTaskModal";
import EditTaskModal from "@/components/modal/EditTaskModal";
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from "@/hooks/api/use-tasks";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useModalStore } from "@/store/modal.store";
import type { Task } from "@/types/types";
import { TaskPageStrings } from "./task-page.types";
import { useNavigate } from "react-router-dom";

export default function TasksPage() {
  const navigate = useNavigate();
  const { openCreateTaskModal, openEditTaskModal } = useModalStore();
  const { getCurrentUserId, logout: logoutFromStore } = useAuthStore();
	

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
	const [paginationState, setPaginationState] = useState({
    page: 0,
    pageSize: 10,
  });

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const currentUserId = getCurrentUserId();

	const handlePageChange = useCallback((page: number) => {
    setPaginationState(prev => ({ ...prev, page }));
  }, []);

	const handlePageSizeChange = useCallback((pageSize: number) => {
    setPaginationState({ page: 0, pageSize });
  }, []);

	const { 
    data: response, 
    isLoading, 
    error, 
    refetch 
  } = useTasks({
    page: paginationState.page + 1,
    limit: paginationState.pageSize,
  });

  const handleCreateTask = async (taskData: any) => {
    try {

      if (!currentUserId) {throw new Error("User ID required");}
      
      await createTaskMutation.mutateAsync({
        ...taskData,
        authorId: currentUserId,
      });
      showNotification(TaskPageStrings.CREATE_TASK_SUCCESS, "success");
    } catch (_error) {
      showNotification(TaskPageStrings.CREATE_TASK_ERROR, "error");
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    try {
      const { id, ...data } = taskData;
      await updateTaskMutation.mutateAsync({ id, data });
      showNotification(TaskPageStrings.UPDATE_TASK_SUCCESS, "success");
    } catch (_error) {
      showNotification(TaskPageStrings.UPDATE_TASK_ERROR, "error");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm(TaskPageStrings.DELETE_TASK_CONFIRMATION)) {
      try {
        await deleteTaskMutation.mutateAsync(id);
        showNotification(TaskPageStrings.DELETE_TASK_SUCCESS, "success");
      } catch (_error) {
        showNotification(TaskPageStrings.DELETE_TASK_ERROR, "error");
      }
    }
  };

  const handleEditTask = (task: Task) => {
    openEditTaskModal(task);
  };

  const showNotification = (message: string, severity: "success" | "error") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleRetry = () => refetch();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logoutFromStore();
      navigate("/auth");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <AppHeader onLogout={handleLogout} />
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              {TaskPageStrings.REPEAT}
            </Button>
          }
        >
          {TaskPageStrings.LOAD_TASKS_ERROR} {(error as Error).message}
        </Alert>
      </Box>
    );
  }

  const tasks = response?.tasks || [];
  const pagination = response?.pagination;

  return (
    <Box sx={{ p: 3 }}>
      <AppHeader onLogout={handleLogout} />
      
      <TaskTable
        rows={tasks}
        totalCount={pagination?.total || 0}
        onAddTask={openCreateTaskModal}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        loading={deleteTaskMutation.isPending}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        currentPage={paginationState.page}
        pageSize={paginationState.pageSize}
      />

      <CreateTaskModal 
        onCreateTask={handleCreateTask} 
        currentUserId={currentUserId || ""} 
      />

      <EditTaskModal 
        onUpdateTask={handleUpdateTask} 
        currentUserId={currentUserId || ""} 
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        message={notification.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
}
