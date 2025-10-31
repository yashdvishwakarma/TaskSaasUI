// src/components/Header.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Business, Logout, Padding, Person } from "@mui/icons-material";
import UserAvatar from "./UserAvtar";
import { useState } from "react";
import { useThemeMode as useTheme } from '../contexts/ThemeContext';
import { DarkMode, LightMode } from '@mui/icons-material';

export default function Header() {
   const { toggleTheme, mode } = useTheme();
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user).data : null;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };


  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleOrganizationClick = () => {
    navigate("/organizations");
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    handleLogout();
    handleMenuClose();
  };
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
        <div style={{ display: "flex", alignItems: "center", gap: 70 }}>
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
          {userData && (
            <Typography
              sx={{
                color: "primary.main",
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={() => navigate("/charts")}
            >
              Analytics
            </Typography>
          )}
        </div>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "light" ? <DarkMode /> : <LightMode />}
          </IconButton>
 {userData &&
          <IconButton
            sx={{ border: "none" }}
            onClick={handleMenuOpen}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {userData && userData.fullName ? (
              <UserAvatar
                name={userData.fullName}
                src=""
                sx={{
                  bgcolor: "primary.main",
                  width: 38,
                  height: 38,
                  cursor: "pointer",
                }}
              />
            ) : (
              <UserAvatar
                name={"User"}
                src=""
                sx={{
                  bgcolor: "primary.main",
                  width: 38,
                  height: 38,
                  cursor: "pointer",
                }}
              />
            )}
          </IconButton>
}
          {userData && (
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText>My Profile</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleOrganizationClick}>
                <ListItemIcon>
                  <Business fontSize="small" />
                </ListItemIcon>
                <ListItemText>My Organization</ListItemText>
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogoutClick}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
