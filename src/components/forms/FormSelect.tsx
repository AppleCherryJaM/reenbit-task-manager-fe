import { FormControl, FormHelperText, InputLabel, MenuItem, Select, useTheme, useMediaQuery } from "@mui/material";
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
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
				MenuProps={{
					PaperProps: {
						sx: {
							'& .MuiMenuItem-root': {
								minHeight: isMobile ? 48 : 'auto',
								px: isMobile ? 1.5 : 2,
							}
						}
					}
				}}
			>
				{options.map((option) => (
					<MenuItem 
						key={option.value} 
						value={option.value}
						sx={{ 
							minHeight: isMobile ? 48 : 'auto',
							px: isMobile ? 1.5 : 2,
						}}
					>
						{option.label}
					</MenuItem>
				))}
			</Select>
			{(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
		</FormControl>
	);
};