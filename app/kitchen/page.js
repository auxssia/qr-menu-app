import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Dashboard from './Dashboard';

export const runtime = 'nodejs';
export const revalidate = 0;

export default async function Kitchen() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: { get: (name) => cookieStore.get(name)?.value },
    }
  );

  const { data: initialOrders } = await supabase
    .from('orders')
    .select(`id, status, created_at, tables ( table_number ), order_items ( quantity, menu_items ( name ) )`)
    .order('created_at', { ascending: true });

  return (
    <div className="app-container">
      <h1 className="kitchen-title">Kitchen Dashboard</h1>
      <Dashboard initialOrders={initialOrders || []} />
    </div>
  );
}
