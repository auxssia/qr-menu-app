'use client';

import React from 'react';
import Link from 'next/link';

// This is a simple placeholder component for the Manager.
const ManagerDashboard = ({ initialOrders }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Manager Dashboard</h1>
        {/* The link to the reports page, using &apos; for the apostrophe */}
        <Link href="/dashboard/reports" className="button-primary">
          View Today&apos;s Sales Report
        </Link>
      </div>
      <div className="active-orders-section">
        <h2>Current Active Orders ({initialOrders.length})</h2>
        {initialOrders.length > 0 ? (
           initialOrders.map(order => (
              <div key={order.id} className="order-card-simple">
                <span>Order #{order.id} for Table {order.tables.table_number}</span>
                <span className={`status-badge status-${order.status}`}>{order.status}</span>
              </div>
            ))
        ) : (
          <p>No active orders right now.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;