import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import contractsData from '../data/contracts';

const typeLabels = {
  food: 'Food',
  drinks: 'Drinks',
  'cleaning-and-chemicals': 'Cleaning and Chemicals',
  'catering-equipment': 'Catering Equipment',
  laundry: 'Laundry'
};

const documentStatusStyles = {
  valid: {
    label: 'Valid',
    badge: 'bg-green-100 text-green-800',
    row: 'border-green-100'
  },
  expiring: {
    label: 'Expiring Soon',
    badge: 'bg-yellow-100 text-yellow-800',
    row: 'border-yellow-100'
  },
  expired: {
    label: 'Expired',
    badge: 'bg-red-100 text-red-800',
    row: 'border-red-100'
  },
  missing: {
    label: 'Not Provided',
    badge: 'bg-gray-100 text-gray-700',
    row: 'border-gray-100'
  }
};

const MS_IN_DAY = 1000 * 60 * 60 * 24;

const ViewContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const contract = contractsData.find((entry) => entry.id === Number(id));

  const handleBackClick = () => {
    if (typeof window !== 'undefined' && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

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

  const hasValue = (value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'number') return true;
    return String(value).trim().length > 0;
  };

  const getDocumentStatus = (expiryDate) => {
    if (!expiryDate) {
      return 'missing';
    }
    const today = new Date();
    const target = new Date(expiryDate);
    if (Number.isNaN(target.getTime())) {
      return 'missing';
    }
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return 'expired';
    }
    if (diffDays <= 30) {
      return 'expiring';
    }
    return 'valid';
  };

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Contract not found</h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find a contract with ID {id}. It may have been deleted.
            </p>
            <button
              onClick={handleBackClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const labeledType = typeLabels[contract.type] || contract.type;
  const headerMeta = [
    hasValue(contract.referenceNumber) && `Reference ${contract.referenceNumber}`,
    hasValue(labeledType) && labeledType
  ]
    .filter(Boolean)
    .join(' · ');

  const overviewFields = [
    {
      label: 'Supplier',
      value: contract.supplier
    },
    {
      label: 'Area / Region',
      value: contract.area
    },
    {
      label: 'End Date',
      value: contract.endDate,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      label: 'Duration',
      value: contract.durationMonths,
      render: (value) => `${value} months`
    },
    {
      label: 'Reminder Period',
      value: contract.reminder,
      render: (value) => value.replace('-', ' ')
    },
    {
      label: 'Internal Contact',
      value: contract.internalContact
    }
  ].filter((field) => hasValue(field.value));

  const financialFields = [
    {
      label: 'Contract Value',
      value: contract.contractValue,
      render: (value) => `£${value.toLocaleString()}`
    },
    {
      label: 'Last Reviewed',
      value: contract.lastReviewed,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      label: 'Status',
      value: contract.status,
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    }
  ].filter((field) => hasValue(field.value));

  const documentEntries = (contract.documents || []).map((doc) => {
    const status = getDocumentStatus(doc.expiryDate);
    const expiryDate = doc.expiryDate ? new Date(doc.expiryDate) : null;
    const daysRemaining = expiryDate
      ? Math.ceil((expiryDate - new Date()) / MS_IN_DAY)
      : null;
    return {
      ...doc,
      status,
      expiryDisplay: expiryDate ? expiryDate.toLocaleDateString() : 'Not set',
      daysRemaining
    };
  });

  const documentsNeedingAttention = documentEntries.filter((doc) =>
    ['expired', 'expiring'].includes(doc.status)
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{contract.name}</h2>
                <span className={getStatusBadge(contract.status)}>
                  {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                </span>
              </div>
              {headerMeta && <p className="text-gray-600 mt-2">{headerMeta}</p>}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={handleBackClick}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => navigate(`/contracts/${contract.id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Edit Contract
              </button>
            </div>
          </div>
        </div>

        {documentsNeedingAttention.length > 0 && (
          <div className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 sm:p-6 text-sm text-yellow-900">
            <p className="font-semibold text-yellow-900">
              {documentsNeedingAttention.length} document
              {documentsNeedingAttention.length > 1 ? 's require' : ' requires'} attention
            </p>
            <ul className="mt-3 space-y-1 text-yellow-800">
              {documentsNeedingAttention.slice(0, 3).map((doc) => (
                <li key={doc.key} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full" />
                  <span>
                    {doc.name || doc.key} —{' '}
                    {documentStatusStyles[doc.status]?.label || 'Update needed'}
                  </span>
                </li>
              ))}
            </ul>
            {documentsNeedingAttention.length > 3 && (
              <p className="text-xs text-yellow-700 mt-2">
                +{documentsNeedingAttention.length - 3} more listed below.
              </p>
            )}
          </div>
        )}

        {(overviewFields.length > 0 || financialFields.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {overviewFields.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Overview</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {overviewFields.map(({ label, value, render }) => (
                    <div key={label}>
                      <dt className="text-sm font-medium text-gray-500">{label}</dt>
                      <dd className="text-base text-gray-900">
                        {render ? render(value) : value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {financialFields.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Financials</h3>
                {financialFields.map(({ label, value, render }) => (
                  <div
                    key={label}
                    className="first:border-none first:pt-0 border-t border-gray-100 pt-4"
                  >
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-base text-gray-900">
                      {render ? render(value) : value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {documentEntries.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Document Compliance</h3>
                <p className="text-sm text-gray-500">
                  Track insurance, safety certificates, and other required uploads.
                </p>
              </div>
              <button
                onClick={() => navigate(`/contracts/${contract.id}/edit`)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Update documents
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {documentEntries.map((doc) => {
                const statusStyle = documentStatusStyles[doc.status] || documentStatusStyles.missing;
                return (
                  <div
                    key={doc.key}
                    className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {doc.name || doc.key}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doc.daysRemaining !== null && doc.daysRemaining >= 0
                          ? `${doc.daysRemaining} day${doc.daysRemaining === 1 ? '' : 's'} remaining`
                          : doc.daysRemaining !== null
                            ? `${Math.abs(doc.daysRemaining)} day${Math.abs(doc.daysRemaining) === 1 ? '' : 's'} overdue`
                            : 'No expiry date captured'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-700">
                        Expires:&nbsp;
                        <span className="font-medium">{doc.expiryDisplay}</span>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.badge}`}
                      >
                        {statusStyle.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {hasValue(contract.notes) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <p className="text-gray-700 leading-relaxed">{contract.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewContract;

