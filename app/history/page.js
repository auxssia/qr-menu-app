'use client';
import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function HistoryPage() {
  // ... (code for the history page)
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      const historyIds = JSON.parse(localStorage.getItem('orderHistory')) || [];
      if (historyIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`*, tables(table_number)`)
        .in('id', historyIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  return (
    <div className="app-container">
      <h1 className="history-title">My Recent Orders</h1>
      {loading && <p>Loading history...</p>}
      {!loading && orders.length === 0 && (
        <p>You haven't placed any orders from this device yet.</p>
      )}
      {!loading && orders.length > 0 && (
        <div className="history-list">
          {orders.map(order => (
            <Link href={`/order/${order.id}`} key={order.id} className="history-card">
              <div>
                <p><strong>Table #{order.tables.table_number}</strong></p>
                <p className="history-date">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div className="history-status">
                <span>{order.status}</span>
                <span>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}