import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container nav-content">
          <div className="nav-logo">AuthSystem</div>
          <div className="nav-links">
            <span>{user?.name}</span>
            <button className="btn btn-danger" style={{ padding: '0.5rem 1rem', width: 'auto' }} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container dashboard-container">
        <div className="welcome-card">
          <h1 className="welcome-title">Welcome, {user?.name}!</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            You have successfully authenticated via JWT. This is a protected route.
          </p>
          
          <div style={{ marginTop: '2rem', textAlign: 'left', background: 'rgba(15, 23, 42, 0.5)', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Your Profile Details:</h3>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>ID:</strong> {user?.id || user?._id}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
