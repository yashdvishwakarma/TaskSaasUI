// src/components/TaskAssignmentTab.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { taskApi } from '../api/taskApi';
import { userApi } from '../api/User/userApi';
import type { TaskItem, CreateTaskDto } from '../api/taskApi';
import type { User }  from '../api/User/types';
import { ApiException } from '../api/types';
import dayjs from 'dayjs';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function TaskAssignmentTab() {
  const localUser = localStorage.getItem('user');
  const parsedUser = localUser ? JSON.parse(localUser) : null;

  // State
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEditTask, setSelectedEditTask] = useState<TaskItem>({
    title: '',
    description: '',
    dueDate: new Date(),
    assigneeId: 0,
    status: 0,
    ownerId: parsedUser?.id ?? 0,
    id: 0,
  });

    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;

  // Form state
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    dueDate: new Date(),
    assigneeId: null,
    status: 0,
    owner: parsedUser?.id ?? 0,
  });

  // Load organization users
  const loadUsers = async () => {
    try {
      const response = await userApi.getUsers({ 
        organizationId: parsedUser?.organizationId 
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  // Load tasks created by admin
  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTasks({ 
        ownerId: parsedUser?.id 
      });
      setTasks(response.data);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || 'Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  };

  // Create task with assignment
  const handleCreateTask = async () => {
    try {
      setError('');
      
      // Validation
      if (!formData.title.trim()) {
        setError('Task title is required');
        return;
      }

      await taskApi.createTask({
        ...formData,
        assigneeId: formData.assigneeId === null ? undefined : formData.assigneeId,
      });
      setSuccessMessage('Task created and assigned successfully');
      setCreateDialogOpen(false);
      resetForm();
      loadTasks();
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || 'Failed to create task');
      }
    }
  };

    // Update task with assignment
  const handleEditTask = async () => {
    try {
      setError('');
      
      // Validation
      if (!selectedEditTask.title.trim()) {
        setError('Task title is required');
        return;
      }

      await taskApi.updateTask({
        ...selectedEditTask,
        assigneeId: selectedEditTask.assigneeId === null ? undefined : selectedEditTask.assigneeId,
      });
      setSuccessMessage('Task Updated and assigned successfully');
      setEditDialogOpen(false);
      resetForm();
      loadTasks();
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || 'Failed to create task');
      }
    }
  };

  // Quick assign task
  const handleQuickAssign = async (taskId: number, userId: number,task: TaskItem) => {
    try {
      task = {
      ...task,
      assigneeId: userId
      }
      await taskApi.updateTask(task);
      setSuccessMessage('Task assigned successfully');
      loadTasks();
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || 'Failed to assign task');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: new Date(),
      assigneeId: null,
      status: 0,
      owner: parsedUser?.id ?? 0,
    });
    setSelectedEditTask({
      title: "",
      description: "",
      dueDate: new Date(),
      assigneeId: 0,
      status: 0,
      ownerId: parsedUser?.id ?? 0,
      id: 0,
    });
  };

  useEffect(() => {
    loadUsers();
    loadTasks();
  }, []);


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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

        {/* Summary Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid sx={{  "xs":12, "sm":4}}>
            <Item>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Tasks
                  </Typography>
                  <Typography variant="h4">{tasks.length}</Typography>
                </CardContent>
              </Card>
              </Item>
          </Grid>
          <Grid sx={{  "xs":12, "sm":4}}>
                   <Item>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Assigned Tasks
                </Typography>
                <Typography variant="h4">
                  {tasks.filter((t) => t.assigneeId).length}
                </Typography>
              </CardContent>
            </Card>
            </Item>
          </Grid>
          <Grid sx={{  "xs":12, "sm":4}}>
            <Item>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Team Members
                </Typography>
                <Typography variant="h4">{users.length}</Typography>
              </CardContent>
            </Card>
            </Item>
          </Grid>
        </Grid>

        {/* Actions */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6">Task Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create & Assign Task
          </Button>
        </Box>

        {/* Tasks Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status === 0 ? "Pending" : "Completed"}
                      color={task.status === 0 ? "warning" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(task.dueDate ? task.dueDate.toString() : Date.UTC.toString()).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {task.assigneeId ? (
                      <Chip
                        label={
                          userData.id == task.assigneeId ? userData.fullName : users.find((u) => u.id == task.assigneeId) ? 
                            users.find((u) => u.id == task.assigneeId)?.fullName : ""
                        }
                        color="primary"
                        size="small"
                      />
                    ) : (
                      <Autocomplete
                        size="small"
                        options={users}
                        getOptionLabel={(option) => option.fullName}
                        style={{ width: 200 }}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Assign to..." />
                        )}
                        onChange={(_, value) => {
                          if (value) handleQuickAssign(task.id, value.id,task);
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary"  onClick={() =>{setSelectedEditTask(task), setEditDialogOpen(true)} }>
                
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create Task Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create & Assign Task</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Task Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
            />
            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(newDate) =>
                setFormData({ ...formData, dueDate: newDate || new Date() })
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  required: true,
                },
              }}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Assign To</InputLabel>
              <Select
                value={formData.assigneeId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assigneeId: Number(e.target.value) || null,
                  })
                }
                label="Assign To"
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                label="Status"
              >
                <MenuItem value={0}>Pending</MenuItem>
                <MenuItem value={1}>In Progress</MenuItem>
                <MenuItem value={2}>Completed</MenuItem>
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
              onClick={handleCreateTask}
              variant="contained"
              color="primary"
            >
              Create Task
            </Button>
          </DialogActions>
        </Dialog>


        {/* Edit Task Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit & Assign Task</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Task Title"
              value={selectedEditTask?.title}
              onChange={(e) =>
                setSelectedEditTask({ ...selectedEditTask, title: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={selectedEditTask.description}
              onChange={(e) =>
                setSelectedEditTask({ ...selectedEditTask, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
            />
            <DatePicker
              label="Due Date"   
              value={dayjs(selectedEditTask.dueDate).toDate() ||  new date()}
              onChange={(newDate) =>
                setSelectedEditTask({ ...selectedEditTask, dueDate: newDate || new Date() })
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  required: true,
                },
              }}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Assign To</InputLabel>
              <Select
                value={selectedEditTask.assigneeId || ""}
                onChange={(e) =>
                  setSelectedEditTask({
                    ...selectedEditTask,
                    assigneeId: Number(e.target.value) || 0,
                  })
                }
                label="Assign To"
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setSelectedEditTask({ ...selectedEditTask, status: e.target.value })
                }
                label="Status"
              >
                <MenuItem value={0}>Pending</MenuItem>
                <MenuItem value={1}>In Progress</MenuItem>
                <MenuItem value={2}>Completed</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditTask}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}