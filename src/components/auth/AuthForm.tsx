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
import { useToast } from "@/providers/ToastProvider";

interface AuthFormProps {
	mode: AuthMode;
	onSubmit: (data: any) => Promise<void>;
	loading: boolean;
	onModeChange: (mode: AuthMode) => void;
}

enum AuthFormStrings {
	LOGIN_TITLE = "Login",
	REGISTER_TITLE = "Register",
	LOGIN_BUTTON = "Login",
	REGISTER_BUTTON = "Register",
	SWITCH_TO_REGISTER = "Don't have an account?",
	SWITCH_TO_LOGIN = "Already have an account?",
	PASSWORD_LABEL = "Password",
	CONFIRM_PASSWORD_LABEL = "Confirm Password",
	EMAIL_LABEL = "Email",
	NAME_LABEL = "Name",
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

	const { showToast } = useToast();

	const isLogin = mode === "login";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (validate()) {
			const data = isLogin
				? { email: formData.email, password: formData.password }
				: { ...formData, name: formData.name || "" };

			try {
				await onSubmit(data);
			} catch (error) {
				const message = error instanceof Error ? error.message : "Authentication failed";
				showToast(message, "error");
			}
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
				{isLogin ? AuthFormStrings.LOGIN_TITLE : AuthFormStrings.REGISTER_TITLE}
			</Typography>

			{!isLogin && (
				<TextField
					fullWidth
					label="Name	"
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
				label={AuthFormStrings.EMAIL_LABEL}
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
				label={AuthFormStrings.PASSWORD_LABEL}
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
					label={AuthFormStrings.CONFIRM_PASSWORD_LABEL}
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
				sx={{
					mt: { xs: 2.5, sm: 3 },
					mb: { xs: 1.5, sm: 2 },
					py: { xs: 1.2, sm: 1.5 },
				}}
				disabled={loading}
			>
				{loading ? (
					<CircularProgress size={24} />
				) : isLogin ? (
					AuthFormStrings.LOGIN_TITLE
				) : (
					AuthFormStrings.REGISTER_TITLE
				)}
			</Button>

			<Box
				sx={{
					textAlign: "center",
					mt: 2,
					"& .MuiTypography-body2": {
						lineHeight: 1.5,
					},
				}}
			>
				<Typography variant="body2" color="text.secondary">
					{isLogin ? AuthFormStrings.SWITCH_TO_REGISTER : AuthFormStrings.SWITCH_TO_LOGIN}{" "}
					<Link
						component="button"
						type="button"
						onClick={handleSwitchMode}
						sx={{ cursor: "pointer" }}
						disabled={loading}
					>
						{isLogin ? AuthFormStrings.REGISTER_BUTTON : AuthFormStrings.LOGIN_BUTTON}
					</Link>
				</Typography>
			</Box>
		</Box>
	);
}
