import {
	Box,
	Checkbox,
	Chip,
	CircularProgress,
	FormControl,
	FormHelperText,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { FormMultiSelectProps } from "./forms.types";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MENU_HEIGHT = ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP;

export const FormMultiSelect = <K extends string>({
	field,
	value,
	onChange,
	label,
	users,
	isLoading,
	currentUserId,
	error,
	helperText,
	disabled,
}: FormMultiSelectProps<K>) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handleChange = (event: SelectChangeEvent<string[]>): void => {
		const {
			target: { value: selectedValue },
		} = event;
		const newValue = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
		onChange(field, newValue);
	};

	const handleDeleteChip = (userId: string): void => {
		const newValue = value.filter((id) => id !== userId);
		onChange(field, newValue);
	};

	const availableUsers = users.filter((user) => user.id !== currentUserId);

	const renderContent = () => {
		if (isLoading) {
			return (
				<MenuItem disabled>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<CircularProgress size={20} />
						<Typography variant="body2">Loading users...</Typography>
					</Box>
				</MenuItem>
			);
		}

		if (!availableUsers.length) {
			return (
				<MenuItem disabled>
					<Typography variant="body2" color="textSecondary">
						No other users available
					</Typography>
				</MenuItem>
			);
		}

		return availableUsers.map((user) => (
			<MenuItem
				key={user.id}
				value={user.id}
				sx={{
					minHeight: ITEM_HEIGHT,
					px: isMobile ? 1.5 : 2,
				}}
			>
				<Checkbox checked={value.includes(user.id)} disabled={disabled} sx={{ p: 0.5 }} />
				<ListItemText
					primary={user.name || user.email}
					secondary={user.name ? user.email : ""}
					primaryTypographyProps={{ variant: "body2" }}
					secondaryTypographyProps={{ variant: "caption" }}
				/>
			</MenuItem>
		));
	};

	return (
		<FormControl fullWidth error={!!error} disabled={disabled}>
			<InputLabel>{label}</InputLabel>
			<Select
				multiple
				value={value}
				onChange={handleChange}
				input={<OutlinedInput label={label} />}
				renderValue={(selected) => (
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 0.5,
							minHeight: "2.5rem",
						}}
					>
						{selected.map((userId) => {
							const user = users.find((u) => u.id === userId);
							return (
								<Chip
									key={userId}
									label={user ? user.name || user.email : `User ${userId.substring(0, 8)}...`}
									size="small"
									onDelete={disabled ? undefined : () => handleDeleteChip(userId)}
									onMouseDown={(e) => e.stopPropagation()}
									sx={{
										maxWidth: "100%",
									}}
								/>
							);
						})}
					</Box>
				)}
				MenuProps={{
					PaperProps: {
						style: {
							maxHeight: MENU_HEIGHT,
							width: isMobile ? "100vw" : 250,
						},
						sx: {
							ml: isMobile ? -2 : 0,
							mr: isMobile ? -2 : 0,
							minWidth: isMobile ? "auto" : 250,
						},
					},
					anchorOrigin: {
						vertical: "bottom",
						horizontal: "left",
					},
					transformOrigin: {
						vertical: "top",
						horizontal: "left",
					},
				}}
				disabled={isLoading || disabled}
				variant="outlined"
			>
				{renderContent()}
			</Select>
			<FormHelperText error={!!error}>{error || helperText || " "}</FormHelperText>
		</FormControl>
	);
};
