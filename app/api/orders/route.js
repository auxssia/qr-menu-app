import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
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

  try {
    const { cart, tableId } = await request.json();
    const numericTableId = parseInt(tableId, 10);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({ table_id: numericTableId, status: 'pending' })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = cart.map(item => ({
      order_id: orderData.id,
      menu_item_id: item.id,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return NextResponse.json({ message: 'Order placed successfully', orderId: orderData.id });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}