import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

import type { ModalBaseProps } from "./Modal.types";

export default function ModalBase({
  open,
  title,
  children,
  onClose,
  onSubmit,
  primaryBtnText = "Save"
}: ModalBaseProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        {children}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        {onSubmit && (
          <Button variant="contained" onClick={onSubmit}>
            {primaryBtnText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
