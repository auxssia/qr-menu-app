'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/utils';

export default function CashierDashboard({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const supabase = createClient();

  // Group unpaid orders by table number to create a bill for each table
  const unpaidTables = orders.reduce((acc, order) => {
    const tableNum = order.tables.table_number;
    if (!acc[tableNum]) {
      acc[tableNum] = {
        table_id: order.table_id,
        items: [],
        total: 0,
      };
    }
    order.order_items.forEach(item => {
      acc[tableNum].items.push(item);
      acc[tableNum].total += item.quantity * item.menu_items.price;
    });
    return acc;
  }, {});

  const handleMarkAsPaid = async (tableId) => {
    if (window.confirm(`Are you sure you want to mark all orders for this table as paid?`)) {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('table_id', tableId);
      if (error) {
        alert('Failed to update payment status.');
      }
    }
  };
  
  // Real-time updates for the cashier
  useEffect(() => {
    const channel = supabase
      .channel('realtime cashier dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          const refreshOrders = async () => {
             const { data: refreshedOrders } = await supabase
              .from('orders')
              .select(`*, tables(table_number), order_items(quantity, menu_items(price, name))`)
              .eq('payment_status', 'unpaid'); // Only fetch unpaid orders
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
      <h1 className="dashboard-title">Cashier - Unpaid Tables</h1>
      <div className="cashier-dashboard">
        {Object.keys(unpaidTables).length === 0 ? (
          <p className="empty-cashier-message">No unpaid tables.</p>
        ) : (
          Object.entries(unpaidTables).map(([tableNum, data]) => (
            <div key={tableNum} className="cashier-table-card">
              <div className="cashier-card-header">
                <h3>Table #{tableNum}</h3>
                <span className="cashier-total">Total: ₹{(data.total * 1.05).toFixed(2)}</span>
              </div>
              <ul className="cashier-item-list">
                {data.items.map((item, index) => (
                  <li key={index}>
                    {item.quantity} x {item.menu_items.name}
                  </li>
                ))}
              </ul>
              <button className="paid-btn-full" onClick={() => handleMarkAsPaid(data.table_id)}>
                Mark as Paid
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}