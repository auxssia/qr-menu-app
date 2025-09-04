'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Dashboard({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);

  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) console.error('Error updating status:', error);
  };

// In app/kitchen/Dashboard.js

useEffect(() => {
    setOrders(initialOrders);

    const channel = supabase
      .channel('realtime orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // ... (INSERT logic is correct and stays the same)
            const fetchNewOrder = async () => {
              const { data: newOrder } = await supabase
                .from('orders')
                .select('*, tables(*), order_items(*, menu_items(*))')
                .eq('id', payload.new.id)
                .single();
              if (newOrder) {
                setOrders(currentOrders => [...currentOrders, newOrder]);
              }
            };
            fetchNewOrder();
          } else if (payload.eventType === 'UPDATE') {
            // This is the corrected logic for updates
            setOrders(currentOrders =>
              currentOrders.map(order =>
                order.id === payload.new.id
                  ? { ...order, status: payload.new.status } // Only update the status field, preserving the rest
                  : order
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialOrders]);

  return (
    <div className="orders-grid">
      {/* THE CHANGE IS HERE: We add .filter() before .map()
        This tells the page to only show orders that are NOT marked as 'served'.
      */}
      {orders
        .filter(order => order.status !== 'served') 
        .map(order => (
          <div key={order.id} className="order-card">
            <h3>Table: {order.tables.table_number}</h3>
            <p>Status: <strong className={`status-${order.status}`}>{order.status}</strong></p>
            <ul>
              {order.order_items.map((item, index) => (
                <li key={index}>{item.quantity} x {item.menu_items.name}</li>
              ))}
            </ul>
            <div className="status-buttons">
                <button onClick={() => updateStatus(order.id, 'in_progress')}>In Progress</button>
                <button onClick={() => updateStatus(order.id, 'ready')}>Ready</button>
                <button onClick={() => updateStatus(order.id, 'served')}>Served</button>
            </div>
          </div>
        ))}
    </div>
  );
}