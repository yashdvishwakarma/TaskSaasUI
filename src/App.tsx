// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import TaskStatusChart from './pages/TaskStatusChart';
// Add Google Font
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import Profile from './pages/Profile';
import AppErrorBoundary from './components/AppErrorBoundary';
import OrganizationManagement from './pages/Organization/OrganizationManagement';
import AppConstants from './api/AppConstants';


interface ProtectedRouteProps {
  children: React.ReactNode;
}
// Protected Route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};
    const localUser = localStorage.getItem('user');
  const parsedUser = localUser ? JSON.parse(localUser).data : null;
  const isAdmin = parsedUser?.role === AppConstants.UserRolesString.Admin;

function App() {

  const token = localStorage.getItem('token');

  return (
    <>

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
                               <Header />
                  <OrganizationManagement />
                </ProtectedRoute>
              }
            />
          <Route
            path="/"  
            element={<Navigate to={token ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </AppErrorBoundary>
    </ThemeProvider>
        </>
  );
}

export default App;