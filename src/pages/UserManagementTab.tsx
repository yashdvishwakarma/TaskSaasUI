// src/components/UserManagementTab.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  TablePagination,
  Switch,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  colors,
} from '@mui/material';
import {
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import { userApi  } from '../api/User/userApi';
import { profileApi  } from '../api/profile/profileApi';
import type { User } from '../api/User/types';
import type { UpdateProfileDto } from '../api/profile/types';
import { ApiException } from '../api/types';
import AppConstants from '../api/AppConstants';

export default function UserManagementTab() {
  const localUser = localStorage.getItem('user');
  const parsedUser = localUser ? JSON.parse(localUser) : null;

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<User>({
    fullName: '',
    email: '',
    password: '',
    role: null,
    organizationId: parsedUser?.organizationId,
    id : 1,
    createdAt : '',
    updatedAt : '',
    activityLog : '',
    idTask_AssigneeId : '',
    idTask_OwnerId : '',    
    isActive : true
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userApi.getUsers({
        page: page + 1,
        limit: rowsPerPage,
        organizationId: parsedUser?.organizationId,
      });
      setUsers(response.data);
      setTotal(response.total);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || 'Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    
    try {
      setError('');
      
      // Validation
      if (!formData.fullName || !formData.email || !formData.password) {
        setError('All fields are required');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      
      await userApi.registerUser(formData);
      setSuccessMessage('User created successfully');
      setCreateDialogOpen(false);
      resetForm();
      loadUsers();
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || 'Failed to create user');
      }
    }
  };

    const [editForm, setEditForm] = useState<UpdateProfileDto>({
      fullName: '',
      email: '',
      UserId : parsedUser?.id,
    });

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean, userDetail : User ) => {
    try {
      userDetail = {
        ...userDetail,
        isActive: !currentStatus
      }
      await profileApi.updateProfile( { ...userDetail});
      setSuccessMessage('User status updated successfully');
      loadUsers();
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || 'Failed to update user status');
      }
    }
  };

  const resetForm = () => {
    setFormData({
    fullName: '',
    email: '',
    password: '',
    role: null,
    organizationId: parsedUser?.organizationId,
    id : 1,
    createdAt : '',
    updatedAt : '',
    activityLog : '',
    idTask_AssigneeId : '',
    idTask_OwnerId : '',      
    isActive : true
    });
  };

  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage]);

  return (
    <Box>
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

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Organization Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      user.role == AppConstants.UserRoles.Admin
                        ? "Admin"
                        : user.role == AppConstants.UserRoles.User
                        ? "User"
                        : "Guest"
                    }
                    color={
                      user.role == AppConstants.UserRoles.Admin
                        ? "error"
                        : "primary"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                  //keeing the status active by default for now
                    // icon={ <ActiveIcon />}
                    // label={"Active"}
                    // color={ "success"}
                    icon={user.isActive ? <ActiveIcon /> : <BlockIcon />}
                    label={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.isActive}
                    onChange={() =>
                      handleToggleUserStatus(user.id, user.isActive,user)
                    }
                    disabled={user.id === parsedUser?.id} // Can't disable self
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            margin="normal"
            required
            helperText="Minimum 6 characters"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              label="Role"
            >
              <MenuItem value={AppConstants.UserRoles.User}>User</MenuItem>
              {/* Admin can only create users, not other admins */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateDialogOpen(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            color="primary"
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}