'use client';

export default function ContactUs() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-teal-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-yellow-300 mt-2">Get in touch with our team</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500" placeholder="Your email" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Message</label>
                  <textarea rows="5" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500" placeholder="Your message"></textarea>
                </div>
                <button type="submit" className="bg-yellow-500 text-teal-900 font-bold px-6 py-2 rounded hover:bg-yellow-400 transition-colors">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-black mb-2">Address</h3>
                  <p className="text-gray-700">Sivakasi, TamilNadu<br />India</p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">Phone</h3>
                  <p className="text-gray-700">+91 XXXX XXX XXX</p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">Email</h3>
                  <p className="text-gray-700">info@pkcrackers.com</p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">Business Hours</h3>
                  <p className="text-gray-700">Monday - Saturday: 9 AM - 6 PM<br />Sunday: 10 AM - 4 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
