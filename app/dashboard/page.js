import { createServer } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSwitcher from './DashboardSwitcher';

export const runtime = 'nodejs';
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = createServer();

  // 1. Get the current user session
  const { data: { user } } = await supabase.auth.getUser();

  // 2. If no user is logged in, redirect them to the login page
  if (!user) {
    redirect('/login');
  }

  // 3. If a user is logged in, fetch their role from the 'profiles' table
  let userRole = null;
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('uuid', user.id) // This is the line we're testing
    .single();
  
  // START: "Black Box Recorder"
  console.log('--- PROFILE CHECK ---');
  console.log('User ID from Auth:', user.id);
  console.log('Profile Data from DB:', profile);
  console.log('Profile Fetch Error:', profileError); // Also log any error
  console.log('---------------------');
  // END: "Black Box Recorder"

  if (profile) {
    userRole = profile.role;
  } else {
    // This is the part that is likely running
    console.error(`No profile found for user ID: ${user.id}. Redirecting to login.`);
    redirect('/login');
  }

  // 4. Fetch the initial data that all dashboards might need
  const { data: initialOrders } = await supabase
    .from('orders')
    .select(`*, tables(*), order_items(quantity, menu_items(*))`)
    .neq('payment_status', 'paid')
    .order('created_at', { ascending: true });

  // 5. Pass the user's role and initial data to the client-side Switcher component
  return (
    <div className="app-container">
      <DashboardSwitcher userRole={userRole} initialOrders={initialOrders || []} />
    </div>
  );
}