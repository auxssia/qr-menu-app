import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Menu from '../../components/Menu';

export const runtime = 'nodejs';

export const revalidate = 0;

export default async function TablePage({ params }) {
  const { tableId } = params;
  
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
    .select('*');

  return <Menu menuItems={menuItems || []} tableId={tableId} />;
}