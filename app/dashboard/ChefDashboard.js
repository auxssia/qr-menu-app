'use client';
import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabaseClient';

export default function ChefDashboard({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const supabase = createClient();

  // Create a flat list of all items from orders that are 'pending' or 'in_progress'
  const allItems = orders.flatMap(order =>
    order.order_items.map(item => ({
      ...item,
      order_id: order.id,
      order_status: order.status,
      table_number: order.tables.table_number,
      station: item.menu_items.station || 'General',
      unique_id: `${order.id}-${item.menu_items.name}`
    }))
  );

  // Group the items by their assigned station
  const groupedByStation = allItems.reduce((acc, item) => {
    const station = item.station;
    if (!acc[station]) acc[station] = [];
    acc[station].push(item);
    return acc;
  }, {});

  const updateStatus = async (orderId, newStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  };

  useEffect(() => {
    const channel = supabase
      .channel('realtime chef dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' },
        () => {
          const refreshOrders = async () => {
             const { data: refreshedOrders } = await supabase
              .from('orders')
              .select(`*, tables(table_number), order_items(quantity, menu_items(name, station))`)
              .in('status', ['pending', 'in_progress'])
              .neq('payment_status', 'paid');
            setOrders(refreshedOrders || []);
          };
          refreshOrders();
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [supabase]);

  return (
    <div>
      <h1 className="dashboard-title">Chef Stations</h1>
      <div className="station-layout">
        {Object.entries(groupedByStation).map(([stationName, items]) => (
          <div key={stationName} className="station-column">
            <h2>{stationName}</h2>
            <div className="station-item-list">
              {items.map(item => (
                <div key={item.unique_id} className="chef-item-card">
                  <div className="chef-item-details">
                    <span className="chef-item-name">{item.quantity} x {item.menu_items.name}</span>
                    <span className="chef-item-table">Table #{item.table_number}</span>
                  </div>
                  {item.order_status === 'pending' && (
                    <button className="chef-action-btn start-btn" onClick={() => updateStatus(item.order_id, 'in_progress')}>Start</button>
                  )}
                  {item.order_status === 'in_progress' && (
                    <button className="chef-action-btn ready-btn" onClick={() => updateStatus(item.order_id, 'ready')}>Ready</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

