'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Cart({ cart, tableId, restaurant, onUpdateCart, onClose, onOrderPlaced }) {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
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

      if (!response.ok) throw new Error('Failed to place order');
      
      const data = await response.json();
      onOrderPlaced();
      router.push(`/order/${data.orderId}`);

    } catch (error) {
      console.error(error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>Your Order at {restaurant.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="cart-modal-body">
           {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-list-item">
                <span className="item-name">{item.name}</span>
                <div className="item-details">
                  <div className="new-quantity-adjuster">
                    <button onClick={() => onUpdateCart(item, 'remove')}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateCart(item, 'add')}>+</button>
                  </div>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-modal-footer">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="summary-row">
            <span>Taxes & Charges</span>
            <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <strong>Total</strong>
            <strong>₹{(totalPrice * 1.05).toFixed(2)}</strong>
          </div>
          <div className="phone-input-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              placeholder="For feedback & offers"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button 
            className="place-order-btn-modal" 
            onClick={handlePlaceOrder}
            disabled={loading || cart.length === 0}
          >
            {loading ? 'Placing...' : 'Place My Order'}
          </button>
        </div>
      </div>
    </div>
  );
}