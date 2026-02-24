'use client';

import { useState, useEffect } from 'react';

export default function OrderDetailsModal({ orderId, isOpen, onClose, editMode = false }) {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(editMode);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    customerDetails: {},
    items: [],
    paymentStatus: 'Unpaid',
    status: 'Pending'
  });

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      if (orderId) {
        fetchOrderDetails();
      }
    }
  }, [isOpen, orderId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    if (orderData && isEditing) {
      setEditFormData({
        customerDetails: {
          customer_name: orderData.order.customer_name,
          phone: orderData.order.phone,
          email: orderData.order.email,
          address: orderData.order.address
        },
        items: orderData.items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: parseFloat(item.price)
        })),
        paymentStatus: orderData.order.payment_status || 'Unpaid',
        status: orderData.order.status || 'Pending'
      });
    }
  }, [isEditing, orderData]);

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

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        orderId,
        customerDetails: editFormData.customerDetails,
        paymentStatus: editFormData.paymentStatus,
        status: editFormData.status,
        items: editFormData.items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsEditing(false);
        await fetchOrderDetails();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save changes');
      }
    } catch (err) {
      setError(err.message || 'Error saving changes');
      console.error('Error saving changes:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveItem = (index) => {
    setEditFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleAddItem = () => {
    setEditFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: null,
        product_id: null,
        product_name: '',
        quantity: 1,
        price: 0
      }]
    }));
  };

  const handleItemChange = (index, field, value) => {
    setEditFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });

    // Show suggestions when typing in product name field
    if (field === 'product_name') {
      setSearchQuery(prev => ({ ...prev, [index]: value }));
      setShowSuggestions(prev => ({ ...prev, [index]: value.length > 0 }));
    }
  };

  const handleSelectProduct = (index, product) => {
    setEditFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: 1
      };
      return { ...prev, items: newItems };
    });
    setShowSuggestions(prev => ({ ...prev, [index]: false }));
    setSearchQuery(prev => ({ ...prev, [index]: '' }));
  };

  const getFilteredProducts = (index) => {
    const query = searchQuery[index] || '';
    if (!query) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  const handleCustomerChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      customerDetails: { ...prev.customerDetails, [field]: value }
    }));
  };

  if (!isOpen) return null;

  const calculateTotal = () => {
    return editFormData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0).toFixed(2);
  };

  const currentTotal = orderData ? parseFloat(orderData.order.total_amount).toFixed(2) : '0.00';
  const displayTotal = isEditing ? calculateTotal() : currentTotal;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Order' : 'Order Details - Invoice'}</h2>
          <div className="header-actions">
            {!isEditing && (
              <button 
                className="icon-button edit-button" 
                onClick={() => setIsEditing(true)}
                title="Edit order"
              >
                ✏️
              </button>
            )}
            <button className="close-button" onClick={onClose}>×</button>
          </div>
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
            <div className="invoice-container a4-sheet">
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
                      {isEditing ? (
                        <select
                          value={editFormData.paymentStatus}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paymentStatus: e.target.value }))}
                          className="payment-select"
                        >
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                        </select>
                      ) : (
                        <span className="meta-value payment-badge" data-status={editFormData.paymentStatus || 'Unpaid'}>
                          {editFormData.paymentStatus || 'Unpaid'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details Section */}
              <div className="customer-section">
                <div className="customer-block">
                  <h4 className="section-title">Billed To:</h4>
                  {isEditing ? (
                    <div className="edit-customer-form">
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={editFormData.customerDetails.customer_name}
                        onChange={(e) => handleCustomerChange('customer_name', e.target.value)}
                        className="form-input"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={editFormData.customerDetails.phone}
                        onChange={(e) => handleCustomerChange('phone', e.target.value)}
                        className="form-input"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={editFormData.customerDetails.email}
                        onChange={(e) => handleCustomerChange('email', e.target.value)}
                        className="form-input"
                      />
                      <textarea
                        placeholder="Address"
                        value={editFormData.customerDetails.address}
                        onChange={(e) => handleCustomerChange('address', e.target.value)}
                        className="form-textarea"
                        rows="2"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="customer-name">{orderData.order.customer_name}</p>
                      {orderData.order.phone && <p>Phone: {orderData.order.phone}</p>}
                      {orderData.order.email && <p>Email: {orderData.order.email}</p>}
                      {orderData.order.address && <p>Address: {orderData.order.address}</p>}
                    </>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="items-table-wrapper">
                {isEditing ? (
                  <div className="edit-items-form">
                    <h4 className="section-title">Order Items:</h4>
                    <table className="items-table edit-table">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editFormData.items.map((item, index) => {
                          const itemAmount = (parseFloat(item.price) * parseInt(item.quantity)).toFixed(2);
                          return (
                            <tr key={index}>
                              <td>
                                <div className="autocomplete-wrapper">
                                  <input
                                    type="text"
                                    value={item.product_name}
                                    onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                                    className="form-input"
                                    placeholder="Product name"
                                  />
                                  {showSuggestions[index] && (
                                    <div className="autocomplete-suggestions">
                                      {getFilteredProducts(index).length > 0 ? (
                                        getFilteredProducts(index).map(product => (
                                          <div
                                            key={product.id}
                                            className="autocomplete-item"
                                            onClick={() => handleSelectProduct(index, product)}
                                          >
                                            <span className="item-name">{product.name}</span>
                                            <span className="item-price">₹{parseFloat(product.price).toFixed(2)}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="autocomplete-item no-results">
                                          No products found
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                  className="form-input"
                                  min="1"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={item.price}
                                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                  className="form-input"
                                  step="0.01"
                                  min="0"
                                />
                              </td>
                              <td className="amount-cell">₹{itemAmount}</td>
                              <td>
                                <button
                                  onClick={() => handleRemoveItem(index)}
                                  className="remove-item-btn"
                                  title="Remove item"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <button onClick={handleAddItem} className="add-item-button">
                      + Add Item
                    </button>
                  </div>
                ) : (
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
                )}
              </div>

              {/* Total Section */}
              <div className="total-section">
                <div className="total-row">
                  <span>Total Items:</span>
                  <span>{editFormData.items.length}</span>
                </div>
                <div className="total-row total-amount">
                  <span>Total Amount:</span>
                  <span>₹{displayTotal}</span>
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
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
              <button onClick={handleSaveChanges} className="save-button" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="close-modal-button">Close</button>
              <button onClick={() => window.print()} className="print-button">Print A4</button>
            </>
          )}
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

        .header-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .icon-button {
          background: none;
          border: 1px solid #d1d5db;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }

        .icon-button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
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

        /* A4 Sheet Styles */
        .a4-sheet {
          background: white;
          width: 100%;
          padding: 40px;
          margin: 0 auto;
          box-sizing: border-box;
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
          align-items: center;
        }

        .meta-label {
          font-weight: 600;
          margin-right: 10px;
        }

        .meta-value {
          text-align: right;
        }

        .payment-badge {
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: 600;
          display: inline-block;
        }

        .payment-badge[data-status="Paid"] {
          background: #d1fae5;
          color: #065f46;
        }

        .payment-badge[data-status="Unpaid"] {
          background: #fef3c7;
          color: #92400e;
        }

        .payment-select {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 13px;
          background: white;
          cursor: pointer;
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

        .edit-customer-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-input,
        .form-textarea {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .items-table-wrapper {
          margin-bottom: 30px;
          overflow-x: auto;
        }

        .edit-items-form {
          margin-bottom: 30px;
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

        .edit-table input {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 3px;
          font-size: 12px;
        }

        .edit-table input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .amount-cell {
          text-align: right;
          font-weight: 600;
          color: #047857;
        }

        .remove-item-btn {
          background: #fee2e2;
          border: none;
          color: #991b1b;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }

        .remove-item-btn:hover {
          background: #fecaca;
        }

        .add-item-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 12px;
          transition: background 0.2s;
        }

        .add-item-button:hover {
          background: #2563eb;
        }

        .autocomplete-wrapper {
          position: relative;
        }

        .autocomplete-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 4px 4px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .autocomplete-item {
          padding: 10px 12px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #f3f4f6;
        }

        .autocomplete-item:hover:not(.no-results) {
          background: #f3f4f6;
        }

        .autocomplete-item:last-child {
          border-bottom: none;
        }

        .autocomplete-item.no-results {
          color: #9ca3af;
          cursor: default;
          justify-content: center;
        }

        .item-name {
          font-weight: 500;
          color: #1f2937;
          flex: 1;
        }

        .item-price {
          color: #047857;
          font-weight: 600;
          white-space: nowrap;
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
        .print-button,
        .save-button,
        .cancel-button {
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

        .save-button {
          background: #3b82f6;
          color: white;
        }

        .save-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .save-button:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }

        .cancel-button {
          background: #e5e7eb;
          color: #1f2937;
        }

        .cancel-button:hover {
          background: #d1d5db;
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

          .a4-sheet {
            padding: 20px;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
