'use client';

import { useState } from 'react';

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const products = {
    sale: [
      { id: 1, name: '2½ Kuruvi', originalPrice: '₹12.00', discount: '₹6.00', image: '🎆' },
      { id: 2, name: '3½ Lakshmi', originalPrice: '₹24.00', discount: '₹12.00', image: '🎇' },
      { id: 3, name: '4" Hulk', originalPrice: '₹36.00', discount: '₹18.00', image: '🎉' },
    ],
    new: [
      { id: 4, name: 'Rainbow Cracker', originalPrice: '₹28.00', discount: '₹14.00', image: '🌈' },
      { id: 5, name: 'Super Combo', originalPrice: '₹50.00', discount: '₹25.00', image: '🎆' },
      { id: 6, name: 'Deluxe Pack', originalPrice: '₹45.00', discount: '₹22.50', image: '✨' },
    ],
    bestsellers: [
      { id: 7, name: 'Gold Lakshmi', originalPrice: '₹96.00', discount: '₹48.00', image: '🎇' },
      { id: 8, name: 'Silver Combo', originalPrice: '₹120.00', discount: '₹60.00', image: '💫' },
      { id: 9, name: 'Premium Pack', originalPrice: '₹150.00', discount: '₹75.00', image: '👑' },
    ],
    daily: [
      { id: 10, name: 'Daily Deal 1', originalPrice: '₹18.00', discount: '₹9.00', image: '🎆' },
      { id: 11, name: 'Daily Deal 2', originalPrice: '₹22.00', discount: '₹11.00', image: '🎇' },
      { id: 12, name: 'Daily Deal 3', originalPrice: '₹26.00', discount: '₹13.00', image: '🎉' },
    ],
  };

  const brands = ['Renu Crackers', 'Mightloads', 'Sri Aravind', 'Ramesh'];
  const blogPosts = [
    { id: 1, title: 'How to Choose the Best Crackers?', image: '🎆' },
    { id: 2, title: 'Firecrackers Safety Guide', image: '⚠️' },
    { id: 3, title: 'Diwali Crackers Online Shopping', image: '🛒' },
    { id: 4, title: 'Diwali Crackers for Kids and Safe Celebration', image: '👨‍👩‍👧‍👦' },
  ];

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = parseFloat(item.discount.replace('₹', ''));
    return total + (price * item.quantity);
  }, 0);

  return (
    <div className="bg-white">
      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shopping Cart ({cart.length})</h2>
              <button onClick={() => setShowCart(false)} className="text-2xl font-bold text-gray-600 hover:text-black">
                ✕
              </button>
            </div>
            
            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.discount} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                          −
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                          +
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total:</span>
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

      {/* Festival Banners */}
      <section className="py-6 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Perfect Collection</h3>
              <p className="text-sm">Customize & Diwali</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Festival</h3>
              <p className="text-sm">Sale on All Items</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Special Offer</h3>
              <p className="text-sm">Limited Time Only</p>
            </div>
          </div>
        </div>
      </section>

      {/* Diwali Promo Banner */}
      <section className="relative bg-gradient-to-r from-red-700 to-red-900 text-white py-8 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,10 L61,40 L92,40 L67,60 L78,90 L50,70 L22,90 L33,60 L8,40 L39,40 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-8 relative z-10">
          {/* Left - Promo Text */}
          <div>
            <h2 className="text-5xl font-bold mb-4">DIWALI 2026</h2>
            <p className="text-2xl font-bold text-yellow-300 mb-2">CELEBRATE THE FESTIVAL OF LIGHTS</p>
            <p className="mb-4">CRACKERS FOR 11 MONTH</p>
            <p className="text-sm opacity-90">11 MONTH (NOV 23 TO SEP 24)</p>
          </div>

          {/* Right - Pricing Table */}
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="font-bold text-lg mb-4">Special Offers</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>₹5,000 - ₹10,000</span>
                <span className="font-bold">₹2,500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>₹10,000 - ₹20,000</span>
                <span className="font-bold">₹5,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>₹20,000 - ₹50,000</span>
                <span className="font-bold">₹10,000</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-3">
                <span className="font-bold">50% Discount</span>
                <span className="font-bold text-yellow-300">Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Sale Products */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8">SALE PRODUCTS</h2>
            <div className="grid grid-cols-3 gap-6">
              {products.sale.map(product => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-purple-100 p-8 text-6xl flex items-center justify-center h-48">
                    {product.image}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-black mb-3">{product.name}</h3>
                    <div className="flex gap-3 mb-4">
                      <span className="text-gray-500 line-through text-sm">{product.originalPrice}</span>
                      <span className="text-red-600 font-bold">{product.discount}</span>
                    </div>
                    <button onClick={() => addToCart(product)} className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition-colors">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Arrivals */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8">NEW ARRIVALS - CRACKERS ONLINE</h2>
            <div className="grid grid-cols-3 gap-6">
              {products.new.map(product => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-pink-100 p-8 text-6xl flex items-center justify-center h-48">
                    {product.image}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-black mb-3">{product.name}</h3>
                    <div className="flex gap-3 mb-4">
                      <span className="text-gray-500 line-through text-sm">{product.originalPrice}</span>
                      <span className="text-red-600 font-bold">{product.discount}</span>
                    </div>
                    <button onClick={() => addToCart(product)} className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition-colors">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Sellers */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8">BEST SELLERS</h2>
            <div className="grid grid-cols-3 gap-6">
              {products.bestsellers.map(product => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-yellow-100 p-8 text-6xl flex items-center justify-center h-48">
                    {product.image}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-black mb-3">{product.name}</h3>
                    <div className="flex gap-3 mb-4">
                      <span className="text-gray-500 line-through text-sm">{product.originalPrice}</span>
                      <span className="text-red-600 font-bold">{product.discount}</span>
                    </div>
                    <button onClick={() => addToCart(product)} className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition-colors">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Products */}
          <div>
            <h2 className="text-3xl font-bold text-black mb-8">DAILY PRODUCTS</h2>
            <div className="grid grid-cols-3 gap-6">
              {products.daily.map(product => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-blue-100 p-8 text-6xl flex items-center justify-center h-48">
                    {product.image}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-black mb-3">{product.name}</h3>
                    <div className="flex gap-3 mb-4">
                      <span className="text-gray-500 line-through text-sm">{product.originalPrice}</span>
                      <span className="text-red-600 font-bold">{product.discount}</span>
                    </div>
                    <button onClick={() => addToCart(product)} className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition-colors">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Brands */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-black text-center mb-12">OUR BRANDS</h2>
          <div className="flex justify-center items-center gap-12">
            {brands.map((brand, idx) => (
              <div key={idx} className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-yellow-500 transition-colors">
                <p className="font-bold text-teal-900">{brand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative bg-gradient-to-r from-teal-800 to-teal-900 text-white py-12 px-6">
        <div className="absolute left-0 top-0 w-16 h-16 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute right-0 bottom-0 w-16 h-16 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,10 L61,40 L92,40 L67,60 L78,90 L50,70 L22,90 L33,60 L8,40 L39,40 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">CRACKERS INDIA</h2>
          <h3 className="text-2xl font-bold text-yellow-300 mb-6">Client Says About Us</h3>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto">
            "We have been sourcing crackers from pk crackers for the past 5 years. The quality is consistently excellent, 
            and their customer service is outstanding. They have helped us grow our business significantly."
          </p>
          <p className="text-sm mt-6 text-yellow-200">- Satisfied Customer</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-12">OUR BLOG POSTS</h2>
          <div className="grid grid-cols-4 gap-6">
            {blogPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-gray-300 p-8 text-5xl flex items-center justify-center h-40">
                  {post.image}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-black text-sm leading-relaxed hover:text-yellow-600 transition-colors">
                    {post.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Button Floating */}
      <button 
        onClick={() => setShowCart(true)}
        className="fixed bottom-8 right-8 bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center"
      >
        <span className="text-2xl">🛒</span>
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {cart.length}
          </span>
        )}
      </button>
    </div>
  );
}
