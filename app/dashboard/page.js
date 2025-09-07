import { createServer } from '@/lib/supabase/utils'; // Absolute path
import DashboardSwitcher from '@/app/dashboard/DashboardSwitcher'; // Absolute path

export const runtime = 'nodejs';
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = createServer();
  // ... (rest of the function is the same)
  const { data: { user } } = await supabase.auth.getUser();
  let userRole = null;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    userRole = profile?.role;
  }
  let initialOrders = [];
  if (userRole !== 'superadmin' && user) {
    const { data } = await supabase.from('orders').select(`*, tables(*), order_items(quantity, menu_items(*))`).neq('payment_status', 'paid').order('created_at', { ascending: true });
    initialOrders = data || [];
  }
  return (
    <div className="app-container">
      <DashboardSwitcher userRole={userRole} initialOrders={initialOrders} />
    </div>
  );
}