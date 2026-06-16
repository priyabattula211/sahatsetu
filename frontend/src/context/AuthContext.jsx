import { createContext, useContext, useEffect, useState } from 'react';
import { fetchMe, login, signup } from '../api/authApi';
import { setAuthToken } from '../api/client';

const AuthContext = createContext(null);
const TOKEN_KEY = 'sehat-setu-token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (!token) {
      setAuthToken(null);
      setLoading(false);
      return;
    }

    setAuthToken(token);
    fetchMe()
      .then((currentUser) => setUser(currentUser))
      .catch(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const value = {
    user,
    token,
    loading,
    async login(payload) {
      const response = await login(payload);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(TOKEN_KEY, response.token);
      setAuthToken(response.token);
      return response.user;
    },
    async signup(payload) {
      const response = await signup(payload);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(TOKEN_KEY, response.token);
      setAuthToken(response.token);
      return response.user;
    },
    logout() {
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
