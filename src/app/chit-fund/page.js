'use client';

export default function ChitFund() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-teal-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Chit Fund</h1>
          <p className="text-yellow-300 mt-2">Flexible payment plans for our valued customers</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            Our Chit Fund is a traditional and trusted way for bulk buyers to manage their purchases. It allows you to spread your payments over time while enjoying quality products from pk crackers.
          </p>

          {/* Plans Grid */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            {[
              { duration: '6 Months', amount: '₹50,000', description: 'Perfect for regular retailers' },
              { duration: '12 Months', amount: '₹100,000', description: 'Ideal for wholesale distributors' },
              { duration: '18 Months', amount: '₹150,000', description: 'Best for large-scale orders' },
            ].map((plan, idx) => (
              <div key={idx} className="border-2 border-yellow-500 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-teal-900 mb-2">{plan.duration}</h3>
                <p className="text-3xl font-bold text-yellow-600 mb-4">{plan.amount}</p>
                <p className="text-gray-700 mb-6">{plan.description}</p>
                <button className="bg-teal-900 text-white px-6 py-2 rounded font-semibold hover:bg-teal-800 transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-black mb-6">Benefits of Our Chit Fund</h3>
            <ul className="grid grid-cols-2 gap-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold">✓</span>
                <span>Flexible payment terms</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold">✓</span>
                <span>No hidden charges</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold">✓</span>
                <span>Guaranteed stock availability</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold">✓</span>
                <span>Special bulk discounts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold">✓</span>
                <span>Dedicated support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold">✓</span>
                <span>Easy enrollment process</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
