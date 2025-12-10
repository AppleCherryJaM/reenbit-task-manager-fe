import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  LinearProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { parseCSVToTasks } from "@/utils/csv-parser/csv-parser";

interface ImportCSVSectionProps {
  onTasksImported: (tasks: any[]) => void;
}

export function ImportCSVSection({ onTasksImported }: ImportCSVSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (!selectedFile) { return; }

    setError(null);
    setIsLoading(true);

    try {
      const tasks = await parseCSVToTasks(selectedFile);
      onTasksImported(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={isLoading}
      />
      <Button
        component="label"
        htmlFor="csv-upload"
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        fullWidth
        disabled={isLoading}
        sx={{ py: 2 }}
      >
        {isLoading ? "Processing..." : "Upload CSV File"}
      </Button>
      {isLoading && <LinearProgress sx={{ mt: 1 }} />}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        Upload a CSV file with task data (first task will be used)
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}