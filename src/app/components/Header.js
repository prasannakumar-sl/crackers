export default function Header() {
  return (
    <header className="bg-teal-900 text-white py-3 px-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-teal-900">
            P
          </div>
          <span className="font-bold text-sm">pk crackers</span>
        </div>
        <nav className="flex gap-8 text-sm">
          <a href="/" className="hover:text-yellow-400 transition-colors">Home</a>
          <a href="/price-list" className="hover:text-yellow-400 transition-colors">Price List</a>
          <a href="/about-us" className="hover:text-yellow-400 transition-colors">About Us</a>
          <a href="/contact-us" className="hover:text-yellow-400 transition-colors">Contact Us</a>
          <a href="/payments-info" className="hover:text-yellow-400 transition-colors">Payments Info</a>
          <a href="/chit-fund" className="hover:text-yellow-400 transition-colors">Chit Fund</a>
        </nav>
      </div>
    </header>
  );
}
