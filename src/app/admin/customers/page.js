'use client';

export default function CustomersPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Customers</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center text-gray-600">
          <p className="text-lg">No customers yet.</p>
          <p className="text-sm mt-2">Customer information will appear here when they place orders.</p>
        </div>
      </div>
    </div>
  );
}
