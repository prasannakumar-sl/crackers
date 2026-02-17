'use client';

import { useState, useEffect } from 'react';

export default function PaymentsInfo() {
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
      id: 'cnjncdjdk',
      qrCode: null
    }
  });

  useEffect(() => {
    const savedPayments = localStorage.getItem('adminPayments');
    if (savedPayments) {
      const parsed = JSON.parse(savedPayments);
      setPayments(parsed);
    }
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-teal-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Payments Information</h1>
          <p className="text-yellow-300 mt-2">Payment details for your orders</p>
        </div>
      </section>

      {/* Payment Details Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bank Account */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">💳 Bank Account</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Name:</span> {payments.bankAccount.name}</p>
                <p><span className="font-semibold">Account No:</span> {payments.bankAccount.accountNo}</p>
                <p><span className="font-semibold">Bank:</span> {payments.bankAccount.bankName}</p>
              </div>
            </div>

            {/* GPay */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📱 GPay</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Name:</span> {payments.gpay.name}</p>
                <p><span className="font-semibold">GPay No:</span> {payments.gpay.number}</p>
              </div>
            </div>

            {/* UPI */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">💰 UPI</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Name:</span> {payments.upi.name}</p>
                <p><span className="font-semibold">UPI ID:</span> {payments.upi.id}</p>
                {payments.upi.qrCode && (
                  <div className="mt-3">
                    <img src={payments.upi.qrCode} alt="UPI QR Code" className="w-40 h-40 object-contain border border-gray-300 rounded" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
