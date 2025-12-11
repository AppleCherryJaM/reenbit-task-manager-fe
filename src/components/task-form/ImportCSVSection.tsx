import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  LinearProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { parseCSVToTasks, downloadCSVTemplate } from "@/utils/csv-parser/csv-parser";
import type { ParsedTask } from "@/utils/csv-parser/csv-parser";

interface ImportCSVSectionProps {
  onTasksImported: (tasks: ParsedTask[]) => void;
  currentUserId?: string;
}

export function ImportCSVSection({ 
  onTasksImported, 
  currentUserId 
}: ImportCSVSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (!selectedFile) { return; }

    setError(null);
    setIsLoading(true);

    try {
      const tasks = await parseCSVToTasks(selectedFile);
      const tasksWithAuthor = tasks.map(task => ({
        ...task,
        authorId: task.authorId || currentUserId || '',
      }));

      onTasksImported(tasksWithAuthor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV file");
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    downloadCSVTemplate(currentUserId);
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
        sx={{ py: 2, mb: 2 }}
      >
        {isLoading ? "Processing..." : "Upload CSV File"}
      </Button>
      
      {isLoading && <LinearProgress sx={{ mt: 1, mb: 2 }} />}
      
      <Box sx={{ display: "flex", flexDirection: 'column', gap: 1, mb: 2 }}>
        <Button
          variant="text"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadTemplate}
          size="small"
        >
          Download Template
        </Button>
        
        <Typography variant="caption" color="text.secondary">
          CSV format: title, description, status, priority, deadline, authorId, assigneeIds
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}