import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    
    const verify = async () => {
      hasVerified.current = true;
      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link may have expired.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 className="auth-title">Email Verification</h1>
        
        {status === 'verifying' && (
          <div className="mt-4">
            <p>Verifying your email, please wait...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4">
            <div className="alert alert-success">{message}</div>
            <Link to="/login" className="btn btn-primary mt-4">Go to Login</Link>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4">
            <div className="alert alert-danger">{message}</div>
            <Link to="/register" className="btn btn-primary mt-4">Back to Registration</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
