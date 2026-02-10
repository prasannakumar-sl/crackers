'use client';

export default function AboutUs() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-teal-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">About pk crackers</h1>
          <p className="text-yellow-300 mt-2">Quality since 1974</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="bg-teal-900 rounded-lg p-8 text-center text-white min-h-64 flex items-center justify-center">
              <div>
                <div className="w-24 h-24 mx-auto mb-6 border-4 border-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-yellow-500 text-3xl font-bold">pk</span>
                </div>
                <p className="text-yellow-400 font-bold">Quality Since 1974</p>
              </div>
            </div>

            {/* Right */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Our Story</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We are the leading supplier of crackers & fancy crackers items with over 50 years of experience in the industry.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                pk crackers has its own base and physical store at Sivakasi, TamilNadu and has been there since 20 years of experience in wholesale and retail of superior seasonal/festival fireworks crackers, supplies & gift boxes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We have fireworks available not only during Diwali but throughout the year. So if you are looking for a fireworks/crackers shop in sivakasi anytime in the year, we are here to serve you with the best quality products at competitive prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { title: '50+ Years Experience', description: 'Serving customers with quality products' },
              { title: 'Wholesale & Retail', description: 'Available for both bulk and individual orders' },
              { title: 'Year-Round Service', description: 'Not just for festivals, available all year' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 border-l-4 border-yellow-500">
                <h3 className="font-bold text-lg text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
