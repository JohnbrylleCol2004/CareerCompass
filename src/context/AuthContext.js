import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  login as loginUser,
  register as registerUser,
  logout as logoutUser,
  getCurrentUser,
  updateProfile as saveProfile,
} from '../services/authService';
import { useNetwork } from './NetworkContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { offline, ready } = useNetwork();
  const operation = useRef(0);

  useEffect(() => {
    if (!ready) return;
    const version = ++operation.current;
    let active = true;
    async function restoreSession() {
      try {
        const restored = await getCurrentUser({ offline });
        if (active && version === operation.current) setUser(restored);
      } catch {
        // A failed connection must not crash the app during startup.
      } finally {
        if (active) setLoading(false);
      }
    }
    restoreSession();
    return () => { active = false; };
  }, [offline, ready]);

  async function updateProfile(profileData) {
    operation.current += 1;
    const updatedUser = await saveProfile(profileData);
    setUser(updatedUser);
    return updatedUser;
  }

  async function login(identifier, password) {
    operation.current += 1;
    const loggedInUser = await loginUser(identifier, password);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(userData) {
    operation.current += 1;
    const registeredUser = await registerUser(userData);
    if (!registeredUser.requiresEmailConfirmation) setUser(registeredUser);
    return registeredUser;
  }

  async function logout() {
  operation.current += 1;
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
