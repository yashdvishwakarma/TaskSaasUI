import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { theme } from "../theme/theme";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  FormHelperText
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from "@mui/icons-material";

export default function Login() {
  const { doLogin } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation functions
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    }
    if (value.length > 100) {
      setEmailError("Email must be less than 100 characters");
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    // if (value.length < 6) {
    //   setPasswordError("Password must be at least 6 characters");
    //   return false;
    // }
    if (value.length > 100) {
      setPasswordError("Password must be less than 100 characters");
      return false;
    }
    // Check for at least one number
    // if (!/\d/.test(value)) {
    //   setPasswordError("Password must contain at least one number");
    //   return false;
    // }
    // Check for at least one letter
    // if (!/[a-zA-Z]/.test(value)) {
    //   setPasswordError("Password must contain at least one letter");
    //   return false;
    // }
    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim(); // Remove whitespace
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleEmailBlur = () => {
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    validatePassword(password);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setLoading(true);
    try {
      await doLogin(email, password);
      nav("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 264px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        padding: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 6,
          width: "100%",
          maxWidth: 440,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{ mb: 4, color: "primary.main" }}
        >
          Welcome back
        </Typography>
        
        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 5, color: "grey.600" }}
        >
          Sign in to continue to your tasks
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={submit} noValidate>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: emailError ? "error.main" : "grey.400" }} />
                </InputAdornment>
              ),
            }}
            inputProps={{
              maxLength: 100,
              autoComplete: "email",
              "aria-label": "Email address",
              pattern: emailRegex.source,
            }}
            required
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            error={!!passwordError}
            helperText={passwordError}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: passwordError ? "error.main" : "grey.400" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{
              maxLength: 100,
              autoComplete: "current-password",
              "aria-label": "Password",
              minLength: 6,
            }}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !!emailError || !!passwordError}
            sx={{
              mb: 3,
              py: 1.5,
              background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)",
              },
              "&:disabled": {
                background: "grey.300",
                color: "grey.500",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "grey.600" }}
        >
          New here?{" "}
          <Link
            to="/register"
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Create an account
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}