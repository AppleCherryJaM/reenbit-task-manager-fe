import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Snackbar } from "@mui/material";
import AppHeader from "@components/header/AppHeader";
import TaskTable from "@components/task-table/TaskTable";
import CreateTaskModal from "@/components/modal/CreateTaskModal";
import EditTaskModal from "@/components/modal/EditTaskModal";
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from "@/hooks/api/use-tasks";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useModalStore } from "@/store/modal.store";
import { TaskPageStrings, TaskPriority, TaskStatus } from "./task-page.types";
import type { Task} from "@/types/types";
import { mapFilterPriorityToApi, mapFilterStatusToApi } from "./task-page.helpers";


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

  const [sortState, setSortState] = useState<{
    field: string;
    direction: 'asc' | 'desc';
  }>({
    field: 'createdAt',
    direction: 'desc'
  });

  const [filterState, setFilterState] = useState<{
    status: string;
    priority: string;
  }>({
    status: 'all',
    priority: 'all'
  });

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const currentUserId = getCurrentUserId();

	const handlePageChange = useCallback((page: number) => {
    setPaginationState(prev => ({ ...prev, page }));
  }, []);

	const { 
    data: response, 
    isLoading, 
    error, 
    refetch 
  } = useTasks({
    page: paginationState.page + 1,
    limit: paginationState.pageSize,
    sortBy: sortState.field,
    sortDirection: sortState.direction,
    status: mapFilterStatusToApi(filterState.status),
    priority: mapFilterPriorityToApi(filterState.priority),
  });

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPaginationState({ page: 0, pageSize });
  }, []);

  const handleSortChange = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSortState({ field, direction });
    refetch();
  }, [refetch]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterState(prev => ({ ...prev, [key]: value }));
    refetch();
  }, [refetch]);

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
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
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
				<TaskTable
					rows={[]}
					onAddTask={openCreateTaskModal}
					onEditTask={handleEditTask}
					onDeleteTask={handleDeleteTask}
					loading={false}
				/>
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

        onSortChange={handleSortChange}
        currentSort={sortState}
        
        onFilterChange={handleFilterChange}
        currentFilters={filterState}
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
