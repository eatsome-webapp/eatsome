'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Filter, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { OrderMode } from '@/app/(dashboard)/pos/layout';
import { MenuItem, MenuCategory } from '@/types';
import { useOrder } from '@/context/OrderContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import MenuCategorySection from './MenuCategorySection';
import MenuItemCard from './MenuItemCard';

// Mock menu categories data
const MOCK_CATEGORIES: MenuCategory[] = [
  { id: 'c1', restaurantId: 'r1', name: 'Appetizers', displayOrder: 1, isActive: true },
  { id: 'c2', restaurantId: 'r1', name: 'Main Dishes', displayOrder: 2, isActive: true },
  { id: 'c3', restaurantId: 'r1', name: 'Desserts', displayOrder: 3, isActive: true },
  { id: 'c4', restaurantId: 'r1', name: 'Drinks', displayOrder: 4, isActive: true },
  { id: 'c5', restaurantId: 'r1', name: 'Sides', displayOrder: 5, isActive: true },
];

// Mock menu items data
const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: 'i1', categoryId: 'c1', name: 'French Fries', description: 'Crispy golden fries', price: 4.99, isAvailable: true, dietaryFlags: ['vegetarian'] },
  { id: 'i2', categoryId: 'c1', name: 'Onion Rings', description: 'Crispy battered onion rings', price: 5.99, isAvailable: true },
  { id: 'i3', categoryId: 'c1', name: 'Chicken Wings', description: 'Spicy buffalo wings', price: 8.99, isAvailable: true },
  { id: 'i4', categoryId: 'c2', name: 'Cheeseburger', description: 'Classic beef burger with cheese', price: 12.99, isAvailable: true },
  { id: 'i5', categoryId: 'c2', name: 'Veggie Burger', description: 'Plant-based patty with fresh toppings', price: 13.99, isAvailable: true, dietaryFlags: ['vegetarian', 'vegan'] },
  { id: 'i6', categoryId: 'c2', name: 'Grilled Salmon', description: 'Fresh salmon with lemon butter', price: 18.99, isAvailable: true },
  { id: 'i7', categoryId: 'c3', name: 'Chocolate Cake', description: 'Rich chocolate layer cake', price: 6.99, isAvailable: true, dietaryFlags: ['vegetarian'] },
  { id: 'i8', categoryId: 'c3', name: 'Cheesecake', description: 'New York style cheesecake', price: 7.99, isAvailable: true, dietaryFlags: ['vegetarian'] },
  { id: 'i9', categoryId: 'c4', name: 'Soda', description: 'Coca-Cola, Sprite, or Fanta', price: 2.99, isAvailable: true, dietaryFlags: ['vegetarian', 'vegan'] },
  { id: 'i10', categoryId: 'c4', name: 'Coffee', description: 'Freshly brewed coffee', price: 3.99, isAvailable: true, dietaryFlags: ['vegetarian', 'vegan'] },
  { id: 'i11', categoryId: 'c5', name: 'Coleslaw', description: 'Creamy cabbage slaw', price: 3.99, isAvailable: true, dietaryFlags: ['vegetarian'] },
  { id: 'i12', categoryId: 'c5', name: 'Mashed Potatoes', description: 'Creamy mashed potatoes with gravy', price: 4.99, isAvailable: true, dietaryFlags: ['vegetarian'] },
];

interface MenuDisplayProps {
  mode: OrderMode;
}

const MenuDisplay = ({ mode }: MenuDisplayProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<MenuCategory[]>(MOCK_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const menuRef = useRef<HTMLDivElement>(null);
  const { addItem } = useOrder();
  const prefersReducedMotion = useReducedMotion();
  
  // Handle search and filtering
  useEffect(() => {
    let filtered = [...menuItems];
    
    // Apply search term filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(lowercasedSearch) || 
        (item.description?.toLowerCase().includes(lowercasedSearch) || false)
      );
    }
    
    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.categoryId === activeCategory);
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, activeCategory, menuItems]);
  
  // Scroll to category
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    
    if (categoryId === 'all') {
      menuRef.current?.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return;
    }
    
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Use scrollIntoView for the element
      element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setActiveCategory('all');
  };
  
  // Get items by category for rendering
  const getItemsByCategory = (categoryId: string) => {
    return searchTerm 
      ? filteredItems.filter(item => item.categoryId === categoryId)
      : menuItems.filter(item => item.categoryId === categoryId);
  };
  
  return (
    <Card className="flex flex-col h-full border-0 shadow-none">
      <div className="p-3 border-b border-neutral-200 flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-lg">Menu</h2>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search menu..."
              className="w-40 pl-8 h-8 md:w-60"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            New Item
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Categories Sidebar */}
        <div className="border-b md:border-r md:border-b-0 border-neutral-200 bg-neutral-50 md:w-48 flex-shrink-0">
          <div className="p-2">
            <Tabs 
              orientation="vertical" 
              value={activeCategory} 
              onValueChange={scrollToCategory} 
              className="w-full"
            >
              <TabsList className="w-full flex flex-row md:flex-col h-auto bg-transparent border-0 p-0">
                <TabsTrigger 
                  value="all" 
                  className="w-full justify-start py-2 h-auto text-sm font-medium"
                >
                  All Items
                </TabsTrigger>
                
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="w-full justify-start py-2 h-auto text-sm font-medium"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Menu Items */}
        <div ref={menuRef} className="flex-1 overflow-y-auto p-4">
          {searchTerm && filteredItems.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No menu items found for "{searchTerm}"
            </div>
          ) : searchTerm ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Search Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                  <MenuItemCard 
                    key={item.id} 
                    item={item} 
                    onAdd={() => addItem(item)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map(category => (
                <MenuCategorySection 
                  key={category.id}
                  category={category}
                  items={getItemsByCategory(category.id)}
                  onAddItem={addItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MenuDisplay; 