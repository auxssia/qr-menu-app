import { createClient } from '@/lib/supabase/utils';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const runtime = 'nodejs';
export const revalidate = 0;

const getTodayDateRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
};

export default async function ReportsPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: { get: (name) => cookieStore.get(name)?.value },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'manager') {
      redirect('/dashboard');
    }
  }

  const { start, end } = getTodayDateRange();

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`*, order_items(*, menu_items(price, name))`)
    .eq('payment_status', 'paid')
    .gte('created_at', start)
    .lte('created_at', end);

  if (error) {
    return <div className="app-container"><p>Error fetching reports.</p></div>;
  }

  const totalSales = orders.reduce((sum, order) => {
    return sum + order.order_items.reduce((orderSum, item) => {
      return orderSum + (item.quantity * item.menu_items.price);
    }, 0);
  }, 0);

  const totalOrders = orders.length;

  const popularItems = orders
    .flatMap(order => order.order_items)
    .reduce((acc, item) => {
      const name = item.menu_items.name;
      acc[name] = (acc[name] || 0) + item.quantity;
      return acc;
    }, {});

  const sortedPopularItems = Object.entries(popularItems)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="app-container">
      {/* FIX: Changed Today's to Today&apos;s */}
      <h1 className="dashboard-title">Today&apos;s Sales Report</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h2>Total Sales</h2>
          <p>₹{totalSales.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h2>Total Orders</h2>
          <p>{totalOrders}</p>
        </div>
      </div>

      <div className="popular-items-section">
        <h2>Top Selling Items Today</h2>
        <ul className="popular-items-list">
          {sortedPopularItems.length === 0 ? (
            <p>No items sold yet today.</p>
          ) : (
            sortedPopularItems.map(([name, count]) => (
              <li key={name}>
                <span>{name}</span>
                <span>{count} sold</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}