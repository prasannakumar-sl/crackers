'use client';

import { useState, useEffect, useRef } from 'react';
import OrderDetailsModal from '../components/OrderDetailsModal';
import InvoicePrint from '../components/InvoicePrint';
import html2pdf from 'html2pdf.js';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Download related state
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);
  const [downloadOrderData, setDownloadOrderData] = useState(null);
  const invoiceRef = useRef(null);

  // Load orders from database
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditDetails = (orderId) => {
    window.location.hash = `#/admin/orders/${orderId}`;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    setEditMode(false);
    // Refresh orders after closing modal (in case changes were made)
    fetchOrders();
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      setDownloadingOrderId(orderId);
      // Fetch full order details including company info
      const response = await fetch(`/api/orders?id=${orderId}`);
      const data = await response.json();

      if (response.ok) {
        // Get payment methods from localStorage
        let paymentMethods = null;
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('adminPayments');
          if (saved) paymentMethods = JSON.parse(saved);
        }

        setDownloadOrderData({ ...data, paymentMethods });

        // Give React a moment to render the hidden invoice
        setTimeout(async () => {
          if (invoiceRef.current) {
            const filename = `Invoice-${data.order.invoice_number || orderId}.pdf`;
            const options = {
              margin: [5, 5, 5, 5],
              filename: filename,
              image: { type: 'jpeg', quality: 0.95 },
              html2canvas: {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
              },
              jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };

            await html2pdf().set(options).from(invoiceRef.current).save();

            // Clean up
            setDownloadOrderData(null);
            setDownloadingOrderId(null);
          }
        }, 500);
      } else {
        console.error('Failed to fetch order details for download:', data.error);
        alert('Failed to prepare invoice for download');
        setDownloadingOrderId(null);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error occurred while downloading invoice');
      setDownloadingOrderId(null);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        console.error('Failed to fetch orders:', data.error);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Orders</h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">
              <p className="text-lg">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-semibold text-gray-800">#{order.id}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{order.customer_name}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{order.phone}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-green-600">₹{parseFloat(order.total_amount).toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{order.item_count}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-sm action-buttons">
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="action-button"
                        title="View order details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEditDetails(order.id)}
                        className="action-button"
                        title="Edit order"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        className={`action-button ${downloadingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Download Invoice"
                        disabled={downloadingOrderId === order.id}
                      >
                        {downloadingOrderId === order.id ? '⌛' : '📥'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editMode={editMode}
      />

      {/* Hidden Invoice for downloading */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', overflow: 'hidden', height: 0 }}>
        {downloadOrderData && (
          <InvoicePrint
            containerRef={invoiceRef}
            orderData={{
              order: downloadOrderData.order,
              items: downloadOrderData.items
            }}
            company={downloadOrderData.company}
            paymentMethods={downloadOrderData.paymentMethods}
          />
        )}
      </div>

      <style jsx>{`
        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-button {
          background: none;
          border: 1px solid #d1d5db;
          cursor: pointer;
          font-size: 16px;
          padding: 6px 10px;
          border-radius: 4px;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .action-button:hover {
          background-color: #f3f4f6;
          border-color: #9ca3af;
        }

        .action-button:active {
          background-color: #e5e7eb;
        }
      `}</style>
    </>
  );
}
