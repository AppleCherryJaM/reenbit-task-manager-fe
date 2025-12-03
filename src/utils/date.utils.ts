export const formatDateForInput = (date: Date | null | undefined): string => {
	if (!date) {
		return "";
	}

	const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	return localDate.toISOString().slice(0, 16);
};

export const parseDateFromInput = (dateString: string | null | undefined): Date | null => {
	if (!dateString) {
		return null;
	}

	return new Date(dateString);
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
