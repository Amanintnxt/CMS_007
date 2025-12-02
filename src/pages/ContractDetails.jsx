import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import BulkUploadModal from '../components/BulkUploadModal';
import contractsData from '../data/contracts';

const typeLabels = {
  food: 'Food',
  drinks: 'Drinks',
  'cleaning-and-chemicals': 'Cleaning and Chemicals',
  'catering-equipment': 'Catering Equipment',
  laundry: 'Laundry'
};

const ContractDetails = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState(contractsData);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('endDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [lastImportSummary, setLastImportSummary] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredContracts = useMemo(() => {
    let filtered = [...contracts];

    if (filterType !== 'all') {
      filtered = filtered.filter((contract) => contract.type === filterType);
    }

    if (searchTerm.trim()) {
      const lowered = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (contract) =>
          contract.name.toLowerCase().includes(lowered) ||
          contract.supplier.toLowerCase().includes(lowered) ||
          contract.referenceNumber.toLowerCase().includes(lowered)
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [contracts, filterType, searchTerm, sortField, sortDirection]);

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

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

  const handleView = (contract) => {
    navigate(`/contracts/${contract.id}`);
  };

  const handleEdit = (contract) => {
    navigate(`/contracts/${contract.id}/edit`);
  };

  const handleDelete = (contract) => {
    setContracts((prev) => prev.filter((c) => c.id !== contract.id));
  };

  const renderActions = ({ row, requestDelete }) => (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => handleView(row)}
        className="text-blue-600 hover:text-blue-800 transition-colors"
      >
        View
      </button>
      <button
        onClick={() => handleEdit(row)}
        className="text-green-600 hover:text-green-800 transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => requestDelete(row)}
        className="text-red-600 hover:text-red-800 transition-colors"
      >
        Delete
      </button>
    </div>
  );

  const columns = [
    {
      key: 'name',
      label: 'Contract',
      sortable: true,
      render: (value, row) => (
        <button
          type="button"
          onClick={() => handleView(row)}
          className="font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          {value}
        </button>
      )
    },
    {
      key: 'supplier',
      label: 'Supplier',
      sortable: true
    },
    {
      key: 'type',
      label: 'Category',
      sortable: true,
      render: (value) => <span className="capitalize">{typeLabels[value] || value}</span>
    },
    {
      key: 'area',
      label: 'Area / Region',
      sortable: true
    },
    {
      key: 'contractValue',
      label: 'Value',
      sortable: true,
      render: (value) => `£${value.toLocaleString()}`
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
    },
    {
      key: 'internalContact',
      label: 'Internal Contact',
      sortable: true
    }
  ];

  const handleBulkUploadSuccess = (newRecords, summary) => {
    if (Array.isArray(newRecords) && newRecords.length > 0) {
      setContracts((prev) => {
        const existingRefs = new Set(prev.map((contract) => contract.referenceNumber));
        const deduped = newRecords.filter(
          (record) => !existingRefs.has(record.referenceNumber)
        );
        return [...prev, ...deduped];
      });
    }
    setLastImportSummary(summary);
    setIsBulkModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">All Contracts</h2>
            <p className="text-gray-600">Review every agreement in one place with quick actions.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-blue-200 text-blue-700 bg-blue-50 text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              Bulk Upload
            </button>
            <button
              onClick={() => navigate('/contracts/new')}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
            >
              New Contract
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Filter by category
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="food">Food</option>
                <option value="drinks">Drinks</option>
                <option value="cleaning-and-chemicals">Cleaning and Chemicals</option>
                <option value="catering-equipment">Catering Equipment</option>
                <option value="laundry">Laundry</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search contracts
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, supplier, or reference"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredContracts.length} of {contracts.length} contracts
          </div>
          {lastImportSummary && (
            <div className="mt-4 text-sm text-gray-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              Last import: <strong>{lastImportSummary.inserted}</strong> added,&nbsp;
              <strong>{lastImportSummary.failed ?? 0}</strong> failed.
              {lastImportSummary.errors?.length > 0 && (
                <span className="block text-xs text-blue-700 mt-1">
                  See server logs for details or re-check your CSV formatting.
                </span>
              )}
            </div>
          )}
        </div>

        <Table
          data={filteredContracts}
          columns={columns}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onEdit={handleView}
          onDelete={handleDelete}
          showActions={true}
          renderActions={renderActions}
        />

        <BulkUploadModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          onSuccess={handleBulkUploadSuccess}
        />
      </div>
    </div>
  );
};

export default ContractDetails;
