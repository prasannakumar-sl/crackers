'use client';

import { useCart } from '../context/CartContext';

export default function FloatingCartButton() {
  const { getCartItemCount, setShowCart } = useCart();
  const cartItemsCount = getCartItemCount();

  return (
    <button
      onClick={() => setShowCart(true)}
      className="fixed bottom-6 right-6 w-16 h-16 bg-yellow-500 text-teal-900 rounded-full flex items-center justify-center text-3xl shadow-lg hover:shadow-xl hover:bg-yellow-400 transition-all z-40"
    >
      🛒
      {cartItemsCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs">
          {cartItemsCount}
        </span>
      )}
    </button>
  );
}
