import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';

const Suppliers = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    keyContact: '',
    email: '',
    phone: '',
    address: '',
    accreditations: ''
  });

  // Sample suppliers data
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'Brakes',
      keyContact: 'Emma Thompson',
      email: 'emma.thompson@brakes.co.uk',
      phone: '+44 1234 567890',
      address: '123 Supply Chain Way, Birmingham, B12 4AA',
      accreditations: 'ISO 9001, BRC AA Rated, HACCP'
    },
    {
      id: 2,
      name: 'JW Lees',
      keyContact: 'James Wilson',
      email: 'james.wilson@jwlees.co.uk',
      phone: '+44 161 234 5678',
      address: '456 Brewery Road, Manchester, M3 6AB',
      accreditations: 'ISO 9001, Alcohol Wholesale Registration'
    },
    {
      id: 3,
      name: 'Countrywide',
      keyContact: 'Michael Anderson',
      email: 'michael.anderson@countrywide.com',
      phone: '+44 3456 789012',
      address: '789 Industrial Estate, London, NW1 2CD',
      accreditations: 'COSHH Certified, REACH Compliant, ISO 9001'
    },
    {
      id: 4,
      name: 'Nisbets',
      keyContact: 'Sarah Mitchell',
      email: 'sarah.mitchell@nisbets.co.uk',
      phone: '+44 4567 890123',
      address: '234 Catering Equipment Park, Bristol, BS1 3DE',
      accreditations: 'ISO 9001, Catering Equipment Certified'
    },
    {
      id: 5,
      name: 'Elis',
      keyContact: 'David Roberts',
      email: 'david.roberts@elis.co.uk',
      phone: '+44 5678 901234',
      address: '567 Laundry Services Lane, Leeds, LS1 4EF',
      accreditations: 'ISO 9001, Oeko-Tex Certified, Sustainable Textiles'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSupplier = {
      id: suppliers.length + 1,
      ...formData
    };
    setSuppliers(prev => [...prev, newSupplier]);
    setFormData({
      name: '',
      keyContact: '',
      email: '',
      phone: '',
      address: '',
      accreditations: ''
    });
    setShowModal(false);
  };

  const handleEdit = (supplier) => {
    navigate(`/suppliers/${supplier.id}/edit`);
  };

  const handleDelete = (supplier) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplier.id));
  };

  const columns = [
    {
      key: 'name',
      label: 'Supplier Name',
      sortable: true,
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: 'keyContact',
      label: 'Key Contact',
      sortable: true
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
      key: 'phone',
      label: 'Phone',
      sortable: false,
      render: (value) => (
        <a href={`tel:${value}`} className="text-blue-600 hover:text-blue-800">
          {value}
        </a>
      )
    },
    {
      key: 'address',
      label: 'Address',
      sortable: false,
      render: (value) => (
        <span className="text-gray-600">{value}</span>
      )
    },
    {
      key: 'accreditations',
      label: 'Accreditations',
      sortable: false,
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Suppliers</h2>
              <p className="text-gray-600">Manage your supplier database</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Add Supplier
            </button>
          </div>
        </div>

        <Table
          data={suppliers}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />

        {/* Add Supplier Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add New Supplier</h3>
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
                    Supplier Name *
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
                    Key Contact *
                  </label>
                  <input
                    type="text"
                    name="keyContact"
                    value={formData.keyContact}
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
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accreditations
                  </label>
                  <input
                    type="text"
                    name="accreditations"
                    value={formData.accreditations}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., ISO 9001, BRC Global Standards"
                  />
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
                    Add Supplier
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

export default Suppliers;
