import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Menu from '../../../components/Menu'; // Note the path change
import { notFound } from 'next/navigation';

export const runtime = 'nodejs';
export const revalidate = 0;

export default async function MenuPage({ params }) {
  const { slug, tableId } = params;
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: { get: (name) => cookieStore.get(name)?.value },
    }
  );

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (!restaurant) {
    notFound();
  }

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurant.id);

  // We are now passing the restaurant object to the Menu component
  return <Menu menuItems={menuItems || []} tableId={tableId} restaurant={restaurant} />;
}