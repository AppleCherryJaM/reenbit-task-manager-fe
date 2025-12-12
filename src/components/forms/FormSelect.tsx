import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { FormSelectProps } from "./forms.types";

export const FormSelect = ({
	field,
	value,
	onChange,
	options,
	error,
	helperText,
	label,
	disabled,
}: FormSelectProps) => {
	const handleChange = (e: SelectChangeEvent<string>): void => {
		onChange(field, e.target.value);
	};

	return (
		<FormControl fullWidth error={!!error} disabled={disabled}>
			<InputLabel>{label}</InputLabel>
			<Select
				value={value || ""}
				label={label}
				onChange={handleChange}
				disabled={disabled}
				variant="outlined"
			>
				{options.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</Select>
			{(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
		</FormControl>
	);
};
