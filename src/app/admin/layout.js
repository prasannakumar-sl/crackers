'use client';

import { useState } from 'react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Products', href: '/admin/products', icon: '📦' },
    { label: 'Orders', href: '/admin/orders', icon: '📋' },
    { label: 'Customers', href: '/admin/customers', icon: '👥' },
    { label: 'Payments Info', href: '/admin/payments-info', icon: '💳' },
    { label: 'Chit Fund', href: '/admin/chit-fund', icon: '💰' },
    { label: 'Staffs', href: '/admin/staffs', icon: '👨‍💼' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    window.location.href = '/#/admin/login';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-gray-900">
              P
            </div>
            {sidebarOpen && <span className="font-bold">PK Admin</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-xl hover:text-yellow-400"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              className="px-4 py-3 hover:bg-gray-800 transition-colors flex items-center gap-3 text-sm border-l-4 border-transparent hover:border-yellow-500"
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Powered by Prasanna Kumar</span>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
