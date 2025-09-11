'use client';

// Imports for all your specific dashboard UIs
import AdminDashboard from './AdminDashboard';
import ChefDashboard from './ChefDashboard';
import WaiterDashboard from './WaiterDashboard';
import CashierDashboard from './CashierDashboard';
import ManagerDashboard from './ManagerDashboard';
import DefaultDashboard from './DefaultDashboard';

const DashboardSwitcher = ({ userRole, initialOrders }) => {
  // This component now instantly receives the role and data as props.

  switch (userRole) {
    case 'admin':
      return <AdminDashboard initialOrders={initialOrders} />;
    case 'manager':
      return <ManagerDashboard initialOrders={initialOrders} />;
    case 'chef':
      return <ChefDashboard initialOrders={initialOrders} />;
    case 'waiter':
      return <WaiterDashboard initialOrders={initialOrders} />;
    case 'cashier':
      return <CashierDashboard initialOrders={initialOrders} />;
    default:
      // This is shown for any role not recognized or if the role is null
      return <DefaultDashboard />;
  }
};

export default DashboardSwitcher;