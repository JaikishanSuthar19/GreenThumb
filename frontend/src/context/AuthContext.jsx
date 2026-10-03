import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe, updateProfile as apiUpdateProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('greenthumb_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('greenthumb_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser({ name, email, password });
      if (res.success && res.token) {
        localStorage.setItem('greenthumb_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('greenthumb_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const updateUserProfile = async (profileData) => {
    try {
      const res = await apiUpdateProfile(profileData);
      if (res.success && res.user) {
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserProfile,
        clearError,
      }}
    >
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
