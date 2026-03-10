'use client';

import { useState, useEffect } from 'react';

export default function FloatingWhatsAppButton() {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (phoneNumber) {
      // WhatsApp link format: https://wa.me/[country-code][phone-number]
      const whatsappUrl = `https://wa.me/${phoneNumber}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading || !phoneNumber) {
    return null;
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-24 right-6 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:shadow-xl hover:bg-green-600 transition-all z-40"
      title="Chat with us on WhatsApp"
    >
      💬
    </button>
  );
}
