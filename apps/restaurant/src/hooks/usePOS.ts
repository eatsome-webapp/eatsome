'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { OrderMode } from '@/app/(dashboard)/pos/layout';
import { MenuItem, MenuCategory, Table, Order, OrderItem } from '@/types';
import { POSRepository } from '@/utils/supabase/repositories/pos-repository';

/**
 * Custom hook for POS-specific operations
 */
export function usePOS() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [activeOrderMode, setActiveOrderMode] = useState<OrderMode>(OrderMode.DINE_IN);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Replace with your actual restaurant ID
        const restaurantId = 'r1';
        
        // Fetch tables
        const tablesData = await POSRepository.getTables(restaurantId);
        setTables(tablesData);
        
        // Fetch menu categories
        const categoriesData = await POSRepository.getMenuCategories(restaurantId);
        setMenuCategories(categoriesData);
        
        // Fetch menu items
        const itemsData = await POSRepository.getMenuItems(restaurantId);
        setMenuItems(itemsData);
        
        // Fetch active orders
        const ordersData = await POSRepository.getActiveOrders(restaurantId);
        setActiveOrders(ordersData);
      } catch (err) {
        console.error('Error fetching POS data:', err);
        setError('Failed to load POS data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Check for table in URL
  useEffect(() => {
    const tableId = searchParams.get('table');
    if (tableId) {
      setActiveTable(tableId);
      setActiveOrderMode(OrderMode.DINE_IN);
    }
  }, [searchParams]);
  
  // Filter menu items by category
  const getMenuItemsByCategory = useCallback((categoryId: string) => {
    return menuItems.filter(item => item.categoryId === categoryId);
  }, [menuItems]);
  
  // Search menu items
  const searchMenuItems = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || 
      (item.description?.toLowerCase().includes(lowerQuery) || false)
    );
  }, [menuItems]);
  
  // Get orders for a specific table
  const getOrdersByTable = useCallback((tableId: string) => {
    return activeOrders.filter(order => order.tableId === tableId);
  }, [activeOrders]);
  
  // Set active table and update URL
  const selectTable = useCallback((tableId: string | null) => {
    setActiveTable(tableId);
    
    // Update URL with table parameter
    if (tableId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('table', tableId);
      router.push(`${pathname}?${params.toString()}`);
      setActiveOrderMode(OrderMode.DINE_IN);
    } else {
      // Remove table parameter from URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete('table');
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [pathname, router, searchParams]);
  
  // Set active order mode
  const setOrderMode = useCallback((mode: OrderMode) => {
    setActiveOrderMode(mode);
    
    // Clear table selection if not dine-in
    if (mode !== OrderMode.DINE_IN && activeTable) {
      selectTable(null);
    }
  }, [activeTable, selectTable]);
  
  // Create a new order
  const createOrder = useCallback(async (orderData: Partial<Order>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace with your actual restaurant ID
      const restaurantId = 'r1';
      
      // Create the order
      const order = await POSRepository.createOrder({
        ...orderData,
        restaurantId,
      });
      
      // Update active orders
      setActiveOrders(prevOrders => [order, ...prevOrders]);
      
      return order;
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update order status
  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await POSRepository.updateOrderStatus(orderId, status);
      
      // Update active orders
      setActiveOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status } 
            : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update table status
  const updateTableStatus = useCallback(async (tableId: string, status: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await POSRepository.updateTableStatus(tableId, status);
      
      // Update tables
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId 
            ? { ...table, status } 
            : table
        )
      );
    } catch (err) {
      console.error('Error updating table status:', err);
      setError('Failed to update table status. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get filtered orders by status
  const getOrdersByStatus = useCallback((status: string | string[]) => {
    const statusArray = Array.isArray(status) ? status : [status];
    return activeOrders.filter(order => statusArray.includes(order.status));
  }, [activeOrders]);
  
  // Refresh active orders
  const refreshActiveOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace with your actual restaurant ID
      const restaurantId = 'r1';
      
      // Fetch active orders
      const ordersData = await POSRepository.getActiveOrders(restaurantId);
      setActiveOrders(ordersData);
    } catch (err) {
      console.error('Error refreshing orders:', err);
      setError('Failed to refresh orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    error,
    tables,
    menuCategories,
    menuItems,
    activeOrders,
    activeTable,
    activeOrderMode,
    getMenuItemsByCategory,
    searchMenuItems,
    getOrdersByTable,
    selectTable,
    setOrderMode,
    createOrder,
    updateOrderStatus,
    updateTableStatus,
    getOrdersByStatus,
    refreshActiveOrders,
  };
} 