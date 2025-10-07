import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4 fixed bottom-0 left-0 right-0 z-40">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-500 text-center sm:text-left">
          © {new Date().getFullYear()} Contract Management System
        </div>
        <div className="text-sm text-gray-500">
          Version 1.0
        </div>
      </div>
    </footer>
  );
};

export default Footer;
