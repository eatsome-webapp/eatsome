export enum Role {
  CUSTOMER = 'customer',
  COURIER = 'courier',
  RESTAURANT_STAFF = 'restaurant_staff',
  RESTAURANT_ADMIN = 'restaurant_admin',
  PLATFORM_ADMIN = 'platform_admin'
}

// Specifieke staffrollen binnen restaurants
export enum StaffRole {
  SERVER = 'server',        // Ober
  HOST = 'host',            // Gastheer/vrouw
  KITCHEN = 'kitchen',      // Keukenpersoneel
  CASHIER = 'cashier',      // Kassamedewerker
  MANAGER = 'manager'       // Shiftmanager
}

// Specifieke adminrollen binnen restaurants
export enum AdminRole {
  MANAGER = 'manager',      // Manager 
  OWNER = 'owner'           // Eigenaar
}

// Specifieke rollen binnen het EatsomePlatform team
export enum PlatformRole {
  SUPPORT = 'support',       // Klantenondersteuning
  OPERATIONS = 'operations', // Operationeel management
  FINANCE = 'finance',       // Financiën
  ADMIN = 'admin'           // Platform beheerder
}

// Hiërarchie van toegangsniveaus - wie heeft toegang tot wat
export const ACCESS_HIERARCHY = {
  [Role.CUSTOMER]: [Role.CUSTOMER],
  [Role.COURIER]: [Role.COURIER, Role.CUSTOMER],
  [Role.RESTAURANT_STAFF]: [Role.RESTAURANT_STAFF, Role.CUSTOMER],
  [Role.RESTAURANT_ADMIN]: [Role.RESTAURANT_ADMIN, Role.RESTAURANT_STAFF, Role.CUSTOMER],
  [Role.PLATFORM_ADMIN]: [Role.PLATFORM_ADMIN, Role.RESTAURANT_ADMIN, Role.RESTAURANT_STAFF, Role.COURIER, Role.CUSTOMER],
};

// Role-specific cookie keys
export const ROLE_COOKIES = {
  [Role.CUSTOMER]: 'customer_session',
  [Role.COURIER]: 'courier_session',
  [Role.RESTAURANT_STAFF]: 'staff_session',
  [Role.RESTAURANT_ADMIN]: 'admin_session',
  [Role.PLATFORM_ADMIN]: 'platform_session',
};

// Role-specific redirect URLs
export const ROLE_REDIRECT_URLS = {
  [Role.CUSTOMER]: '/login',
  [Role.COURIER]: '/courier/login',
  [Role.RESTAURANT_STAFF]: '/staff-login',
  [Role.RESTAURANT_ADMIN]: '/login?type=restaurant-admin',
  [Role.PLATFORM_ADMIN]: '/admin/login',
};

// Interface for user access information
export interface UserAccess {
  primaryRole: Role;
  specificRole?: StaffRole | AdminRole | PlatformRole; 
  restaurantId?: string;
  allowedFeatures?: string[];
}

// Helper function to check if a role has access to another role
export function hasAccessToRole(userRole: Role, targetRole: Role): boolean {
  return ACCESS_HIERARCHY[userRole]?.includes(targetRole) || false;
} 