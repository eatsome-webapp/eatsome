'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { Order, OrderItem, MenuItem } from '@/types';
import { OrderMode } from '@/app/(dashboard)/pos/layout';

interface OrderContextType {
  currentOrder: Order | null;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  updateItemNotes: (itemId: string, notes: string) => void;
  clearOrder: () => void;
  setOrderType: (type: OrderMode) => void;
  sendOrder: () => Promise<boolean>;
  activeTable: string | null;
  setActiveTable: (tableId: string | null) => void;
  setCustomerInfo: (name: string, phone?: string, email?: string) => void;
  setDeliveryAddress: (address: any) => void;
  setPaymentMethod: (method: string) => void;
  setTip: (amount: number) => void;
  setDiscount: (amount: number) => void;
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Generate a unique ID for order items
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize a new order if none exists
  useEffect(() => {
    if (!currentOrder) {
      setCurrentOrder({
        id: generateId(),
        restaurantId: 'r1', // Replace with actual restaurant ID
        orderNumber: `POS-${Math.floor(Math.random() * 10000)}`,
        status: 'new',
        orderType: 'dine_in',
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [currentOrder]);
  
  // Calculate totals whenever order items change
  useEffect(() => {
    if (currentOrder) {
      const subtotal = currentOrder.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      
      const taxRate = 0.06; // 6% tax rate - This would come from settings
      const taxAmount = (subtotal - (currentOrder.discount || 0)) * taxRate;
      
      const total = subtotal - (currentOrder.discount || 0) + taxAmount + (currentOrder.tip || 0);
      
      setCurrentOrder({
        ...currentOrder,
        subtotal,
        tax: taxAmount,
        total,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [
    currentOrder?.items, 
    currentOrder?.discount, 
    currentOrder?.tip
  ]);
  
  // Get active table from URL if present
  useEffect(() => {
    const tableId = searchParams.get('table');
    if (tableId) {
      setActiveTable(tableId);
      
      // Update order type to dine-in if table is selected
      if (currentOrder && currentOrder.orderType !== 'dine_in') {
        setCurrentOrder({
          ...currentOrder,
          orderType: 'dine_in',
          tableId,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }, [searchParams, currentOrder]);
  
  const addItem = useCallback((item: MenuItem) => {
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      // Check if item already exists in order
      const existingItem = prevOrder.items.find(
        (orderItem) => orderItem.menuItemId === item.id
      );
      
      if (existingItem) {
        // Update quantity if item exists
        return {
          ...prevOrder,
          items: prevOrder.items.map((orderItem) =>
            orderItem.menuItemId === item.id
              ? { ...orderItem, quantity: orderItem.quantity + 1 }
              : orderItem
          ),
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Add new item
        const newItem: OrderItem = {
          id: generateId(),
          orderId: prevOrder.id,
          menuItemId: item.id,
          name: item.name,
          quantity: 1,
          price: item.price,
        };
        
        return {
          ...prevOrder,
          items: [...prevOrder.items, newItem],
          updatedAt: new Date().toISOString(),
        };
      }
    });
  }, []);
  
  const removeItem = useCallback((itemId: string) => {
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      return {
        ...prevOrder,
        items: prevOrder.items.filter((item) => item.id !== itemId),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);
  
  const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      if (quantity <= 0) {
        return {
          ...prevOrder,
          items: prevOrder.items.filter((item) => item.id !== itemId),
          updatedAt: new Date().toISOString(),
        };
      }
      
      return {
        ...prevOrder,
        items: prevOrder.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);
  
  const updateItemNotes = useCallback((itemId: string, notes: string) => {
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      return {
        ...prevOrder,
        items: prevOrder.items.map((item) =>
          item.id === itemId ? { ...item, notes } : item
        ),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);
  
  const clearOrder = useCallback(() => {
    setCurrentOrder({
      id: generateId(),
      restaurantId: 'r1', // Replace with actual restaurant ID
      orderNumber: `POS-${Math.floor(Math.random() * 10000)}`,
      status: 'new',
      orderType: 'dine_in',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // Clear active table
    setActiveTable(null);
    
    // Remove table from URL if present
    if (searchParams.has('table')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('table');
      router.push(`${pathname}?${newParams.toString()}`);
    }
  }, [pathname, router, searchParams]);
  
  const setOrderType = useCallback((mode: OrderMode) => {
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      let orderType = 'dine_in';
      if (mode === OrderMode.TAKEOUT) orderType = 'takeout';
      if (mode === OrderMode.DELIVERY) orderType = 'delivery';
      
      return {
        ...prevOrder,
        orderType,
        // Clear table ID if not dine-in
        tableId: orderType === 'dine_in' ? prevOrder.tableId : undefined,
        // Clear delivery address if not delivery
        deliveryAddress: orderType === 'delivery' ? prevOrder.deliveryAddress : undefined,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);
  
  const setCustomerInfo = useCallback((name: string, phone?: string, email?: string) => {
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      return {
        ...prevOrder,
        customer: {
          ...(prevOrder.customer || {}),
          name,
          phone,
          email,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);
  
  const setDeliveryAddress = useCallback((address: any) => {
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      return {
        ...prevOrder,
        deliveryAddress: address,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);
  
  const setPaymentMethod = useCallback((method: string) => {
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      return {
        ...prevOrder,
        paymentMethod: method as any,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);
  
  const setTip = useCallback((amount: number) => {
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      return {
        ...prevOrder,
        tip: amount,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);
  
  const setDiscount = useCallback((amount: number) => {
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      return {
        ...prevOrder,
        discount: amount,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);
  
  const sendOrder = useCallback(async () => {
    if (!currentOrder || currentOrder.items.length === 0) {
      return false;
    }
    
    setLoading(true);
    
    try {
      // This would be an API call in production
      // For now, we'll simulate a successful order submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('Sending order:', currentOrder);
      
      // Clear the order after successful submission
      clearOrder();
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error sending order:', error);
      setLoading(false);
      return false;
    }
  }, [currentOrder, clearOrder]);
  
  const value = {
    currentOrder,
    addItem,
    removeItem,
    updateItemQuantity,
    updateItemNotes,
    clearOrder,
    setOrderType,
    sendOrder,
    activeTable,
    setActiveTable,
    setCustomerInfo,
    setDeliveryAddress,
    setPaymentMethod,
    setTip,
    setDiscount,
    loading,
  };
  
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export function useOrder() {
  const context = useContext(OrderContext);
  
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  
  return context;
} 