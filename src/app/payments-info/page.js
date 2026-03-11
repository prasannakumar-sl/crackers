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
    <div className="dark-bg-section">
      {/* Hero Section */}
      <section className="relative navy-bg-section text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Payments Information</h1>
          <p className="gold-text mt-2">Payment details for your orders</p>
        </div>
      </section>

      {/* Payment Details Section */}
      <section className="py-12 px-6 dark-bg-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Bank Account */}
            <div className="navy-bg-section rounded-lg shadow border border-gray-600 p-6">
              <h3 className="text-lg font-bold text-white mb-4">💳 Bank Account</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><span className="font-semibold gold-text">Name:</span> {payments.bankAccount.name}</p>
                <p><span className="font-semibold gold-text">Account No:</span> {payments.bankAccount.accountNo}</p>
                <p><span className="font-semibold gold-text">Bank:</span> {payments.bankAccount.bankName}</p>
              </div>
            </div>

            {/* GPay */}
            <div className="navy-bg-section rounded-lg shadow border border-gray-600 p-6">
              <h3 className="text-lg font-bold text-white mb-4">📱 GPay</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><span className="font-semibold gold-text">Name:</span> {payments.gpay.name}</p>
                <p><span className="font-semibold gold-text">GPay No:</span> {payments.gpay.number}</p>
              </div>
            </div>

            {/* UPI Text Only */}
            <div className="navy-bg-section rounded-lg shadow border border-gray-600 p-6">
              <h3 className="text-lg font-bold text-white mb-4">💰 UPI</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><span className="font-semibold gold-text">Name:</span> {payments.upi.name}</p>
                <p><span className="font-semibold gold-text">UPI ID:</span> {payments.upi.id}</p>
              </div>
            </div>
          </div>

          {/* UPI QR Code Section */}
          <div className="navy-bg-section rounded-lg shadow border border-gray-600 p-10 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-6">Scan UPI QR Code</h2>
            {payments.upi.qrCode ? (
              <>
                <img src={payments.upi.qrCode} alt="UPI QR Code" className="w-150 h-250 object-contain border-2 gold-accent rounded p-4" />
                <p className="text-center text-gray-300 mt-28 font-semibold">{payments.upi.id}</p>
              </>
            ) : (
              <div className="w-64 h-64 bg-gray-700 border-2 gold-accent rounded flex items-center justify-center">
                <p className="text-gray-400 text-center">QR Code will be displayed here</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
