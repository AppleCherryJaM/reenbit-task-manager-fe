import type { TextFieldProps } from "@mui/material";
import type { TaskFormValues } from "@/schemas/task.schema";
import type { User } from "@/types/types";

export interface Option {
	value: string;
	label: string;
}

export interface FormSelectProps {
	field: keyof TaskFormValues;
	value: string;
	onChange: (field: keyof TaskFormValues, value: string) => void;
	options: Option[];
	error?: string;
	helperText?: string;
	label: string;
	disabled?: boolean;
}

export interface FormMultiSelectProps<K extends string> {
	field: K;
	value: string[];
	onChange: (field: K, value: string[]) => void;
	label: string;
	users: User[];
	isLoading: boolean;
	currentUserId?: string;
	error?: string;
	helperText?: string;
	disabled?: boolean;
}

export interface FormTextFieldProps<K extends string>
	extends Omit<TextFieldProps, "onChange" | "error"> {
	field: K;
	value: string;
	onChange: (field: K, value: string) => void;
	error?: string;
	helperText?: string;
}
