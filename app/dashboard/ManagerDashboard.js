'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabaseClient';
import Link from 'next/link'; // Make sure Link is imported

export default function ManagerDashboard({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const supabase = createClient();

  // Real-time subscription to keep the order list updated
  useEffect(() => {
    const channel = supabase
      .channel('realtime manager dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          const refreshOrders = async () => {
             const { data: refreshedOrders } = await supabase
              .from('orders')
              .select(`*, tables(table_number)`)
              .neq('payment_status', 'paid')
              .order('created_at', { ascending: false }); // Show newest orders first
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
      <h1 className="dashboard-title">Manager Dashboard</h1>
      
      {/* Link to the new reports page */}
      <div className="manager-actions">
        <Link href="/dashboard/reports" className="reports-link-btn">
          View Today's Sales Report
        </Link>
      </div>

      {/* Live Order Overview Section */}
      <div className="manager-section">
        <h2>Live Order Overview</h2>
        <div className="manager-order-list">
          <div className="manager-list-header">
            <span>Table</span>
            <span>Status</span>
            <span>Payment</span>
            <span>Time</span>
          </div>
          {orders.length === 0 ? (
            <p className="empty-manager-message">No active orders.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="manager-order-row">
                <span>#{order.tables.table_number}</span>
                <span className={`status-pill status-${order.status}`}>{order.status}</span>
                <span className={`status-pill status-${order.payment_status}`}>{order.payment_status}</span>
                <span>{new Date(order.created_at).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}