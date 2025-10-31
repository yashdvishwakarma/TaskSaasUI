// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
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
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  CheckCircle,
} from "@mui/icons-material";
import { theme } from "../theme/theme";
import AppConstatns from "../api/AppConstants";

export default function Register() {
  const { doRegister } = useAuth();
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Validation errors
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation functions
  const validateFullName = (value: string) => {
    if (!value.trim()) {
      setFullNameError("Full name is required");
      return false;
    }
    if (value.trim().length < 2) {
      setFullNameError("Full name must be at least 2 characters");
      return false;
    }
    if (value.length > 100) {
      setFullNameError("Full name must be less than 100 characters");
      return false;
    }
    // Check for valid name characters (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      setFullNameError("Full name can only contain letters, spaces, hyphens, and apostrophes");
      return false;
    }
    setFullNameError("");
    return true;
  };

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
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (value.length > 100) {
      setPasswordError("Password must be less than 100 characters");
      return false;
    }
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(value)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    // Check for at least one number
    if (!/\d/.test(value)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordError("Password must contain at least one special character");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  // Handle input changes
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    validateFullName(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    // Re-validate confirm password if it has a value
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateConfirmPassword(value);
  };

  // Handle blur events
  const handleFullNameBlur = () => validateFullName(fullName);
  const handleEmailBlur = () => validateEmail(email);
  const handlePasswordBlur = () => validatePassword(password);
  const handleConfirmPasswordBlur = () => validateConfirmPassword(confirmPassword);

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    return { strength, label: labels[strength] };
  };

  const passwordStrength = getPasswordStrength();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const isFullNameValid = validateFullName(fullName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    
    try {
      
      const response: any = await doRegister(fullName, email, password, AppConstatns.UserRoles.Admin);
      
      if (response?.data?.isSuccess && response?.data) {
        // Success case - manually store data
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        nav("/dashboard");
      } 
      else if (response?.data?.success) {
        // Error case - show specific error message
        setError(response.data.success.message);
      } else if (response?.error?.message) {
        // Handle API error messages
        setError(response.error.message);
      } else {
        // Fallback error
        setError("Registration failed. Please try again.");
      }
      
    } catch (err: any) {
      setError("Network error. Please check your connection.");
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
          Create account
        </Typography>
        
        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 5, color: "grey.600" }}
        >
          Start managing your tasks today
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={submit} noValidate>
          <TextField
            fullWidth
            label="Full name"
            value={fullName}
            onChange={handleFullNameChange}
            onBlur={handleFullNameBlur}
            error={!!fullNameError}
            helperText={fullNameError}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: fullNameError ? "error.main" : "grey.400" }} />
                </InputAdornment>
              ),
            }}
            inputProps={{
              maxLength: 100,
              autoComplete: "name",
              "aria-label": "Full name",
            }}
            required
          />

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
            sx={{ mb: 2 }}
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
              autoComplete: "new-password",
              "aria-label": "Password",
              minLength: 8,
            }}
            required
          />

          {/* Password strength indicator */}
          {password && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ flex: 1, display: 'flex', gap: 0.5 }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Box
                      key={level}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: level <= passwordStrength.strength 
                          ? passwordStrength.strength <= 2 ? 'error.main' 
                          : passwordStrength.strength <= 3 ? 'warning.main' 
                          : 'success.main'
                          : 'grey.300',
                        transition: 'background-color 0.3s',
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" sx={{ 
                  color: passwordStrength.strength <= 2 ? 'error.main' 
                    : passwordStrength.strength <= 3 ? 'warning.main' 
                    : 'success.main',
                  minWidth: 80,
                }}>
                  {passwordStrength.label}
                </Typography>
              </Box>
            </Box>
          )}

          <TextField
            fullWidth
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: confirmPasswordError ? "error.main" : "grey.400" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{
              maxLength: 100,
              autoComplete: "new-password",
              "aria-label": "Confirm password",
            }}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{" "}
                <Link to="/terms" style={{ color: theme.palette.primary.main }}>
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link to="/privacy" style={{ color: theme.palette.primary.main }}>
                  Privacy Policy
                </Link>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !!fullNameError || !!emailError || !!passwordError || !!confirmPasswordError || !agreeToTerms}
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
              "Create account"
            )}
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "grey.600" }}
        >
          Have an account?{" "}
          <Link
            to="/login"
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}