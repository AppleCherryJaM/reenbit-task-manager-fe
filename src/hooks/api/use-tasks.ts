import { 
	useMutation, 
	useQuery, 
	useQueryClient 
} from "@tanstack/react-query";
import { taskService } from "@/services/task-service/task.service";

import type { 
	TasksResponse, 
	TaskFilters, 
	UpdateTaskData 
} from "@/services/task-service/task-service.types";

export const useTasks = (filters?: TaskFilters) => {
	return useQuery<TasksResponse>({
		queryKey: ["tasks", filters],
		queryFn: () => taskService.getTasks(filters),
		placeholderData: (previousData) => previousData,
	});
};

export const useTask = (id: string) => {
	return useQuery({
		queryKey: ["task", id],
		queryFn: () => taskService.getTaskById(id),
		enabled: !!id,
	});
};

export const useCreateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: taskService.createTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});
};

export const useUpdateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
			taskService.updateTask(id, data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.setQueryData(["task", variables.id], data);
		},
	});
};

export const useDeleteTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: taskService.deleteTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});
};
