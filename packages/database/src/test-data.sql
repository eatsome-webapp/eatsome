-- Insert a test restaurant
INSERT INTO restaurants (id, name, description, address)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Test Restaurant',
  'A test restaurant for development',
  '123 Test Street, Amsterdam'
);

-- Assign the current user as owner of this restaurant
INSERT INTO restaurant_staff (restaurant_id, user_id, role)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  auth.uid(),
  'owner'
);

-- Create some menu categories
INSERT INTO menu_categories (restaurant_id, name, sort_order)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Starters', 1),
  ('11111111-1111-1111-1111-111111111111', 'Main Courses', 2),
  ('11111111-1111-1111-1111-111111111111', 'Desserts', 3),
  ('11111111-1111-1111-1111-111111111111', 'Drinks', 4);

-- Add some menu items
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_available)
VALUES
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM menu_categories WHERE name = 'Starters' LIMIT 1), 'Bruschetta', 'Toasted bread topped with fresh tomato, basil, and garlic', 6.50, TRUE),
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM menu_categories WHERE name = 'Main Courses' LIMIT 1), 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 12.50, TRUE),
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM menu_categories WHERE name = 'Desserts' LIMIT 1), 'Tiramisu', 'Coffee-flavored Italian dessert with mascarpone', 7.50, TRUE),
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM menu_categories WHERE name = 'Drinks' LIMIT 1), 'Sparkling Water', '500ml bottle', 3.00, TRUE);

-- Add some tables
INSERT INTO restaurant_tables (restaurant_id, name, capacity, position_x, position_y)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Table 1', 2, 100, 100),
  ('11111111-1111-1111-1111-111111111111', 'Table 2', 4, 200, 100),
  ('11111111-1111-1111-1111-111111111111', 'Table 3', 6, 300, 100); 