import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider } from "./providers/ToastProvider";
import { theme } from "./providers/theme.provider";
import MainRouter from "./router/MainRouter";
import { ConfirmationProvider } from "./providers/ConfirmationProvider";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Router>
					<ToastProvider>
						<ConfirmationProvider>
							<MainRouter />
						</ConfirmationProvider>
					</ToastProvider>
				</Router>
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
