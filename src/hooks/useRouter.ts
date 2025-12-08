import { useNavigate } from "react-router-dom";

export const useRouterNavigate = () => {
	const navigate = useNavigate();

	const redirectToLogin = () => {
		navigate("/auth", { replace: true });
	};

	const redirectToTasks = () => {
		navigate("/tasks", { replace: true });
	};

	const goBack = () => {
		navigate(-1);
	};

	return {
		redirectToLogin,
		redirectToTasks,
		goBack,
		navigate,
	};
};
