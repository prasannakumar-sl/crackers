'use client';

import { useState, useEffect } from 'react';

export default function OrderDetailsModal({ orderId, isOpen, onClose }) {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/orders?id=${orderId}`);
      const data = await response.json();
      
      if (response.ok) {
        setOrderData(data);
      } else {
        setError(data.error || 'Failed to fetch order details');
      }
    } catch (err) {
      setError(err.message || 'Error fetching order details');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details - Invoice</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <p>Loading order details...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button onClick={fetchOrderDetails} className="retry-button">Retry</button>
            </div>
          ) : orderData ? (
            <div className="invoice-container">
              {/* Header Section */}
              <div className="invoice-header">
                <div className="company-section">
                  <h3 className="company-name">{orderData.company?.company_name || 'PK Crackers'}</h3>
                  <div className="company-details">
                    {orderData.company?.address && <p>{orderData.company.address}</p>}
                    {orderData.company?.phone_number && <p>Phone: {orderData.company.phone_number}</p>}
                    {orderData.company?.email && <p>Email: {orderData.company.email}</p>}
                    {orderData.company?.gst_number && <p>GST: {orderData.company.gst_number}</p>}
                  </div>
                </div>

                <div className="invoice-info">
                  <h2 className="invoice-title">BILL</h2>
                  <div className="invoice-meta">
                    <div className="meta-row">
                      <span className="meta-label">Bill No:</span>
                      <span className="meta-value">{orderData.order.invoice_number || `invno_${String(orderData.order.id).padStart(8, '0')}`}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Date:</span>
                      <span className="meta-value">
                        {new Date(orderData.order.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Payment:</span>
                      <span className="meta-value">UnPaid</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details Section */}
              <div className="customer-section">
                <div className="customer-block">
                  <h4 className="section-title">Billed To:</h4>
                  <p className="customer-name">{orderData.order.customer_name}</p>
                  {orderData.order.phone && <p>Phone: {orderData.order.phone}</p>}
                  {orderData.order.email && <p>Email: {orderData.order.email}</p>}
                  {orderData.order.address && <p>Address: {orderData.order.address}</p>}
                </div>
              </div>

              {/* Items Table */}
              <div className="items-table-wrapper">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Item Name</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Discounted Price</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.items.map((item, index) => {
                      const itemAmount = parseFloat(item.price) * item.quantity;
                      return (
                        <tr key={item.id || index}>
                          <td>{index + 1}</td>
                          <td>{item.product_name}</td>
                          <td>₹{parseFloat(item.price).toFixed(2)}</td>
                          <td>—</td>
                          <td>₹{parseFloat(item.price).toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td>₹{itemAmount.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Total Section */}
              <div className="total-section">
                <div className="total-row">
                  <span>Total Items:</span>
                  <span>{orderData.items.length}</span>
                </div>
                <div className="total-row total-amount">
                  <span>Total Amount:</span>
                  <span>₹{parseFloat(orderData.order.total_amount).toFixed(2)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="invoice-footer">
                <div className="footer-text">
                  <p>Authorized Signature</p>
                  <p className="footer-company">for {orderData.company?.company_name || 'PK Crackers'}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-modal-button">Close</button>
          <button onClick={() => window.print()} className="print-button">Print</button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          max-width: 900px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: #111827;
        }

        .modal-body {
          padding: 30px;
        }

        .loading-state,
        .error-state {
          text-align: center;
          padding: 40px 20px;
        }

        .error-message {
          color: #dc2626;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .retry-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .retry-button:hover {
          background: #2563eb;
        }

        /* Invoice Styles */
        .invoice-container {
          font-family: Arial, sans-serif;
          color: #1f2937;
        }

        .invoice-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #111827;
        }

        .company-section h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
          font-weight: 700;
        }

        .company-details {
          font-size: 12px;
          line-height: 1.6;
        }

        .company-details p {
          margin: 4px 0;
        }

        .invoice-info {
          text-align: right;
        }

        .invoice-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 15px 0;
          color: #111827;
        }

        .invoice-meta {
          font-size: 13px;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          min-width: 200px;
        }

        .meta-label {
          font-weight: 600;
          margin-right: 10px;
        }

        .meta-value {
          text-align: right;
        }

        .customer-section {
          margin-bottom: 30px;
        }

        .customer-block {
          background: #f9fafb;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #0f766e;
        }

        .section-title {
          margin: 0 0 8px 0;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #6b7280;
        }

        .customer-name {
          margin: 0 0 6px 0;
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .customer-block p {
          margin: 4px 0;
          font-size: 13px;
          color: #374151;
        }

        .items-table-wrapper {
          margin-bottom: 30px;
          overflow-x: auto;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        .items-table thead {
          background: #f3f4f6;
          border-top: 1px solid #d1d5db;
          border-bottom: 2px solid #111827;
        }

        .items-table th {
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          color: #1f2937;
          border-right: 1px solid #e5e7eb;
        }

        .items-table th:last-child {
          border-right: none;
        }

        .items-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #e5e7eb;
          border-right: 1px solid #f3f4f6;
        }

        .items-table td:last-child {
          border-right: none;
        }

        .items-table tbody tr:hover {
          background: #f9fafb;
        }

        .total-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-bottom: 30px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 4px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          width: 250px;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .total-amount {
          font-weight: 700;
          font-size: 16px;
          color: #047857;
          border-top: 2px solid #111827;
          padding-top: 12px;
          margin-bottom: 0;
        }

        .invoice-footer {
          text-align: right;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .footer-text {
          font-size: 12px;
          color: #6b7280;
        }

        .footer-company {
          font-weight: 600;
          color: #1f2937;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .close-modal-button,
        .print-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          font-size: 14px;
        }

        .close-modal-button {
          background: #e5e7eb;
          color: #1f2937;
        }

        .close-modal-button:hover {
          background: #d1d5db;
        }

        .print-button {
          background: #047857;
          color: white;
        }

        .print-button:hover {
          background: #065f46;
        }

        @media print {
          .modal-overlay {
            background: transparent;
          }

          .modal-content {
            max-width: 100%;
            width: 100%;
            max-height: 100%;
            box-shadow: none;
            border-radius: 0;
          }

          .modal-header,
          .modal-footer {
            display: none;
          }

          .modal-body {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
