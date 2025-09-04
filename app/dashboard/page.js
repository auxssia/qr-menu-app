import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import DashboardSwitcher from './DashboardSwitcher';

export const runtime = 'nodejs';
export const revalidate = 0;

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: { get: (name) => cookieStore.get(name)?.value },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  let userRole = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    userRole = profile?.role;
  }

  // Fetch all necessary data, EXCLUDING paid orders
  const { data: initialOrders } = await supabase
    .from('orders')
    .select(`*, tables(*), order_items(quantity, menu_items(*))`)
    .neq('payment_status', 'paid') // <-- THIS IS THE FIX
    .order('created_at', { ascending: true });

  return (
    <div className="app-container">
      <DashboardSwitcher userRole={userRole} initialOrders={initialOrders || []} />
    </div>
  );
}