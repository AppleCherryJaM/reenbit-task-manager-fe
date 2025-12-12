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
  Container,
} from "@mui/material";
import { type AuthMode, useAuthForm } from "@/hooks/auth/useAuthForm";

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
  SWITCH_TO_REGISTER = "Don't have an account? Register",
  SWITCH_TO_LOGIN = "Already have an account? Login",
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
    <Container 
      component="form" 
      onSubmit={handleSubmit} 
      noValidate
      maxWidth="xs"
      sx={{
        px: { xs: 1, sm: 2 },
        py: { xs: 2, sm: 3 },
        width: '100%'
      }}
    >
      <Typography 
        variant="h5" 
        align="center" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem' },
          mb: { xs: 2, sm: 3 }
        }}
      >
        {isLogin ? AuthFormStrings.LOGIN_TITLE : AuthFormStrings.REGISTER_TITLE}
      </Typography>

      {!isLogin && (
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          margin="normal"
          disabled={loading}
          autoComplete="name"
          size="small"
          sx={{
            '& .MuiInputBase-root': {
              height: { xs: 48, sm: 56 }
            }
          }}
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
        size="small"
        sx={{
          '& .MuiInputBase-root': {
            height: { xs: 48, sm: 56 }
          }
        }}
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
        size="small"
        sx={{
          '& .MuiInputBase-root': {
            height: { xs: 48, sm: 56 }
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={loading}
                sx={{
                  p: { xs: 0.5, sm: 1 }
                }}
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
          size="small"
          sx={{
            '& .MuiInputBase-root': {
              height: { xs: 48, sm: 56 }
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  disabled={loading}
                  sx={{
                    p: { xs: 0.5, sm: 1 }
                  }}
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
          mt: { xs: 2, sm: 3 }, 
          mb: { xs: 1, sm: 2 },
          height: { xs: 48, sm: 56 },
          fontSize: { xs: '0.875rem', sm: '1rem' }
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

      <Box sx={{ textAlign: "center", mt: { xs: 1, sm: 2 } }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          {isLogin ? AuthFormStrings.SWITCH_TO_REGISTER : AuthFormStrings.SWITCH_TO_LOGIN}{" "}
          <Link
            component="button"
            type="button"
            onClick={handleSwitchMode}
            sx={{ 
              cursor: "pointer",
              fontSize: 'inherit'
            }}
            disabled={loading}
          >
            {isLogin ? AuthFormStrings.LOGIN_BUTTON : AuthFormStrings.REGISTER_BUTTON}
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}