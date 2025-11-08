import React, { createContext, useState, useEffect } from 'react';
import { fetchMe } from '../api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      refreshUser(); // load user when token exists
    }
  }, [token]);

  const login = (token, userData) => {
    setToken(token);
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // ✅ new function to refresh user data from /me
  const refreshUser = async () => {
    if (!token) return;
    try {
      const data = await fetchMe(token);
      setUser(data);
    } catch (err) {
      console.error('Failed to refresh user:', err.message);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};