import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import MenuManager from './MenuManager';

export const runtime = 'nodejs';
export const revalidate = 0;

export default async function Admin() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: { get: (name) => cookieStore.get(name)?.value },
    }
  );
  
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .order('id', { ascending: true });

  return (
    <div className="app-container">
      <h1 className="admin-title">Menu Management</h1>
      <MenuManager initialItems={menuItems || []} />
    </div>
  );
}
