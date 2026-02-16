'use client';

import { useState, useEffect, useRef } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AppearancePage() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

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
  }, []);

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
