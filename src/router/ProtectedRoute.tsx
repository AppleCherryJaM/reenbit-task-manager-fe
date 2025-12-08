import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

interface ProtectedRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = "/auth" }: ProtectedRouteProps) {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated || !user) {
		return <Navigate to={redirectTo} replace />;
	}

	return <>{children}</>;
}
