'use client';

import { useCart } from './context/CartContext';
import ParadiseAnimation from './components/ParadiseAnimation';
import { useState, useEffect } from 'react';

export default function Home() {
  const { addToCart, getCartItemCount, getCartTotal } = useCart();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [homePageDecoration, setHomePageDecoration] = useState(null);
  const [banners, setBanners] = useState([]);
  const [brands, setBrands] = useState(['Renu Crackers', 'Mightloads', 'Sri Aravind', 'Ramesh']);
  const [navbarColor, setNavbarColor] = useState('#1d4f4f');
  const [paradiseText, setParadiseText] = useState('PARADISE');
  const [paradiseBackgroundColor, setParadiseBackgroundColor] = useState('#f3f4f6');
  const [testimonial, setTestimonial] = useState(null);
  const [blogPosts, setBlogPosts] = useState([
    { id: 1, title: 'How to Choose the Best Crackers?', image: '🎆' },
    { id: 2, title: 'Firecrackers Safety Guide', image: '⚠️' },
    { id: 3, title: 'Diwali Crackers Online Shopping', image: '🛒' },
    { id: 4, title: 'Diwali Crackers for Kids and Safe Celebration', image: '👨‍👩‍👧‍👦' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsRes, carouselRes, settingsRes] = await Promise.all([
          fetch('/api/sections'),
          fetch('/api/carousel'),
          fetch('/api/settings'),
        ]);
        const sectionsData = await sectionsRes.json();
        const carouselData = await carouselRes.json();
        const settingsData = await settingsRes.json();

        setSections(Array.isArray(sectionsData) ? sectionsData : []);
        setCarouselImages(Array.isArray(carouselData) ? carouselData : []);
        setHomePageDecoration(settingsData.homePageDecoration || null);
        setBanners(Array.isArray(settingsData.banners) ? settingsData.banners : []);
        setNavbarColor(settingsData.navbarColor || '#1d4f4f');
        setParadiseText(settingsData.paradiseText || 'PARADISE');
        setParadiseBackgroundColor(settingsData.paradiseBackgroundColor || '#f3f4f6');
        setTestimonial(settingsData.testimonial || null);
        if (Array.isArray(settingsData.blogPosts)) {
          setBlogPosts(settingsData.blogPosts);
        }
        if (Array.isArray(settingsData.brands)) {
          setBrands(settingsData.brands);
        }

        // Apply theme colors from settings
        const darkBg = settingsData.darkBackground || '#0f1e3d';
        const navyBg = settingsData.navyBackground || '#1a2847';
        const goldAccent = settingsData.goldAccent || '#d4a574';

        document.documentElement.style.setProperty('--background', darkBg);
        document.documentElement.style.setProperty('--dark-navy', darkBg);
        document.documentElement.style.setProperty('--navy', navyBg);
        document.documentElement.style.setProperty('--gold', goldAccent);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSections([]);
        setCarouselImages([]);
        setHomePageDecoration(null);
        setBanners([]);
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

  const cartTotal = getCartTotal();
  const cartItemsCount = getCartItemCount();

  return (
    <div className="dark-bg-section relative">
      {/* Paradise Animation */}
      <ParadiseAnimation text={paradiseText} backgroundColor={paradiseBackgroundColor} />

      {/* Decoration - Top Left Corner */}
      {homePageDecoration && (
        <div className="fixed top-4 left-4 z-10 pointer-events-none">
          <img
            src={homePageDecoration}
            alt="Page Decoration"
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>
      )}

      {/* Decoration - Top Right Corner */}
      {homePageDecoration && (
        <div className="fixed top-4 right-4 z-10 pointer-events-none">
          <img
            src={homePageDecoration}
            alt="Page Decoration"
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>
      )}
      {/* Carousel Banner */}
      <section className="w-full relative overflow-hidden dark-bg-section">
        {carouselImages.length > 0 ? (
          <div className="relative w-full h-48 sm:h-64 md:h-96 flex items-center justify-center">
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
          <div style={{padding:"15%"}}/>
        )}
      </section>
      
      {/* Festival Banners */}
      <section className="py-8 px-4 sm:px-6 navy-bg-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="text-white rounded-xl cursor-pointer hover:shadow-xl transition-all active:scale-[0.98] banner-card overflow-hidden flex flex-col"
                style={{
                  backgroundColor: banner.solidColor || banner.gradientFrom || 'var(--gold)'
                }}
                onClick={() => setSelectedBanner(banner)}
              >
                {banner.bannerImage && (
                  <div className="w-full h-40 overflow-hidden flex items-center justify-center bg-gray-700">
                    <img
                      src={banner.bannerImage}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl sm:text-2xl mb-2">{banner.title}</h3>
                    <p className="text-sm sm:text-base font-semibold">{banner.subtitle}</p>
                  </div>
                  {banner.products && banner.products.length > 0 && (
                    <div className="mt-4 text-xs bg-white/20 inline-block px-3 py-1.5 rounded-full w-fit">
                      {banner.products.length} Products
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-4 sm:px-6 dark-bg-section">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-300">Loading products...</p>
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300">No product sections available. Visit the admin panel to create sections and add products.</p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.id} className="mb-16">
                <h2 className="text-2xl sm:text-3xl font-bold gold-text mb-6 sm:mb-8">{section.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {section.products && section.products.length > 0 ? (
                    section.products.map(product => (
                      <div key={product.id} className="navy-bg-section rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        <div className="bg-gray-700 h-48 flex items-center justify-center overflow-hidden">
                          <img
                            src={product.image || 'https://cdn.builder.io/api/v1/image/assets%2Fa8b7ea913e4d4cbb918cc3633423e9fa%2Fcf0b1bff048f4f4aa4c2904d1907c926'}
                            alt={product.name}
                            style={{width:"50%"}}
                            onError={(e) => {
                              e.target.src = 'https://cdn.builder.io/api/v1/image/assets%2Fa8b7ea913e4d4cbb918cc3633423e9fa%2Fcf0b1bff048f4f4aa4c2904d1907c926';
                            }}
                          />
                        </div>
                        <div className="p-4 flex-grow">
                          <h3 className="font-bold text-white mb-3">{product.name}</h3>
                          <div className="flex gap-3 mb-4">
                            <span className="gold-text font-bold">₹{parseFloat(product.price).toFixed(2)}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); addToCart({ ...product, quantity: 1 }); }} className="w-full gold-button py-2 rounded font-semibold hover:bg-yellow-400 transition-colors">
                            ADD TO CART
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-300 col-span-3">No products in this section yet.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Our Brands */}
      <section className="py-12 px-4 sm:px-6 navy-bg-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold gold-text text-center mb-8 sm:mb-12">OUR BRANDS</h2>
          <div className="flex justify-center items-center gap-4 sm:gap-6 lg:gap-12 flex-wrap">
            {brands.map((brand, idx) => (
              <div key={idx} className="px-4 sm:px-6 py-3 sm:py-4 border-2 gold-accent rounded-lg hover:bg-opacity-10 hover:bg-yellow-500 transition-colors">
                <p className="font-bold text-sm sm:text-base gold-text">{brand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonial && (
        <section className="relative text-white py-12 px-4 sm:px-6" style={{ backgroundColor: navbarColor }}>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{testimonial.title}</h2>
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-300 mb-6">{testimonial.heading}</h3>
            <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto px-4">
              "{testimonial.quote}"
            </p>
            <p className="text-sm mt-6 text-yellow-200">- {testimonial.attribution}</p>
          </div>
        </section>
      )}

      {/* Blog Posts */}
      <section className="py-12 px-4 sm:px-6 dark-bg-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold gold-text mb-8 sm:mb-12">OUR BLOG POSTS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {blogPosts.map(post => (
              <div key={post.id} className="navy-bg-section rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-gray-700 p-8 text-5xl flex items-center justify-center h-40">
                  {post.image}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm leading-relaxed hover:gold-text transition-colors">
                    {post.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Products Modal */}
      {selectedBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4" onClick={() => setSelectedBanner(null)}>
          <div className="navy-bg-section rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className={`p-6 text-white bg-gradient-to-r ${selectedBanner.gradientFrom} ${selectedBanner.gradientTo} relative`}>
              <h2 className="text-2xl font-bold">{selectedBanner.title}</h2>
              <p className="text-sm opacity-90">{selectedBanner.subtitle}</p>
              <button
                onClick={() => setSelectedBanner(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full w-8 h-8 flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {!selectedBanner.products || selectedBanner.products.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No products in this collection yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedBanner.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors">
                      <div className="flex-grow">
                        <h4 className="font-bold text-white">{product.name}</h4>
                        <p className="gold-text font-bold">₹{parseFloat(product.price).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-300">Qty: {product.qty || 1}</span>
                        {/* <button
                          onClick={() => {
                            addToCart({ ...product, quantity: parseInt(product.qty) || 1, bannerTitle: selectedBanner.title });
                            // Optional: show some feedback that item was added
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition-colors text-sm"
                        >
                          ADD TO CART
                        </button> */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-600 bg-gray-800 flex justify-between items-center">
              <button
                onClick={() => {
                  if (selectedBanner.products && selectedBanner.products.length > 0) {
                    selectedBanner.products.forEach(product => {
                      addToCart({ ...product, quantity: parseInt(product.qty) || 1, bannerTitle: selectedBanner.title });
                    });
                    setSelectedBanner(null);
                  }
                }}
                className="px-6 py-2 gold-button rounded font-bold hover:bg-yellow-400 transition-colors shadow-md active:transform active:scale-95"
              >
                <span>🛒</span>
                ADD TO CART
              </button>
              <button
                onClick={() => setSelectedBanner(null)}
                className="px-6 py-2 bg-gray-700 text-white rounded font-bold hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-96 w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Product preview"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-black font-bold text-lg hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
          <div className="navy-bg-section rounded-xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="relative h-64 bg-gray-700 flex items-center justify-center overflow-hidden">
              <img
                src={selectedProduct.image || 'https://cdn.builder.io/api/v1/image/assets%2Fa8b7ea913e4d4cbb918cc3633423e9fa%2Fcf0b1bff048f4f4aa4c2904d1907c926'}
                alt={selectedProduct.name}
                className="w-full h-full object-contain p-8"
                onError={(e) => {
                  e.target.src = 'https://cdn.builder.io/api/v1/image/assets%2Fa8b7ea913e4d4cbb918cc3633423e9fa%2Fcf0b1bff048f4f4aa4c2904d1907c926';
                }}
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-lg hover:bg-white/40 transition-colors shadow-md"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedProduct.name}</h2>
                <p className="text-gray-300 text-lg uppercase tracking-wider font-semibold">
                  {selectedProduct.category || 'Standard Product'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-4xl font-extrabold gold-text">
                  ₹{parseFloat(selectedProduct.price).toFixed(2)}
                </span>
                <span className="bg-green-900 text-green-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                  In Stock
                </span>
              </div>

              <div className="pt-4 border-t border-gray-600">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Product Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedProduct.description || "This premium quality firecracker is designed for a safe and spectacular celebration. Made with high-quality materials to ensure consistent performance and vibrant effects."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Quantity</p>
                  <p className="text-sm font-semibold text-gray-200">1 Box / Pack</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Safe to Use</p>
                  <p className="text-sm font-semibold text-gray-200">Certified Quality</p>
                </div>
              </div>
            </div>

            {/* Footer / Action */}
            <div className="p-8 pt-0 mt-auto">
              <button
                onClick={() => {
                  addToCart({ ...selectedProduct, quantity: 1 });
                  setSelectedProduct(null);
                }}
                className="w-full gold-button py-4 rounded-xl font-bold text-xl hover:bg-yellow-400 active:transform active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
              >
                <span>🛒</span>
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
