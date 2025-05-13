export type DashboardView = 'front' | 'back';
export type UserRole = 'owner' | 'manager' | 'staff';

export interface NavItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  viewType: DashboardView | 'both';
  requiredRole: UserRole | 'all';
}

export interface DashboardContextType {
  view: DashboardView;
  setView: (view: DashboardView) => void;
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
  currentRole: UserRole;
  temporaryRole: UserRole | null;
  setTemporaryRole: (role: UserRole | null) => void;
  resetTemporaryRole: () => void;
} 