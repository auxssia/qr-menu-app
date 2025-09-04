'use client';

import { useState } from 'react';
import { createClient } from '../../lib/supabaseClient';

export default function MenuManager({ initialItems }) {
  const [menuItems, setMenuItems] = useState(initialItems);
  const [formState, setFormState] = useState({ name: '', price: '', description: '', category: 'Appetizers' });
  const [editingItem, setEditingItem] = useState(null);
  const supabase = createClient();

  // Group items by category for display
  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // ... (All other functions like handleInputChange, handleSubmit, etc., remain exactly the same)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormState(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormState({ name: '', price: '', description: '', category: 'Appetizers' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.price) {
      alert('Name and Price are required.');
      return;
    }
    const itemData = {
      name: formState.name,
      price: parseFloat(formState.price),
      description: formState.description,
      category: formState.category,
    };
    if (editingItem) {
      const { data: updatedItem, error } = await supabase.from('menu_items').update(itemData).eq('id', editingItem.id).select().single();
      if (error) {
        alert(`Failed to update item: ${error.message}`);
      } else {
        setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item));
        alert('Item updated successfully!');
        handleCancelEdit();
      }
    } else {
      const { data: createdItem, error } = await supabase.from('menu_items').insert(itemData).select().single();
      if (error) {
        alert(`Failed to add item: ${error.message}`);
      } else {
        setMenuItems(currentItems => [...currentItems, createdItem]);
        alert('Item added successfully!');
        handleCancelEdit();
      }
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', itemId);
    if (error) {
      alert(`Failed to delete item: ${error.message}`);
    } else {
      setMenuItems(menuItems.filter(item => item.id !== itemId));
      alert('Item deleted successfully!');
    }
  };

  return (
    <div className="admin-content">
      <div className="add-item-form">
        <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit}>
          {/* ... (form inputs are the same) */}
          <input name="name" value={formState.name} onChange={handleInputChange} placeholder="Item Name" required />
          <input name="price" value={formState.price} onChange={handleInputChange} placeholder="Price" type="number" step="0.01" required />
          <input name="description" value={formState.description} onChange={handleInputChange} placeholder="Description" />
          <select name="category" value={formState.category} onChange={handleInputChange}>
            <option>Appetizers</option>
            <option>Main Course</option>
            <option>Drinks</option>
            <option>Desserts</option>
          </select>
          <div className="form-buttons">
            <button type="submit">{editingItem ? 'Update Item' : 'Add Item'}</button>
            {editingItem && <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="item-list">
        <h2>Existing Items</h2>
        {/* New rendering logic for grouped items */}
        {Object.keys(groupedItems).map(category => (
          <div key={category} className="category-section">
            <h3 className="category-title-admin">{category}</h3>
            {groupedItems[category].map(item => (
              <div key={item.id} className="admin-item-card">
                <div className="item-details">
                  <strong>{item.name}</strong>
                  <p>₹{item.price} - {item.description || 'No description'}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEditClick(item)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDeleteItem(item.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}