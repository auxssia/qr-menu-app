'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabaseClient'; // 1. Import the new function

export default function Dashboard({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const supabase = createClient(); // 2. Create the client instance

  useEffect(() => {
    // This logic now correctly handles updates for both INSERT and UPDATE
    const handleDbChanges = (payload) => {
      if (payload.eventType === 'INSERT') {
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
        setOrders(currentOrders =>
          currentOrders.map(order =>
            order.id === payload.new.id
              ? { ...order, status: payload.new.status }
              : order
          )
        );
      }
    };

    const channel = supabase
      .channel('realtime orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, handleDbChanges)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const updateStatus = async (orderId, newStatus) => {
    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
  };

  return (
    <div className="orders-grid">
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