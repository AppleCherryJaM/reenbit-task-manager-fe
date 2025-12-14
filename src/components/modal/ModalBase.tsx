import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import type { ModalBaseProps } from "./Modal.types";

export default function ModalBase({
	open,
	title,
	children,
	onClose,

	primaryBtnText,
	secondaryBtnText = "Cancel",
	onSubmit,
	onPrimaryAction,
	onSecondaryAction,
	disableSubmit,
	disablePrimary,
	disableSecondary,
	showActions = true,
	isLoading = false,

	maxWidth = "sm",
	fullWidth = true,
	dividers = false,
}: ModalBaseProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handlePrimaryAction = onPrimaryAction || onSubmit;
	const isPrimaryDisabled =
		disablePrimary !== undefined
			? disablePrimary
			: disableSubmit !== undefined
				? disableSubmit
				: false;

	const handleSecondary = onSecondaryAction || onClose;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth={fullWidth}
			maxWidth={!isMobile ? maxWidth : false}
		>
			<DialogTitle sx={{ px: { xs: 2, sm: 3 } }}>{title}</DialogTitle>
			<DialogContent
				dividers={dividers}
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
					mt: 1,
					px: { xs: 2, sm: 3 },
					pb: { xs: 2, sm: 3 },
				}}
			>
				{children}
			</DialogContent>
			{showActions && (
				<DialogActions
					sx={{
						px: { xs: 2, sm: 3 },
						pb: { xs: 2, sm: 2.5 },
						flexDirection: { xs: "column", sm: "row" },
						gap: { xs: 1, sm: 0 },
					}}
				>
					{secondaryBtnText && (
						<Button
							onClick={handleSecondary}
							color="inherit"
							disabled={disableSecondary || isLoading}
							fullWidth={isMobile}
						>
							{secondaryBtnText}
						</Button>
					)}
					{primaryBtnText && handlePrimaryAction && (
						<Button
							onClick={handlePrimaryAction}
							variant="contained"
							disabled={isPrimaryDisabled || isLoading}
							fullWidth={isMobile}
							startIcon={isLoading ? null : undefined}
						>
							{isLoading ? "Processing..." : primaryBtnText}
						</Button>
					)}
				</DialogActions>
			)}
		</Dialog>
	);
}
