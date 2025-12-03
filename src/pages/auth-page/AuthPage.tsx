import { Alert, Container, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import type { AuthMode } from "@/hooks/auth/useAuthForm";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { adaptApiUserToStore } from "@/utils/auth.utils";

export default function AuthPage() {
	const [mode, setMode] = useState<AuthMode>("login");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { login: setAuth } = useAuthStore();

	const handleSubmit = async (data: any) => {
		setLoading(true);
		setError(null);

		try {
			// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
			let response;

			if (mode === "login") {
				response = await authService.login(data);
			} else {
				response = await authService.register(data);
			}

			const storeUser = adaptApiUserToStore(response.user);
			setAuth(storeUser, response.accessToken);
			navigate("/tasks");
		} catch (err: any) {
			setError(err.message || `Error while ${mode === "login" ? "login" : "registration"}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 8 }}>
			<Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden", p: 3 }}>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<AuthForm mode={mode} onSubmit={handleSubmit} loading={loading} onModeChange={setMode} />
			</Paper>
		</Container>
	);
}
