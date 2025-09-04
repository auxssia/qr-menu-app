'use client';

import ChefDashboard from './ChefDashboard';
import WaiterDashboard from './WaiterDashboard';
import ManagerDashboard from './ManagerDashboard';
import CashierDashboard from './CashierDashboard'; // 1. Import the new component

export default function DashboardSwitcher({ userRole, initialOrders }) {
  switch (userRole) {
    case 'chef':
      return <ChefDashboard initialOrders={initialOrders} />;
    case 'waiter':
      return <WaiterDashboard initialOrders={initialOrders} />;
    case 'manager':
      return <ManagerDashboard initialOrders={initialOrders} />;
    case 'cashier':
      // 2. Add the case for the 'cashier' role
      return <CashierDashboard initialOrders={initialOrders} />;
    default:
      return <div><h1>Dashboard</h1><p>Welcome! Your role is not defined.</p></div>;
  }
}