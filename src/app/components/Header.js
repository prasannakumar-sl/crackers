'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { getCartItemCount, setShowCart } = useCart();
  const cartItemsCount = getCartItemCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/price-list', label: 'Price List' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact-us', label: 'Contact Us' },
    { href: '/payments-info', label: 'Payments Info' },
    { href: '/chit-fund', label: 'Chit Fund' },
  ];

  return (
    <header className="bg-teal-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-teal-900">
            P
          </div>
          <span className="font-bold text-sm">pk crackers</span>
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
        <div className="md:hidden bg-teal-800 border-t border-teal-700">
          <nav className="flex flex-col py-2">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-6 py-3 hover:bg-teal-700 transition-colors text-sm border-b border-teal-700"
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
              className="px-6 py-3 hover:bg-teal-700 transition-colors text-sm text-left flex items-center gap-2"
            >
              🛒 Cart
              {cartItemsCount > 0 && (
                <span className="bg-red-500 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs ml-auto">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
