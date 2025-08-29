'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabaseClient'; // 1. Import the new function
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderStatus() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const supabase = createClient(); // 2. Create the client instance

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      setOrder(data);
    };
    fetchOrder();

    const channel = supabase
      .channel(`realtime-order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, supabase]);

  if (!order) {
    return (
        <div className="status-container">
            <h1>Loading Order...</h1>
        </div>
    );
  }

  return (
    <div className="status-container">
      <Image
        src="/order-confirmed.png"
        alt="Order confirmation illustration"
        width={280}
        height={203}
        priority
      />
      <h1 className="confirmation-title">Order Placed..!!</h1>
      <div className="order-details">
        <span>Unique Id: {order.id.substring(0, 8)}...</span>
        <br />
        <span>Order Status: {order.status}</span>
      </div>
      <Link href="/" className="order-more-btn">
        Order Again
      </Link>
    </div>
  );
}