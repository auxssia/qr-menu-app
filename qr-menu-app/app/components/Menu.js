'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Menu({ menuItems }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // This is the function that was missing
  const handleUpdateCart = (item, action) => {
    setCart(currentCart => {
      const itemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

      if (action === 'add') {
        if (itemIndex > -1) {
          return currentCart.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          return [...currentCart, { ...item, quantity: 1 }];
        }
      }

      if (action === 'remove') {
        if (itemIndex > -1) {
          const currentItem = currentCart[itemIndex];
          if (currentItem.quantity > 1) {
            return currentCart.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem
            );
          } else {
            return currentCart.filter(cartItem => cartItem.id !== item.id);
          }
        }
      }
      return currentCart;
    });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cart, tableId: 3 }),
      });

      if (!response.ok) throw new Error('Failed to place order');
      
      const data = await response.json();
      router.push(`/order/${data.orderId}`);
    } catch (error) {
      console.error(error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getItemQuantity = (itemId) => {
    const itemInCart = cart.find(item => item.id === itemId);
    return itemInCart ? itemInCart.quantity : 0;
  };

  return (
    <main>
      <div className="cart-summary">
        <h2>Your Order</h2>
        {cart.length === 0 ? <p>Your cart is empty.</p> : (
          <div>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <span>{item.name} (x{item.quantity})</span>
                <div className="cart-item-actions">
                  <span>₹{item.price * item.quantity}</span>
                  <button onClick={() => handleUpdateCart(item, 'remove')} className="remove-item-btn">×</button>
                </div>
              </div>
            ))}
            <hr />
            <div className="cart-total"><strong>Total</strong><strong>₹{totalPrice}</strong></div>
            <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading || cart.length === 0}>{loading ? 'Placing...' : 'Place Order'}</button>
          </div>
        )}
      </div>

      <h1 className="title">Our Menu</h1>
      <div className="menu-grid">
        {menuItems.map((item) => {
          const quantity = getItemQuantity(item.id);
          return (
            <div key={item.id} className="menu-card">
              <h2>{item.name}</h2>
              <p className="description">{item.description}</p>
              <div className="card-footer">
                <p className="price">₹{item.price}</p>
                {quantity === 0 ? (
                  <button onClick={() => handleUpdateCart(item, 'add')}>Add</button>
                ) : (
                  <div className="quantity-adjuster">
                    <button onClick={() => handleUpdateCart(item, 'remove')}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => handleUpdateCart(item, 'add')}>+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}