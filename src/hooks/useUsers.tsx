import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import type { User } from "@/types/types";

export function useUsers() {
	const { data, isLoading, error, isError } = useQuery<User[], Error>({
		queryKey: ["users"],
		queryFn: () => userService.getAllUsers(),
		staleTime: 5 * 60 * 1000, // 5 минут
		retry: 1,
	});

	return {
		users: data || [],
		isLoading,
		error,
		isError,
	};
}
