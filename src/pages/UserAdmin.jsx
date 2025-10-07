import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';

const UserAdmin = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer',
    permissions: {
      editContracts: false,
      uploadDocuments: false,
      receiveAlerts: false
    }
  });

  // Sample users data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'admin',
      permissions: {
        editContracts: true,
        uploadDocuments: true,
        receiveAlerts: true
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'manager',
      permissions: {
        editContracts: true,
        uploadDocuments: true,
        receiveAlerts: false
      }
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'viewer',
      permissions: {
        editContracts: false,
        uploadDocuments: false,
        receiveAlerts: true
      }
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('permissions.')) {
      const permissionKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: users.length + 1,
      ...formData
    };
    setUsers(prev => [...prev, newUser]);
    setFormData({
      name: '',
      email: '',
      role: 'viewer',
      permissions: {
        editContracts: false,
        uploadDocuments: false,
        receiveAlerts: false
      }
    });
    setShowModal(false);
  };

  const handleEdit = (user) => {
    navigate(`/users/${user.id}/edit`);
  };

  const handleDelete = (user) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handlePermissionToggle = (userId, permission) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? {
        ...user,
        permissions: {
          ...user.permissions,
          [permission]: !user.permissions[permission]
        }
      } : user
    ));
  };

  const getRoleBadge = (role) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'manager':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'viewer':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-800">
          {value}
        </a>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value, row) => (
        <select
          value={value}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="viewer">Viewer</option>
        </select>
      )
    },
    {
      key: 'permissions',
      label: 'Permissions',
      sortable: false,
      render: (value, row) => (
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value.editContracts}
              onChange={() => handlePermissionToggle(row.id, 'editContracts')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-xs text-gray-600">Edit</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value.uploadDocuments}
              onChange={() => handlePermissionToggle(row.id, 'uploadDocuments')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-xs text-gray-600">Upload</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value.receiveAlerts}
              onChange={() => handlePermissionToggle(row.id, 'receiveAlerts')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-xs text-gray-600">Alerts</span>
          </label>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">User Administration</h2>
              <p className="text-gray-600">Manage system users and permissions</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Add User
            </button>
          </div>
        </div>

        <Table
          data={users}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />

        {/* Add User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="viewer">Viewer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permissions
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.editContracts"
                        checked={formData.permissions.editContracts}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Edit Contracts</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.uploadDocuments"
                        checked={formData.permissions.uploadDocuments}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Upload Documents</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="permissions.receiveAlerts"
                        checked={formData.permissions.receiveAlerts}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Receive Alerts</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAdmin;
