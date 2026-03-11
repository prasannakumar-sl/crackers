'use client';

export default function ContactUs() {
  return (
    <div className="dark-bg-section">
      {/* Hero Section */}
      <section className="relative navy-bg-section text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Contact Us</h1>
          <p className="gold-text mt-2 text-sm sm:text-base">Get in touch with our team</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 dark-bg-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm sm:text-base">Name</label>
                  <input type="text" className="w-full px-3 sm:px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-yellow-500 text-sm sm:text-base" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm sm:text-base">Email</label>
                  <input type="email" className="w-full px-3 sm:px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-yellow-500 text-sm sm:text-base" placeholder="Your email" />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm sm:text-base">Message</label>
                  <textarea rows="5" className="w-full px-3 sm:px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-yellow-500 text-sm sm:text-base" placeholder="Your message"></textarea>
                </div>
                <button type="submit" className="gold-button font-bold px-4 sm:px-6 py-2 rounded text-sm sm:text-base hover:bg-yellow-400 transition-colors">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-bold text-white mb-2 text-sm sm:text-base">Address</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Sivakasi, TamilNadu<br />India</p>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 text-sm sm:text-base">Phone</h3>
                  <p className="text-gray-300 text-sm sm:text-base">+91 XXXX XXX XXX</p>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 text-sm sm:text-base">Email</h3>
                  <p className="text-gray-300 text-sm sm:text-base">info@pkcrackers.com</p>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 text-sm sm:text-base">Business Hours</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Monday - Saturday: 9 AM - 6 PM<br />Sunday: 10 AM - 4 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
