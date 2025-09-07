'use client';

import ChefDashboard from '@/app/dashboard/ChefDashboard'; // Absolute paths
import WaiterDashboard from '@/app/dashboard/WaiterDashboard';
import ManagerDashboard from '@/app/dashboard/ManagerDashboard';
import CashierDashboard from '@/app/dashboard/CashierDashboard';
import SuperAdminDashboard from '@/app/dashboard/SuperAdminDashboard';

export default function DashboardSwitcher({ userRole, initialOrders }) {
  if (!userRole) {
    return <div><h1>Loading...</h1></div>;
  }

  switch (userRole) {
    case 'superadmin': return <SuperAdminDashboard />;
    case 'chef': return <ChefDashboard initialOrders={initialOrders} />;
    case 'waiter': return <WaiterDashboard initialOrders={initialOrders} />;
    case 'manager': return <ManagerDashboard initialOrders={initialOrders} />;
    case 'cashier': return <CashierDashboard initialOrders={initialOrders} />;
    default: return <div><h1>Access Denied</h1><p>Your role is not recognized.</p></div>;
  }
}