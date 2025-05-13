'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { DashboardContextType, DashboardView, UserRole } from '@/types/dashboard';

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children, initialRole = 'owner' }: { 
  children: ReactNode; 
  initialRole?: UserRole;
}) => {
  // Persist sidebar state in localStorage
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('eatsome-sidebar-expanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist view type in localStorage
  const [view, setViewState] = useState<DashboardView>(() => {
    if (typeof window === 'undefined') return 'front';
    const saved = localStorage.getItem('eatsome-dashboard-view');
    return (saved as DashboardView) || 'front';
  });

  const [currentRole] = useState<UserRole>(initialRole);
  const [temporaryRole, setTemporaryRole] = useState<UserRole | null>(null);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };

  // Handle view change
  const setView = (newView: DashboardView) => {
    setViewState(newView);
  };

  // Reset temporary role
  const resetTemporaryRole = () => {
    setTemporaryRole(null);
  };

  // Persist state changes to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('eatsome-sidebar-expanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('eatsome-dashboard-view', view);
  }, [view]);

  const value = {
    view,
    setView,
    sidebarExpanded,
    toggleSidebar,
    currentRole,
    temporaryRole,
    setTemporaryRole,
    resetTemporaryRole,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};