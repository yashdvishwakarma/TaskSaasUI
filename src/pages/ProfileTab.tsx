// // src/components/Profile.tsx
// import { Card, CardContent, Typography, Button, Box } from "@mui/material";
// import { GetProfile } from "../api/task";
// import { useEffect, useState } from "react";

// export default  function Profile() {

//     // const [loading, setLoading] = useState(true);
//     // const [error, setError] = useState("");
//     const localUser = localStorage.getItem("user");
//     const parsedUser = localUser ? JSON.parse(localUser) : null;

//     const [profile, setProfile] = useState<any>(null);

//   const loadProfile = async () => {
//     try {
//       // setError("");
//       const res = await GetProfile({ UserId: parsedUser?.id });
//       setProfile(res.data); // save API response
//     } catch (err) {
//       console.error(err);
//       // setError("Failed to load Profile");
//     } finally {
//       // setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   return (
//     <Box display="flex" justifyContent="center" mt={5}>
//       <Card sx={{ maxWidth: 500, width: "100%", p: 3 }}>
//         <CardContent>
//           <Typography variant="h5" gutterBottom>
//             Profile
//           </Typography>

//           <Typography variant="body1"><b>Name:</b> {profile?.fullName}</Typography>
//           <Typography variant="body1"><b>Email:</b> {profile?.email}</Typography>
//           <Typography variant="body1"><b>Role:</b> {profile?.role}</Typography>

//           <Box mt={3} display="flex" gap={2}>
//             <Button variant="contained" color="primary">Edit Profile</Button>
//             <Button variant="outlined" color="secondary">Change Password</Button>
//             <Button variant="text" color="error">Logout</Button>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }


// src/components/Profile.tsx
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { profileApi } from '../api/profile/profileApi';
import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from '../api/profile/types';
import { ApiException } from '../api/types';
import AppConstants from '../api/AppConstants';
import { User } from '../api/User/types';

export default function ProfileTab() {
  const localUser = localStorage.getItem('user');
  const parsedUser = localUser ? JSON.parse(localUser).data : null;

  // State management
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Edit form state
  const [editForm, setEditForm] = useState<User>({
    id: parsedUser?.id,
    fullName: '',
    email: '',
    role: null,
    createdAt: '',
    updatedAt: '',
    activityLog: '',
    password: '',
    idTask_AssigneeId : '',
    idTask_OwnerId : '',
    organizationId : 0,
    isActive: true,
  });
  
  // Password dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState<ChangePasswordDto>({
    OldPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
    UserId : parsedUser?.id
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState('');

  // Load profile
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await profileApi.getProfile(parsedUser?.id);
      setProfile(response);
      setEditForm({
        ...editForm,
        fullName: response.fullName,
        email: response.email,
        id : parsedUser?.id
      });
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || 'Failed to load profile');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');

      // Basic validation
      if (!editForm.fullName.trim()) {
        setError('Name is required');
        return;
      }
      if (!editForm.email.trim() || !editForm.email.includes('@')) {
        setError('Valid email is required');
        return;
      }

      const response = await profileApi.updateProfile( editForm);
      loadProfile();
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully');
      
      // Update local storage user data
      const updatedUser = { ...parsedUser, ...response };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || 'Failed to update profile');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    try {
      setPasswordError('');
      
      // Validation
      if (!passwordForm.OldPassword) {
        setPasswordError('Current password is required');
        return;
      }
      if (!passwordForm.NewPassword || passwordForm.NewPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters');
        return;
      }
      if (passwordForm.NewPassword !== passwordForm.ConfirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }

      setSaving(true);
      await profileApi.changePassword( passwordForm);
      setPasswordDialogOpen(false);
      setSuccessMessage('Password changed successfully');
      
      // Reset form
      setPasswordForm({
        UserId : parsedUser?.id,
        OldPassword: '',
        NewPassword: '',
        ConfirmPassword: '',
      });
    } catch (err) {
      if (err instanceof ApiException) {
        setPasswordError(err.message || 'Failed to change password');
      } else {
        setPasswordError('An unexpected error occurred');
      }
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      ...editForm,
      fullName: profile?.fullName || '',
      email: profile?.email || '',
      id : parsedUser?.id
    });
    setError('');
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    if (parsedUser?.id) {
      loadProfile();
    }
  }, [parsedUser?.id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="center" mt={5}>
        <Card sx={{ maxWidth: 600, width: "100%", p: 3 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h5">Profile</Typography>
              {!isEditing && (
                <IconButton onClick={() => setIsEditing(true)} color="primary">
                  <EditIcon />
                </IconButton>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {isEditing ? (
              // Edit Mode
              <Box component="form" noValidate>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                  margin="normal"
                  required
                  error={!editForm.fullName.trim() && saving}
                  helperText={
                    !editForm.fullName.trim() && saving
                      ? "Name is required"
                      : ""
                  }
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  margin="normal"
                  required
                  error={
                    (!editForm.email.trim() || !editForm.email.includes("@")) &&
                    saving
                  }
                  helperText={
                    (!editForm.email.trim() || !editForm.email.includes("@")) &&
                    saving
                      ? "Valid email is required"
                      : ""
                  }
                />
                <TextField
                  fullWidth
                  label="Role"
                  value={
                    profile?.role == AppConstants.UserRoles.Admin
                      ? "Admin"
                      : profile?.role == AppConstants.UserRoles.User
                      ? "User"
                      : profile?.role == AppConstants.UserRoles.Guest
                      ? "Guest"
                      : ""
                  }
                  margin="normal"
                  disabled
                  helperText="Role cannot be changed"
                />

                <Box mt={3} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleUpdateProfile}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              // View Mode
              <>
                <Box mb={2}>
                  <Typography variant="body1" gutterBottom>
                    <b>Name:</b> {profile?.fullName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <b>Email:</b> {profile?.email}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <b>Role:</b>{" "}
                    {profile?.role == AppConstants.UserRoles.Admin
                      ? "Admin"
                      : profile?.role == AppConstants.UserRoles.User
                      ? "User"
                      : profile?.role == AppConstants.UserRoles.Guest
                      ? "Guest"
                      : ""}
                  </Typography>
                </Box>

                <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setPasswordDialogOpen(true)}
                  >
                    Change Password
                  </Button>
                  <Button variant="text" color="error" onClick={handleLogout}>
                    Logout
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Current Password"
            type={showPasswords.current ? "text" : "password"}
            value={passwordForm.OldPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                OldPassword: e.target.value,
              })
            }
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                      })
                    }
                  >
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="New Password"
            type={showPasswords.new ? "text" : "password"}
            value={passwordForm.NewPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, NewPassword: e.target.value })
            }
            margin="normal"
            required
            helperText="Minimum 6 characters"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        new: !showPasswords.new,
                      })
                    }
                  >
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type={showPasswords.confirm ? "text" : "password"}
            value={passwordForm.ConfirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                ConfirmPassword: e.target.value,
              })
            }
            margin="normal"
            required
            error={
              passwordForm.ConfirmPassword !== "" &&
              passwordForm.NewPassword !== passwordForm.ConfirmPassword
            }
            helperText={
              passwordForm.ConfirmPassword !== "" &&
              passwordForm.NewPassword !== passwordForm.ConfirmPassword
                ? "Passwords do not match"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm,
                      })
                    }
                  >
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPasswordDialogOpen(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            color="primary"
            disabled={saving}
          >
            {saving ? "Changing..." : "Change Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}