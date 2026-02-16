'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoginPage from '../login/page';
import AdminLayout from '../admin/layout';
import AdminDashboard from '../admin/page';
import ProductsPage from '../admin/products/page';
import OrdersPage from '../admin/orders/page';
import CustomersPage from '../admin/customers/page';
import PaymentsInfoPage from '../admin/payments-info/page';
import ChitFundPage from '../admin/chit-fund/page';
import StaffsPage from '../admin/staffs/page';
import CompanyInfoPage from '../admin/company-info/page';
import AppearancePage from '../admin/appearance/page';

export default function HashRouter({ children }) {
  const [hash, setHash] = useState('');

  useEffect(() => {
    // Set initial hash
    setHash(window.location.hash);

    // Listen for hash changes
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse hash to get route
  const route = hash.replace('#', '') || '/';

  // Admin routes - check if user is authorized
  const adminRoutes = ['/admin', '/admin/dashboard', '/admin/products', '/admin/orders', '/admin/customers', '/admin/payments-info', '/admin/chit-fund', '/admin/staffs', '/admin/company-info', '/admin/appearance'];
  const isAdminRoute = adminRoutes.includes(route);
  const adminUser = typeof window !== 'undefined' ? localStorage.getItem('adminUser') : null;

  // If admin route but not logged in, show login
  if (isAdminRoute && !adminUser) {
    return <LoginPage />;
  }

  // Render admin pages
  if (route === '/admin/login') {
    return <LoginPage />;
  }

  if (isAdminRoute && adminUser) {
    let pageContent = <AdminDashboard />;

    if (route === '/admin/products') {
      pageContent = <ProductsPage />;
    } else if (route === '/admin/orders') {
      pageContent = <OrdersPage />;
    } else if (route === '/admin/customers') {
      pageContent = <CustomersPage />;
    } else if (route === '/admin/payments-info') {
      pageContent = <PaymentsInfoPage />;
    } else if (route === '/admin/chit-fund') {
      pageContent = <ChitFundPage />;
    } else if (route === '/admin/staffs') {
      pageContent = <StaffsPage />;
    } else if (route === '/admin/company-info') {
      pageContent = <CompanyInfoPage />;
    } else if (route === '/admin/appearance') {
      pageContent = <AppearancePage />;
    }

    return <AdminLayout>{pageContent}</AdminLayout>;
  }

  // Otherwise render regular frontend with header and footer
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
