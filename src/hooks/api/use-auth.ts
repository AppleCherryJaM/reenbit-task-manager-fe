import { authService } from "@services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
	const queryClient = useQueryClient();

	const loginMutation = useMutation({
		mutationFn: authService.login,
		onSuccess: (data) => {
			queryClient.setQueryData(["user", "profile"], data.user);
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	const registerMutation = useMutation({
		mutationFn: authService.register,
		onSuccess: (data) => {
			queryClient.setQueryData(["user", "profile"], data.user);
		},
	});

	const logoutMutation = useMutation({
		mutationFn: authService.logout,
		onSuccess: () => {
			queryClient.clear();
		},
		onError: () => {
			queryClient.clear();
		},
	});

	return {
		login: loginMutation.mutateAsync,
		register: registerMutation.mutateAsync,
		logout: logoutMutation.mutateAsync,
		isLoading: loginMutation.isPending || registerMutation.isPending,
		error: loginMutation.error || registerMutation.error,
	};
};
