'use client';

import { useState, useEffect, useRef } from 'react';
import { Snackbar, Alert, IconButton, TextField, Autocomplete, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const styleOptions = [
  { label: 'Cards', value: 'cards' },
  { label: 'Table', value: 'table' },
];

export default function AppearancePage() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [priceListStyle, setPriceListStyle] = useState(null);
  const [styleLoading, setStyleLoading] = useState(true);
  const [homePageDecoration, setHomePageDecoration] = useState(null);
  const [decorationLoading, setDecorationLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [editBannerData, setEditBannerData] = useState({});
  const fileInputRef = useRef(null);
  const decorationInputRef = useRef(null);

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
    fetchCarouselImages();
    fetchSettings();
    fetchBanners();
  }, []);

  const fetchSettings = async () => {
    try {
      setStyleLoading(true);
      const response = await fetch('/api/settings');
      const data = await response.json();
      const selectedOption = styleOptions.find(opt => opt.value === data.style);
      setPriceListStyle(selectedOption || styleOptions[1]); // Default to 'table'
      setHomePageDecoration(data.homePageDecoration || null);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setPriceListStyle(styleOptions[1]); // Default to 'table'
      setHomePageDecoration(null);
    } finally {
      setStyleLoading(false);
    }
  };

  const fetchBanners = async () => {
    try {
      setBannersLoading(true);
      const response = await fetch('/api/settings');
      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
      showAlert('Failed to load banners', 'error');
    } finally {
      setBannersLoading(false);
    }
  };

  const handleEditBanner = (banner) => {
    setEditingBannerId(banner.id);
    setEditBannerData({ ...banner });
  };

  const handleCancelEdit = () => {
    setEditingBannerId(null);
    setEditBannerData({});
  };

  const handleSaveBanner = async () => {
    if (!editBannerData.title || !editBannerData.subtitle) {
      showAlert('Please fill in all fields', 'error');
      return;
    }

    const updatedBanners = banners.map(b =>
      b.id === editingBannerId ? editBannerData : b
    );

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners: updatedBanners }),
      });

      if (response.ok) {
        setBanners(updatedBanners);
        setEditingBannerId(null);
        setEditBannerData({});
        showAlert('✓ Banner updated successfully!', 'success');
      } else {
        showAlert('Failed to update banner', 'error');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      showAlert('Error updating banner', 'error');
    }
  };

  const handlePriceListStyleChange = async (event, newValue) => {
    if (!newValue) return;

    setPriceListStyle(newValue);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style: newValue.value }),
      });

      if (response.ok) {
        showAlert('✓ Price-list style updated successfully!', 'success');
      } else {
        showAlert('Failed to update price-list style', 'error');
        fetchSettings(); // Revert to previous value on error
      }
    } catch (error) {
      console.error('Error updating price list style:', error);
      showAlert('Error updating price-list style', 'error');
      fetchSettings(); // Revert to previous value on error
    }
  };

  const handleDecorationFileSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showAlert('Please select a valid image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert('Image size must be less than 5MB', 'error');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result;

        setDecorationLoading(true);
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ homePageDecoration: base64Data }),
        });

        if (response.ok) {
          await fetchSettings();
          showAlert('✓ Home page decoration updated successfully!', 'success');
          // Reset file input
          if (decorationInputRef.current) {
            decorationInputRef.current.value = '';
          }
        } else {
          showAlert('Failed to update home page decoration', 'error');
        }
        setDecorationLoading(false);
      };

      reader.onerror = () => {
        showAlert('Failed to read file', 'error');
        setDecorationLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading decoration:', error);
      showAlert('Error uploading decoration', 'error');
      setDecorationLoading(false);
    }
  };

  const handleDeleteDecoration = async () => {
    if (!confirm('Are you sure you want to delete the decoration image?')) {
      return;
    }

    try {
      setDecorationLoading(true);
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homePageDecoration: null }),
      });

      if (response.ok) {
        await fetchSettings();
        showAlert('✓ Decoration image deleted successfully!', 'success');
      } else {
        showAlert('Failed to delete decoration image', 'error');
      }
    } catch (error) {
      console.error('Error deleting decoration:', error);
      showAlert('Error deleting decoration image', 'error');
    } finally {
      setDecorationLoading(false);
    }
  };

  const fetchCarouselImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/carousel');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure data is an array
      if (Array.isArray(data)) {
        setCarouselImages(data);
      } else {
        console.error('Invalid carousel data format:', data);
        setCarouselImages([]);
      }
    } catch (error) {
      console.error('Error fetching carousel images:', error);
      setCarouselImages([]);
      showAlert('Failed to load carousel images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showAlert('Please select a valid image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert('Image size must be less than 5MB', 'error');
      return;
    }

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result;

        setSubmitting(true);
        const response = await fetch('/api/carousel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: base64Data,
            displayOrder: carouselImages.length,
          }),
        });

        if (response.ok) {
          await fetchCarouselImages();
          showAlert('✓ Image uploaded successfully!', 'success');
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          const error = await response.json();
          showAlert(`Failed to upload image: ${error.error}`, 'error');
        }
        setSubmitting(false);
      };

      reader.onerror = () => {
        showAlert('Failed to read file', 'error');
        setSubmitting(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      showAlert('Error uploading image', 'error');
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this carousel image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/carousel/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCarouselImages();
        showAlert('✓ Image deleted successfully!', 'success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to delete image';
        showAlert(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showAlert(`Error deleting image: ${error.message}`, 'error');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Appearance Settings</h2>

      {/* Carousel Images Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Carousel Images</h3>
        <p className="text-gray-600 mb-6">Upload images for the DIWALI 2026 banner carousel. Images will auto-scroll every 3 seconds.</p>

        {/* Add Image Form */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          {/* File Upload Option */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Upload Image from Device</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={submitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <p className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, WebP, GIF (Max 5MB)</p>
          </div>
        </div>

        {/* Carousel Images Preview */}
        {loading ? (
          <p className="text-gray-600">Loading carousel images...</p>
        ) : carouselImages.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No carousel images yet. Add some to get started!</p>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Current Carousel Images ({carouselImages.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carouselImages.map((image, index) => (
                <div key={image.id} className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                  {/* Image Preview */}
                  <div className="bg-white h-40 overflow-hidden flex items-center justify-center">
                    <img
                      src={image.image_url}
                      alt={`Carousel ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22150%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%23999%22%3EImage Failed to Load%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>

                  {/* Image Info */}
                  <div className="p-4">
                    {/* <p className="text-sm text-gray-600 mb-3 break-all">{image.image_url}</p> */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded">Position {index + 1}</span>
                      <IconButton
                        onClick={() => handleDeleteImage(image.id)}
                        color="error"
                        size="small"
                        title="Delete image"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

        <div className="bg-white rounded-lg shadow p-6" style={{ marginTop: '2rem' }}>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Price-List Page Design</h3>
        <div style={{display:"flex", gap: "1rem", alignItems: "flex-start"}}>
          <div style={{ flex: 1, maxWidth: "300px" }}>
           
              <Autocomplete
                options={styleOptions}
                value={priceListStyle}
                onChange={handlePriceListStyleChange}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={(params) => <TextField {...params} label="Style Settings" />}
              />
          </div>
        </div>
      </div>

        <div className="bg-white rounded-lg shadow p-6" style={{ marginTop: '2rem' }}>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Home Page Design</h3>
        <p className="text-gray-600 mb-6">Upload a decoration image (GIF or image) to display on the home page corners.</p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <label className="block text-gray-700 font-medium mb-2">Upload Decoration Image</label>
          <input
            ref={decorationInputRef}
            type="file"
            accept="image/*"
            onChange={handleDecorationFileSelect}
            disabled={decorationLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <p className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, GIF, WebP (Max 5MB)</p>
        </div>

        {homePageDecoration && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Current Decoration Image</h4>
            <div className="bg-white p-4 rounded-lg border border-gray-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <img
                    src={homePageDecoration}
                    alt="Home page decoration"
                    className="max-w-xs max-h-64 object-contain rounded"
                  />
                  <p className="text-xs text-gray-600 mt-3">This image will appear on the top left and right corners of the home page</p>
                </div>
                <IconButton
                  onClick={handleDeleteDecoration}
                  color="error"
                  disabled={decorationLoading}
                  title="Delete decoration image"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6" style={{ marginTop: '2rem' }}>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Festival Banners</h3>
        <p className="text-gray-600 mb-6">Customize the three promotional banners displayed on the home page.</p>

        {bannersLoading ? (
          <p className="text-gray-600">Loading banners...</p>
        ) : banners.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No banners found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {banners.map((banner) => (
              <div key={banner.id} className={`bg-gradient-to-r ${banner.gradientFrom} ${banner.gradientTo} text-white p-6 rounded-lg`}>
                {editingBannerId === banner.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={editBannerData.title || ''}
                        onChange={(e) => setEditBannerData({ ...editBannerData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={editBannerData.subtitle || ''}
                        onChange={(e) => setEditBannerData({ ...editBannerData, subtitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleSaveBanner}
                        size="small"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleCancelEdit}
                        size="small"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg mb-2">{banner.title}</h4>
                      <p className="text-sm">{banner.subtitle}</p>
                    </div>
                    <IconButton
                      onClick={() => handleEditBanner(banner)}
                      color="inherit"
                      size="small"
                      title="Edit banner"
                    >
                      <EditIcon />
                    </IconButton>
                  </div>
                )}
              </div>
            ))}
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
