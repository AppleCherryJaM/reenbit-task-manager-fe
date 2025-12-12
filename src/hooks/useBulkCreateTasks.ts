import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task-service/task.service";

interface UseBulkCreateTasksOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useBulkCreateTasks = (options?: UseBulkCreateTasksOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tasks: any[]) => taskService.bulkCreateTasks(tasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      
			if (options?.onSuccess) {
        options.onSuccess();
      }
			
    },
    onError: (error) => {

      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};