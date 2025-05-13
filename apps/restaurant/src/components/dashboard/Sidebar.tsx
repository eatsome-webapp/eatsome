'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '@/context/DashboardContext';
import { NavItem, UserRole } from '@/types/dashboard';
import { cn } from '@/lib/utils';

// Icons for sidebar
import { 
  LayoutDashboard, 
  Receipt, 
  UtensilsCrossed, 
  Clock, 
  BarChart3, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  User,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

// Navigation items
const navItems: NavItem[] = [
  { 
    id: 'dashboard', 
    title: 'Kassa', 
    icon: 'LayoutDashboard', 
    href: '/dashboard', 
    viewType: 'both',
    requiredRole: 'all'
  },
  { 
    id: 'orders', 
    title: 'Bestellingen', 
    icon: 'Receipt', 
    href: '/dashboard/orders', 
    viewType: 'front',
    requiredRole: 'all'
  },
  { 
    id: 'menu', 
    title: 'Menu', 
    icon: 'UtensilsCrossed', 
    href: '/dashboard/menu', 
    viewType: 'front',
    requiredRole: 'all'
  },
  { 
    id: 'payments', 
    title: 'Betalingen', 
    icon: 'DollarSign', 
    href: '/dashboard/payments', 
    viewType: 'front',
    requiredRole: 'all'
  },
  { 
    id: 'analytics', 
    title: 'Rapportages', 
    icon: 'BarChart3', 
    href: '/dashboard/analytics', 
    viewType: 'back',
    requiredRole: 'owner'
  },
  { 
    id: 'staff', 
    title: 'Personeel', 
    icon: 'Users', 
    href: '/dashboard/staff', 
    viewType: 'back',
    requiredRole: 'owner'
  },
  { 
    id: 'settings', 
    title: 'Instellingen', 
    icon: 'Settings', 
    href: '/dashboard/settings', 
    viewType: 'back',
    requiredRole: 'owner'
  },
];

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  Receipt: <Receipt size={20} />,
  UtensilsCrossed: <UtensilsCrossed size={20} />,
  Clock: <Clock size={20} />,
  BarChart3: <BarChart3 size={20} />,
  Users: <Users size={20} />,
  Settings: <Settings size={20} />,
  Bell: <Bell size={20} />,
  User: <User size={20} />,
  DollarSign: <DollarSign size={20} />,
  ShoppingCart: <ShoppingCart size={20} />,
};

export default function Sidebar() {
  const { view, sidebarExpanded, toggleSidebar, currentRole, temporaryRole } = useDashboard();
  const pathname = usePathname();
  
  // Determine effective role
  const effectiveRole = temporaryRole || currentRole;
  
  // Filter nav items based on current view and role
  const filteredNavItems = navItems.filter(item => {
    // Check view type
    const viewMatch = item.viewType === 'both' || item.viewType === view;
    
    // Check role requirement
    const roleMatch = item.requiredRole === 'all' || 
                     (effectiveRole === 'owner') || 
                     (item.requiredRole === effectiveRole);
    
    return viewMatch && roleMatch;
  });

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 z-20 h-full bg-white border-r border-neutral-200 shadow-sm rounded-tr-2xl rounded-br-2xl transition-all duration-300 ease-in-out",
        sidebarExpanded ? "w-64" : "w-20"
      )}
      animate={{ width: sidebarExpanded ? 256 : 80 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo Area */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-200">
        {sidebarExpanded ? (
          <div className="text-lg font-bold text-neutral-900">Eatsome Kassa</div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center font-bold text-neutral-900">
              K
            </div>
          </div>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="h-8 w-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors"
          aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="py-6 px-3">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.id}>
              <Link 
                href={item.href} 
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg transition-colors group",
                  pathname === item.href 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                <div className="flex-shrink-0 text-current">
                  {iconMap[item.icon]}
                </div>
                
                {sidebarExpanded && (
                  <span className="ml-3 font-medium">{item.title}</span>
                )}
                
                {pathname === item.href && (
                  <motion.div
                    className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r"
                    layoutId="sidebar-indicator"
                    transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Area */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200",
        sidebarExpanded ? "flex items-center" : "flex flex-col items-center"
      )}>
        <div className={cn(
          "h-10 w-10 rounded-full bg-neutral-200 flex-shrink-0 mr-3 overflow-hidden",
          !sidebarExpanded && "mb-2 mr-0"
        )}>
          <img
            src="/assets/profile-placeholder.jpg"
            alt="Kassamedewerker"
            className="h-full w-full object-cover"
            onError={(e) => {
              // Use a fallback on error
              e.currentTarget.src = '/assets/profile-placeholder.jpg';
            }}
          />
        </div>
        
        {sidebarExpanded && (
          <div className="flex-1 truncate">
            <div className="font-medium text-sm text-neutral-900">Kassamedewerker</div>
            <div className="text-xs text-neutral-500 truncate">kassa@restaurant.nl</div>
          </div>
        )}
        
        <Link
          href="/dashboard/profile"
          className={cn(
            "ml-auto p-1.5 text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors",
            !sidebarExpanded && "ml-0 mt-2"
          )}
          aria-label="Profile settings"
        >
          <Settings size={16} />
        </Link>
      </div>
    </motion.aside>
  );
} 