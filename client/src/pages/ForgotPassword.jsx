import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      if (data.success) {
        setSent(true);
        toast.success('Password reset email sent');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>
        
        {sent ? (
          <div className="text-center">
            <div className="alert alert-success">
              Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
            </div>
            <Link to="/login" className="btn btn-primary mt-4">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email"
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center mt-6" style={{ fontSize: '0.875rem' }}>
          <Link to="/login">Back to log in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
