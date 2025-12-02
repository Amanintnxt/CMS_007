import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Tabs = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const tabs = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Contract Details', path: '/contracts', icon: '📄' },
    { name: 'Suppliers', path: '/suppliers', icon: '🏢' },
    { name: 'User Admin', path: '/users', icon: '👥' },
    { name: 'Reports', path: '/reports', icon: '📈' }
  ];

  const currentTab =
    tabs.find((tab) => location.pathname === tab.path) ||
    tabs.find((tab) => tab.path !== '/' && location.pathname.startsWith(tab.path)) ||
    tabs[0];

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 pt-20 pb-0">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-center w-full">
        <div className="flex space-x-16 max-w-6xl w-full">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={`flex-1 text-center py-3 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm">{tab.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between py-4 px-1 border-b-2 border-transparent text-left"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">{currentTab.icon}</span>
            <span className="font-medium text-sm text-gray-900">{currentTab.name}</span>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isMobileMenuOpen && (
          <div className="py-2 space-y-1">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
