'use client';

import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productNumber: '',
    name: '',
    description: '',
    originalPrice: '',
    discount: '',
    image: '🎆',
  });

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = () => {
    if (!formData.productNumber || !formData.name || !formData.originalPrice || !formData.discount) {
      alert('Please fill in all required fields');
      return;
    }

    const newProduct = {
      id: Date.now(),
      ...formData,
      originalPrice: parseFloat(formData.originalPrice),
      discount: parseFloat(formData.discount),
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));

    // Reset form
    setFormData({
      productNumber: '',
      name: '',
      description: '',
      originalPrice: '',
      discount: '',
      image: '🎆',
    });
    setShowForm(false);
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
  };

  const emojis = ['🎆', '🎇', '🎉', '🌈', '✨', '👑', '💫', '💥', '🔥', '⚡'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Products</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Add New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Product Number</label>
              <input
                type="text"
                name="productNumber"
                value={formData.productNumber}
                onChange={handleInputChange}
                placeholder="e.g., P001"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., 2½ Kuruvi"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Original Price</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="e.g., 12.00"
                step="0.01"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Discount Price</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="e.g., 6.00"
                step="0.01"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Product Image</label>
              <div className="flex gap-2 flex-wrap">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                    className={`text-3xl px-3 py-2 rounded border-2 transition-colors ${
                      formData.image === emoji
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleAddProduct}
            className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-colors"
          >
            Add Product
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {products.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg">No products yet. Click "Add Product" to create one.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Product #</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Original Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Image</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-semibold text-gray-800">{product.productNumber}</td>
                  <td className="px-6 py-3 text-sm text-gray-800">{product.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{product.description}</td>
                  <td className="px-6 py-3 text-sm text-gray-800">₹{product.originalPrice.toFixed(2)}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-red-600">₹{product.discount.toFixed(2)}</td>
                  <td className="px-6 py-3 text-2xl">{product.image}</td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
