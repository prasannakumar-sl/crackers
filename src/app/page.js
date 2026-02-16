'use client';

import { useCart } from './context/CartContext';
import { useState, useEffect } from 'react';

export default function Home() {
  const { addToCart, getCartItemCount, getCartTotal } = useCart();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsRes, carouselRes] = await Promise.all([
          fetch('/api/sections'),
          fetch('/api/carousel'),
        ]);
        const sectionsData = await sectionsRes.json();
        const carouselData = await carouselRes.json();

        setSections(Array.isArray(sectionsData) ? sectionsData : []);
        setCarouselImages(Array.isArray(carouselData) ? carouselData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSections([]);
        setCarouselImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-scroll carousel every 3 seconds
  useEffect(() => {
    if (carouselImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselImages]);

  const brands = ['Renu Crackers', 'Mightloads', 'Sri Aravind', 'Ramesh'];
  const blogPosts = [
    { id: 1, title: 'How to Choose the Best Crackers?', image: '🎆' },
    { id: 2, title: 'Firecrackers Safety Guide', image: '⚠️' },
    { id: 3, title: 'Diwali Crackers Online Shopping', image: '🛒' },
    { id: 4, title: 'Diwali Crackers for Kids and Safe Celebration', image: '👨‍👩‍👧‍👦' },
  ];

  const cartTotal = getCartTotal();
  const cartItemsCount = getCartItemCount();

  return (
    <div className="bg-white">
      {/* Festival Banners */}
      <section className="py-6 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Perfect Collection</h3>
              <p className="text-sm">Customize & Diwali</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Festival</h3>
              <p className="text-sm">Sale on All Items</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Special Offer</h3>
              <p className="text-sm">Limited Time Only</p>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Banner */}
      <section className="w-full relative overflow-hidden bg-gray-200">
        {carouselImages.length > 0 ? (
          <div className="relative w-full h-96 flex items-center justify-center">
            <img
              key={carouselImages[currentImageIndex]?.id}
              src={carouselImages[currentImageIndex]?.image_url}
              alt={`Carousel ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22%23999%22%3EImage Failed to Load%3C/text%3E%3C/svg%3E';
              }}
            />
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {carouselImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fe0b97a868c7a4760bf7ee5c2ab73e471%2F674b44a28ad6493891cab41238680c55?format=webp&width=1200&height=500"
            alt="Diwali Crackers Special"
            className="w-full h-auto object-cover"
          />
        )}
      </section>

      {/* Products Section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No product sections available. Visit the admin panel to create sections and add products.</p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.id} className="mb-16">
                <h2 className="text-3xl font-bold text-black mb-8">{section.title}</h2>
                <div className="grid grid-cols-3 gap-6">
                  {section.products && section.products.length > 0 ? (
                    section.products.map(product => (
                      <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="bg-purple-100 p-8 text-6xl flex items-center justify-center h-48">
                          {product.image || '📦'}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-black mb-3">{product.name}</h3>
                          <div className="flex gap-3 mb-4">
                            <span className="text-gray-800 font-bold">₹{parseFloat(product.price).toFixed(2)}</span>
                          </div>
                          <button onClick={() => addToCart({ ...product, quantity: 1 })} className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition-colors">
                            ADD TO CART
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 col-span-3">No products in this section yet.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Our Brands */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-black text-center mb-12">OUR BRANDS</h2>
          <div className="flex justify-center items-center gap-12">
            {brands.map((brand, idx) => (
              <div key={idx} className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-yellow-500 transition-colors">
                <p className="font-bold text-teal-900">{brand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative bg-gradient-to-r from-teal-800 to-teal-900 text-white py-12 px-6">
        <div className="absolute left-0 top-0 w-16 h-16 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute right-0 bottom-0 w-16 h-16 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,10 L61,40 L92,40 L67,60 L78,90 L50,70 L22,90 L33,60 L8,40 L39,40 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">CRACKERS INDIA</h2>
          <h3 className="text-2xl font-bold text-yellow-300 mb-6">Client Says About Us</h3>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto">
            "We have been sourcing crackers from pk crackers for the past 5 years. The quality is consistently excellent, 
            and their customer service is outstanding. They have helped us grow our business significantly."
          </p>
          <p className="text-sm mt-6 text-yellow-200">- Satisfied Customer</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-12">OUR BLOG POSTS</h2>
          <div className="grid grid-cols-4 gap-6">
            {blogPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-gray-300 p-8 text-5xl flex items-center justify-center h-40">
                  {post.image}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-black text-sm leading-relaxed hover:text-yellow-600 transition-colors">
                    {post.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
