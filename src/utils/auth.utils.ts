export interface ApiUser {
	id: string;
	email: string;
	name: string | null;
	role: string;
}

export interface StoreUser {
	id: string;
	email: string;
	name: string | null;
}

export const adaptApiUserToStore = (apiUser: ApiUser): StoreUser => ({
	id: apiUser.id,
	email: apiUser.email,
	name: apiUser.name,
});
