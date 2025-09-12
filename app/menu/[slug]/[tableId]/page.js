import { createServer } from '../../../../lib/supabase/server';
import Menu from '../../../components/Menu';
import { notFound } from 'next/navigation';

export const runtime = 'nodejs';
export const revalidate = 0;

export default async function MenuPage({ params }) {
  console.log('[LOG] Menu page rendering started.');
  
  const { slug, tableId } = params; 
  console.log(`[LOG] Slug from URL: ${slug}`);
  console.log(`[LOG] Table ID from URL: ${tableId}`);

  const supabase = createServer();
  console.log('[LOG] Supabase server client created.');

  try {
    console.log(`[LOG] STEP 1: Fetching restaurant with slug: "${slug}"`);
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, name')
      .eq('slug', slug)
      .single();

    if (restaurantError) {
      console.error('[ERROR] Error fetching restaurant:', restaurantError);
    }
    console.log('[LOG] Restaurant data received:', restaurant);

    if (!restaurant) {
      console.log('[LOG] Restaurant not found. Triggering 404 page.');
      notFound();
    }

    console.log(`[LOG] STEP 2: Fetching menu items for restaurant ID: ${restaurant.id}`);
    const { data: menuItems, error: menuItemsError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurant.id);

    if (menuItemsError) {
      console.error('[ERROR] Error fetching menu items:', menuItemsError);
    }
    console.log(`[LOG] Found ${menuItems ? menuItems.length : 0} menu items.`);

    console.log('[LOG] Rendering Menu component...');
    return <Menu menuItems={menuItems || []} tableId={tableId} restaurant={restaurant} />;

  } catch (error) {
    console.error('[FATAL ERROR] A critical error occurred:', error);
    return <div>An unexpected error occurred.</div>;
  }
}