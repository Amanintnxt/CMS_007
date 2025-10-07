import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';

const Dashboard = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('endDate');
  const [sortDirection, setSortDirection] = useState('asc');

  // Sample data
  const contracts = [
    {
      id: 1,
      name: 'Office Supplies Contract',
      supplier: 'ABC Supplies Ltd',
      type: 'non-food',
      endDate: '2024-03-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Cafeteria Food Services',
      supplier: 'Fresh Foods Co',
      type: 'food',
      endDate: '2024-01-30',
      status: 'expiring'
    },
    {
      id: 3,
      name: 'Cleaning Chemicals',
      supplier: 'CleanChem Solutions',
      type: 'chemicals',
      endDate: '2023-12-01',
      status: 'expired'
    },
    {
      id: 4,
      name: 'IT Equipment Lease',
      supplier: 'TechCorp Industries',
      type: 'non-food',
      endDate: '2024-06-20',
      status: 'active'
    },
    {
      id: 5,
      name: 'Uniform Services',
      supplier: 'Professional Uniforms',
      type: 'non-food',
      endDate: '2024-02-10',
      status: 'active'
    }
  ];

  const filteredAndSortedContracts = useMemo(() => {
    let filtered = contracts;
    
    if (filterType !== 'all') {
      filtered = contracts.filter(contract => contract.type === filterType);
    }
    
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [filterType, sortField, sortDirection]);

  // Calculate dashboard stats
  const dashboardStats = useMemo(() => {
    const totalContracts = contracts.length;
    const activeContracts = contracts.filter(c => c.status === 'active').length;
    const expiringContracts = contracts.filter(c => c.status === 'expiring').length;
    const expiredContracts = contracts.filter(c => c.status === 'expired').length;
    
    // Calculate total contract value (mock data)
    const totalValue = contracts.reduce((sum, contract) => {
      const mockValues = {
        1: 15000, // Office Supplies
        2: 45000, // Cafeteria Food
        3: 8500,  // Cleaning Chemicals
        4: 25000, // IT Equipment
        5: 12000  // Uniform Services
      };
      return sum + (mockValues[contract.id] || 0);
    }, 0);

    // Calculate expiring in next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringSoon = contracts.filter(contract => {
      const endDate = new Date(contract.endDate);
      return endDate <= thirtyDaysFromNow && endDate > new Date() && contract.status !== 'expired';
    }).length;

    // Calculate average contract duration (mock data)
    const averageDuration = 12; // months

    return {
      totalContracts,
      activeContracts,
      expiringContracts,
      expiredContracts,
      totalValue,
      expiringSoon,
      averageDuration
    };
  }, [contracts]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (contract) => {
    navigate(`/contracts/${contract.id}/edit`);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'expiring':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'expired':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getEndDateDisplay = (date, status) => {
    const dateStr = new Date(date).toLocaleDateString();
    if (status === 'expired') {
      return <span className="text-red-500">{dateStr}</span>;
    }
    return dateStr;
  };

  const columns = [
    {
      key: 'name',
      label: 'Contract Name',
      sortable: true,
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: 'supplier',
      label: 'Supplier',
      sortable: true
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <span className="capitalize">{value.replace('-', ' ')}</span>
      )
    },
    {
      key: 'endDate',
      label: 'End Date',
      sortable: true,
      render: (value, row) => getEndDateDisplay(value, row.status)
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={getStatusBadge(value)}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage and monitor all your contracts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Contracts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalContracts}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    +2 this month
                  </span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Contracts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeContracts}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.round((dashboardStats.activeContracts / dashboardStats.totalContracts) * 100)}% of total
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardStats.expiringSoon}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  Next 30 days
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Value */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-gray-900">£{dashboardStats.totalValue.toLocaleString()}</p>
                <p className="text-sm text-blue-600 mt-1">
                  £{Math.round(dashboardStats.totalValue / dashboardStats.totalContracts).toLocaleString()} avg
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contract Status Overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Active</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{dashboardStats.activeContracts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Expiring</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{dashboardStats.expiringContracts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Expired</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{dashboardStats.expiredContracts}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/contracts')}
                className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium">Add New Contract</span>
                </div>
              </button>
              <button 
                onClick={() => navigate('/suppliers')}
                className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">Manage Suppliers</span>
                </div>
              </button>
              <button 
                onClick={() => navigate('/reports')}
                className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium">View Reports</span>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">New contract added</p>
                  <p className="text-xs text-gray-500">Office Supplies Contract</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Contract expiring</p>
                  <p className="text-xs text-gray-500">Cafeteria Food Services</p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Contract renewed</p>
                  <p className="text-xs text-gray-500">IT Equipment Lease</p>
                  <p className="text-xs text-gray-400">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
              >
                <option value="all">All Types</option>
                <option value="food">Food</option>
                <option value="non-food">Non-Food</option>
                <option value="chemicals">Chemicals</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Showing {filteredAndSortedContracts.length} contracts</span>
            </div>
          </div>
        </div>

        {/* Contracts Table */}
        <Table
          data={filteredAndSortedContracts}
          columns={columns}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onEdit={handleEdit}
          showActions={true}
        />
      </div>
    </div>
  );
};

export default Dashboard;
