import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import { Alert, Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";
import { parseCSVToTasks } from "@/utils/csv-parser/csv-parser";
import { CSVFormStrings, type CSVImportViewProps, type CSVImportViewRef } from "./task-form.utils";

const CSVImportView = forwardRef<CSVImportViewRef, CSVImportViewProps>(function CSVImportView(
	{ currentUserId, onBulkCreate, isLoading, onFileSelected },
	ref
) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [taskCount, setTaskCount] = useState<number | null>(null);

	const processUpload = async (): Promise<void> => {
		if (!selectedFile) {
			setError("Please select a CSV file first");
			throw new Error("No file selected");
		}

		setError(null);
		setIsProcessing(true);

		try {
			const tasks = await parseCSVToTasks(selectedFile);

			const tasksWithAuthor = tasks.map((task) => ({
				...task,
				authorId: task.authorId || currentUserId,
				assigneeIds: task.assigneeIds || [],
			}));

			setTaskCount(tasksWithAuthor.length);

			await onBulkCreate(tasksWithAuthor);
			setSelectedFile(null);
			setTaskCount(null);

			if (onFileSelected) {
				onFileSelected(false);
			}

			return;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to parse CSV file";
			setError(errorMessage);
			throw err;
		} finally {
			setIsProcessing(false);
		}
	};

	useImperativeHandle(ref, () => ({
		triggerUpload: processUpload,
	}));

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file) {
			return;
		}

		setSelectedFile(file);
		setError(null);
		setTaskCount(null);

		if (onFileSelected) {
			onFileSelected(true);
		}
	};

	return (
		<Box>
			<input
				id="csv-upload-input"
				type="file"
				accept=".csv"
				onChange={handleFileSelect}
				style={{ display: "none" }}
				disabled={isProcessing || isLoading}
			/>

			<Button
				component="label"
				htmlFor="csv-upload-input"
				variant="outlined"
				startIcon={<CloudUploadIcon />}
				fullWidth
				disabled={isProcessing || isLoading}
				sx={{ py: 2, mb: 2 }}
			>
				{selectedFile ? `Selected: ${selectedFile.name}` : "Select CSV File"}
			</Button>

			{selectedFile && (
				<Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
					<Stack direction="row" alignItems="center" spacing={1}>
						<DescriptionIcon color="primary" />
						<Box>
							<Typography variant="body2" fontWeight={500}>
								{selectedFile.name}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								{(selectedFile.size / 1024).toFixed(1)} KB
							</Typography>
						</Box>
					</Stack>
				</Paper>
			)}

			{(isProcessing || isLoading) && (
				<Box sx={{ mb: 2 }}>
					<LinearProgress />
					<Typography variant="caption" sx={{ mt: 1, display: "block" }}>
						{isProcessing ? "Processing CSV file..." : "Creating tasks..."}
					</Typography>
				</Box>
			)}

			<Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
				{CSVFormStrings.CSV_FORMAT}
			</Typography>

			{taskCount && !isProcessing && !isLoading && (
				<Alert severity="info" sx={{ mt: 1 }}>
					Found {taskCount} tasks in the file. Ready to upload!
				</Alert>
			)}

			{error && (
				<Alert severity="error" sx={{ mt: 2 }}>
					{error}
				</Alert>
			)}
		</Box>
	);
});

export { CSVImportView };
