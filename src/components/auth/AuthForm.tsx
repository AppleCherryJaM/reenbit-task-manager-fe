import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	Box,
	Button,
	CircularProgress,
	IconButton,
	InputAdornment,
	Link,
	TextField,
	Typography,
} from "@mui/material";
import { type AuthMode, useAuthForm } from "@/hooks/auth/useAuthForm";

interface AuthFormProps {
	mode: AuthMode;
	onSubmit: (data: any) => Promise<void>;
	loading: boolean;
	onModeChange: (mode: AuthMode) => void;
}

export default function AuthForm({ mode, onSubmit, loading, onModeChange }: AuthFormProps) {
	const {
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
	} = useAuthForm(mode);

	const isLogin = mode === "login";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (validate()) {
			const data = isLogin
				? { email: formData.email, password: formData.password }
				: { ...formData, name: formData.name || "" };

			await onSubmit(data);
		}
	};

	const handleSwitchMode = () => {
		const newMode: AuthMode = isLogin ? "register" : "login";
		resetForm(newMode);
		onModeChange(newMode);
	};

	return (
		<Box component="form" onSubmit={handleSubmit} noValidate>
			<Typography variant="h5" align="center" gutterBottom>
				{isLogin ? "Вход в систему" : "Регистрация"}
			</Typography>

			{!isLogin && (
				<TextField
					fullWidth
					label="Имя"
					name="name"
					value={formData.name || ""}
					onChange={handleChange}
					error={!!errors.name}
					helperText={errors.name}
					margin="normal"
					disabled={loading}
					autoComplete="name"
				/>
			)}

			<TextField
				fullWidth
				label="Email"
				name="email"
				type="email"
				value={formData.email}
				onChange={handleChange}
				error={!!errors.email}
				helperText={errors.email}
				margin="normal"
				disabled={loading}
				autoComplete="email"
			/>

			<TextField
				fullWidth
				label="Пароль"
				name="password"
				type={showPassword ? "text" : "password"}
				value={formData.password}
				onChange={handleChange}
				error={!!errors.password}
				helperText={errors.password}
				margin="normal"
				disabled={loading}
				autoComplete={isLogin ? "current-password" : "new-password"}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={() => setShowPassword(!showPassword)}
								edge="end"
								disabled={loading}
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
			/>

			{!isLogin && (
				<TextField
					fullWidth
					label="Подтвердите пароль"
					type={showConfirmPassword ? "text" : "password"}
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					error={!!errors.confirmPassword}
					helperText={errors.confirmPassword}
					margin="normal"
					disabled={loading}
					autoComplete="new-password"
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									edge="end"
									disabled={loading}
								>
									{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			)}

			<Button
				type="submit"
				fullWidth
				variant="contained"
				size="large"
				sx={{ mt: 3, mb: 2 }}
				disabled={loading}
			>
				{loading ? <CircularProgress size={24} /> : isLogin ? "Войти" : "Зарегистрироваться"}
			</Button>

			<Box sx={{ textAlign: "center" }}>
				<Typography variant="body2" color="text.secondary">
					{isLogin ? "Ещё нет аккаунта?" : "Уже есть аккаунт?"}{" "}
					<Link
						component="button"
						type="button"
						onClick={handleSwitchMode}
						sx={{ cursor: "pointer" }}
						disabled={loading}
					>
						{isLogin ? "Зарегистрируйтесь" : "Войдите"}
					</Link>
				</Typography>
			</Box>
		</Box>
	);
}
