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
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleView(row)}
        title="View contract"
        aria-label="View contract"
        className="p-2 rounded-xl border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>
      <button
        onClick={() => handleEdit(row)}
        title="Edit contract"
        aria-label="Edit contract"
        className="p-2 rounded-xl border border-gray-200 text-green-600 hover:bg-green-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536L7.5 21.5l-4 1 1-4L15.732 3.732z"
          />
        </svg>
      </button>
      <button
        onClick={() => requestDelete(row)}
        title="Delete contract"
        aria-label="Delete contract"
        className="p-2 rounded-xl border border-gray-200 text-red-600 hover:bg-red-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m-9-9h14m-10-4h6a1 1 0 011 1v2H7V6a1 1 0 011-1z"
          />
        </svg>
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-32">
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
