'use client';

import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartModal() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartItemCount, showCart, setShowCart } = useCart();
  const router = useRouter();
  const cartItemsCount = getCartItemCount();
  const cartTotal = getCartTotal();

  const handleCheckout = () => {
    setShowCart(false);
    router.push('/checkout');
  };

  if (!showCart) return null;

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-transparent z-40"
        onClick={() => setShowCart(false)}
      />

      {/* Modal Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-teal-900 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Shopping Cart</h2>
        <button
          onClick={() => setShowCart(false)}
          className="text-2xl font-bold hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {cartItemsCount === 0 ? (
          <p className="text-gray-600 text-center py-12">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                {/* Item Card */}
                <div className="flex gap-3 mb-3">
                  {/* Image */}
                  <div className="w-16 h-16 bg-yellow-100 rounded flex items-center justify-center text-3xl flex-shrink-0">
                    🎆
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-black text-sm line-clamp-2">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 text-xs ml-2 flex-shrink-0"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {item.discount && typeof item.discount === 'number'
                        ? `₹${item.discount.toFixed(2)}`
                        : item.discount
                      }
                    </p>
                    <span className="text-sm font-bold text-red-600">
                      ₹{(() => {
                        let price = 0;
                        if (typeof item.discount === 'number') {
                          price = item.discount;
                        } else if (item.discount) {
                          price = parseFloat(item.discount.replace('₹', ''));
                        }
                        return (price * item.quantity).toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center gap-2 bg-white rounded border border-gray-200">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-900"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {cartItemsCount > 0 && (
        <div className="border-t p-4 bg-white space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold">Total:</span>
            <span className="text-xl font-bold text-red-600">₹{cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
      </div>
    </>
  );
}
