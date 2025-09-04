import { supabase } from '../../lib/supabaseClient';
import Dashboard from './Dashboard'; // Import our new component

export const revalidate = 0;

export default async function Kitchen() {
  // Fetch the initial list of orders
  const { data: initialOrders } = await supabase
    .from('orders')
    .select(`
      id, status, created_at,
      tables ( table_number ),
      order_items (
        quantity,
        menu_items ( name )
      )
    `)
    .order('created_at', { ascending: true });

  return (
    <div className="kitchen-container">
      <h1 className="kitchen-title">Kitchen Dashboard</h1>
      {/* Pass the initial orders to the interactive Dashboard component */}
      <Dashboard initialOrders={initialOrders} />
    </div>
  );
}