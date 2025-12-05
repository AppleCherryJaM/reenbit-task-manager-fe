import { Alert, Box, Button } from "@mui/material";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<Box sx={{ p: 3 }}>
					<Alert
						severity="error"
						action={
							<Button color="inherit" size="small" onClick={this.handleRetry}>
								Попробовать снова
							</Button>
						}
					>
						Что-то пошло не так: {this.state.error?.message}
					</Alert>
				</Box>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
