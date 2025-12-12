import { Box, Alert, Button } from "@mui/material";
import AppHeader from "@components/header/AppHeader";

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Box sx={{ p: 3 }}>
      <AppHeader />
      <Alert
        severity="error"
        sx={{ mb: 2 }}
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      >
        {error.message}
      </Alert>
    </Box>
  );
}