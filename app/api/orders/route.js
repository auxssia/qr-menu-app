import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request) {
  try {
    const { cart, tableId } = await request.json();

    // 1. Create a single order in the 'orders' table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({ table_id: tableId, status: 'pending' })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Prepare the items for the 'order_items' table from the cart array
    const orderItems = cart.map(item => ({ // The fix is here: we now map the cart array directly
      order_id: orderData.id,
      menu_item_id: item.id,
      quantity: item.quantity,
    }));

    // 3. Insert all items into the 'order_items' table
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