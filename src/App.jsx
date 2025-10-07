import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import ProtectedRoute from './components/ProtectedRoute';
import SessionWarning from './components/SessionWarning';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContractDetails from './pages/ContractDetails';
import Suppliers from './pages/Suppliers';
import UserAdmin from './pages/UserAdmin';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import EditContract from './pages/EditContract';
import EditSupplier from './pages/EditSupplier';
import EditUser from './pages/EditUser';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <SessionWarning />
                <Header />
                <Tabs />
                
                <main className="pt-0">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/contracts" element={<ContractDetails />} />
                    <Route path="/contracts/:id/edit" element={<EditContract />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/suppliers/:id/edit" element={<EditSupplier />} />
                    <Route path="/users" element={<UserAdmin />} />
                    <Route path="/users/:id/edit" element={<EditUser />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                
                <Footer />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
