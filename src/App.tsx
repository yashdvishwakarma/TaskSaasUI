// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import TaskStatusChart from './pages/TaskStatusChart';
import Profile from './pages/Profile';
import AppErrorBoundary from './components/AppErrorBoundary';
import OrganizationManagement from './pages/Organization/OrganizationManagement';
import AppConstants from './api/AppConstants';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import "./index.css";

// Add Google Font
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Protected Route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/index" />;
};

function App() {
  const token = localStorage.getItem('token');
  const localUser = localStorage.getItem('user');
  const parsedUser = localUser ? JSON.parse(localUser).data : null;
  const isAdmin = parsedUser?.role === AppConstants.UserRolesString.Admin;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <TooltipProvider>
          <CssBaseline />
          <Toaster />
          <Sonner />
          <AppErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/index" element={<Index />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Dashboard />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/charts"
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <TaskStatusChart />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Profile />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route  
                path="/organizations"
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <OrganizationManagement />
                    </>
                  </ProtectedRoute>
                }
              />
              
              {/* Index route from first component - you may want to protect this too */}
              <Route 
                path="/index" 
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Index />
                    </>
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirect */}
              <Route
                path="/"  
                element={<Navigate to={token ? "/dashboard" : "/index"} />}
              />
              
              {/* 404 Not Found - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;