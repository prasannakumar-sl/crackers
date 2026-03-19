'use client';

import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { generateInvoicePDF } from '../../lib/generateInvoice';

function ImageField({ image, name }) {
  const [showAsImage, setShowAsImage] = useState(true);

  const handleImageError = () => {
    setShowAsImage(false);
  };

  const isLikelyImagePath = (str) => {
    // Check if string looks like a path or URL
    return /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(str) || str.startsWith('http') || str.startsWith('/') || str.startsWith('data:');
  };

  return (
    <div className="w-24 h-24 flex-shrink-0 bg-gray-700 rounded-lg flex items-center justify-center text-4xl overflow-hidden">
      {showAsImage && isLikelyImagePath(image) ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span>{image}</span>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    state: '',
  });

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const savedPayments = localStorage.getItem('adminPayments');
    if (savedPayments) {
      try {
        const parsed = JSON.parse(savedPayments);
        setPayments(parsed);
      } catch (error) {
        console.error('Error parsing payment info:', error);
      }
    }
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showAlert = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      // Allow only letters and spaces
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: lettersOnly
      }));
    } else if (name === 'phone') {
      // Allow only numbers and limit to 10 digits
      const numbersOnly = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleConfirmOrder = async () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.state) {
      showAlert('Please fill in all customer details', 'warning');
      return;
    }

    if (formData.name.trim().length === 0) {
      showAlert('Please enter a valid name (letters only)', 'warning');
      return;
    }

    if (formData.phone.length !== 10) {
      showAlert('Phone number must be exactly 10 digits', 'warning');
      return;
    }

    // Validate minimum order amount
    const minimumOrder = formData.state.toLowerCase() === 'tamil nadu' ? 2000 : 3000;
    if (cartTotal < minimumOrder) {
      showAlert(`Minimum order amount is ₹${minimumOrder} for ${formData.state}. Current total: ₹${cartTotal.toFixed(2)}`, 'warning');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        items: cart,
        itemCount: cart.length,
        totalAmount: getCartTotal() + 100 + packingFee,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('✓ Order confirmed! Thank you for your order.', 'success');

        // Generate and download invoice PDF
        try {
          await generateInvoicePDF(orderData, data.invoiceNumber || `invno_${String(data.orderId || '00000001').padStart(8, '0')}`);
        } catch (pdfError) {
          console.error('Error generating PDF:', pdfError);
        }

        clearCart();
        // Redirect or show success message
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        showAlert(`Failed to confirm order: ${data.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      showAlert(`Error confirming order: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen dark-bg-section flex items-center justify-center">
        <div className="navy-bg-section p-8 rounded-lg shadow-lg text-center border border-gray-600">
          <h1 className="text-2xl font-bold mb-4 text-white">Your cart is empty</h1>
          <button
            onClick={() => router.push('/')}
            className="gold-button py-2 px-6 rounded"
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
    <div className="dark-bg-section min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-gray-300">Review your order and complete checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Review Section */}
            <div className="navy-bg-section rounded-lg shadow-lg overflow-hidden border border-gray-600">
              <div className="bg-green-700 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Order Review</h2>
              </div>

              <div className="p-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-600 last:border-b-0 last:pb-0">
                    {/* Product Image */}
                    {item.image && (
                      <ImageField image={item.image} name={item.name} />
                    )}

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{item.name}</h3>
                      {item.productNumber && (
                        <p className="text-sm text-gray-400 mb-2">Product ID: {item.productNumber}</p>
                      )}
                      <p className="text-gray-300 mb-2">
                        Quantity: <span className="font-semibold">{item.quantity}</span>
                      </p>
                      <p className="text-gray-300">
                        Price:{' '}
                        <span className="font-semibold">
                          ₹{item.discount
                            ? typeof item.discount === 'number'
                              ? (item.discount * item.quantity).toFixed(2)
                              : (parseFloat(item.discount.replace('₹', '')) * item.quantity).toFixed(2)
                            : '0.00'}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-600 space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Packing Fee:</span>
                    <span>₹{packingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping:</span>
                    <span>₹{shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-gray-600">
                    <span>Order Total:</span>
                    <span className="gold-text">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details Section */}
            <div className="navy-bg-section rounded-lg shadow-lg overflow-hidden border border-gray-600">
              <div className="bg-green-700 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Customer Details</h2>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:border-yellow-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Letters only</p>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:border-yellow-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">{formData.phone.length}/10 digits</p>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">State/Region</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Select your state</option>
                    <option value="Tamil Nadu">Tamil Nadu (Min: ₹2000)</option>
                    <option value="Other">Other States (Min: ₹3000)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 font-semibold mb-2">Delivery Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter delivery address"
                    rows="3"
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary & Payment Info */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="navy-bg-section rounded-lg shadow-lg overflow-hidden border border-gray-600">
              <div className="bg-blue-900 text-white px-6 py-4">
                <h2 className="text-lg font-bold">Payment Methods</h2>
              </div>

              <div className="p-6 space-y-3">
                <div className="pb-4 border-b border-gray-600">
                  <h3 className="font-bold text-white mb-2">Bank Account</h3>
                  <p className="text-sm text-gray-300">A/C Name: {payments.bankAccount.name}</p>
                  <p className="text-sm text-gray-300">A/C No: {payments.bankAccount.accountNo}</p>
                  <p className="text-sm text-gray-300">Bank: {payments.bankAccount.bankName}</p>
                </div>

                <div className="pb-4 border-b border-gray-600">
                  <h3 className="font-bold text-white mb-2">GPay</h3>
                  <p className="text-sm text-gray-300">Name: {payments.gpay.name}</p>
                  <p className="text-sm text-gray-300">GPay No: {payments.gpay.number}</p>
                </div>

                <div>
                  <h3 className="font-bold text-white mb-2">UPI</h3>
                  <p className="text-sm text-gray-300">Name: {payments.upi.name}</p>
                  <p className="text-sm text-gray-300">UPI ID: {payments.upi.id}</p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-900 border-l-4 gold-accent p-4 rounded">
              <h3 className="font-bold gold-text mb-2">Important Notes</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Minimum Order: ₹2000 (TamilNadu), ₹3000 (Other States)</li>
                <li>• 50% Discount on bulk orders</li>
                <li>• Payment required before delivery</li>
              </ul>
            </div>

            {/* Confirm Order Button */}
            <button
              onClick={handleConfirmOrder}
              disabled={loading}
              className="w-full gold-button py-3 rounded font-bold hover:bg-yellow-400 transition disabled:bg-gray-600"
            >
              {loading ? 'Confirming...' : 'Confirm Order'}
            </button>

            {/* Continue Shopping Button */}
            <button
              onClick={() => router.push('/')}
              className="w-full border-2 gold-accent py-3 rounded font-bold text-white hover:bg-gray-800 transition"
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
