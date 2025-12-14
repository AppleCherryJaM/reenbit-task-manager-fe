import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingStateProps {
	message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				gap: 2,
			}}
		>
			<CircularProgress size={60} />
			{message && (
				<Typography variant="h6" color="text.secondary">
					{message}
				</Typography>
			)}
		</Box>
	);
}
