import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SessionWarning = () => {
  const { getSessionTimeLeft, refreshSession, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      const sessionTime = getSessionTimeLeft();
      
      if (sessionTime) {
        setTimeLeft(sessionTime);
        
        // Show warning when less than 5 minutes left
        if (sessionTime.total < 5 * 60 * 1000) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
      } else {
        setShowWarning(false);
        setTimeLeft(null);
      }
    };

    // Check session every minute
    checkSession();
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, [getSessionTimeLeft]);

  const handleRefreshSession = async () => {
    const result = await refreshSession();
    if (result.success) {
      setShowWarning(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!showWarning || !timeLeft) {
    return null;
  }

  const minutesLeft = Math.floor(timeLeft.total / (1000 * 60));
  const secondsLeft = Math.floor((timeLeft.total % (1000 * 60)) / 1000);

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">
            Your session will expire in {minutesLeft}:{secondsLeft.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefreshSession}
            className="bg-white text-yellow-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors"
          >
            Extend Session
          </button>
          <button
            onClick={handleLogout}
            className="bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;
