import { createServerClient } from '@supabase/ssr'; // Import from the new, correct package
import { cookies } from 'next/headers';
import MenuManager from './MenuManager';

export const runtime = 'nodejs';

export const revalidate = 0;

export default async function Admin() {
  // This is the new, correct way to create a Supabase client in a Server Component
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .order('id', { ascending: true });

  return (
    <div className="admin-container">
      <h1 className="admin-title">Menu Management</h1>
      <MenuManager initialItems={menuItems} />
    </div>
  );
}