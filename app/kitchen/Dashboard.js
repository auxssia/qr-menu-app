'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabaseClient';

export default function Dashboard({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const supabase = createClient();

  // --- DERIVED DATA ---
  // 1. Group all active orders by their table number for the main view
  const groupedByTable = orders.reduce((acc, order) => {
    const tableNum = order.tables.table_number;
    if (!acc[tableNum]) acc[tableNum] = [];
    acc[tableNum].push(order);
    return acc;
  }, {});

  // 2. Create a flat list of ONLY the items that are currently "in_progress" for the chef's list
  const preparingItems = orders
    .filter(order => order.status === 'in_progress')
    .flatMap(order => 
      order.order_items.map(item => ({
        ...item,
        table_number: order.tables.table_number,
        unique_id: `${order.id}-${item.menu_items.name}` // Create a unique key for React
      }))
    );

  // --- HANDLER FUNCTIONS ---
  const updateStatus = async (orderId, newStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  };

  const handleMarkAsPaid = async (tableId) => {
    if (window.confirm(`Are you sure you want to mark all orders for Table ${tableId} as paid?`)) {
      await supabase.from('orders').update({ payment_status: 'paid' }).eq('table_id', tableId);
    }
  };

  // --- REAL-TIME SUBSCRIPTION ---
  useEffect(() => {
    const channel = supabase
      .channel('realtime kitchen')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          const refreshOrders = async () => {
             const { data: refreshedOrders } = await supabase
              .from('orders')
              .select(`*, tables(table_number), order_items(quantity, menu_items(name))`)
              .neq('payment_status', 'paid')
              .order('table_id', { ascending: true })
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

  // --- RENDER ---
  return (
    <div className="kitchen-layout">
      {/* Left Column: Orders grouped by table */}
      <div className="table-groups-container">
        {Object.keys(groupedByTable).length === 0 && <p>No active orders.</p>}
        {Object.entries(groupedByTable).map(([tableNum, tableOrders]) => (
          <div key={tableNum} className="table-group unpaid">
            <div className="table-group-header">
              <h2>Table #{tableNum}</h2>
              <button className="paid-btn" onClick={() => handleMarkAsPaid(tableOrders[0].table_id)}>Mark as Paid</button>
            </div>
            <div className="orders-grid">
              {tableOrders.map(order => (
                <div key={order.id} className="order-card">
                  <p>Status: <strong className={`status-${order.status}`}>{order.status}</strong></p>
                  <ul>{order.order_items.map((item, index) => (<li key={index}>{item.quantity} x {item.menu_items.name}</li>))}</ul>
                  <div className="status-buttons">
                    <button onClick={() => updateStatus(order.id, 'in_progress')}>In Progress</button>
                    <button onClick={() => updateStatus(order.id, 'ready')}>Ready</button>
                    <button onClick={() => updateStatus(order.id, 'served')}>Served</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right Column: Chef's "To-Do" List */}
      <div className="preparing-list-container">
        <h2>Currently Preparing</h2>
        {preparingItems.length === 0 ? (
          <p className="empty-list-message">No items are currently being prepared.</p>
        ) : (
          <ul className="preparing-list">
            {preparingItems.map(item => (
              <li key={item.unique_id} className="preparing-item">
                <span className="preparing-item-name">{item.quantity} x {item.menu_items.name}</span>
                <span className="preparing-item-table">Table #{item.table_number}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

