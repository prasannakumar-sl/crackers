'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [footerColor, setFooterColor] = useState('#1d4f4f');

  useEffect(() => {
    fetchFooterColor();
  }, []);

  const fetchFooterColor = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setFooterColor(data.navbarColor || '#1d4f4f');
    } catch (error) {
      console.error('Error fetching footer color:', error);
    }
  };

  return (
    <footer className="text-white py-8 px-6 text-center text-sm" style={{ backgroundColor: footerColor }}>
      <p>&copy; 2025 pk crackers. All rights reserved.</p>
    </footer>
  );
}
