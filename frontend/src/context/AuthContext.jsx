import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          console.error("Failed to restore auth session:", err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser({
      id: res.id,
      fullName: res.fullName,
      email: res.email,
      role: res.role
    });
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser({
      id: res.id,
      fullName: res.fullName,
      email: res.email,
      role: res.role
    });
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
