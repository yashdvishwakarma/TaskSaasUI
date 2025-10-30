// src/pages/Dashboard.tsx
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import { createTask, deleteTask, type TaskItem } from "../api/task";
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
  ToggleButtonGroup,
  ToggleButton,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  RadioGroup,
  Radio,
  Collapse,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Delete,
  Edit,
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  Search,
  FilterList,
  Download,
  Upload,
  Close,
  RadioButtonUnchecked,
  Flag,
  Person,
  CalendarToday,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { taskApi } from "../api/taskApi";
import { ApiException } from "../api/types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const statusConfig = {
  0: { label: "To do", color: "#E5E7EB", textColor: "#6B7280" },
  1: { label: "In Progress", color: "#FEF3C7", textColor: "#D97706" },
  2: { label: "Done", color: "#D1FAE5", textColor: "#059669" },
};

const priorityConfig = {
  0: { label: "Low", color: "#10B981" },
  1: { label: "Medium", color: "#F59E0B" },
  2: { label: "High", color: "#EF4444" },
};

const getStatusIcon = (status: number) => {
  switch (status) {
    case 0:
      return <RadioButtonUnchecked sx={{ fontSize: 20, color: "grey.500" }} />;
    case 1:
      return <Schedule sx={{ fontSize: 20, color: "warning.main" }} />;
    case 2:
      return <CheckCircle sx={{ fontSize: 20, color: "success.main" }} />;
    default:
      return <RadioButtonUnchecked sx={{ fontSize: 20, color: "grey.500" }} />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

export default function Dashboard() {
  const theme = useTheme();
  const localUser = localStorage.getItem("user");
  const parsedUser = localUser ? JSON.parse(localUser) : null;
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [openNewTaskDialog, setOpenNewTaskDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    task: TaskItem | null;
  }>({
    open: false,
    task: null,
  });

  // New task dialog states - with proper default date
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    priority: 1,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    tags: "",
  });

  const user = localStorage.getItem("user");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N for new task
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setOpenNewTaskDialog(true);
      }
      // Cmd/Ctrl + F for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        document.getElementById("task-search")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const loadTasks = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const result = await taskApi.getTasks({
        page,
        limit: pagination.limit,
      });
      setTasks(
        result.data
          ? result.data.map((task: any) => ({
              ...task,
              dueDate: task.dueDate
                ? task.dueDate.toISOString?.() ?? String(task.dueDate)
                : undefined,
              priority: task.priority || 1,
              tags: task.tags || [],
            }))
          : []
      );

      setPagination({
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (err) {
      if (err instanceof ApiException) {
        switch (err.code) {
          case "UNAUTHORIZED":
            setError("You are not authorized to view tasks. Please login.");
            break;
          case "NETWORK_ERROR":
            setError("Network error. Please check your internet connection.");
            break;
          default:
            setError(err.message || "Failed to load tasks");
        }

        console.error("API Error:", {
          code: err.code,
          message: err.message,
          details: err.details,
          statusCode: err.statusCode,
        });
      } else {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return (b.priority || 0) - (a.priority || 0);
        case "dueDate":
          return (
            new Date(a.dueDate || 0).getTime() -
            new Date(b.dueDate || 0).getTime()
          );
        case "status":
          return a.status - b.status;
        default:
          return b.id - a.id;
      }
    });

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title,
        status: 0,
        owner: user ? JSON.parse(user).id : null,
        Role: "User",
        organizationId: parsedUser?.organizationId ?? 0,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setTitle("");
      await loadTasks();
    } catch (err) {
      setError("Failed to create task");
    }
  };

  // Add this state for dialog error
  const [dialogError, setDialogError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Update createAdvancedTask function
  const createAdvancedTask = async () => {
    try {
      setDialogError(""); // Clear any previous errors

      // Format the date properly
      const formattedDate = newTaskData.dueDate
        ? newTaskData.dueDate.toISOString() // ISO format for API
        : "";

      await createTask({
        title: newTaskData.title,
        description: newTaskData.description,
        status: 0,
        priority: newTaskData.priority,
        dueDate: formattedDate,
        tags: newTaskData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        owner: user ? JSON.parse(user).id : null,
        Role: "User",
        organizationId: parsedUser?.organizationId ?? 0,
      });

      setOpenNewTaskDialog(false);
      // Reset with proper default date
      setNewTaskData({
        title: "",
        description: "",
        priority: 1,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tags: "",
      });

      // Show success message
      setError(""); // Clear any existing errors
      setSuccessMessage("Task created successfully!");

      await loadTasks();
    } catch (err) {
      // Show error in dialog instead of main page
      setDialogError("Failed to create task. Please try again.");
    }
  };

  // Add auto-dismiss for success and error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleBulkComplete = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) => {
          const task = tasks.find((t) => t.id === taskId);
          if (task) {
            return taskApi.updateTask({
              ...task,
              status: 2,
              assigneeId:
                task.assigneeId === null ? undefined : task.assigneeId,
            });
          }
        })
      );
      setSelectedTasks([]);
      await loadTasks();
    } catch (err) {
      setError("Failed to complete tasks");
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
      await taskApi.updateTask({
        ...task,
        assigneeId: task.assigneeId === null ? undefined : task.assigneeId,
        title: editTitle,
      });
      setEditingTask(null);
      await loadTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle("");
  };

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(filteredTasks, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `tasks-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importTasks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedTasks = JSON.parse(e.target?.result as string);
        // Process imported tasks here
        setError("Import functionality to be implemented with API");
      } catch (err) {
        setError("Failed to import tasks");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const completionPercentage =
    tasks.length > 0
      ? (tasks.filter((t) => t.status === 2).length / tasks.length) * 100
      : 0;


      // Also update other operations to show success messages
const handleDelete = async (taskId: number) => {
  try {
    await deleteTask({
      id: taskId,
      title,
      status: 0,
      owner: user ? JSON.parse(user).id : null,
      Role: "User",
    });
    setAnchorEl(null);
    setSuccessMessage("Task deleted successfully!");
    await loadTasks();
  } catch (err) {
    setError("Failed to delete task");
  }
};

const toggleStatus = async (task: TaskItem) => {
  const nextStatus = task.status === 2 ? 0 : task.status + 1;
  
  if (task.status === 2 && nextStatus === 0) {
    setConfirmDialog({ open: true, task });
    return;
  }
  
  try {
    await taskApi.updateTask({
      ...task,
      status: nextStatus,
      assigneeId: task.assigneeId === null ? undefined : task.assigneeId,
    });
    
    // Show appropriate success message
    const statusMessage = nextStatus === 2 
      ? "Task completed!" 
      : nextStatus === 1 
      ? "Task moved to In Progress" 
      : "Task moved to To Do";
    
    setSuccessMessage(statusMessage);
    await loadTasks();
  } catch (err) {
    setError("Failed to update task");
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: 5,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3 }}>
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
            {Array.isArray(tasks)
              ? `${tasks.filter((t) => t.status !== 2).length} active, ${
                  tasks.filter((t) => t.status === 2).length
                } completed`
              : "Loading tasks..."}
          </Typography>
        </Box>
        {/* Summary Cards */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ mb: 5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              flex: 1,
              borderRadius: 2,
              background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
              color: "white",
            }}
          >
            <Stack spacing={1}>
              <Assignment sx={{ fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold">
                {tasks.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Tasks
              </Typography>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              flex: 1,
              borderRadius: 2,
              backgroundColor: "#D1FAE5",
              color: "#059669",
            }}
          >
            <Stack spacing={1}>
              <CheckCircle sx={{ fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold">
                {tasks.filter((t) => t.status === 2).length}
              </Typography>
              <Typography variant="body2">Completed</Typography>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              flex: 1,
              borderRadius: 2,
              backgroundColor: "#FEF3C7",
              color: "#D97706",
            }}
          >
            <Stack spacing={1}>
              <Schedule sx={{ fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold">
                {tasks.filter((t) => t.status === 1).length}
              </Typography>
              <Typography variant="body2">In Progress</Typography>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              flex: 1,
              borderRadius: 2,
              backgroundColor: "#E5E7EB",
              color: "#6B7280",
            }}
          >
            <Stack spacing={1}>
              <TrendingUp sx={{ fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold">
                {tasks.filter((t) => t.status === 0).length}
              </Typography>
              <Typography variant="body2">To Do</Typography>
            </Stack>
          </Paper>
        </Stack>
        {/* Progress Bar */}
        <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2" color="text.secondary">
                Overall Progress
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                {completionPercentage.toFixed(0)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  background:
                    "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
                  borderRadius: 1,
                },
              }}
            />
          </Stack>
        </Paper>
        {/* Filter & Search Bar */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <TextField
            id="task-search"
            size="small"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: "grey.400", mr: 1 }} />,
            }}
            sx={{ flex: 1 }}
          />

          <ToggleButtonGroup
            value={filterStatus}
            exclusive
            onChange={(e, value) => value !== null && setFilterStatus(value)}
            size="small"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value={0}>To Do</ToggleButton>
            <ToggleButton value={1}>In Progress</ToggleButton>
            <ToggleButton value={2}>Completed</ToggleButton>
          </ToggleButtonGroup>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="createdAt">Date Created</MenuItem>
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>

          <Button
            startIcon={<Download />}
            onClick={exportTasks}
            variant="outlined"
            size="small"
          >
            Export
          </Button>

          <Button
            component="label"
            startIcon={<Upload />}
            variant="outlined"
            size="small"
          >
            Import
            <input type="file" hidden accept=".json" onChange={importTasks} />
          </Button>
        </Stack>
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
                startAdornment: <Add sx={{ color: "grey.400", mr: 2 }} />,
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
                  background:
                    "linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)",
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
        ) : filteredTasks.length === 0 ? (
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
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Add your first task to get started"}
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {filteredTasks.map((task) => (
              <Fade in key={task.id}>
                <Paper
                  className="task-row"
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: selectedTasks.includes(task.id)
                      ? "primary.main"
                      : "grey.200",
                    transition: "all 0.2s ease",
                    position: "relative",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "grey.300",
                      boxShadow: theme.shadows[2],
                      "& .task-actions": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  {/* Status Indicator Bar */}
                  <Box
                    sx={{
                      width: 4,
                      height: "80%",
                      borderRadius: 1,
                      backgroundColor:
                        statusConfig[task.status as keyof typeof statusConfig]
                          ?.color || "#E5E7EB",
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />

                  <Stack spacing={1}>
                    {/* Main Task Row */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ ml: 2 }}
                    >
                      {/* Status Toggle Button */}
                      <Tooltip
                        title={`Status: ${
                          statusConfig[task.status as keyof typeof statusConfig]
                            ?.label
                        }`}
                      >
                        <IconButton
                          size="small"
                          onClick={() => toggleStatus(task)}
                          sx={{
                            width: 36,
                            height: 36,
                            border: "2px solid",
                            borderColor:
                              task.status === 2 ? "success.light" : "grey.300",
                            backgroundColor:
                              task.status === 2
                                ? "success.light"
                                : "transparent",
                            "&:hover": {
                              backgroundColor:
                                task.status === 2
                                  ? "success.main"
                                  : alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          {getStatusIcon(task.status)}
                        </IconButton>
                      </Tooltip>

                      {/* Task Content */}
                      <Box
                        flex={1}
                        onClick={() =>
                          setExpandedTask(
                            expandedTask === task.id ? null : task.id
                          )
                        }
                      >
                        {editingTask === task.id ? (
                          <TextField
                            fullWidth
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                saveEdit(task);
                              }
                              if (e.key === "Escape") {
                                cancelEdit();
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            variant="standard"
                            sx={{
                              "& .MuiInput-underline:before": {
                                borderBottom: "1px solid #E5E7EB",
                              },
                            }}
                          />
                        ) : (
                          <>
                            <Typography
                              variant="body1"
                              sx={{
                                textDecoration:
                                  task.status === 2 ? "line-through" : "none",
                                color:
                                  task.status === 2
                                    ? "text.disabled"
                                    : "text.primary",
                                fontWeight: 500,
                              }}
                            >
                              {task.title || "Untitled Task"}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              mt={0.5}
                              alignItems="center"
                              flexWrap="wrap"
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                #{task.id}
                              </Typography>
                              <Chip
                                label={
                                  statusConfig[
                                    task.status as keyof typeof statusConfig
                                  ]?.label || "Unknown"
                                }
                                size="small"
                                sx={{
                                  height: 20,
                                  backgroundColor:
                                    statusConfig[
                                      task.status as keyof typeof statusConfig
                                    ]?.color || "#E5E7EB",
                                  color:
                                    statusConfig[
                                      task.status as keyof typeof statusConfig
                                    ]?.textColor || "#6B7280",
                                  fontWeight: 500,
                                  fontSize: "0.75rem",
                                }}
                              />
                              {task.priority !== undefined && (
                                <Chip
                                  icon={<Flag sx={{ fontSize: 14 }} />}
                                  label={
                                    priorityConfig[
                                      task.priority as keyof typeof priorityConfig
                                    ]?.label
                                  }
                                  size="small"
                                  sx={{
                                    height: 20,
                                    backgroundColor: `${
                                      priorityConfig[
                                        task.priority as keyof typeof priorityConfig
                                      ]?.color
                                    }20`,
                                    color:
                                      priorityConfig[
                                        task.priority as keyof typeof priorityConfig
                                      ]?.color,
                                    fontWeight: 600,
                                    "& .MuiChip-icon": {
                                      color:
                                        priorityConfig[
                                          task.priority as keyof typeof priorityConfig
                                        ]?.color,
                                    },
                                  }}
                                />
                              )}
                              {task.dueDate && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Due:{" "}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                              )}
                              {task.tags?.map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, borderRadius: 1 }}
                                />
                              ))}
                            </Stack>

                            {/* Progress Indicator */}
                            <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                              {[0, 1, 2].map((status) => (
                                <Box
                                  key={status}
                                  sx={{
                                    width: 30,
                                    height: 3,
                                    borderRadius: 1,
                                    backgroundColor:
                                      task.status >= status
                                        ? statusConfig[
                                            status as keyof typeof statusConfig
                                          ]?.color
                                        : alpha(theme.palette.grey[400], 0.3),
                                    transition: "all 0.3s",
                                  }}
                                />
                              ))}
                            </Stack>
                          </>
                        )}
                      </Box>

                      {/* Actions - hidden by default */}
                      <Stack
                        direction="row"
                        spacing={1}
                        className="task-actions"
                        sx={{ opacity: 0, transition: "opacity 0.2s" }}
                      >
                        {!editingTask && (
                          <>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(task);
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>

                            <Checkbox
                              checked={selectedTasks.includes(task.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleTaskSelection(task.id);
                              }}
                              size="small"
                              onClick={(e) => e.stopPropagation()}
                            />

                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnchorEl(e.currentTarget);
                                setSelectedTaskId(task.id);
                              }}
                            >
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </>
                        )}

                        {editingTask === task.id && (
                          <>
                            <Button
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                saveEdit(task);
                              }}
                              sx={{ minWidth: 60 }}
                            >
                              Save
                            </Button>
                            <Button
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelEdit();
                              }}
                              color="inherit"
                              sx={{ minWidth: 60 }}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </Stack>

                      {/* Expand/Collapse Icon */}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedTask(
                            expandedTask === task.id ? null : task.id
                          );
                        }}
                      >
                        {expandedTask === task.id ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </Stack>

                    {/* Expandable Task Details */}
                    <Collapse
                      in={expandedTask === task.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ pt: 2, pl: 7, pr: 2 }}>
                        <Stack spacing={2}>
                          {task.description && (
                            <Box>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                color="text.secondary"
                              >
                                Description
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {task.description}
                              </Typography>
                            </Box>
                          )}
                          <Stack direction="row" spacing={2} flexWrap="wrap">
                            <Chip
                              icon={<Person sx={{ fontSize: 16 }} />}
                              label={`Created by ${task?.owner || "Unknown"}`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={<CalendarToday sx={{ fontSize: 16 }} />}
                              label={`Created ${formatDate(task?.createdAt)}`}
                              size="small"
                              variant="outlined"
                            />
                          </Stack>
                        </Stack>
                      </Box>
                    </Collapse>
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
              const task = tasks.find((t) => t.id === selectedTaskId);
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
        {/* Bulk Actions Bar */}
        {selectedTasks.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              p: 2,
              borderRadius: 3,
              zIndex: 1000,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2">
                {selectedTasks.length} selected
              </Typography>
              <Button
                size="small"
                onClick={handleBulkComplete}
                variant="contained"
              >
                Mark Complete
              </Button>
              <IconButton size="small" onClick={() => setSelectedTasks([])}>
                <Close />
              </IconButton>
            </Stack>
          </Paper>
        )}
        {/* Speed Dial for Quick Actions */}
        <SpeedDial
          ariaLabel="Quick actions"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            icon={<Add />}
            tooltipTitle="New Task"
            onClick={() => setOpenNewTaskDialog(true)}
          />
          <SpeedDialAction
            icon={<FilterList />}
            tooltipTitle="Filter"
            onClick={() => setOpenFilterDialog(true)}
          />
        </SpeedDial>
        {/* Success Alert */}
        {successMessage && (
          <Fade in={true}>
            <Alert
              severity="success"
              onClose={() => setSuccessMessage("")}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {successMessage}
            </Alert>
          </Fade>
        )}
        {/* Error Alert */}
        {error && (
          <Fade in={true}>
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {error}
            </Alert>
          </Fade>
        )}
        {/* New Task Dialog */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Dialog
            open={openNewTaskDialog}
            onClose={() => {
              setOpenNewTaskDialog(false);
              setDialogError(""); // Clear error when closing
            }}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Create New Task</DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                {/* Show error in dialog */}
                {dialogError && (
                  <Alert
                    severity="error"
                    onClose={() => setDialogError("")}
                    sx={{ mb: 2 }}
                  >
                    {dialogError}
                  </Alert>
                )}

                <TextField
                  label="Title"
                  fullWidth
                  value={newTaskData.title}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, title: e.target.value })
                  }
                  required
                  error={dialogError !== "" && !newTaskData.title.trim()}
                  helperText={
                    dialogError && !newTaskData.title.trim()
                      ? "Title is required"
                      : ""
                  }
                />
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={newTaskData.description}
                  onChange={(e) =>
                    setNewTaskData({
                      ...newTaskData,
                      description: e.target.value,
                    })
                  }
                />
                <FormControl>
                  <Typography variant="subtitle2" gutterBottom>
                    Priority
                  </Typography>
                  <RadioGroup
                    row
                    value={newTaskData.priority}
                    onChange={(e) =>
                      setNewTaskData({
                        ...newTaskData,
                        priority: parseInt(e.target.value),
                      })
                    }
                  >
                    <FormControlLabel
                      value={0}
                      control={<Radio />}
                      label="Low"
                    />
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label="Medium"
                    />
                    <FormControlLabel
                      value={2}
                      control={<Radio />}
                      label="High"
                    />
                  </RadioGroup>
                </FormControl>
                <DatePicker
                  label="Due Date"
                  value={newTaskData.dueDate}
                  onChange={(newDate) =>
                    setNewTaskData({
                      ...newTaskData,
                      dueDate:
                        newDate ||
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    })
                  }
                  minDate={new Date()} // Prevent selecting past dates
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true,
                    },
                  }}
                />
                <TextField
                  label="Tags (comma-separated)"
                  fullWidth
                  value={newTaskData.tags}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, tags: e.target.value })
                  }
                  placeholder="e.g., urgent, work, personal"
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenNewTaskDialog(false);
                  setDialogError(""); // Clear error when canceling
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={createAdvancedTask}
                variant="contained"
                disabled={!newTaskData.title.trim()}
              >
                Create Task
              </Button>
            </DialogActions>
          </Dialog>
        </LocalizationProvider>
        {/* Filter Dialog */}
        <Dialog
          open={openFilterDialog}
          onClose={() => setOpenFilterDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Filter Options</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) =>
                    setFilterStatus(e.target.value as number | "all")
                  }
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value={0}>To Do</MenuItem>
                  <MenuItem value={1}>In Progress</MenuItem>
                  <MenuItem value={2}>Completed</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="createdAt">Date Created</MenuItem>
                  <MenuItem value="dueDate">Due Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFilterDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
        {/* Confirm Dialog for Status Rollback */}
        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ open: false, task: null })}
        >
          <DialogTitle>Move task back to To Do?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to move "{confirmDialog.task?.title}" from
              Done back to To Do?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDialog({ open: false, task: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (confirmDialog.task) {
                  try {
                    await taskApi.updateTask({
                      ...confirmDialog.task,
                      status: 0,
                      assigneeId:
                        confirmDialog.task.assigneeId === null
                          ? undefined
                          : confirmDialog.task.assigneeId,
                    });
                    await loadTasks();
                  } catch (err) {
                    setError("Failed to update task");
                  }
                }
                setConfirmDialog({ open: false, task: null });
              }}
              color="primary"
              variant="contained"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
