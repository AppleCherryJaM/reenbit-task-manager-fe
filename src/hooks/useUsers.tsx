import { useQuery } from "@tanstack/react-query";
import type { User } from "../types/types";

const userApi = {
	getUsers: async (): Promise<User[]> => {
		const response = await fetch("/api/users");
		if (!response.ok) {
			throw new Error("Failed to fetch users");
		}
		return response.json();
	},
};

export const useUsers = () => {
	const {
		data: users = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["users"],
		queryFn: userApi.getUsers,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	return {
		users,
		isLoading,
		error,
	};
};
