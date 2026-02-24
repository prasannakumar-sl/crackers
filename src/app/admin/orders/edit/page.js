'use client';

import { useState, useEffect } from 'react';

export default function EditOrderPage() {
  const [orderId, setOrderId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    customerDetails: {},
    items: [],
    paymentStatus: 'Unpaid',
    status: 'Pending'
  });

  useEffect(() => {
    // Get order ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setOrderId(id);
      fetchProducts();
      fetchOrderDetails(id);
    }
  }, []);

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

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/orders?id=${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setOrderData(data);
        setEditFormData({
          customerDetails: {
            customer_name: data.order.customer_name,
            phone: data.order.phone,
            email: data.order.email,
            address: data.order.address
          },
          items: data.items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: parseFloat(item.price),
          discount: parseFloat(item.discount) || 0
        })),
          paymentStatus: data.order.payment_status || 'Unpaid',
          status: data.order.status || 'Pending'
        });
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
      setSuccessMessage('');

      const payload = {
        orderId,
        customerDetails: editFormData.customerDetails,
        paymentStatus: editFormData.paymentStatus,
        status: editFormData.status,
        items: editFormData.items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
          discount: parseFloat(item.discount) || 0
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMessage('Order updated successfully!');
        await fetchOrderDetails(orderId);
        // Redirect back to orders list after 1.5 seconds
        setTimeout(() => {
          window.location.hash = '#/admin/orders';
        }, 1500);
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
        price: 0,
        discount: 0
      }]
    }));
  };

  const handleItemChange = (index, field, value) => {
    setEditFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });

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

  const handleCancel = () => {
    window.location.hash = '#/admin/orders';
  };

  const calculateTotal = () => {
    return editFormData.items.reduce((sum, item) => {
      const basePrice = parseFloat(item.price) * parseInt(item.quantity);
      const discount = parseFloat(item.discount) || 0;
      return sum + (basePrice - discount);
    }, 0).toFixed(2);
  };

  if (!orderId) {
    return (
      <div className="edit-order-container">
        <p className="error-message">Order ID not found in URL</p>
      </div>
    );
  }

  return (
    <div className="edit-order-container">
      <div className="edit-page-header">
        <h2>Edit Order #{orderId}</h2>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading order details...</p>
        </div>
      ) : error ? (
        <div className="error-banner">
          <p className="error-message">{error}</p>
          <button onClick={() => fetchOrderDetails(orderId)} className="retry-button">Retry</button>
        </div>
      ) : successMessage ? (
        <div className="success-banner">
          <p className="success-message">{successMessage}</p>
        </div>
      ) : orderData ? (
        <div className="edit-form-wrapper">
          {/* Customer Details Section */}
          <section className="form-section">
            <h3 className="section-title">Customer Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  value={editFormData.customerDetails.customer_name || ''}
                  onChange={(e) => handleCustomerChange('customer_name', e.target.value)}
                  className="form-input"
                  placeholder="Customer name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  value={editFormData.customerDetails.phone || ''}
                  onChange={(e) => handleCustomerChange('phone', e.target.value)}
                  className="form-input"
                  placeholder="Phone number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={editFormData.customerDetails.email || ''}
                  onChange={(e) => handleCustomerChange('email', e.target.value)}
                  className="form-input"
                  placeholder="Email address"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Address</label>
                <textarea
                  value={editFormData.customerDetails.address || ''}
                  onChange={(e) => handleCustomerChange('address', e.target.value)}
                  className="form-textarea"
                  placeholder="Address"
                  rows="3"
                />
              </div>
            </div>
          </section>

          {/* Order Status Section */}
          <section className="form-section">
            <h3 className="section-title">Order Status</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Payment Status</label>
                <select
                  value={editFormData.paymentStatus}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, paymentStatus: e.target.value }))}
                  className="form-input"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Order Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="form-input"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </section>

          {/* Items Section */}
          <section className="form-section">
            <h3 className="section-title">Order Items</h3>
            <div className="items-table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {editFormData.items.map((item, index) => {
                    const baseAmount = parseFloat(item.price) * parseInt(item.quantity);
                    const discountAmount = parseFloat(item.discount) || 0;
                    const itemAmount = (baseAmount - discountAmount).toFixed(2);
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
                        <td>
                          <input
                            type="number"
                            value={item.discount || 0}
                            onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
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
            </div>
            <button onClick={handleAddItem} className="add-item-button">
              + Add Item
            </button>
          </section>

          {/* Total Section */}
          <section className="form-section">
            <div className="total-display">
              <div className="total-row">
                <span>Total Items:</span>
                <span>{editFormData.items.length}</span>
              </div>
              <div className="total-row total-amount">
                <span>Total Amount:</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="form-actions">
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
            <button onClick={handleSaveChanges} className="save-button" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .edit-order-container {
          padding: 30px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .edit-page-header {
          margin-bottom: 30px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
        }

        .edit-page-header h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          color: #1f2937;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          background: #f9fafb;
          border-radius: 8px;
          color: #6b7280;
        }

        .error-banner,
        .success-banner {
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-banner {
          background: #fee2e2;
          border: 1px solid #fecaca;
        }

        .success-banner {
          background: #d1fae5;
          border: 1px solid #a7f3d0;
        }

        .error-message {
          color: #991b1b;
          margin: 0;
          font-weight: 500;
        }

        .success-message {
          color: #065f46;
          margin: 0;
          font-weight: 500;
        }

        .retry-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          white-space: nowrap;
        }

        .retry-button:hover {
          background: #991b1b;
        }

        .edit-form-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          padding: 25px;
          border-bottom: 1px solid #e5e7eb;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 20px 0;
          color: #1f2937;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          color: #374151;
        }

        .form-input,
        .form-textarea {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          color: #1f2937;
          background: #f9fafb;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .items-table-wrapper {
          overflow-x: auto;
          margin-bottom: 20px;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .items-table thead {
          background: #f3f4f6;
          border-top: 1px solid #d1d5db;
          border-bottom: 2px solid #111827;
        }

        .items-table th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #1f2937;
          border-right: 1px solid #e5e7eb;
        }

        .items-table th:last-child {
          border-right: none;
        }

        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          border-right: 1px solid #f3f4f6;
        }

        .items-table td:last-child {
          border-right: none;
        }

        .items-table tbody tr:hover {
          background: #f9fafb;
        }

        .items-table input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 13px;
          background: white;
        }

        .items-table input:focus {
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
          padding: 6px 10px;
          border-radius: 4px;
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
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
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

        .total-display {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 20px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          width: 280px;
          margin-bottom: 8px;
          font-size: 15px;
        }

        .total-amount {
          font-weight: 700;
          font-size: 18px;
          color: #047857;
          border-top: 2px solid #111827;
          padding-top: 12px;
          margin-bottom: 0;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 25px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          border-radius: 0 0 8px 8px;
        }

        .cancel-button,
        .save-button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.2s;
        }

        .cancel-button {
          background: #e5e7eb;
          color: #1f2937;
        }

        .cancel-button:hover {
          background: #d1d5db;
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

        @media (max-width: 768px) {
          .edit-order-container {
            padding: 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-section {
            padding: 20px;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .cancel-button,
          .save-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
