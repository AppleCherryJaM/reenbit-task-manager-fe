import { useState } from "react";

export const useTaskFilters = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	return {
		page,
		pageSize,
		setPage,
		setPageSize,
	};
};
