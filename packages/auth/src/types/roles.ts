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

// Hiërarchie van toegangsniveaus - wie heeft toegang tot wat
export const ACCESS_HIERARCHY = {
  [Role.CUSTOMER]: [Role.CUSTOMER],
  [Role.COURIER]: [Role.COURIER, Role.CUSTOMER],
  [Role.RESTAURANT_STAFF]: [Role.RESTAURANT_STAFF, Role.CUSTOMER],
  [Role.RESTAURANT_ADMIN]: [Role.RESTAURANT_ADMIN, Role.RESTAURANT_STAFF, Role.CUSTOMER],
  [Role.PLATFORM_ADMIN]: [Role.PLATFORM_ADMIN, Role.RESTAURANT_ADMIN, Role.RESTAURANT_STAFF, Role.COURIER, Role.CUSTOMER],
};

// Helper functie om te controleren of een rol toegang heeft tot een bepaald niveau
export function hasAccessToRole(userRole: Role, targetRole: Role): boolean {
  return ACCESS_HIERARCHY[userRole]?.includes(targetRole) || false;
} 