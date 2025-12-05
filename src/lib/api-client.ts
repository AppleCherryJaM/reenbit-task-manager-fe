import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || "";

interface TokenResponse {
	accessToken: string;
	refreshToken: string;
}

class ApiClient {
	private client: AxiosInstance;
	private isRefreshing = false;
	private failedQueue: Array<{
		resolve: (value: any) => void;
		reject: (error: any) => void;
	}> = [];

	constructor() {
		this.client = axios.create({
			baseURL: API_BASE_URL,
			timeout: 10000,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		this.client.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				const token = this.getAccessToken();

				if (token && config.headers) {
					config.headers.Authorization = `Bearer ${token}`;
				}

				return config;
			},
			(error: AxiosError) => Promise.reject(error)
		);

		this.client.interceptors.response.use(
			(response: AxiosResponse) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

				if (error.response?.status === 401 && !originalRequest?._retry) {
					if (this.isRefreshing) {
						return new Promise((resolve, reject) => {
							this.failedQueue.push({ resolve, reject });
						})
							.then((token) => {
								if (originalRequest.headers) {
									originalRequest.headers.Authorization = `Bearer ${token}`;
								}
								return this.client(originalRequest);
							})
							.catch((err) => Promise.reject(err));
					}

					originalRequest._retry = true;
					this.isRefreshing = true;

					try {
						const newToken = await this.refreshToken();
						this.setAccessToken(newToken);

						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${newToken}`;
						}

						this.processQueue(null, newToken);

						return this.client(originalRequest);
					} catch (refreshError) {
						this.processQueue(refreshError, null);
						this.clearTokens();
						window.location.href = "/login";
						return Promise.reject(refreshError);
					} finally {
						this.isRefreshing = false;
					}
				}

				return Promise.reject(error);
			}
		);
	}

	private processQueue(error: any, token: string | null = null): void {
		this.failedQueue.forEach((prom) => {
			if (error) {
				prom.reject(error);
			} else {
				prom.resolve(token);
			}
		});
		this.failedQueue = [];
	}

	private async refreshToken(): Promise<string> {
		const refreshToken = this.getRefreshToken();
		if (!refreshToken) {
			throw new Error("No refresh token available");
		}

		const response = await axios.post<TokenResponse>(`${API_BASE_URL}/auth/refresh-token`, {
			refreshToken,
		});

		this.setTokens(response.data.accessToken, response.data.refreshToken);
		return response.data.accessToken;
	}

	private getAccessToken(): string | null {
		return localStorage.getItem("accessToken");
	}

	private getRefreshToken(): string | null {
		return localStorage.getItem("refreshToken");
	}

	private setAccessToken(token: string): void {
		localStorage.setItem("accessToken", token);
	}

	private setRefreshToken(token: string): void {
		localStorage.setItem("refreshToken", token);
	}

	private setTokens(accessToken: string, refreshToken: string): void {
		this.setAccessToken(accessToken);
		this.setRefreshToken(refreshToken);
	}

	private clearTokens(): void {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	}

	public async get<T>(url: string, params?: any): Promise<T> {
		const response = await this.client.get<T>(url, { params });
		return response.data;
	}

	public async post<T>(url: string, data?: any): Promise<T> {
		const response = await this.client.post<T>(url, data);
		return response.data;
	}

	public async put<T>(url: string, data?: any): Promise<T> {
		const response = await this.client.put<T>(url, data);
		return response.data;
	}

	public async patch<T>(url: string, data?: any): Promise<T> {
		const response = await this.client.patch<T>(url, data);
		return response.data;
	}

	public async delete<T>(url: string): Promise<T> {
		const response = await this.client.delete<T>(url);
		return response.data;
	}

	public setAuthTokens(accessToken: string, refreshToken: string): void {
		this.setTokens(accessToken, refreshToken);
	}

	public clearAuthTokens(): void {
		this.clearTokens();
	}
}

export const apiClient = new ApiClient();
