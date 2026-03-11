'use client';

import { useState, useEffect } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';

export default function ColoursPage() {
  const [colors, setColors] = useState({
    darkBackground: '#0f1e3d',
    navyBackground: '#1a2847',
    goldAccent: '#d4a574',
  });
  const [loading, setLoading] = useState(true);
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
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      const data = await response.json();
      setColors({
        darkBackground: data.darkBackground || '#0f1e3d',
        navyBackground: data.navyBackground || '#1a2847',
        goldAccent: data.goldAccent || '#d4a574',
      });
    } catch (error) {
      console.error('Error fetching colors:', error);
      showAlert('Failed to load colors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (colorKey, value) => {
    setColors(prev => ({
      ...prev,
      [colorKey]: value,
    }));
  };

  const handleSaveColors = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          darkBackground: colors.darkBackground,
          navyBackground: colors.navyBackground,
          goldAccent: colors.goldAccent,
        }),
      });

      if (response.ok) {
        showAlert('✓ Colors updated successfully!', 'success');
      } else {
        showAlert('Failed to update colors', 'error');
      }
    } catch (error) {
      console.error('Error updating colors:', error);
      showAlert('Error updating colors', 'error');
    }
  };

  const handleResetToDefaults = async () => {
    if (!confirm('Are you sure you want to reset colors to defaults?')) {
      return;
    }

    const defaultColors = {
      darkBackground: '#0f1e3d',
      navyBackground: '#1a2847',
      goldAccent: '#d4a574',
    };

    setColors(defaultColors);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultColors),
      });

      if (response.ok) {
        showAlert('✓ Colors reset to defaults!', 'success');
      } else {
        showAlert('Failed to reset colors', 'error');
      }
    } catch (error) {
      console.error('Error resetting colors:', error);
      showAlert('Error resetting colors', 'error');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading colors...</p>
      </div>
    );
  }

  const colorSettings = [
    {
      key: 'darkBackground',
      label: 'Dark Background Color',
      description: 'Main dark background color used across the page',
      usage: 'Dark sections background',
    },
    {
      key: 'navyBackground',
      label: 'Navy Background Color',
      description: 'Navy color used for cards and secondary sections',
      usage: 'Card backgrounds and navy sections',
    },
    {
      key: 'goldAccent',
      label: 'Gold Accent Color',
      description: 'Gold color used for text, buttons, and accents',
      usage: 'Text accents, buttons, borders',
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Theme Colors</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-8">
          Customize the theme colors used throughout your website. Changes will be applied instantly to the home page.
        </p>

        <div className="space-y-8">
          {colorSettings.map(setting => (
            <div key={setting.key} className="border-b border-gray-200 pb-8">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{setting.label}</h3>
                <p className="text-sm text-gray-600">{setting.description}</p>
                <p className="text-xs text-gray-500 mt-2">Used for: {setting.usage}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors[setting.key]}
                    onChange={(e) => handleColorChange(setting.key, e.target.value)}
                    style={{
                      width: '80px',
                      height: '50px',
                      cursor: 'pointer',
                      border: '2px solid #ddd',
                      borderRadius: '6px',
                    }}
                  />
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={colors[setting.key]}
                      onChange={(e) => handleColorChange(setting.key, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#000000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Hex color code</p>
                  </div>
                </div>

                <div
                  style={{ backgroundColor: colors[setting.key] }}
                  className="w-24 h-12 rounded-lg border-2 border-gray-300 flex-shrink-0"
                  title="Color preview"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveColors}
            size="large"
          >
            Save Colors
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleResetToDefaults}
            size="large"
          >
            Reset to Defaults
          </Button>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
