import { lazy } from "react";
import { Navigate } from "react-router-dom";
import type { RouteConfig } from "@/types/types";

const AuthPage = lazy(() => import("@/pages/auth-page/AuthPage"));
const TasksPage = lazy(() => import("@/pages/task-page/TasksPage"));

export const routes: RouteConfig[] = [
	{
		path: "/",
		element: <Navigate to="/tasks" replace />,
	},
	{
		path: "/auth",
		element: <AuthPage />,
	},
	{
		path: "/tasks",
		element: <TasksPage />,
		auth: true,
	},
	{
		path: "*",
		element: <div>404 - Page Not Found</div>,
	},
];

export const getPublicRoutes = () => routes.filter((route) => !route.auth);

export const getPrivateRoutes = () => routes.filter((route) => route.auth);
