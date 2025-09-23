// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask, type TaskItem } from "../api/task";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Chip,
  Stack,
  Checkbox,
  Menu,
  MenuItem,
  Skeleton,
  Alert,
  Fade,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Delete,
  Edit,
} from "@mui/icons-material";

const statusConfig = {
  0: { label: "To do", color: "#E5E7EB", textColor: "#6B7280" },
  1: { label: "In Progress", color: "#FEF3C7", textColor: "#D97706" },
  2: { label: "Done", color: "#D1FAE5", textColor: "#059669" },
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const user = localStorage.getItem("user");

  const load = async () => {
    try {
      setError("");
      const  tasks  = await getTasks();
      setTasks(tasks.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      await createTask({
        title,
        status: 0,
        owner: user ? JSON.parse(user).id : null,
        Role : "User"
      });
      setTitle("");
      await load();
    } catch (err) {
      setError("Failed to create task");
    }
  };

  const toggleStatus = async (task: TaskItem) => {
    const nextStatus = task.status === 2 ? 0 : task.status + 1;
    try {
      await updateTask({
        TaskId: task.id,
        Title: task.title,
        status: nextStatus,
        owner: user ? JSON.parse(user).id : null,
      });
      await load();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      // await deleteTask(taskId);
         await deleteTask({
           id : taskId,
           title,
           status: 0,
           owner: user ? JSON.parse(user).id : null,
           Role: "User",
         });
         setAnchorEl(null);
      await load();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleEdit = (task: TaskItem) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setAnchorEl(null);
  };

  const saveEdit = async (task: TaskItem) => {
    if (!editTitle.trim()) return;
    
    try {
      // await updateTask(task.id, { ...task, title: editTitle });
      await updateTask({
        TaskId : task.id,
        Title : editTitle ? editTitle : task.title,
        status: 0,
        owner: user ? JSON.parse(user).id : null,
      });
      setEditingTask(null);
      await load();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle("");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: 5,
      }}
    >
      <Box sx={{ maxWidth: 800, mx: "auto", px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h2"
            sx={{
              color: "primary.main",
              mb: 1,
              background: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Tasks
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {tasks.filter(t => t.status !== 2).length} active, {tasks.filter(t => t.status === 2).length} completed
          </Typography>
        </Box>

        {/* Add Task Form */}
        <Paper
          component="form"
          onSubmit={add}
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            border: "2px dashed",
            borderColor: "grey.200",
            borderRadius: 2,
            backgroundColor: "grey.50",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.light",
              backgroundColor: "background.paper",
            },
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="standard"
              sx={{
                "& .MuiInput-underline:before": {
                  borderBottom: "none",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottom: "none",
                },
                "& .MuiInput-underline:after": {
                  borderBottom: "none",
                },
                "& input": {
                  fontSize: "1.1rem",
                  fontWeight: 500,
                },
              }}
              InputProps={{
                startAdornment: (
                  <Add sx={{ color: "grey.400", mr: 2 }} />
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!title.trim()}
              sx={{
                minWidth: 100,
                background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)",
                },
              }}
            >
              Add Task
            </Button>
          </Stack>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Tasks List */}
        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={80}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>
        ) : tasks.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: "grey.50",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks yet
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Add your first task to get started
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {tasks.map((task) => (
              <Fade in key={task.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.100",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "grey.200",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" alignItems="center" spacing={2} flex={1}>
                      <Checkbox
                        checked={task.status === 2}
                        onChange={() => toggleStatus(task)}
                        sx={{
                          color: "grey.400",
                          "&.Mui-checked": {
                            color: "success.main",
                          },
                        }}
                      />
                      
                      {editingTask === task.id ? (
                        <TextField
                          fullWidth
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveEdit(task);
                            }
                          }}
                          onBlur={() => saveEdit(task)}
                          autoFocus
                          variant="standard"
                          sx={{
                            "& .MuiInput-underline:before": {
                              borderBottom: "1px solid #E5E7EB",
                            },
                          }}
                        />
                      ) : (
                        <Box flex={1}>
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: task.status === 2 ? "line-through" : "none",
                              color: task.status === 2 ? "text.disabled" : "text.primary",
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                            onClick={() => handleEdit(task)}
                          >
                            {task.title}
                          </Typography>
                          <Stack direction="row" spacing={1} mt={1}>
                            <Typography variant="caption" color="text.secondary">
                              #{task.id}
                            </Typography>
                            <Chip
                              label={statusConfig[task.status as keyof typeof statusConfig].label}
                              size="small"
                              sx={{
                                backgroundColor: statusConfig[task.status as keyof typeof statusConfig].color,
                                color: statusConfig[task.status as keyof typeof statusConfig].textColor,
                                fontWeight: 500,
                                fontSize: "0.75rem",
                              }}
                            />
                          </Stack>
                        </Box>
                      )}
                    </Stack>

                    {!editingTask && (
                      <IconButton
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedTaskId(task.id);
                        }}
                        sx={{ color: "grey.400" }}
                      >
                        <MoreVert />
                      </IconButton>
                    )}

                    {editingTask === task.id && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          onClick={() => saveEdit(task)}
                          sx={{ minWidth: 60 }}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          onClick={cancelEdit}
                          color="inherit"
                          sx={{ minWidth: 60 }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Paper>
              </Fade>
            ))}
          </Stack>
        )}

        {/* Task Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 150,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              const task = tasks.find(t => t.id === selectedTaskId);
              if (task) handleEdit(task);
            }}
            sx={{ gap: 1.5 }}
          >
            <Edit fontSize="small" sx={{ color: "grey.600" }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => selectedTaskId && handleDelete(selectedTaskId)}
            sx={{ gap: 1.5, color: "error.main" }}
          >
            <Delete fontSize="small" />
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}