import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';

// Custom Route Component for Protected Routes
const ProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// Custom Route Component for Auth Routes (redirects logged-in users to dashboard)
const AuthRoute = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1E293B',
          color: '#F8FAFC',
          border: '1px solid #334155'
        }
      }} />
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
        
        {/* Verify email can be accessed if logged in but unverified, or logged out */}
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/" element={<Navigate to={useAuth().user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
