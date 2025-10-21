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
  Grid,
  Paper,
} from "@mui/material";
import { taskApi } from "../api/taskApi"; // adjust import path

// Consistent color palette for status
const COLORS = ["#FFB300", "#0288D1", "#43A047"];

// Status display configuration
const STATUS_CONFIG = {
  Pending: { color: "#FFB300", icon: "🟡", value: 0 },
  "In Progress": { color: "#0288D1", icon: "🔵", value: 1 },
  Completed: { color: "#43A047", icon: "🟢", value: 2 },
};

interface Task {
  status: number;
  createdAt?: string;
  [key: string]: any;
}

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

interface chartDataByDate {
    date: string;
    count: unknown;
}[]

export default function TaskStatusChart() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tasksByDate, setTasksByDate] = useState<chartDataByDate[]>([]);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskApi.getTasks();
      console.log("response:", response);

      if (response && Array.isArray(response?.data)) {
        setTasks(response.data);


      const tasksByDate = response.data.reduce((acc : any, task : any) => {
        // Parse createdAt safely
        const created = task.dueDate ? new Date(task.dueDate) : null;

        // Skip invalid or placeholder dates
        if (
          !created ||
          isNaN(created.getTime()) ||
          created.getFullYear() === 1
        ) {
          return acc;
        }

        const dateKey = created.toLocaleDateString("en-CA"); // e.g. "2025-10-07"
        acc[dateKey] = (acc[dateKey] || 0) + 1;

        return acc;
      }, {});

      const chartData = Object.entries(tasksByDate).map(([date, count]) => ({
        date,
        count,
      }));

      setTasksByDate(chartData)
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError("Unable to load chart data");
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on time selection
  const filteredTasks = useMemo(() => {
    if (timeFilter === "all") return tasks;

    const now = new Date();
    const filterDate = new Date();

    if (timeFilter === "7days") {
      filterDate.setDate(now.getDate() - 7);
    } else if (timeFilter === "30days") {
      filterDate.setDate(now.getDate() - 30);
    }

    return tasks.filter((task) => {
      if (!task.createdAt) return true; // Include tasks without createdAt
      const taskDate = new Date(task.createdAt);
      return taskDate >= filterDate;
    });
  }, [tasks, timeFilter]);

  // Transform filtered tasks into chart data with percentages
  const chartData = useMemo(() => {
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

  // Calculate summary metrics
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter((t) => t.status === 2).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartData;
      return (
        <Paper
          elevation={3}
          sx={{
            p: 1.5,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Count: {data.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share: {data.percentage}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Render label inside pie slices
  const renderLabel = (entry: ChartData) => {
    if (entry.value === 0) return ""; // Hide label for zero values
    return `${entry.percentage}%`;
  };

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Empty state
  if (!loading && totalTasks === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No tasks to display
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      {/* Header with filter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          Task Status Overview
        </Typography>

        {/* Time filter dropdown */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="time-filter-label">Time Period</InputLabel>
          <Select
            labelId="time-filter-label"
            id="time-filter"
            value={timeFilter}
            label="Time Period"
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <MenuItem value="all">All Tasks</MenuItem>
            <MenuItem value="7days">Last 7 Days</MenuItem>
            <MenuItem value="30days">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Section */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
          }}
        >
          {/* Total and completion rate */}
          <Box>
            <Typography variant="body1" color="text.secondary">
              <strong>{completedTasks}</strong> of <strong>{totalTasks}</strong>{" "}
              tasks completed
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {completionRate}% Complete
            </Typography>
          </Box>

          {/* Status chips */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: { xs: "flex-start", md: "flex-end" },
            }}
          >
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const count =
                chartData.find((d) => d.name === status)?.value || 0;
              return (
                <Chip
                  key={status}
                  label={`${config.icon} ${status}: ${count}`}
                  sx={{
                    backgroundColor: `${config.color}20`,
                    color: config.color,
                    fontWeight: "bold",
                    border: `1px solid ${config.color}`,
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Pie Chart */}
      <Box sx={{ width: "100%", height: 350, mb: 7 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.percentage}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "inherit", fontWeight: 500 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ width: "100%", height: 350 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={tasksByDate}>
            <XAxis dataKey="date"  />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
