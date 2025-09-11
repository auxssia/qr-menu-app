import { createServer } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';

export const runtime = 'nodejs';
export const revalidate = 0;

export default async function HistoryPage() {
  const supabase = createServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch all PAID orders for the user's restaurant
  const { data: orders } = await supabase
    .from('orders')
    .select(`*, tables(table_number)`)
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false });

  return (
    <div className="app-container">
      <h1 className="dashboard-title">Order History</h1>
      <div className="history-list">
        {orders && orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="history-card">
              <span>Order #{order.id}</span>
              <span>Table #{order.tables.table_number}</span>
              <span>{new Date(order.created_at).toLocaleString()}</span>
              <span className="status-badge status-paid">{order.payment_status}</span>
            </div>
          ))
        ) : (
          <p>No completed orders found.</p>
        )}
      </div>
    </div>
  );
}