import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to initialize context and check user state from token/cookie
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Assume API interceptor handles token injecting/refresh
        const { data } = await api.get('/auth/me');
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const setAccessToken = (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const login = (userData, accessToken) => {
    setUser(userData);
    setAccessToken(accessToken);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setAccessToken }}>
      {loading ? <div className="loading-screen">Loading...</div> : children}
    </AuthContext.Provider>
  );
};
