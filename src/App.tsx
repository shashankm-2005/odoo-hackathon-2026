import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Layouts
import { AdminLayout } from './layouts/AdminLayout';
import { EmployeeLayout } from './layouts/EmployeeLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { EmployeesPage } from './pages/admin/EmployeesPage';
import { AttendancePage } from './pages/admin/AttendancePage';
import { LeaveManagementPage } from './pages/admin/LeaveManagementPage';
import { PayrollPage } from './pages/admin/PayrollPage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Employee Pages
import { EmployeeDashboardPage } from './pages/employee/EmployeeDashboardPage';
import { EmployeeProfilePage } from './pages/employee/EmployeeProfilePage';
import { EmployeeAttendancePage } from './pages/employee/EmployeeAttendancePage';
import { EmployeeLeavePage } from './pages/employee/EmployeeLeavePage';
import { EmployeePayrollPage } from './pages/employee/EmployeePayrollPage';
import { EmployeeSettingsPage } from './pages/employee/EmployeeSettingsPage';

// Route Guards
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullHeight label="Authenticating administrative session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/employee" replace />;
  }

  return <>{children}</>;
};

const ProtectedEmployeeRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullHeight label="Authenticating employee session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullHeight label="Loading Dayflow workspace..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/employee" replace />;
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <HashRouter>
            <Routes>
              {/* Root redirect */}
              <Route path="/" element={<RootRedirect />} />

              {/* Public Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Admin Portal Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="leave" element={<LeaveManagementPage />} />
                <Route path="payroll" element={<PayrollPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Employee Self-Service Routes */}
              <Route
                path="/employee"
                element={
                  <ProtectedEmployeeRoute>
                    <EmployeeLayout />
                  </ProtectedEmployeeRoute>
                }
              >
                <Route index element={<EmployeeDashboardPage />} />
                <Route path="profile" element={<EmployeeProfilePage />} />
                <Route path="attendance" element={<EmployeeAttendancePage />} />
                <Route path="leave" element={<EmployeeLeavePage />} />
                <Route path="payroll" element={<EmployeePayrollPage />} />
                <Route path="settings" element={<EmployeeSettingsPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </HashRouter>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
