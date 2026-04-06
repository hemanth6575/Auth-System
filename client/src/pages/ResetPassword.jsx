import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    
    try {
      const { data } = await api.put(`/auth/reset-password/${token}`, { password });
      if (data.success) {
        setSuccess(true);
        toast.success('Password has been reset successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create new password</h1>
        <p className="auth-subtitle">Your new password must be different from previous used passwords.</p>
        
        {success ? (
          <div className="text-center">
            <div className="alert alert-success">Your password has been successfully reset.</div>
            <Link to="/login" className="btn btn-primary mt-4">Go to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Must be at least 6 characters"
                required 
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm new password"
                required 
                minLength="6"
              />
            </div>

            <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
