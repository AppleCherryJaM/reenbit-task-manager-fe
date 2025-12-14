export const formatDateForInput = (date: Date | string | null | undefined): string => {
	if (!date) {
		return "";
	}

	try {
		const dateObj = typeof date === "string" ? new Date(date) : date;

		if (isNaN(dateObj.getTime())) {
			console.warn("Invalid date provided to formatDateForInput:", date);
			return "";
		}

		const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);

		return localDate.toISOString().slice(0, 16);
	} catch (error) {
		console.error("Error formatting date:", error, date);

		return "";
	}
};

export const parseDateFromInput = (dateString: string | null | undefined): Date | null => {
	if (!dateString) {
		return null;
	}

	try {
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? null : date;
	} catch (error) {
		console.error("Error parsing date:", error, dateString);
		return null;
	}
};

export const getCurrentDateTimeForInput = (): string => {
	const now = new Date();
	return formatDateForInput(now);
};

export const getDefaultDeadline = (hoursToAdd: number = 24): string => {
	const deadline = new Date();
	deadline.setHours(deadline.getHours() + hoursToAdd);
	return formatDateForInput(deadline);
};
