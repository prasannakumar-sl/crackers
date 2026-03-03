'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function PriceList() {
  const { cart, addToCart, setShowCart, updateQuantity, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [displayStyle, setDisplayStyle] = useState('table');

  // Fetch display style from settings
  useEffect(() => {
    const fetchDisplayStyle = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        setDisplayStyle(data.style || 'table');
      } catch (error) {
        console.error('Error fetching display style:', error);
        setDisplayStyle('table');
      }
    };

    fetchDisplayStyle();
  }, []);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setAllProducts(data);

        // Group products by category
        const grouped = {};
        data.forEach(product => {
          const category = product.category || 'UNCATEGORIZED';
          if (!grouped[category]) {
            grouped[category] = [];
          }
          const price = parseFloat(product.price);
          grouped[category].push({
            id: product.id,
            name: product.name,
            description: product.description || '',
            size: '1 Box',
            originalPrice: price,
            discount: price / 2,
            image: product.image,
          });
        });

        // Convert to array format
        const categoriesArray = Object.entries(grouped).map(([name, products]) => ({
          name,
          discount: '50% discount',
          products,
        }));

        setCategories(categoriesArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getQuantity = (productId) => {
    const qty = quantities[productId];
    return qty === undefined ? 0 : qty;
  };

  const setQuantity = (productId, qty) => {
    // If qty is a string (from input), handle empty case for backspace
    if (qty === '') {
      setQuantities({ ...quantities, [productId]: '' });
      removeFromCart(productId);
      return;
    }

    const newQty = Math.max(0, parseInt(qty) || 0);
    setQuantities({ ...quantities, [productId]: newQty });

    // Find if product is already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (newQty > 0) {
      if (existingItem) {
        // Use updateQuantity to set exact value
        updateQuantity(productId, newQty);
      } else {
        // Add new item to cart
        const product = allProducts.find(p => p.id === productId);
        if (product) {
          const originalPrice = parseFloat(product.price);
          const salePrice = originalPrice / 2;
          addToCart({
            id: product.id,
            name: product.name,
            originalPrice: originalPrice,
            price: salePrice,
            discount: salePrice,
            quantity: newQty
          });
        }
      }
    } else {
      // If quantity is 0, remove from cart
      removeFromCart(productId);
    }
  };

  // Sync local quantities with cart state
  useEffect(() => {
    const newQuantities = { ...quantities };

    // Update quantities from cart
    cart.forEach(item => {
      newQuantities[item.id] = item.quantity;
    });

    // Handle items removed from cart
    Object.keys(newQuantities).forEach(id => {
      const productId = parseInt(id);
      if (!cart.find(item => item.id === productId)) {
        // If it's not in the cart and not currently being edited (empty string), set to 0
        if (newQuantities[id] !== '') {
          newQuantities[id] = 0;
        }
      }
    });

    setQuantities(newQuantities);
  }, [cart]);

  const calculateTotal = (price, qty) => (price * qty).toFixed(2);

  const cartTotal = cart.reduce((total, item) => {
    return total + (item.discount * item.quantity);
  }, 0);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleViewCart = () => {
    setShowCart(true);
  };

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
                onClick={handleViewCart}
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
          {loading ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">Loading products from database...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">No products available. Please add products from the admin panel.</p>
            </div>
          ) : (
            categories.map((category, catIdx) => (
              <div key={catIdx} className="mb-12">
                {/* Category Header */}
                <div className="bg-purple-400 text-white py-3 px-6 rounded-t-lg font-bold text-lg mb-0">
                  {catIdx + 1}. {category.name.toUpperCase()} ({category.discount})
                </div>

                {/* Table View */}
                {displayStyle === 'table' && (
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
                                <div
                                  className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center text-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => product.image && setEnlargedImage(product.image)}
                                >
                                  {product.image ? (
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    '🎆'
                                  )}
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
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={qty}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val === '' || /^\d+$/.test(val)) {
                                        setQuantity(product.id, val);
                                      }
                                    }}
                                    className="w-10 text-center border border-gray-300 rounded py-1 text-sm font-semibold"
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
                )}

                {/* Cards View */}
                {displayStyle === 'cards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white border border-purple-400 rounded-b-lg overflow-hidden shadow-md p-4">
                    {category.products.map((product) => {
                      const qty = getQuantity(product.id);
                      const total = calculateTotal(product.discount, qty);

                      return (
                        <div key={product.id} className="border border-purple-300 rounded-lg p-4 hover:shadow-lg transition-shadow">
                          {/* Product Image */}
                          <div
                            className="w-full h-40 bg-yellow-100 rounded flex items-center justify-center text-3xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity mb-3"
                            onClick={() => product.image && setEnlargedImage(product.image)}
                          >
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              '🎆'
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="mb-3">
                            <h3 className="text-sm font-semibold text-black mb-1">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">{product.description}</p>
                            <p className="text-xs text-gray-600">{product.size}</p>
                          </div>

                          {/* Prices */}
                          <div className="mb-3 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Original:</span>
                              <span className="line-through text-gray-600">₹{product.originalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Discount:</span>
                              <span className="font-bold text-red-600">₹{product.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-semibold text-black">Total:</span>
                              <span className="font-bold text-black">₹{total}</span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setQuantity(product.id, qty - 1)}
                              className="bg-red-500 text-white w-7 h-7 rounded font-bold hover:bg-red-600 transition-colors"
                            >
                              −
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={qty}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d+$/.test(val)) {
                                  setQuantity(product.id, val);
                                }
                              }}
                              className="w-10 text-center border border-gray-300 rounded py-1 text-sm font-semibold"
                            />
                            <button
                              onClick={() => setQuantity(product.id, qty + 1)}
                              className="bg-green-600 text-white w-7 h-7 rounded font-bold hover:bg-green-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Image Enlargement Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div
            className="relative rounded-lg"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
          >
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-2 right-2 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
            >
              ✕
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged product"
              style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
