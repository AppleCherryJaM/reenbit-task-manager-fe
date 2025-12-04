import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import type { ModalBaseProps } from "./Modal.types";

export default function ModalBase({ open, title, children, onClose }: ModalBaseProps) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>{title}</DialogTitle>
			<DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
				{children}
			</DialogContent>
		</Dialog>
	);
}
