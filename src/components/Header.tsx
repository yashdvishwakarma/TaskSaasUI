// src/components/Header.tsx
import { AppBar, Toolbar, Typography, Button, Avatar, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";

export default function Header() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!userData) return null;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "grey.100",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        >
          TaskSaaS
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton sx={{border:"none"}} onClick={() => navigate("/profile") }>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 36,
                height: 36,
              }}
            >
              {userData.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Button
            startIcon={<Logout />}
            onClick={handleLogout}
            color="inherit"
            sx={{ color: "grey.600" }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}