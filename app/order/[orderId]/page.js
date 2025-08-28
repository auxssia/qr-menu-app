'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component

export default function OrderStatus() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // ... (The data fetching logic remains exactly the same)
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
  }, [orderId]);

  if (!order) {
    return (
      <div className="status-container">
        <h1>Loading Order...</h1>
      </div>
    );
  }

  return (
    <div className="status-container">
      {/* Add the Image from your public folder */}
      <Image
        src="/order-confirmed.png" // The path to your image
        alt="Order confirmation illustration"
        width={280} // Specify width
        height={203} // Specify height
        priority // Helps load the image faster
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