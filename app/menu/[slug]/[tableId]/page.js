import { createServer } from '@/lib/supabase/utils'; // Absolute path
import Menu from '@/app/components/Menu'; // Absolute path
import { notFound } from 'next/navigation';

export const runtime = 'nodejs';
export const revalidate = 0;

export default async function MenuPage({ params }) {
  const { slug, tableId } = params;
  const supabase = createServer();

  const { data: restaurant } = await supabase.from('restaurants').select('id, name').eq('slug', slug).single();
  if (!restaurant) { notFound(); }

  const { data: menuItems } = await supabase.from('menu_items').select('*').eq('restaurant_id', restaurant.id);

  return <Menu menuItems={menuItems || []} tableId={tableId} restaurant={restaurant} />;
}