'use client';

import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function CheckoutPage() {
  const { cart, getCartTotal } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmOrder = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      showAlert('Please fill in all customer details', 'warning');
      return;
    }

    // Save order to localStorage
    const newOrder = {
      id: Date.now(),
      customerName: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      items: cart,
      itemCount: cart.length,
      totalAmount: getCartTotal() + 100 + packingFee,
      date: new Date().toLocaleDateString()
    };

    const existingOrders = localStorage.getItem('adminOrders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(newOrder);
    localStorage.setItem('adminOrders', JSON.stringify(orders));

    showAlert('Order confirmed! Thank you for your order.', 'success');
    // In a real app, you'd navigate to a payment processing page or handle payment here
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white py-2 px-6 rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const cartTotal = getCartTotal();
  const shippingFee = 100; // Fixed shipping fee
  const packingFee = cartTotal > 5000 ? 0 : 50;
  const totalAmount = cartTotal + shippingFee + packingFee;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and complete checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Review Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-green-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Order Review</h2>
              </div>
              
              <div className="p-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                    {/* Product Image */}
                    {item.image && (
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                        {item.image.startsWith('http') || item.image.startsWith('/') ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{item.image}</span>
                        )}
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                      {item.productNumber && (
                        <p className="text-sm text-gray-600 mb-2">Product ID: {item.productNumber}</p>
                      )}
                      <p className="text-gray-700 mb-2">
                        Quantity: <span className="font-semibold">{item.quantity}</span>
                      </p>
                      <p className="text-gray-700">
                        Price:{' '}
                        <span className="font-semibold">
                          ₹{typeof item.discount === 'number'
                            ? (item.discount * item.quantity).toFixed(2)
                            : (parseFloat(item.discount.replace('₹', '')) * item.quantity).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Packing Fee:</span>
                    <span>₹{packingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span>₹{shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-gray-200">
                    <span>Order Total:</span>
                    <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-green-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Customer Details</h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Delivery Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter delivery address"
                    rows="3"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary & Payment Info */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-900 text-white px-6 py-4">
                <h2 className="text-lg font-bold">Payment Methods</h2>
              </div>

              <div className="p-6 space-y-3">
                <div className="pb-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-2">Bank Account</h3>
                  <p className="text-sm text-gray-700">A/C Name: PK TRADERS</p>
                  <p className="text-sm text-gray-700">A/C No: 123456789123</p>
                  <p className="text-sm text-gray-700">Bank: BBBB</p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-2">GPay</h3>
                  <p className="text-sm text-gray-700">Name: xxxx</p>
                  <p className="text-sm text-gray-700">GPay No: 9354200000</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">UPI</h3>
                  <p className="text-sm text-gray-700">Name: xxxx</p>
                  <p className="text-sm text-gray-700">UPI ID: cnjncdjdk</p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h3 className="font-bold text-yellow-800 mb-2">Important Notes</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Minimum Order: ₹2000 (TamilNadu), ₹3000 (Other States)</li>
                <li>• 50% Discount on bulk orders</li>
                <li>• Payment required before delivery</li>
              </ul>
            </div>

            {/* Confirm Order Button */}
            <button
              onClick={handleConfirmOrder}
              className="w-full bg-blue-900 text-white py-3 rounded font-bold hover:bg-blue-800 transition"
            >
              Confirm Order
            </button>

            {/* Continue Shopping Button */}
            <button
              onClick={() => router.push('/')}
              className="w-full border-2 border-blue-900 text-blue-900 py-3 rounded font-bold hover:bg-blue-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

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
