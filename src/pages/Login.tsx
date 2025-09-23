// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {theme } from "../theme/theme";
 import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
        minHeight: "100vh",
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

        <form onSubmit={submit}>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "grey.400" }} />
                </InputAdornment>
              ),
            }}
            required
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "grey.400" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mb: 3,
              py: 1.5,
              background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)",
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