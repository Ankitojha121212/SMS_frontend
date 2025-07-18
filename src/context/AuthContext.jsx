
import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, login, logout, signup } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    const data = await login(email, password);
    const currentUser = getCurrentUser();
    setUser(currentUser);
    return data;
  };

  const signupUser = async (userData) => {
    const data = await signup(userData);
    const currentUser = getCurrentUser();
    setUser(currentUser);
    return data;
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, signupUser }}>
      {children}
    </AuthContext.Provider>
  );
};
