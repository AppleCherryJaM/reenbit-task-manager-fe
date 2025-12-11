import { useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
	const location = useLocation();

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

	useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const statusFromUrl = searchParams.get('status') || 'all';
    const priorityFromUrl = searchParams.get('priority') || 'all';
    const pageFromUrl = parseInt(searchParams.get('page') || '0');
    const sortFieldFromUrl = searchParams.get('sortField') || 'createdAt';
    const sortDirectionFromUrl = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';

    setFilterState({
      status: statusFromUrl,
      priority: priorityFromUrl
    });
    
    setPaginationState({
      page: pageFromUrl,
      pageSize: 10
    });
    
    setSortState({
      field: sortFieldFromUrl,
      direction: sortDirectionFromUrl
    });
  }, [location.search])

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

	const updateUrl = useCallback((filters: any, pagination: any, sort: any) => {
    const searchParams = new URLSearchParams();

    if (filters.status !== 'all') {
      searchParams.set('status', filters.status);
    }
    
    if (filters.priority !== 'all') {
      searchParams.set('priority', filters.priority);
    }
    
    if (pagination.page > 0) {
      searchParams.set('page', pagination.page.toString());
    }
    
    if (sort.field !== 'createdAt') {
      searchParams.set('sortField', sort.field);
    }
    
    if (sort.direction !== 'desc') {
      searchParams.set('sortDirection', sort.direction);
    }

    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  }, [navigate, location.pathname]);


  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPaginationState({ page: 0, pageSize });
  }, []);

  const handleSortChange = useCallback((field: string, direction: 'asc' | 'desc') => {
    const newSort = { field, direction };
    setSortState(newSort);
    updateUrl(filterState, paginationState, newSort);
    refetch();
  }, [filterState, paginationState, updateUrl, refetch]);

	const handlePageChange = useCallback((page: number) => {
    const newPagination = { ...paginationState, page };
    setPaginationState(newPagination);
    updateUrl(filterState, newPagination, sortState);
  }, [filterState, paginationState, sortState, updateUrl]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    const newFilters = { ...filterState, [key]: value };
    setFilterState(newFilters);
    updateUrl(newFilters, paginationState, sortState);
    refetch();
  }, [filterState, paginationState, sortState, updateUrl, refetch]);

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