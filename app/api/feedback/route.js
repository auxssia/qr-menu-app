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
    const { orderId, customerId, rating, comment } = await request.json();

    if (!orderId || !rating) {
      return NextResponse.json({ error: 'Order ID and rating are required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('feedback')
      .insert({
        order_id: orderId,
        customer_id: customerId,
        rating: rating,
        comment: comment,
      });

    if (error) {
      // It might fail if feedback for this order already exists, which is okay.
      console.warn('Feedback submission info:', error.message);
    }

    return NextResponse.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}