import React, { useState } from 'react';

const Table = ({ 
  data, 
  columns, 
  onSort, 
  sortField, 
  sortDirection,
  onEdit,
  onDelete,
  showActions = true,
  primaryActionLabel = 'Edit',
  secondaryActionLabel = 'Delete',
  renderActions
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rowPendingDelete, setRowPendingDelete] = useState(null);

  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const requestDelete = (row) => {
    setRowPendingDelete(row);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (rowPendingDelete && onDelete) {
      onDelete(rowPendingDelete);
    }
    setIsConfirmOpen(false);
    setRowPendingDelete(null);
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setRowPendingDelete(null);
  };

  const renderActionButtons = (row) => {
    if (renderActions) {
      return renderActions({ row, requestDelete });
    }

    return (
      <>
        <button
          onClick={() => onEdit && onEdit(row)}
          className="text-blue-600 hover:text-blue-900 transition-colors"
        >
          {primaryActionLabel}
        </button>
        <button
          onClick={() => requestDelete(row)}
          className="text-red-600 hover:text-red-900 transition-colors"
        >
          {secondaryActionLabel}
        </button>
      </>
    );
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr key={row.id ?? index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {renderActionButtons(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {paginatedData.map((row, index) => (
          <div key={row.id ?? index} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="space-y-3">
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.label}
                  </span>
                  <span className="text-sm text-gray-900 text-right flex-1 ml-4">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))}
              {showActions && (
                <div className="flex space-x-4 pt-3 border-t border-gray-100">
                  {renderActions ? (
                    renderActions({ row, requestDelete })
                  ) : (
                    <>
                      <button
                        onClick={() => onEdit && onEdit(row)}
                        className="flex-1 text-blue-600 hover:text-blue-900 transition-colors text-sm font-medium py-2"
                      >
                        {primaryActionLabel}
                      </button>
                      <button
                        onClick={() => requestDelete(row)}
                        className="flex-1 text-red-600 hover:text-red-900 transition-colors text-sm font-medium py-2"
                      >
                        {secondaryActionLabel}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete item?</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This action cannot be undone. Are you sure you want to delete
                    {rowPendingDelete?.name ? ` "${rowPendingDelete.name}"` : ''}?
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white px-4 sm:px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded-xl px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
          <span className="text-sm text-gray-700 px-2">
            <span className="hidden sm:inline">Page {currentPage} of {totalPages}</span>
            <span className="sm:hidden">{currentPage}/{totalPages}</span>
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
