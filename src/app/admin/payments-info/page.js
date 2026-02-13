'use client';

import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function PaymentsInfoPage() {
  const [payments, setPayments] = useState({
    bankAccount: {
      name: 'PK TRADERS',
      accountNo: '123456789123',
      bankName: 'BBBB'
    },
    gpay: {
      name: 'xxxx',
      number: '9354200000'
    },
    upi: {
      name: 'xxxx',
      id: 'cnjncdjdk'
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [tempPayments, setTempPayments] = useState(payments);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showAlert = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const savedPayments = localStorage.getItem('adminPayments');
    if (savedPayments) {
      const parsed = JSON.parse(savedPayments);
      setPayments(parsed);
      setTempPayments(parsed);
    }
  }, []);

  const handleInputChange = (category, field, value) => {
    setTempPayments(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    setPayments(tempPayments);
    localStorage.setItem('adminPayments', JSON.stringify(tempPayments));
    setEditMode(false);
    showAlert('Payment methods updated successfully!', 'success');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Payment Methods</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`${editMode ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded font-semibold transition-colors`}
        >
          {editMode ? '✕ Cancel' : '✎ Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bank Account */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💳 Bank Account</h3>
          {editMode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Account Name</label>
                <input
                  type="text"
                  value={tempPayments.bankAccount.name}
                  onChange={(e) => handleInputChange('bankAccount', 'name', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={tempPayments.bankAccount.accountNo}
                  onChange={(e) => handleInputChange('bankAccount', 'accountNo', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={tempPayments.bankAccount.bankName}
                  onChange={(e) => handleInputChange('bankAccount', 'bankName', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 text-black"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">Name:</span> {payments.bankAccount.name}</p>
              <p><span className="font-semibold">Account No:</span> {payments.bankAccount.accountNo}</p>
              <p><span className="font-semibold">Bank:</span> {payments.bankAccount.bankName}</p>
            </div>
          )}
        </div>

        {/* GPay */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📱 GPay</h3>
          {editMode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={tempPayments.gpay.name}
                  onChange={(e) => handleInputChange('gpay', 'name', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">GPay Number</label>
                <input
                  type="text"
                  value={tempPayments.gpay.number}
                  onChange={(e) => handleInputChange('gpay', 'number', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 text-black"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">Name:</span> {payments.gpay.name}</p>
              <p><span className="font-semibold">GPay No:</span> {payments.gpay.number}</p>
            </div>
          )}
        </div>

        {/* UPI */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💰 UPI</h3>
          {editMode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={tempPayments.upi.name}
                  onChange={(e) => handleInputChange('upi', 'name', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  value={tempPayments.upi.id}
                  onChange={(e) => handleInputChange('upi', 'id', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 text-black"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">Name:</span> {payments.upi.name}</p>
              <p><span className="font-semibold">UPI ID:</span> {payments.upi.id}</p>
            </div>
          )}
        </div>
      </div>

      {editMode && (
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
