'use client';

import { useState, useEffect } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SectionManager from '../components/SectionManager';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
    quantity: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [showImport, setShowImport] = useState(false);
  const [importingFile, setImportingFile] = useState(false);
  const [importResults, setImportResults] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0,
      };

      console.log('Submitting product:', payload);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setFormData({
          name: '',
          price: '',
          description: '',
          category: '',
          image: '',
          quantity: '',
        });
        setShowForm(false);
        fetchProducts();
        showAlert('✓ Product added successfully! Check the Products List below.', 'success');
      } else {
        showAlert(`Failed to add product: ${responseData.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showAlert(`Error adding product: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportingFile(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setImportResults(data);
        const message = `✓ Import completed: ${data.successCount} added, ${data.duplicateCount || 0} duplicates skipped${data.errorCount > 0 ? `, ${data.errorCount} errors` : ''}`;
        showAlert(message, 'success');
        fetchProducts();
        setShowImport(false);
      } else {
        showAlert(`Import failed: ${data.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error importing products:', error);
      showAlert(`Error importing products: ${error.message}`, 'error');
    } finally {
      setImportingFile(false);
      e.target.value = '';
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      console.log('=== DELETE START ===');
      console.log('Deleting product with ID:', productId);
      console.log('ID type:', typeof productId);
      const url = `/api/products/${productId}`;
      console.log('URL:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });

      console.log(`DELETE ${url}`, response.status, response.statusText);
      console.log('Delete response status:', response.status);
      console.log('Response statusText:', response.statusText);

      const responseData = await response.json();
      console.log('Delete response data:', responseData);

      if (response.ok) {
        showAlert('✓ Product deleted successfully!', 'success');
        fetchProducts();
      } else {
        showAlert(`Failed to delete product: ${responseData.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showAlert(`Error deleting product: ${error.message}`, 'error');
    }
  };

  const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  return (
    <div>
      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Products Management
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'sections'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sections Management
          </button>
        </div>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-gray-800">{products.length}</p>
                </div>
                <span className="text-4xl">📦</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-800">0</p>
                </div>
                <span className="text-4xl">📋</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-800">0</p>
                </div>
                <span className="text-4xl">👥</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-800">₹{totalRevenue.toFixed(2)}</p>
                </div>
                <span className="text-4xl">💰</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="mb-6 flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {showForm ? 'Cancel' : '+ Add New Product'}
            </button>
            <button
              onClick={() => setShowImport(!showImport)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {showImport ? 'Cancel' : '📥 Import from Excel'}
            </button>
          </div> */}

          {/* Import File Form */}
          {/* {showImport && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Import Products from Excel</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Select Excel File</label>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleImportFile}
                    disabled={importingFile}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Excel file should have columns: Name, Price, Category, Quantity, Description
                  </p>
                </div>

                {importingFile && (
                  <p className="text-blue-600">Importing products...</p>
                )}

                {importResults && (
                  <div className="bg-gray-50 rounded p-4 space-y-2">
                    <p className="font-semibold text-gray-800">Import Results:</p>
                    <p className="text-green-600">✓ Successfully added: {importResults.successCount}</p>
                    {importResults.duplicateCount > 0 && (
                      <p className="text-orange-600">⊘ Duplicates skipped: {importResults.duplicateCount}</p>
                    )}
                    {importResults.errorCount > 0 && (
                      <p className="text-red-600">✕ Errors: {importResults.errorCount}</p>
                    )}

                    {importResults.duplicates && importResults.duplicates.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Duplicate Products (not added):</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {importResults.duplicates.map((dup, idx) => (
                            <li key={idx}>• {dup}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {importResults.errors && importResults.errors.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Errors:</p>
                        <ul className="text-sm text-red-600 space-y-1">
                          {importResults.errors.map((err, idx) => (
                            <li key={idx}>• {err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )} */}

          {/* Add Product Form */}
          {/* {showForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Product</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Sparklers"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Sparklers, Bombs"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="e.g., 100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Product description..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {submitting ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            </div>
          )} */}

          {/* Products Table */}
          {/* <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Products List</h3>

            {loading ? (
              <p className="text-gray-600">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-600">No products added yet. Click "Add New Product" to get started!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">Name</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">Category</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">Price</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">Quantity</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">Description</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800">{product.name}</td>
                        <td className="px-4 py-3 text-gray-600">{product.category || '-'}</td>
                        <td className="px-4 py-3 text-gray-800">₹{parseFloat(product.price).toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-800">{product.quantity}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{product.description || '-'}</td>
                        <td className="px-4 py-3">
                          <IconButton
                            onClick={() => handleDeleteProduct(product.id)}
                            color="error"
                            size="small"
                            title="Delete product"
                            aria-label="Delete product"
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
          </div> */}
        </div>
      )}

      {/* Sections Tab */}
      {activeTab === 'sections' && <SectionManager />}

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
