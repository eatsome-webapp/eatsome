// Type definitions for the Table component and other POS types

/**
 * Table status represents the current state of a table
 */
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'dirty';

/**
 * Table represents a physical table in the restaurant
 */
export interface Table {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  seats: number;
  status: TableStatus;
}

/**
 * Order status represents the current state of an order
 */
export type OrderStatus = 
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'completed'
  | 'cancelled';

/**
 * Order type represents the fulfillment method
 */
export type OrderType = 'dine_in' | 'takeout' | 'delivery';

/**
 * Payment status represents the current state of payment
 */
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

/**
 * Payment method available in the system
 */
export type PaymentMethod = 'cash' | 'card' | 'online' | 'gift_card';

/**
 * MenuItem represents a product that can be ordered
 */
export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  allergens?: string[];
  dietaryFlags?: string[];
  displayOrder?: number;
}

/**
 * Menu category for organizing menu items
 */
export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

/**
 * OrderItem represents an item in an order
 */
export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  options?: OrderItemOption[];
}

/**
 * OrderItemOption represents a modification to an order item
 */
export interface OrderItemOption {
  id: string;
  name: string;
  price?: number;
}

/**
 * Customer information for orders
 */
export interface Customer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
}

/**
 * Address for delivery orders
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  instructions?: string;
}

/**
 * Order represents a customer order
 */
export interface Order {
  id: string;
  restaurantId: string;
  orderNumber: string;
  customer?: Customer;
  tableId?: string;
  status: OrderStatus;
  orderType: OrderType;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip?: number;
  discount?: number;
  total: number;
  notes?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  deliveryAddress?: Address;
  createdAt: string;
  updatedAt: string;
} 