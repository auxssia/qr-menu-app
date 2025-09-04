'use client';

import { useState } from 'react';
import Image from 'next/image';
import Cart from './Cart';

// This component now receives the restaurant prop
export default function Menu({ menuItems, tableId, restaurant }) {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = ['All', ...new Set(menuItems.map(item => item.category).filter(Boolean))];
  const filteredMenuItems = selectedCategory === 'All' ? menuItems : menuItems.filter(item => item.category === selectedCategory);

  const handleUpdateCart = (item, action) => {
    setCart(currentCart => {
      const itemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);
      if (action === 'add') {
        if (itemIndex > -1) {
          return currentCart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
        } else { return [...currentCart, { ...item, quantity: 1 }]; }
      }
      if (action === 'remove') {
        if (itemIndex > -1) {
          if (currentCart[itemIndex].quantity > 1) {
            return currentCart.map(c => c.id === item.id ? { ...c, quantity: c.quantity - 1 } : c);
          } else { return currentCart.filter(c => c.id !== item.id); }
        }
      }
      return currentCart;
    });
  };

  const handleOrderSuccess = () => {
    setCart([]);
    setIsCartOpen(false);
  };
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getItemQuantity = (itemId) => cart.find(item => item.id === itemId)?.quantity || 0;

  return (
    <div className="app-container menu-page">
      {isCartOpen && (
        <Cart 
          cart={cart}
          tableId={tableId}
          restaurant={restaurant} // <-- THIS IS THE FIX: We are now passing the restaurant info
          onUpdateCart={handleUpdateCart} 
          onClose={() => setIsCartOpen(false)}
          onOrderPlaced={handleOrderSuccess}
        />
      )}
      
      <header className="menu-header">
        {/* You can replace this with a dynamic logo if you add a logo_url to your restaurants table */}
        <Image src="/logo.png" alt="Restaurant Logo" width={120} height={40} />
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </div>
      </header>
      
      <nav className="category-nav">
        <div className="category-chips">
          {categories.map(category => (<button key={category} className={`chip ${selectedCategory === category ? 'active' : ''}`} onClick={() => setSelectedCategory(category)}>{category}</button>))}
        </div>
      </nav>

      <main className="menu-list">
        {filteredMenuItems.map(item => {
          const quantity = getItemQuantity(item.id);
          return (
            <div key={item.id} className="new-menu-card">
              <div className="card-details">
                <h3 className="card-name">{item.name}</h3>
                <p className="card-description">{item.description}</p>
                <p className="card-price">₹{item.price}</p>
              </div>
              <div className="card-action">
                {quantity === 0 ? (<button className="add-button" onClick={() => handleUpdateCart(item, 'add')}>+ Add</button>) : (<div className="new-quantity-adjuster"><button onClick={() => handleUpdateCart(item, 'remove')}>-</button><span>{quantity}</span><button onClick={() => handleUpdateCart(item, 'add')}>+</button></div>)}
              </div>
            </div>
          );
        })}
      </main>

      {totalItems > 0 && (<div className="floating-cta" onClick={() => setIsCartOpen(true)}>View Order ({totalItems} items • ₹{totalPrice})</div>)}
    </div>
  );
}