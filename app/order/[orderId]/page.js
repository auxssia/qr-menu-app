import { createServer } from '../../../lib/supabase/server';
import { notFound } from 'next/navigation';

export const runtime = 'nodejs';
export const revalidate = 0;

export default async function OrderStatusPage({ params }) {
  const { orderId } = params;
  const supabase = createServer();

  const { data: order } = await supabase
    .from('orders')
    .select(`*, tables(table_number), order_items(quantity, menu_items(name))`)
    .eq('id', orderId)
    .single();

  if (!order) {
    notFound();
  }

  return (
    <div className="app-container">
      <div className="order-status-card">
        <h2>Order Status</h2>
        <p>Your order for Table #{order.tables.table_number} is currently:</p>
        <h3 className={`status-badge status-${order.status}`}>{order.status}</h3>
        <ul>
          {order.order_items.map((item, index) => (
            <li key={index}>{item.quantity} x {item.menu_items.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}