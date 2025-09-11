'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';

export default function WaiterDashboard({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const supabase = createClient();

  // Filter for orders that are ready for pickup
  const readyForPickup = orders.filter(order => order.status === 'ready');

  const handleMarkAsServed = async (orderId) => {
    // This function updates the order status to 'served'
    const { error } = await supabase
      .from('orders')
      .update({ status: 'served' })
      .eq('id', orderId);
    
    if (error) {
      alert("Failed to update status.");
      console.error(error);
    }
  };

  // Real-time subscription to keep the order list updated
  useEffect(() => {
    const channel = supabase
      .channel('realtime waiter dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          const refreshOrders = async () => {
             const { data: refreshedOrders } = await supabase
              .from('orders')
              .select(`*, tables(table_number), order_items(quantity, menu_items(name))`)
              .neq('payment_status', 'paid')
              .order('created_at', { ascending: true });
            setOrders(refreshedOrders || []);
          };
          refreshOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div>
      <h1 className="dashboard-title">Ready for Pickup</h1>
      <div className="waiter-dashboard">
        {readyForPickup.length === 0 ? (
          <p className="empty-pickup-message">No orders are currently ready for pickup.</p>
        ) : (
          <div className="pickup-list">
            {readyForPickup.map(order => (
              <div key={order.id} className="pickup-card">
                <div className="pickup-card-header">
                  <h3>Table #{order.tables.table_number}</h3>
                </div>
                <ul className="pickup-card-body">
                  {order.order_items.map((item, index) => (
                    <li key={index}>
                      {item.quantity} x {item.menu_items.name}
                    </li>
                  ))}
                </ul>
                <button 
                  className="serve-btn" 
                  onClick={() => handleMarkAsServed(order.id)}
                >
                  Mark as Served
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
