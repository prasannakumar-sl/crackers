'use client';

import { useState, useEffect, useRef } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: null,
    quantity: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fileInputRef = useRef(null);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showAlert = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch products from database on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products from /api/products...');
      const response = await fetch('/api/products', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });
      const data = await response.json();
      console.log('Fetched products:', data);
      console.log('Total products:', data.length);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert(`Error fetching products: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category || '',
      image: null,
      quantity: product.quantity || '',
    });
    setImagePreview(product.image || null);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      showAlert('Product name and price are required', 'warning');
      return;
    }

    try {
      setSubmitting(true);

      const isEditing = editingId !== null;
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('price', parseFloat(formData.price));
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('quantity', parseInt(formData.quantity) || 0);

      // Add image if selected
      if (formData.image instanceof File) {
        payload.append('image', formData.image);
      }

      const method = isEditing ? 'PATCH' : 'POST';
      const url = isEditing ? `/api/products/${editingId}` : '/api/products';

      console.log(`${isEditing ? 'Updating' : 'Submitting'} product to database`);

      const response = await fetch(url, {
        method,
        body: payload,
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        showAlert(`✓ Product ${isEditing ? 'updated' : 'added'} successfully to database!`, 'success');

        // Reset form
        setFormData({
          name: '',
          price: '',
          description: '',
          category: '',
          image: null,
          quantity: '',
        });
        setImagePreview(null);
        setShowForm(false);
        setEditingId(null);

        // Fetch fresh data from database
        await fetchProducts();
      } else {
        showAlert(`Failed to ${isEditing ? 'update' : 'add'} product: ${responseData.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert(`Error: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeleting(id);
      console.log('=== DELETE START ===');
      console.log('Deleting product with ID:', id);
      console.log('ID type:', typeof id);
      console.log('URL:', `/api/products/${id}`);

      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);
      console.log('Response statusText:', response.statusText);

      const responseData = await response.json();
      console.log('Delete response data:', responseData);
      console.log('=== DELETE END ===');

      if (response.ok) {
        showAlert('✓ Product deleted successfully', 'success');
        await fetchProducts();
      } else {
        const errorMsg = responseData.error || 'Unknown error';
        console.error('Delete failed with error:', errorMsg);
        showAlert(`Failed to delete product: ${errorMsg}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      showAlert(`Error deleting product: ${error.message}`, 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!confirm('Are you sure you want to delete this product image?')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: null }),
      });

      if (response.ok) {
        showAlert('✓ Image deleted successfully', 'success');
        await fetchProducts();
      } else {
        const data = await response.json();
        showAlert(`Failed to delete image: ${data.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showAlert(`Error deleting image: ${error.message}`, 'error');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Products</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setImagePreview(null);
            if (showForm) {
              setEditingId(null);
              setFormData({
                name: '',
                price: '',
                description: '',
                category: '',
                image: null,
                quantity: '',
              });
            }
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleAddProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., 2½ Kuruvi"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  step="0.01"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Sparklers, Bombs"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600 text-black"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600 text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product description"
                  rows="3"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600 text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Product Image</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600 text-black"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload JPG, PNG, or GIF (Max 5MB)</p>
                  </div>
                  {imagePreview && (
                    <div className="flex-shrink-0 relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-700 transition-colors"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {submitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Product' : 'Add Product to Database')}
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg">Loading products from database...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg">No products in database yet. Click "Add Product" to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-semibold text-gray-800">{product.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{product.category || '-'}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">₹{parseFloat(product.price).toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{product.quantity}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 max-w-xs truncate">{product.description || '-'}</td>
                    <td className="px-6 py-3">
                      {product.image ? (
                        <div className="flex items-center gap-2">
                          <div className="relative group">
                            {product.image.startsWith('data:') || product.image.startsWith('/uploads') ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded border border-gray-200"
                              />
                            ) : (
                              <span className="text-2xl">{product.image}</span>
                            )}
                            <button
                              onClick={() => handleDeleteImage(product.id)}
                              disabled={deleting === product.id}
                              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete Image"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <IconButton
                        onClick={() => handleEditProduct(product)}
                        color="primary"
                        size="small"
                        title="Edit Product"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deleting === product.id}
                        color="error"
                        size="small"
                        title="Delete Product"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
