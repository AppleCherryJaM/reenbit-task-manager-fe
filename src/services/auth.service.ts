import { apiClient } from "@/lib/api-client";

export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	password: string;
	name?: string;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		email: string;
		name: string | null;
		role: string;
	};
}

export class AuthService {
	async login(credentials: LoginData): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/login", credentials);

		apiClient.setAuthTokens(response.accessToken, response.refreshToken);

		return response;
	}

	async register(userData: RegisterData): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/register", userData);

		apiClient.setAuthTokens(response.accessToken, response.refreshToken);

		return response;
	}

	async refreshToken(refreshToken: string): Promise<AuthResponse> {
		return apiClient.post<AuthResponse>("/auth/refresh-token", { refreshToken });
	}

	async logout(): Promise<void> {
		const refreshToken = localStorage.getItem("refreshToken");
		try {
			await apiClient.post("/auth/logout", { refreshToken });
		} finally {
			this.clearAuth();
		}
	}

	async logoutAll(): Promise<void> {
		try {
			await apiClient.post("/auth/logout-all");
		} finally {
			this.clearAuth();
		}
	}

	getCurrentUser() {
		const token = localStorage.getItem("accessToken");
		if (!token) {
			return null;
		}

		try {
			const payload = JSON.parse(atob(token.split(".")[1]));
			return {
				id: payload.userId,
				email: payload.email,
				role: payload.role,
			};
		} catch {
			return null;
		}
	}

	isAuthenticated(): boolean {
		return !!this.getCurrentUser();
	}

	clearAuth(): void {
		apiClient.clearAuthTokens();
	}
}

export const authService = new AuthService();
