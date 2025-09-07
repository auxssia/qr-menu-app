'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Cart({ cart, tableId, restaurant, onUpdateCart, onClose, onOrderPlaced }) {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const router = useRouter();
  // ... (totalPrice calculation is the same)

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cart: cart, 
          tableId: tableId,
          restaurantId: restaurant.id, // Pass the restaurant's ID
          phone: phone
        }),
      });
      // ... (rest of the function is the same)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>Your Order at {restaurant.name}</h2>
          {/* ... (rest of the component JSX is the same) ... */}
        </div>
      </div>
    </div>
  );
}