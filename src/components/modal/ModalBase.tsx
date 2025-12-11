import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from "@mui/material";
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

  maxWidth = 'sm',
  fullWidth = true,
  dividers = false
}: ModalBaseProps) {

  const handlePrimaryAction = onPrimaryAction || onSubmit;
  const isPrimaryDisabled = disablePrimary !== undefined 
    ? disablePrimary 
    : (disableSubmit !== undefined ? disableSubmit : false);
  
  const handleSecondary = onSecondaryAction || onClose;
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth={fullWidth} 
      maxWidth={maxWidth}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent 
        dividers={dividers}
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 2, 
          mt: 1 
        }}
      >
        {children}
      </DialogContent>
      {showActions && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {secondaryBtnText && (
            <Button 
              onClick={handleSecondary} 
              color="inherit" 
              disabled={disableSecondary || isLoading}
            >
              {secondaryBtnText}
            </Button>
          )}
          {primaryBtnText && handlePrimaryAction && (
            <Button 
              onClick={handlePrimaryAction} 
              variant="contained" 
              disabled={isPrimaryDisabled || isLoading}
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