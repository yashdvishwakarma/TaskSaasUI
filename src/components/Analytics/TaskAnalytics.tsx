// src/components/TaskAnalytics.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  Area,
  AreaChart,
  ComposedChart,
  LabelList,
} from "recharts";
import {
  Box,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Menu,
  Divider,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Skeleton,
  ButtonGroup,
  Button,
  Stack,
  Tabs,
  Tab,
  Badge,
  Tooltip as MuiTooltip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  CalendarToday,
  Assessment,
  Person,
  Download,
  Refresh,
  DarkMode,
  LightMode,
  FilterList,
  MoreVert,
  Schedule,
  Flag,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Analytics,
  Speed,
  Group,
} from "@mui/icons-material";
import Grid from '@mui/material/Grid';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  differenceInDays,
  addDays,
  startOfMonth,
  endOfMonth,
  parseISO,
} from "date-fns";
import { taskApi } from "../../api/taskApi";
import { useThemeMode } from "../../contexts/ThemeContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { theme } from "../../theme/theme";

// Constants
const COLORS = {
  status: ["#FFB300", "#0288D1", "#43A047"],
  priority: ["#43A047", "#FFB300", "#F44336"],
  trend: { up: "#43A047", down: "#F44336", flat: "#757575" },
  chart: ["#7C3AED", "#A78BFA", "#E0D4FC", "#F3EFFF"],
};

const STATUS_CONFIG = {
  0: { label: "Pending", color: "#FFB300", icon: "🟡" },
  1: { label: "In Progress", color: "#0288D1", icon: "🔵" },
  2: { label: "Completed", color: "#43A047", icon: "🟢" },
};

const PRIORITY_CONFIG = {
  0: { label: "Low", color: "#43A047", icon: "🟢" },
  1: { label: "Medium", color: "#FFB300", icon: "🟡" },
  2: { label: "High", color: "#F44336", icon: "🔴" },
};

interface Task {
  id: number;
  title: string;
  description?: string;
  status: number;
  dueDate: string;
  priority: number;
  ownerId: number;
  assigneeId: number;
  organizationId: number;
  createdAt: string;
  modifiedAt: string;
  createdBy: number;
  modifiedBy: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color = "primary",
  subtitle,
}) => {
  const { toggleTheme, mode } = useThemeMode(); // Your theme context

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
            {icon}
          </Avatar>
        </Box>
        {change !== undefined && (
          <Box display="flex" alignItems="center" mt={1}>
            {change > 0 ? (
              <TrendingUp sx={{ color: COLORS.trend.up, fontSize: 20 }} />
            ) : change < 0 ? (
              <TrendingDown sx={{ color: COLORS.trend.down, fontSize: 20 }} />
            ) : (
              <TrendingFlat sx={{ color: COLORS.trend.flat, fontSize: 20 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color:
                  change > 0
                    ? COLORS.trend.up
                    : change < 0
                    ? COLORS.trend.down
                    : COLORS.trend.flat,
                ml: 0.5,
              }}
            >
              {Math.abs(change)}% from last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default function TaskAnalytics() {
  const { toggleTheme, mode } = useThemeMode();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7days");
  const [viewType, setViewType] = useState("overview");
  const [selectedUser, setSelectedUser] = useState<number | "all">("all");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Load data
  useEffect(() => {
    loadTaskData();
  }, []);

  const loadTaskData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskApi.getTasks();

      if (response?.data && Array.isArray(response.data)) {
        setTasks(response.data);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError("Unable to load task data");
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on time range
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    const now = new Date();
    let startDate = new Date();

    // Apply time filter
    switch (timeRange) {
      case "7days":
        startDate = subDays(now, 7);
        break;
      case "30days":
        startDate = subDays(now, 30);
        break;
      case "thisMonth":
        startDate = startOfMonth(now);
        break;
      case "custom":
        if (dateRange[0] && dateRange[1]) {
          startDate = dateRange[0];
          const endDate = dateRange[1];
          filtered = filtered.filter((task) => {
            const taskDate = parseISO(task.createdAt);
            return taskDate >= startDate && taskDate <= endDate;
          });
          return filtered;
        }
        break;
    }

    if (timeRange !== "all" && timeRange !== "custom") {
      filtered = filtered.filter((task) => {
        const taskDate = parseISO(task.createdAt);
        return taskDate >= startDate;
      });
    }

    // Apply user filter
    if (selectedUser !== "all") {
      filtered = filtered.filter(
        (task) =>
          task.assigneeId === selectedUser || task.ownerId === selectedUser
      );
    }

    return filtered;
  }, [tasks, timeRange, selectedUser, dateRange]);

    // Calculate average completion time
  const calculateAvgCompletionTime = (tasks: Task[]) => {
    const completedTasks = tasks.filter((t) => t.status === 2);
    if (completedTasks.length === 0) return 0;

    const totalDays = completedTasks.reduce((sum, task) => {
      const created = parseISO(task.createdAt);
      const modified = parseISO(task.modifiedAt);
      return sum + differenceInDays(modified, created);
    }, 0);

    return Math.round(totalDays / completedTasks.length);
  };



  // Calculate task velocity
  const calculateVelocity = (tasks: Task[]) => {
    const lastWeek = tasks.filter((t) => {
      const date = parseISO(t.createdAt);
      return date >= subDays(new Date(), 7);
    });
    const completed = lastWeek.filter((t) => t.status === 2).length;
    return Math.round((completed / 7) * 10) / 10; // Tasks per day
  };

  // Prepare chart data
  const statusChartData = useMemo(() => {
    const counts = {
      Pending: filteredTasks.filter((t) => t.status === 0).length,
      "In Progress": filteredTasks.filter((t) => t.status === 1).length,
      Completed: filteredTasks.filter((t) => t.status === 2).length,
    };

    const total = Object.values(counts).reduce((sum, val) => sum + val, 0);

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
  }, [filteredTasks]);

  const priorityChartData = useMemo(() => {
    const counts = {
      Low: filteredTasks.filter((t) => t.priority === 0).length,
      Medium: filteredTasks.filter((t) => t.priority === 1).length,
      High: filteredTasks.filter((t) => t.priority === 2).length,
    };

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color:
        name === "Low"
          ? COLORS.priority[0]
          : name === "Medium"
          ? COLORS.priority[1]
          : COLORS.priority[2],
    }));
  }, [filteredTasks]);

  // Time series data
  const timeSeriesData = useMemo(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, timeRange === "7days" ? 7 : 30);
    const dates = eachDayOfInterval({ start: startDate, end: endDate });

    return dates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayTasks = filteredTasks.filter(
        (task) => format(parseISO(task.createdAt), "yyyy-MM-dd") === dateStr
      );

      return {
        date: format(date, "MMM dd"),
        created: dayTasks.length,
        completed: dayTasks.filter((t) => t.status === 2).length,
        inProgress: dayTasks.filter((t) => t.status === 1).length,
      };
    });
  }, [filteredTasks, timeRange]);

  // User performance data
  const userPerformanceData = useMemo(() => {
    const userStats = new Map<
      number,
      {
        assigned: number;
        completed: number;
        avgTime: number;
        name: string;
      }
    >();

    filteredTasks.forEach((task) => {
      const userId = task.assigneeId;
      if (!userStats.has(userId)) {
        userStats.set(userId, {
          assigned: 0,
          completed: 0,
          avgTime: 0,
          name: `User ${userId}`, // You'd replace this with actual user names
        });
      }

      const stats = userStats.get(userId)!;
      stats.assigned++;
      if (task.status === 2) {
        stats.completed++;
      }
    });

    return Array.from(userStats.values())
      .map((user) => ({
        ...user,
        completionRate:
          user.assigned > 0
            ? Math.round((user.completed / user.assigned) * 100)
            : 0,
      }))
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 5); // Top 5 users
  }, [filteredTasks]);

  // Overdue analysis
  const overdueData = useMemo(() => {
    const now = new Date();
    const overdueTasks = filteredTasks.filter((task) => {
      const dueDate = parseISO(task.dueDate);
      return dueDate < now && task.status !== 2 && dueDate.getFullYear() > 1;
    });

    const byDays = {
      "1-3 days": 0,
      "4-7 days": 0,
      "1-2 weeks": 0,
      "2+ weeks": 0,
    };

    overdueTasks.forEach((task) => {
      const daysDiff = differenceInDays(now, parseISO(task.dueDate));
      if (daysDiff <= 3) byDays["1-3 days"]++;
      else if (daysDiff <= 7) byDays["4-7 days"]++;
      else if (daysDiff <= 14) byDays["1-2 weeks"]++;
      else byDays["2+ weeks"]++;
    });

    return Object.entries(byDays).map(([range, count]) => ({
      range,
      count,
    }));
  }, [filteredTasks]);

  // Workload prediction (simple linear trend)
  const workloadPrediction = useMemo(() => {
    const dailyCreated = timeSeriesData.map((d) => d.created);
    const avgDaily =
      dailyCreated.reduce((a, b) => a + b, 0) / dailyCreated.length;

    const nextWeek = Array.from({ length: 7 }, (_, i) => ({
      date: format(addDays(new Date(), i + 1), "MMM dd"),
      predicted: Math.round(avgDaily * (1 + (Math.random() * 0.2 - 0.1))), // Simple variation
      type: "predicted",
    }));

    return [...timeSeriesData, ...nextWeek];
  }, [timeSeriesData]);

    // Calculate metrics
  const metrics = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter((t) => t.status === 2).length;
    const inProgress = filteredTasks.filter((t) => t.status === 1).length;
    const pending = filteredTasks.filter((t) => t.status === 0).length;
    const high = filteredTasks.filter((t) => t.priority === 2).length;
    const overdue = filteredTasks.filter((t) => {
      const dueDate = parseISO(t.dueDate);
      return (
        dueDate < new Date() && t.status !== 2 && dueDate.getFullYear() > 1
      );
    }).length;

    // Calculate previous period for comparison
    let prevPeriodTasks = tasks;
    if (timeRange === "7days") {
      const prevStart = subDays(new Date(), 14);
      const prevEnd = subDays(new Date(), 7);
      prevPeriodTasks = tasks.filter((t) => {
        const date = parseISO(t.createdAt);
        return date >= prevStart && date <= prevEnd;
      });
    }

    const prevCompleted = prevPeriodTasks.filter((t) => t.status === 2).length;
    const completionChange = prevCompleted
      ? Math.round(((completed - prevCompleted) / prevCompleted) * 100)
      : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      high,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      completionChange,
      avgCompletionTime: calculateAvgCompletionTime(filteredTasks),
      velocity: calculateVelocity(filteredTasks),
    };
  }, [filteredTasks, tasks, timeRange]);


  // Export functions
  const exportToPDF = async () => {
    const element = document.getElementById("analytics-dashboard");
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 280, 190);
      pdf.save("task-analytics.pdf");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Task ID",
      "Title",
      "Status",
      "Priority",
      "Created",
      "Due Date",
    ];
    const rows = filteredTasks.map((task) => [
      task.id,
      task.title,
      STATUS_CONFIG[task.status].label,
      PRIORITY_CONFIG[task.priority].label,
      format(parseISO(task.createdAt), "yyyy-MM-dd"),
      task.dueDate !== "0001-01-01T00:00:00"
        ? format(parseISO(task.dueDate), "yyyy-MM-dd")
        : "No due date",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "task-analytics.csv";
    a.click();
  };

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <Paper sx={{ p: 1.5 }}>
        <Typography variant="caption" fontWeight="bold">
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography
            key={index}
            variant="caption"
            display="block"
            sx={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Paper>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Box p={3}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, md: 3, sm: 6 }} key={i}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box p={3}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadTaskData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box id="analytics-dashboard" sx={{ p: 3 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Task Analytics Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: {format(new Date(), "MMM dd, yyyy HH:mm")}
              </Typography>
            </Box>

            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              {/* Time range selector */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <MenuItem value="7days">Last 7 Days</MenuItem>
                  <MenuItem value="30days">Last 30 Days</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>

              {/* View type toggle */}
              <ToggleButtonGroup
                value={viewType}
                exclusive
                onChange={(_, value) => value && setViewType(value)}
                size="small"
              >
                <ToggleButton value="overview">Overview</ToggleButton>
                <ToggleButton value="detailed">Detailed</ToggleButton>
              </ToggleButtonGroup>

              {/* Action buttons */}
              <ButtonGroup size="small">
                <Button onClick={loadTaskData} startIcon={<Refresh />}>
                  Refresh
                </Button>
                <Button onClick={() => setAnchorEl(document.body)}>
                  <MoreVert />
                </Button>
              </ButtonGroup>

              {/* Theme toggle */}
              <IconButton onClick={toggleTheme} size="small">
                {mode === "light" ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Box>
          </Box>

          {/* Export menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem
              onClick={() => {
                exportToPDF();
                setAnchorEl(null);
              }}
            >
              <Download sx={{ mr: 1 }} /> Export as PDF
            </MenuItem>
            <MenuItem
              onClick={() => {
                exportToCSV();
                setAnchorEl(null);
              }}
            >
              <Download sx={{ mr: 1 }} /> Export as CSV
            </MenuItem>
          </Menu>

          {/* Custom date range picker */}
          {timeRange === "custom" && (
            <Box mt={2} display="flex" gap={2}>
              <DatePicker
                label="Start Date"
                value={dateRange[0]}
                onChange={(date) => setDateRange([date, dateRange[1]])}
                slotProps={{ textField: { size: "small" } }}
              />
              <DatePicker
                label="End Date"
                value={dateRange[1]}
                onChange={(date) => setDateRange([dateRange[0], date])}
                slotProps={{ textField: { size: "small" } }}
              />
            </Box>
          )}
        </Paper>

        {/* Metrics Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid  size={{ xs: 12, md: 8, sm: 6 }}>
            <MetricCard
              title="Total Tasks"
              value={metrics.total}
              icon={<Assessment />}
              color="primary"
              subtitle={`${metrics.completed} completed`}
            />
          </Grid>
          <Grid  size={{ xs: 12, md: 3, sm: 6 }}>
            <MetricCard
              title="Completion Rate"
              value={`${metrics.completionRate}%`}
              change={metrics.completionChange}
              icon={<CheckCircle />}
              color="success"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3, sm: 6 }}>
            <MetricCard
              title="Overdue Tasks"
              value={metrics.overdue}
              icon={<Warning />}
              color="warning"
              subtitle={`${metrics.high} high priority`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3, sm: 6 }}>
            <MetricCard
              title="Avg Completion"
              value={`${metrics.avgCompletionTime} days`}
              icon={<Schedule />}
              color="info"
              subtitle={`${metrics.velocity} tasks/day`}
            />
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
            <Tab label="Status Overview" />
            <Tab label="Time Analysis" />
            <Tab label="Performance" />
            <Tab label="Predictions" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Status Distribution */}
            <Grid  size={{ xs: 12, md: 6}}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Task Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percentage }) =>
                        `${name}: ${percentage}%`
                      }
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS.status[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Priority Breakdown */}
            <Grid size={{ xs: 12, md: 6}}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Priority Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={priorityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Overdue Analysis */}
            <Grid  size={{ xs: 12}}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Overdue Task Analysis
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 8}}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={overdueData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="category" dataKey="range" />
                        <YAxis type="number" />
                        <Tooltip />
                        <Bar dataKey="count" fill={COLORS.priority[2]}>
                          <LabelList dataKey="count" position="top" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4}}>
                    <Box display="flex" flexDirection="column" gap={2} mt={4}>
                      {overdueData.map((item, index) => (
                        <Box
                          key={index}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2">{item.range}</Typography>
                          <Chip
                            label={item.count}
                            size="small"
                            color={
                              item.count > 5
                                ? "error"
                                : item.count > 2
                                ? "warning"
                                : "default"
                            }
                          />
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {/* Task Trends */}
            <Grid size={{ xs: 12}}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Task Creation & Completion Trends
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="created"
                      stackId="1"
                      stroke={COLORS.chart[0]}
                      fill={COLORS.chart[0]}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="2"
                      stroke={COLORS.status[2]}
                      fill={COLORS.status[2]}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="inProgress"
                      stackId="2"
                      stroke={COLORS.status[1]}
                      fill={COLORS.status[1]}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Velocity Chart */}
            <Grid size={{ xs: 12, md: 6}}>
              <Paper sx={{ p: 3, height: 350 }}>
                <Typography variant="h6" gutterBottom>
                  Task Velocity
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Average tasks completed per day
                </Typography>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height={250}
                >
                  <ResponsiveContainer width="80%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="10%"
                      outerRadius="90%"
                      data={[
                        {
                          name: "Velocity",
                          value: metrics.velocity,
                          fill: COLORS.chart[0],
                        },
                      ]}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={10}
                        fill={COLORS.chart[0]}
                      />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan fontSize="36" fontWeight="bold">
                          {metrics.velocity}
                        </tspan>
                        <tspan x="50%" dy="1.5em" fontSize="14" fill="#666">
                          tasks/day
                        </tspan>
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Completion Time Distribution */}
            <Grid size={{ xs: 12, md: 6}}>
              <Paper sx={{ p: 3, height: 350 }}>
                <Typography variant="h6" gutterBottom>
                  Completion Time Distribution
                </Typography>
                <Box sx={{ mt: 4 }}>
                  {[
                    { label: "< 1 day", value: 35, color: COLORS.status[2] },
                    { label: "1-3 days", value: 45, color: COLORS.status[1] },
                    { label: "4-7 days", value: 15, color: COLORS.priority[1] },
                    { label: "> 7 days", value: 5, color: COLORS.priority[2] },
                  ].map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{item.label}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {item.value}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.value}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor:  theme.palette.grey[200],
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: item.color,
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            {/* User Performance */}
            <Grid size={{ xs: 12}}>
              <Paper sx={{ p: 3 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h6">User Performance Metrics</Typography>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by User</InputLabel>
                    <Select
                      value={selectedUser}
                      label="Filter by User"
                      onChange={(e) =>
                        setSelectedUser(e.target.value as number | "all")
                      }
                    >
                      <MenuItem value="all">All Users</MenuItem>
                      {Array.from(new Set(tasks.map((t) => t.assigneeId))).map(
                        (userId) => (
                          <MenuItem key={userId} value={userId}>
                            User {userId}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Box>

                <Grid container spacing={2}>
                  {userPerformanceData.map((user, index) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={2}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              sx={{
                                bgcolor:
                                  COLORS.chart[index % COLORS.chart.length],
                              }}
                            >
                              <Person />
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {user.name}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${user.completionRate}%`}
                            color={
                              user.completionRate >= 80
                                ? "success"
                                : user.completionRate >= 60
                                ? "warning"
                                : "error"
                            }
                            size="small"
                          />
                        </Box>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 6}}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Assigned
                            </Typography>
                            <Typography variant="h6">
                              {user.assigned}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6}}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Completed
                            </Typography>
                            <Typography variant="h6" color="success.main">
                              {user.completed}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Box mt={2}>
                          <LinearProgress
                            variant="determinate"
                            value={user.completionRate}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Team Comparison */}
            <Grid size={{ xs: 12}}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Team Performance Comparison
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={userPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="assigned"
                      fill={COLORS.chart[0]}
                      name="Assigned Tasks"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="completed"
                      fill={COLORS.status[2]}
                      name="Completed Tasks"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="completionRate"
                      stroke={COLORS.priority[2]}
                      strokeWidth={3}
                      name="Completion Rate (%)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
            {/* Workload Prediction */}
            <Grid size={{ xs: 12}}>
              <Paper sx={{ p: 3 }}>
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom>
                    Workload Prediction
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on historical data and current trends
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={workloadPrediction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="created"
                      stroke={COLORS.chart[0]}
                      strokeWidth={2}
                      name="Actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke={COLORS.chart[1]}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Prediction Insights:</strong> Based on current
                    velocity, expect approximately{" "}
                    {Math.round(metrics.velocity * 7)} new tasks next week.
                  </Typography>
                </Alert>
              </Paper>
            </Grid>

            {/* Capacity Planning */}
            <Grid size={{ xs: 12,md: 6}}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Team Capacity Analysis
                </Typography>
                <Box mt={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Current workload distribution
                  </Typography>
                  {[
                    {
                      name: "Available Capacity",
                      value: 30,
                      color: COLORS.status[2],
                    },
                    { name: "In Progress", value: 45, color: COLORS.status[1] },
                    {
                      name: "Overloaded",
                      value: 25,
                      color: COLORS.priority[2],
                    },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      mb={2}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: 1,
                          bgcolor: item.color,
                        }}
                      />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {item.value}%
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <Alert severity="warning">
                    <Typography variant="body2">
                      25% of team members are currently overloaded. Consider
                      redistributing tasks.
                    </Typography>
                  </Alert>
                </Box>
              </Paper>
            </Grid>

            {/* Risk Analysis */}
            <Grid size={{ xs: 12,md: 6}}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Risk Analysis
                </Typography>
                <Stack spacing={2} mt={3}>
                  <Alert severity="error" icon={<ErrorIcon />}>
                    <Typography variant="body2">
                      <strong>High Risk:</strong> {metrics.overdue} overdue
                      tasks need immediate attention
                    </Typography>
                  </Alert>
                  <Alert severity="warning" icon={<Warning />}>
                    <Typography variant="body2">
                      <strong>Medium Risk:</strong> {metrics.high} high-priority
                      tasks pending
                    </Typography>
                  </Alert>
                  <Alert severity="info" icon={<Flag />}>
                    <Typography variant="body2">
                      <strong>Attention:</strong> Task creation rate increased
                      by 15% this week
                    </Typography>
                  </Alert>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Summary Section */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions & Insights
          </Typography>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12,md: 4}}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Speed color="primary" />
                  <Typography variant="subtitle2" fontWeight="medium">
                    Performance Summary
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Team is performing at {metrics.completionRate}% efficiency
                  with an average completion time of {metrics.avgCompletionTime}{" "}
                  days.
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12,md: 4}}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <TrendingUp sx={{ color: COLORS.status[2] }} />
                  <Typography variant="subtitle2" fontWeight="medium">
                    Positive Trends
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Task completion rate improved by{" "}
                  {Math.abs(metrics.completionChange)}% compared to last period.
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12,md: 4}}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Analytics color="error" />
                  <Typography variant="subtitle2" fontWeight="medium">
                    Areas for Improvement
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Focus on reducing the {metrics.overdue} overdue tasks and
                  redistribute workload from overloaded team members.
                </Typography>
              </Card>

            </Grid>
          </Grid>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}
