import React, { useState } from 'react';

const expectedColumns = [
  'name',
  'supplier',
  'type',
  'endDate',
  'status',
  'contractValue',
  'durationMonths',
  'area',
  'reminder',
  'internalContact',
  'referenceNumber',
  'notes',
  'lastReviewed'
];

const BulkUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const resetState = () => {
    setSelectedFile(null);
    setPreviewRows([]);
    setStatus({ type: '', message: '' });
  };

  const parsePreview = async (file) => {
    const text = await file.text();
    const [headerLine, ...rows] = text.split(/\r?\n/).filter(Boolean);
    if (!headerLine) {
      setPreviewRows([]);
      return;
    }
    const headers = headerLine.split(',').map((h) => h.trim());
    const preview = rows.slice(0, 5).map((row) => {
      const values = row.split(',').map((value) => value.trim());
      return headers.reduce((acc, header, idx) => {
        acc[header] = values[idx] ?? '';
        return acc;
      }, {});
    });

    setPreviewRows(preview);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    resetState();
    if (!file) {
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setStatus({ type: 'error', message: 'Please upload a CSV file.' });
      return;
    }

    setSelectedFile(file);
    await parsePreview(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus({ type: 'error', message: 'Select a CSV file before uploading.' });
      return;
    }

    setIsUploading(true);
    setStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/contracts/bulk-upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.message || 'Upload failed. Please try again.');
      }

      const result = await response.json();
      onSuccess(result.records || [], result);
      resetState();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const downloadTemplate = () => {
    const header = expectedColumns.join(',');
    const sampleRow = [
      'Sample Contract',
      'Supplier Ltd',
      'food',
      '2024-12-31',
      'active',
      '50000',
      '12',
      'North Region',
      '1-month',
      'Alex Smith',
      'REF-123',
      'Optional notes go here',
      '2024-01-15'
    ].join(',');

    const csvContent = `${header}\n${sampleRow}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'contract-upload-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Bulk Upload Contracts</h3>
            <p className="text-sm text-gray-500">
              Upload a CSV file with the required columns to add contracts in bulk.
            </p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="text-xs text-gray-500">
              Required columns: {expectedColumns.join(', ')}
            </div>
            <button
              onClick={downloadTemplate}
              className="text-sm text-blue-600 hover:text-blue-800"
              type="button"
            >
              Download CSV template
            </button>
          </div>

          {previewRows.length > 0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Preview (showing first {previewRows.length} rows)
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-left text-gray-600">
                  <thead>
                    <tr>
                      {Object.keys(previewRows[0]).map((header) => (
                        <th key={header} className="px-2 py-1 font-medium text-gray-500 uppercase">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-200">
                        {Object.keys(row).map((key) => (
                          <td key={key} className="px-2 py-1">
                            {row[key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {status.message && (
            <div
              className={`text-sm px-3 py-2 rounded-xl ${
                status.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-100'
                  : 'bg-green-50 text-green-700 border border-green-100'
              }`}
            >
              {status.message}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;

