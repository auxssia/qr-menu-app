'use client';

import { useState } from 'react';
import { createClient } from '../../lib/supabase/client'; // Corrected Import

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState([]);
  const [formState, setFormState] = useState({ name: '', price: '', description: '', category: 'Appetizers' });
  const supabase = createClient();

  // In a real app, you would fetch the initial menu items here with useEffect
  // For now, we will just focus on the form logic.

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logic to add or update an item in Supabase would go here
    alert('Form submitted! (Logic to be implemented)');
    // Example: await supabase.from('menu_items').insert([formState]);
    setFormState({ name: '', price: '', description: '', category: 'Appetizers' });
  };

  return (
    <div className="admin-content">
      <div className="add-item-form">
        <h2>Add New Menu Item</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" value={formState.name} onChange={handleInputChange} placeholder="Item Name" required />
          <input name="price" value={formState.price} onChange={handleInputChange} placeholder="Price" type="number" step="0.01" required />
          <input name="description" value={formState.description} onChange={handleInputChange} placeholder="Description" />
          <select name="category" value={formState.category} onChange={handleInputChange}>
            <option>Appetizers</option>
            <option>Main Course</option>
            <option>Drinks</option>
            <option>Desserts</option>
          </select>
          <button type="submit">Add Item</button>
        </form>
      </div>
    </div>
  );
}