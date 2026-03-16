'use client';

import { useCart } from '../context/CartContext';

export default function FloatingCartButton() {
  const { getCartItemCount, setShowCart } = useCart();
  const cartItemsCount = getCartItemCount();

  return (
    <button
      onClick={() => setShowCart(true)}
      className="cart-button"
    >
      🛒
      {cartItemsCount > 0 && (
        <span className="cart-badge">
          {cartItemsCount}
        </span>
      )}
    </button>
  );
}
