// src/App.tsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Profile from './pages/Profile';
import AppErrorBoundary from './components/AppErrorBoundary';
import OrganizationManagement from './pages/Organization/OrganizationManagement';
import AppConstants from './api/AppConstants';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TaskAnalytics from './components/Analytics/TaskAnalytics';
import { CustomThemeProvider } from './contexts/ThemeContext'; 
import Footer from './components/Footer';
import "./index.css";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Add Google Font
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

const queryClient = new QueryClient();

// Layout for public pages WITH header and footer (login, register)
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Layout for protected pages (dashboard, etc.)
const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/index" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

// Layout for pages with only footer (no header)
const FooterOnlyLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const token = localStorage.getItem('token');
  const localUser = localStorage.getItem('user');
  const parsedUser = localUser ? JSON.parse(localUser).data : null;
  const isAdmin = parsedUser?.role === AppConstants.UserRolesString.Admin;

  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppErrorBoundary>
            <Routes>
              {/* Index page - no header, only footer */}
              <Route element={<FooterOnlyLayout />}>
                <Route path="/index" element={<Index />} />
              </Route>
              
              {/* Public routes with header and footer */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              
              {/* Protected routes with header only */}
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/charts" element={<TaskAnalytics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/organizations" element={<OrganizationManagement />} />
              </Route>
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to={token ? "/dashboard" : "/index"} />} />
            </Routes>
          </AppErrorBoundary>
        </TooltipProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  );
}

export default App;