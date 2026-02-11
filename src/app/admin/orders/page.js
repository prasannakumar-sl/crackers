'use client';

import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('adminOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Orders</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg">No orders yet.</p>
            <p className="text-sm mt-2">Orders will appear here when customers checkout.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Items</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-semibold text-gray-800">#{order.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-800">{order.customerName}</td>
                  <td className="px-6 py-3 text-sm text-gray-800">{order.phone}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-green-600">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-3 text-sm text-gray-800">{order.itemCount}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
