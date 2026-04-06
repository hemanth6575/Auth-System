import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    
    try {
      const { data } = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (data.success) {
        toast.success(data.message || 'Registration successful. Please check your email.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join us to get started</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Enter your name"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              className="form-control" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-control" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Create a password"
              required 
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              className="form-control" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              placeholder="Confirm your password"
              required 
              minLength="6"
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6" style={{ fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
