import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: { get: (name) => cookieStore.get(name)?.value },
    }
  );

  try {
    // We now receive restaurantId from the frontend
    const { cart, tableId, restaurantId, phone } = await request.json(); 
    const numericTableId = parseInt(tableId, 10);
    let customerId = null;

    if (phone && phone.trim() !== '') {
      let { data: customer } = await supabase.from('customers').select('id').eq('phone', phone).single();
      if (!customer) {
        const { data: newCustomer } = await supabase.from('customers').insert({ phone: phone, restaurant_id: restaurantId }).select('id').single();
        customer = newCustomer;
      }
      customerId = customer.id;
    }

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({ 
        table_id: numericTableId, 
        status: 'pending',
        customer_id: customerId,
        restaurant_id: restaurantId // Save the restaurant ID with the order
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = cart.map(item => ({
      order_id: orderData.id,
      menu_item_id: item.id,
      quantity: item.quantity,
    }));

    await supabase.from('order_items').insert(orderItems);

    return NextResponse.json({ message: 'Order placed successfully', orderId: orderData.id });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}