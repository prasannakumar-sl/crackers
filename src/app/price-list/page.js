'use client';

import { useState } from 'react';

export default function PriceList() {
  const [quantities, setQuantities] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState([]);

  const categories = [
    {
      name: 'ONE SOUND CRACKERS',
      discount: '50% discount',
      products: [
        { id: 1, name: '2½ Kuruvi', description: '2½" звукові', size: '1 Box', originalPrice: 12.00, discount: 6.00 },
        { id: 2, name: '3½ Lakshmi', description: '3½" बॉक्स', size: '1 Box', originalPrice: 24.00, discount: 12.00 },
        { id: 3, name: '4" Hulk', description: '4" आकार', size: '1 Box', originalPrice: 36.00, discount: 18.00 },
        { id: 4, name: 'Gold Lakshmi Machine Fuse', description: 'सोने की फ्यूज', size: '1 Pkt', originalPrice: 96.00, discount: 48.00 },
        { id: 5, name: 'Bahubali Super Deluxe Machine Fuse', description: 'सुपर डिलक्स', size: '1 Pkt', originalPrice: 130.00, discount: 65.00 },
      ]
    },
    {
      name: 'BOMBS',
      discount: '50% discount',
      products: [
        { id: 6, name: 'Bullet Bomb', description: 'बुलेट बम', size: '1 Box', originalPrice: 60.00, discount: 30.00 },
        { id: 7, name: 'Super Bomb', description: 'सुपर बम', size: '1 Box', originalPrice: 80.00, discount: 40.00 },
        { id: 8, name: 'Deluxe Bomb', description: 'डीलक्स बम', size: '1 Pkt', originalPrice: 45.00, discount: 22.50 },
      ]
    }
  ];

  const getQuantity = (productId) => quantities[productId] || 0;
  const setQuantity = (productId, qty) => {
    setQuantities({ ...quantities, [productId]: Math.max(0, qty) });
  };

  const calculateTotal = (price, qty) => (price * qty).toFixed(2);

  const cartTotal = Object.entries(quantities).reduce((total, [id, qty]) => {
    if (qty === 0) return total;
    const product = categories.flatMap(c => c.products).find(p => p.id === parseInt(id));
    return total + (product.discount * qty);
  }, 0);

  const cartItemsCount = Object.values(quantities).reduce((total, qty) => total + qty, 0);

  return (
    <div className="bg-white">
      {/* Golden Header Section */}
      <section className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-black py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4 items-center mb-4">
            {/* Products Count */}
            <div className="text-center">
              <p className="text-sm font-semibold">Products</p>
              <p className="text-2xl font-bold">
                {Object.values(quantities).reduce((sum, qty) => sum + qty, 0)}
              </p>
            </div>

            {/* Cart Total */}
            <div className="text-center">
              <p className="text-sm font-semibold">Overall Total</p>
              <p className="text-2xl font-bold">₹{cartTotal.toFixed(2)}</p>
            </div>

            {/* View Cart Button */}
            <div className="text-center">
              <button 
                onClick={() => setShowCart(true)}
                className="bg-yellow-100 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2 w-full"
              >
                🛒 View Cart
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div>
            <button className="w-full bg-yellow-100 text-black py-2 rounded font-semibold hover:bg-yellow-50 transition-colors">
              🔽 Filter
            </button>
          </div>

          {/* Minimum Order Info */}
          <div className="text-center text-sm font-semibold mt-3 text-blue-900">
            Minimum Order Rs.2000 for Tamilnadu and Rs.3000 for Other States.
          </div>
        </div>
      </section>

      {/* Categories and Products */}
      <section className="py-8 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {categories.map((category, catIdx) => (
            <div key={catIdx} className="mb-12">
              {/* Category Header */}
              <div className="bg-purple-400 text-white py-3 px-6 rounded-t-lg font-bold text-lg mb-0">
                {catIdx + 1}. {category.name.toUpperCase()} ({category.discount})
              </div>

              {/* Products Table */}
              <div className="bg-white border border-purple-400 rounded-b-lg overflow-hidden shadow-md">
                <table className="w-full">
                  <thead className="bg-purple-300 text-black font-semibold">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs">Image</th>
                      <th className="px-4 py-3 text-left text-xs">Product</th>
                      <th className="px-4 py-3 text-left text-xs">Size</th>
                      <th className="px-4 py-3 text-left text-xs">Price</th>
                      <th className="px-4 py-3 text-left text-xs">Discount</th>
                      <th className="px-4 py-3 text-center text-xs">Quantity</th>
                      <th className="px-4 py-3 text-right text-xs">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.products.map((product) => {
                      const qty = getQuantity(product.id);
                      const total = calculateTotal(product.discount, qty);

                      return (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          {/* Image */}
                          <td className="px-4 py-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center text-lg">
                              🎆
                            </div>
                          </td>

                          {/* Product Name */}
                          <td className="px-4 py-3">
                            <div className="text-sm font-semibold text-black">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.description}</div>
                          </td>

                          {/* Size */}
                          <td className="px-4 py-3 text-sm text-black">{product.size}</td>

                          {/* Original Price */}
                          <td className="px-4 py-3">
                            <span className="text-sm line-through text-gray-600">₹{product.originalPrice.toFixed(2)}</span>
                          </td>

                          {/* Discount Price */}
                          <td className="px-4 py-3">
                            <span className="text-sm font-bold text-red-600">₹{product.discount.toFixed(2)}</span>
                          </td>

                          {/* Quantity Controls */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setQuantity(product.id, qty - 1)}
                                className="bg-red-500 text-white w-7 h-7 rounded font-bold hover:bg-red-600 transition-colors"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                value={qty}
                                onChange={(e) => setQuantity(product.id, parseInt(e.target.value) || 0)}
                                className="w-10 text-center border border-gray-300 rounded py-1 text-sm font-semibold"
                                min="0"
                              />
                              <button
                                onClick={() => setQuantity(product.id, qty + 1)}
                                className="bg-green-600 text-white w-7 h-7 rounded font-bold hover:bg-green-700 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Total */}
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-black">₹{total}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shopping Summary</h2>
              <button onClick={() => setShowCart(false)} className="text-2xl font-bold text-gray-600 hover:text-black">
                ✕
              </button>
            </div>
            
            {cartItemsCount === 0 ? (
              <p className="text-gray-600 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-48 overflow-y-auto">
                  {categories.flatMap(c => c.products).map(product => {
                    const qty = getQuantity(product.id);
                    if (qty === 0) return null;
                    const total = (product.discount * qty).toFixed(2);

                    return (
                      <div key={product.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-black">{product.name}</h3>
                          <p className="text-sm text-gray-600">₹{product.discount.toFixed(2)} × {qty} = ₹{total}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Grand Total:</span>
                    <span className="text-2xl font-bold text-red-600">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-teal-900 text-white py-3 rounded-lg font-bold hover:bg-teal-800 transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
