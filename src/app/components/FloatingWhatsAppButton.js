'use client';

import { useState, useEffect } from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function FloatingWhatsAppButton() {
  const [phoneNumber, setPhoneNumber] = useState(null);

  useEffect(() => {
    fetchPhoneNumber();
  }, []);

  const fetchPhoneNumber = async () => {
    try {
      const response = await fetch('/api/company-info', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.phone_number) {
          // Remove any non-digit characters and ensure it starts with country code
          const cleanPhone = data.phone_number.replace(/\D/g, '');
          setPhoneNumber(cleanPhone);
        }
      }
    } catch (error) {
      console.error('Error fetching phone number:', error);
    }
  };

  const handleWhatsAppClick = () => {
    if (phoneNumber) {
      // WhatsApp link format: https://wa.me/[country-code][phone-number]
      const whatsappUrl = `https://wa.me/${phoneNumber}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!phoneNumber) {
    return null;
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="whatsapp-button"
      title="Chat with us on WhatsApp"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon className="whatsapp-icon" />
    </button>
  );
}
