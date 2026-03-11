'use client';

export default function ChitFund() {
  return (
    <div className="dark-bg-section">
      {/* Hero Section */}
      <section className="relative navy-bg-section text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Chit Fund</h1>
          <p className="gold-text mt-2">Flexible payment plans for our valued customers</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-6 dark-bg-section">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Our Chit Fund is a traditional and trusted way for bulk buyers to manage their purchases. It allows you to spread your payments over time while enjoying quality products from pk crackers.
          </p>

          {/* Plans Grid */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            {[
              { duration: '6 Months', amount: '₹50,000', description: 'Perfect for regular retailers' },
              { duration: '12 Months', amount: '₹100,000', description: 'Ideal for wholesale distributors' },
              { duration: '18 Months', amount: '₹150,000', description: 'Best for large-scale orders' },
            ].map((plan, idx) => (
              <div key={idx} className="border-2 gold-accent rounded-lg p-6 text-center hover:shadow-lg transition-shadow bg-gray-800">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.duration}</h3>
                <p className="text-3xl font-bold gold-text mb-4">{plan.amount}</p>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                <button className="gold-button px-6 py-2 rounded font-semibold hover:bg-yellow-400 transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="navy-bg-section p-8 rounded-lg border border-gray-600">
            <h3 className="text-xl font-bold gold-text mb-6">Benefits of Our Chit Fund</h3>
            <ul className="grid grid-cols-2 gap-4 text-gray-300">
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
