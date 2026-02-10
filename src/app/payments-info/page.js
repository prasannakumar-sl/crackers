'use client';

export default function PaymentsInfo() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-teal-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Payments Information</h1>
          <p className="text-yellow-300 mt-2">Multiple secure payment options available</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-black mb-8">Accepted Payment Methods</h2>
          
          <div className="grid grid-cols-2 gap-8">
            {[
              { method: 'Credit Card', description: 'All major credit cards accepted (Visa, Mastercard, American Express)' },
              { method: 'Debit Card', description: 'Bank debit cards for secure transactions' },
              { method: 'Bank Transfer', description: 'Direct bank transfer for wholesale orders' },
              { method: 'Cash on Delivery', description: 'Available for selected locations' },
              { method: 'Digital Wallets', description: 'Google Pay, Apple Pay, and other popular wallets' },
              { method: 'Cheque', description: 'Accepted for corporate and bulk orders' },
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-black text-lg mb-2">{item.method}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Terms Section */}
          <div className="mt-12 bg-gray-100 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-black mb-4">Payment Terms</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Minimum Order: Rs.2000 for Tamilnadu, Rs.3000 for Other States</li>
              <li>• 50% Discount available on bulk orders</li>
              <li>• Payment must be completed before delivery</li>
              <li>• GST applicable as per government norms</li>
              <li>• Special discounts for wholesale buyers</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
