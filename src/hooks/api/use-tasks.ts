import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskData, TaskFilters, UpdateTaskData } from "../../services/task.service";
import { taskService } from "../../services/task.service";

export const useTasks = (filters?: TaskFilters) => {
	return useQuery({
		queryKey: ["tasks", filters],
		queryFn: () => taskService.getTasks(filters),
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
