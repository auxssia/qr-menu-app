import { supabase } from '../lib/supabaseClient';
import Menu from './components/Menu';

// This tells Next.js to always fetch fresh data on each request
export const revalidate = 0;

export default async function Home() {
  // Fetch data directly in the component
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*');

  // Pass the data to our interactive Menu component
  return <Menu menuItems={menuItems} />;
}