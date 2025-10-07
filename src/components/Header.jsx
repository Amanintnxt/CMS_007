import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, getSessionTimeLeft } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  const sessionTimeLeft = getSessionTimeLeft();
  const sessionDisplay = sessionTimeLeft ? `${sessionTimeLeft.hours}h ${sessionTimeLeft.minutes}m` : null;

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 truncate">
            <span className="hidden sm:inline">Contract Management System</span>
            <span className="sm:hidden">CMS</span>
          </h1>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'JD'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-sm font-medium">
                {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
              </span>
              {sessionDisplay && (
                <div className="text-xs text-gray-500">
                  Session: {sessionDisplay}
                </div>
              )}
            </div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'admin@company.com'}
                </p>
                {sessionDisplay && (
                  <p className="text-xs text-blue-600 mt-1">
                    Session expires in {sessionDisplay}
                  </p>
                )}
              </div>
              <Link 
                to="/profile" 
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
