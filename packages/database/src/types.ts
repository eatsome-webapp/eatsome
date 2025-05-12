export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  logo_url: string | null;
  cover_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantStaff {
  id: string;
  restaurant_id: string;
  user_id: string;
  role: 'owner' | 'manager' | 'staff' | 'kitchen';
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RestaurantTable {
  id: string;
  restaurant_id: string;
  name: string;
  capacity: number;
  position_x: number | null;
  position_y: number | null;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  table_id: string | null;
  customer_id: string | null;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
  // Joined relations
  order_items?: OrderItem[];
  table?: { name: string };
  customer?: { email: string };
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  quantity: number;
  price: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  menu_item?: { name: string };
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
} 