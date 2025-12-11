import { TextField } from "@mui/material";
import type { ChangeEvent } from "react";
import type { FormTextFieldProps } from "./forms.types";

export const FormTextField = <K extends string>({
	field,
	value,
	onChange,
	error,
	helperText,
	...props
}: FormTextFieldProps<K>) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
		onChange(field, e.target.value);
	};

	return (
		<TextField
			value={value || ""}
			onChange={handleChange}
			error={!!error}
			helperText={error || helperText || " "}
			fullWidth
			variant="outlined"
			{...props}
		/>
	);
};
