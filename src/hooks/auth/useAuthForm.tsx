import { useCallback, useState } from "react";

export type AuthMode = "login" | "register";

export function useAuthForm(mode: AuthMode = "login") {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		...(mode === "register" ? { name: "" } : {}),
	});
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const isLogin = mode === "login";

	const validate = useCallback((): boolean => {
		const newErrors: Record<string, string> = {};

		// Email
		if (!formData.email.trim()) {
			newErrors.email = "Email обязателен";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Некорректный email";
		}

		// Name (только для регистрации)
		if (!isLogin && !formData.name?.trim()) {
			newErrors.name = "Имя обязательно";
		}

		// Password
		if (!formData.password) {
			newErrors.password = "Пароль обязателен";
		} else if (formData.password.length < 6) {
			newErrors.password = "Пароль должен быть не менее 6 символов";
		}

		// Confirm password (только для регистрации)
		if (!isLogin) {
			if (!confirmPassword) {
				newErrors.confirmPassword = "Подтвердите пароль";
			} else if (formData.password !== confirmPassword) {
				newErrors.confirmPassword = "Пароли не совпадают";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData, confirmPassword, isLogin]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			setFormData((prev) => ({ ...prev, [name]: value }));

			if (errors[name]) {
				setErrors((prev) => ({ ...prev, [name]: "" }));
			}
		},
		[errors]
	);

	const resetForm = useCallback((newMode: AuthMode) => {
		setFormData({
			email: "",
			password: "",
			...(newMode === "register" ? { name: "" } : {}),
		});
		setConfirmPassword("");
		setErrors({});
		setShowPassword(false);
		setShowConfirmPassword(false);
	}, []);

	return {
		formData,
		confirmPassword,
		showPassword,
		showConfirmPassword,
		errors,
		handleChange,
		setConfirmPassword,
		setShowPassword,
		setShowConfirmPassword,
		validate,
		resetForm,
	};
}
