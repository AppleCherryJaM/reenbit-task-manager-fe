import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useCallback,
} from "react";
import ModalBase from "@/components/modal/ModalBase"; // ← твой ModalBase
import { Typography } from "@mui/material";

interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface ConfirmationContextValue {
  showConfirmation: (options: ConfirmationOptions) => void;
}

const ConfirmationContext = createContext<ConfirmationContextValue | undefined>(
  undefined
);

export const ConfirmationProvider = ({ children }: { children: React0Node }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    message: "",
    onConfirm: () => {},
  });

  const showConfirmation = useCallback((opts: ConfirmationOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    options.onCancel?.();
  };

  const handleConfirm = () => {
    options.onConfirm();
  };

  return (
    <ConfirmationContext.Provider value={{ showConfirmation }}>
      {children}
      <ModalBase
				open={isOpen}
				title={options.title || "Confirm Action"}
				onClose={handleClose}
				primaryBtnText={options.confirmText || "Confirm"}
				secondaryBtnText={options.cancelText || "Cancel"}
				onPrimaryAction={handleConfirm}
				onSecondaryAction={handleClose}
				primaryBtnColor="error"        
				secondaryBtnColor="primary"    
				isLoading={options.isLoading || false}
				maxWidth="xs"
			>
        <Typography variant="body1" color="text.secondary">
          {options.message}
        </Typography>
      </ModalBase>
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error(
      "useConfirmation must be used inside ConfirmationProvider"
    );
  }
  return context;
};