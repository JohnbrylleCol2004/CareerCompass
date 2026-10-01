import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  login as loginUser,
  register as registerUser,
  logout as logoutUser,
  getCurrentUser,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    const savedUser = await getCurrentUser();
    setUser(savedUser);
    setLoading(false);
  }

  async function login(identifier, password) {
    const loggedInUser = await loginUser(identifier, password);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(userData) {
    const registeredUser = await registerUser(userData);
    setUser(registeredUser);
    return registeredUser;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}