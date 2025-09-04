'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabaseClient';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// ... (StarRating component is the same)
const StarRating = ({ rating, setRating }) => { /* ... */ };

export default function OrderStatus() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [restaurantSlug, setRestaurantSlug] = useState('');
  // ... (other state variables are the same)

  const supabase = createClient();

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return;

      const { data: orderData } = await supabase
        .from('orders')
        .select(`*, restaurants(slug), order_items(*, menu_items(*))`) // Fetch restaurant slug
        .eq('id', orderId)
        .single();

      if (orderData) {
        setOrder(orderData);
        setRestaurantSlug(orderData.restaurants.slug);
      }
      // ... (fetch feedback logic is the same)
    };
    fetchOrderData();
    // ... (real-time subscription is the same)
  }, [orderId, supabase]);

  // ... (handleSubmitFeedback logic is the same)

  if (!order) {
    return <div className="app-container"><h1>Loading Order...</h1></div>;
  }

  const renderContent = () => {
    if (order.payment_status !== 'paid') {
      return (
        <>
          {/* ... (bill summary is the same) ... */}
          {/* This link is now fixed */}
          <Link href={`/menu/${restaurantSlug}/${order.table_id}`} className="order-more-btn">
            Order More
          </Link>
        </>
      );
    } 
    // ... (the rest of the render logic is the same)
  };

  return <div className="app-container status-page-container">{renderContent()}</div>;
}