import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import documentFields from '../constants/documentFields';

const createDocumentState = (seed = {}) =>
  documentFields.reduce((acc, field) => {
    acc[field.key] = {
      file: null,
      expiry: seed[field.key] || ''
    };
    return acc;
  }, {});

const EditContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    contractName: '',
    supplier: '',
    area: '',
    type: '',
    contractValue: '',
    duration: '',
    endDate: '',
    reminder: '',
    notes: '',
    specialTerms: '',
    referenceNumber: '',
    internalContact: ''
  });

  const [documents, setDocuments] = useState(createDocumentState());

  const [alerts, setAlerts] = useState({
    whoNotified: '',
    alertType: 'email'
  });

  // Sample data - in real app, this would come from API
  const sampleContract = {
    id: id,
    contractName: 'Office Supplies Contract',
    supplier: 'abc-supplies',
    area: 'Head Office',
    type: 'non-food',
    contractValue: '15000',
    duration: '12',
    endDate: '2024-03-15',
    reminder: '1-month',
    notes: 'This contract covers all office supplies for the head office location.',
    specialTerms: 'Quarterly review required',
    referenceNumber: 'CON-2024-001',
    internalContact: 'John Doe',
    documents: [
      {
        key: 'insurance',
        name: 'Insurance Certificate',
        expiryDate: '2024-05-31'
      },
      {
        key: 'gdpr',
        name: 'GDPR Compliance',
        expiryDate: '2024-09-30'
      },
      {
        key: 'tradingStandards',
        name: 'Trading Standards Report',
        expiryDate: '2024-04-15'
      }
    ]
  };

  useEffect(() => {
    // In real app, fetch contract data by ID
    if (sampleContract) {
      const { documents: sampleDocs = [], ...contractFields } = sampleContract;
      setFormData(contractFields);
      const docSeed = sampleDocs.reduce((acc, doc) => {
        acc[doc.key] = doc.expiryDate || '';
        return acc;
      }, {});
      setDocuments(createDocumentState(docSeed));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    setDocuments(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        file
      }
    }));
  };

  const handleExpiryChange = (value, field) => {
    setDocuments(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        expiry: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contract updated:', { formData, documents, alerts });
    navigate('/');
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Contract</h2>
              <p className="text-gray-600">Update contract information</p>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contract Name *
                    </label>
                    <input
                      type="text"
                      name="contractName"
                      value={formData.contractName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier *
                    </label>
                    <select
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Supplier</option>
                      <option value="brakes">Brakes</option>
                      <option value="jw-lees">JW Lees</option>
                      <option value="countrywide">Countrywide</option>
                      <option value="nisbets">Nisbets</option>
                      <option value="elis">Elis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="food">Food</option>
                      <option value="drinks">Drinks</option>
                      <option value="cleaning-and-chemicals">Cleaning and Chemicals</option>
                      <option value="catering-equipment">Catering Equipment</option>
                      <option value="laundry">Laundry</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contract Value (£)
                    </label>
                    <input
                      type="number"
                      name="contractValue"
                      value={formData.contractValue}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (months)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Reminders */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminders</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Period
                  </label>
                  <select
                    name="reminder"
                    value={formData.reminder}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Reminder</option>
                    <option value="1-week">1 Week</option>
                    <option value="2-weeks">2 Weeks</option>
                    <option value="1-month">1 Month</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Document Upload */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Upload</h3>
                <div className="space-y-6">
                  {documentFields.map(({ key, label, helper }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          {label}
                        </label>
                        <span className="text-xs text-gray-400">
                          {documents[key]?.expiry ? 'Expiry tracked' : 'Optional'}
                        </span>
                      </div>
                      {helper && <p className="text-xs text-gray-500 mb-2">{helper}</p>}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, key)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="date"
                            value={documents[key]?.expiry || ''}
                            onChange={(e) => handleExpiryChange(e.target.value, key)}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      {documents[key]?.file && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ {documents[key].file.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Terms
                    </label>
                    <input
                      type="text"
                      name="specialTerms"
                      value={formData.specialTerms}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      name="referenceNumber"
                      value={formData.referenceNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internal Contact
                    </label>
                    <input
                      type="text"
                      name="internalContact"
                      value={formData.internalContact}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Who should be notified?
                    </label>
                    <input
                      type="email"
                      value={alerts.whoNotified}
                      onChange={(e) => setAlerts(prev => ({ ...prev, whoNotified: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="email@company.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Update Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContract;
