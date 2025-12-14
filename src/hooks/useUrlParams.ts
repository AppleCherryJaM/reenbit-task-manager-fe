import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useUrlParams = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const params = useMemo(() => {
		const searchParams = new URLSearchParams(location.search);
		return {
			status: searchParams.get("status") || "all",
			priority: searchParams.get("priority") || "all",
			page: parseInt(searchParams.get("page") || "0"),
			sortField: searchParams.get("sortField") || "createdAt",
			sortDirection: (searchParams.get("sortDirection") || "desc") as "asc" | "desc",
			search: searchParams.get("search") || "",
		};
	}, [location.search]);

	const updateParams = useCallback(
		(newParams: Record<string, string | number>) => {
			const searchParams = new URLSearchParams(location.search);

			Object.entries(newParams).forEach(([key, value]) => {
				if (
					value === "" ||
					value === "all" ||
					value === 0 ||
					value === "createdAt" ||
					value === "desc"
				) {
					searchParams.delete(key);
				} else {
					searchParams.set(key, String(value));
				}
			});

			navigate(
				{
					pathname: location.pathname,
					search: searchParams.toString(),
				},
				{ replace: true }
			);
		},
		[navigate, location.pathname, location.search]
	);

	return { params, updateParams };
};
