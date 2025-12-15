import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { routes } from "./router.config";

const PageLoader = () => (
	<Box
		sx={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "100vh",
		}}
	>
		<CircularProgress />
	</Box>
);

const renderRoute = (route: (typeof routes)[0]) => {
	const { path, element, auth, children } = route;

	if (auth) {
		return (
			<Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>}>
				{children?.map((childRoute) => renderRoute(childRoute))}
			</Route>
		);
	}

	if (path === "/auth") {
		return (
			<Route key={path} path={path} element={<PublicRoute>{element}</PublicRoute>}>
				{children?.map((childRoute) => renderRoute(childRoute))}
			</Route>
		);
	}

	return (
		<Route key={path} path={path} element={element}>
			{children?.map((childRoute) => renderRoute(childRoute))}
		</Route>
	);
};

export default function MainRouter() {
	return (
		<Suspense fallback={<PageLoader />}>
			<Routes>{routes.map((route) => renderRoute(route))}</Routes>
		</Suspense>
	);
}
