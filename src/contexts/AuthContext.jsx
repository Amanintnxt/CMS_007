import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('cms_user');
        const storedExpiry = localStorage.getItem('cms_session_expiry');
        
        if (storedUser && storedExpiry) {
          const expiryTime = new Date(storedExpiry);
          const now = new Date();
          
          // Check if session is still valid (24 hours)
          if (expiryTime > now) {
            setUser(JSON.parse(storedUser));
            setSessionExpiry(expiryTime);
          } else {
            // Session expired, clear storage
            localStorage.removeItem('cms_user');
            localStorage.removeItem('cms_session_expiry');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Clear corrupted data
        localStorage.removeItem('cms_user');
        localStorage.removeItem('cms_session_expiry');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Auto-logout when session expires
  useEffect(() => {
    if (sessionExpiry) {
      const now = new Date();
      const timeUntilExpiry = sessionExpiry.getTime() - now.getTime();
      
      if (timeUntilExpiry > 0) {
        const timer = setTimeout(() => {
          logout();
        }, timeUntilExpiry);
        
        return () => clearTimeout(timer);
      } else {
        logout();
      }
    }
  }, [sessionExpiry]);

  const login = async (userData) => {
    try {
      // Create session expiry time (24 hours from now)
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 24);
      
      // Store user data and session info
      localStorage.setItem('cms_user', JSON.stringify(userData));
      localStorage.setItem('cms_session_expiry', expiryTime.toISOString());
      
      setUser(userData);
      setSessionExpiry(expiryTime);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Failed to save session' };
    }
  };

  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('cms_user');
      localStorage.removeItem('cms_session_expiry');
      
      // Reset state
      setUser(null);
      setSessionExpiry(null);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Failed to clear session' };
    }
  };

  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      localStorage.setItem('cms_user', JSON.stringify(newUserData));
      setUser(newUserData);
      
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Failed to update user data' };
    }
  };

  const isAuthenticated = () => {
    return user !== null && sessionExpiry !== null && sessionExpiry > new Date();
  };

  const getSessionTimeLeft = () => {
    if (!sessionExpiry) return null;
    
    const now = new Date();
    const timeLeft = sessionExpiry.getTime() - now.getTime();
    
    if (timeLeft <= 0) return null;
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, total: timeLeft };
  };

  const refreshSession = () => {
    if (user) {
      // Extend session by 24 hours
      const newExpiryTime = new Date();
      newExpiryTime.setHours(newExpiryTime.getHours() + 24);
      
      localStorage.setItem('cms_session_expiry', newExpiryTime.toISOString());
      setSessionExpiry(newExpiryTime);
      
      return { success: true };
    }
    return { success: false, error: 'No active session to refresh' };
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),
    sessionExpiry,
    login,
    logout,
    updateUser,
    getSessionTimeLeft,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
