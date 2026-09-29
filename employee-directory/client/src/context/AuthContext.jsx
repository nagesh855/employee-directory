import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const TOKEN_KEY = 'employee-token';
const AuthContext = createContext(null);

const getErrorMessage = (error) => {
  const validationError = error.response?.data?.errors?.[0]?.msg;
  return validationError || error.response?.data?.message || 'Authentication failed';
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const saveSession = (sessionToken, sessionUser) => {
    localStorage.setItem(TOKEN_KEY, sessionToken);
    setToken(sessionToken);
    setUser(sessionUser);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      saveSession(response.data.token, response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      saveSession(response.data.token, response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
