'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

// Helper function to adjust brightness of a hex color
function adjustBrightness(hexColor, percent) {
  const num = parseInt(hexColor.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

export default function Header() {
  const { getCartItemCount, setShowCart } = useCart();
  const cartItemsCount = getCartItemCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    company_name: 'pk crackers',
    logo: null,
  });
  const [loadingCompanyInfo, setLoadingCompanyInfo] = useState(true);
  const [navbarColor, setNavbarColor] = useState('#1d4f4f');

  useEffect(() => {
    fetchCompanyInfo();
    fetchNavbarColor();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch('/api/company-info', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCompanyInfo({
          company_name: data.company_name || 'pk crackers',
          logo: data.logo,
        });
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
      // Use default values on error
    } finally {
      setLoadingCompanyInfo(false);
    }
  };

  const fetchNavbarColor = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setNavbarColor(data.navbarColor || '#1d4f4f');
    } catch (error) {
      console.error('Error fetching navbar color:', error);
      // Use default color on error
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/price-list', label: 'Price List' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact-us', label: 'Contact Us' },
    { href: '/payments-info', label: 'Payments Info' },
    { href: '/chit-fund', label: 'Chit Fund' },
  ];

  return (
    <header className="text-white sticky top-0 z-50 shadow-md" style={{ backgroundColor: navbarColor }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {!loadingCompanyInfo && companyInfo.logo ? (
            <img
              src={companyInfo.logo}
              alt={companyInfo.company_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-teal-900">
              {companyInfo.company_name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-sm">{companyInfo.company_name}</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm items-center">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="hover:text-yellow-400 transition-colors">
              {link.label}
            </a>
          ))}
          <button
            onClick={() => setShowCart(true)}
            className="relative hover:text-yellow-400 transition-colors flex items-center gap-2"
          >
            🛒 Cart
            {cartItemsCount > 0 && (
              <span className="bg-red-500 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemsCount}
              </span>
            )}
          </button>
          
          {/* <a
            href="/#/admin/login"
            className="bg-yellow-500 text-teal-900 px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition-colors"
          >
            Admin Login
          </a> */}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: adjustBrightness(navbarColor, -20) }}>
          <nav className="flex flex-col py-2">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-6 py-3 transition-colors text-sm"
                style={{
                  borderBottom: `1px solid ${adjustBrightness(navbarColor, -20)}`,
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = adjustBrightness(navbarColor, -10)}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setShowCart(true);
                setMobileMenuOpen(false);
              }}
              className="px-6 py-3 transition-colors text-sm text-left flex items-center gap-2"
              onMouseOver={(e) => e.target.style.backgroundColor = adjustBrightness(navbarColor, -10)}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              🛒 Cart
              {cartItemsCount > 0 && (
                <span className="bg-red-500 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs ml-auto">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <a
              href="/#/admin/login"
              className="px-6 py-3 transition-colors text-sm block"
              style={{
                borderBottom: `1px solid ${adjustBrightness(navbarColor, -20)}`,
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = adjustBrightness(navbarColor, -10)}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Login
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
