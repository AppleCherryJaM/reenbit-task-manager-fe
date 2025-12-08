import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

interface PublicRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
}

export function PublicRoute({ children, redirectTo = "/tasks" }: PublicRouteProps) {
	const { isAuthenticated } = useAuthStore();

	if (isAuthenticated) {
		return <Navigate to={redirectTo} replace />;
	}

	return <>{children}</>;
}
