import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
	id: string;
	email: string;
	name?: string | null;
};

export type AuthState = {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;

	login: (user: User, token: string) => void;
	logout: () => void;
	getCurrentUserId: () => string | null;
	getCurrentUser: () => User | null;
	getToken: () => string | null;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			isAuthenticated: false,

			login: (user, token) =>
				set({
					user,
					token,
					isAuthenticated: true,
				}),

			logout: () =>
				set({
					user: null,
					token: null,
					isAuthenticated: false,
				}),

			getCurrentUserId: () => {
				const state = get();
				return state.user?.id || null;
			},

			getCurrentUser: () => {
				return get().user;
			},

			getToken: () => {
				return get().token;
			},
		}),
		{
			name: "auth-storage",
		}
	)
);
