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
  updateProfile as saveProfile,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        setUser(await getCurrentUser());
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function updateProfile(profileData) {
    const updatedUser = await saveProfile(profileData);
    setUser(updatedUser);
    return updatedUser;
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
  try {
    await logoutUser();
  } catch (error) {
    console.log('Logout error:', error.message);
  } finally {
    setUser(null);
  }
}

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}