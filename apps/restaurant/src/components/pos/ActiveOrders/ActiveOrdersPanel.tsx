'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Clock, CheckCircle2, Info } from 'lucide-react';
import { Order } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ActiveOrderCard from './ActiveOrderCard';

// Mock active orders data
const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    restaurantId: 'r1',
    orderNumber: 'ORD-1001',
    status: 'new',
    orderType: 'dine_in',
    tableId: 't2',
    items: [
      { id: 'oi1', orderId: 'o1', menuItemId: 'i4', name: 'Cheeseburger', quantity: 2, price: 12.99 },
      { id: 'oi2', orderId: 'o1', menuItemId: 'i1', name: 'French Fries', quantity: 1, price: 4.99 },
    ],
    subtotal: 30.97,
    tax: 1.86,
    total: 32.83,
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'o2',
    restaurantId: 'r1',
    orderNumber: 'ORD-1002',
    status: 'preparing',
    orderType: 'takeout',
    customer: {
      name: 'John Doe',
      phone: '555-123-4567',
    },
    items: [
      { id: 'oi3', orderId: 'o2', menuItemId: 'i5', name: 'Veggie Burger', quantity: 1, price: 13.99 },
      { id: 'oi4', orderId: 'o2', menuItemId: 'i9', name: 'Soda', quantity: 1, price: 2.99 },
    ],
    subtotal: 16.98,
    tax: 1.02,
    total: 18.00,
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  },
  {
    id: 'o3',
    restaurantId: 'r1',
    orderNumber: 'ORD-1003',
    status: 'ready',
    orderType: 'delivery',
    customer: {
      name: 'Jane Smith',
      phone: '555-987-6543',
      email: 'jane@example.com',
    },
    deliveryAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
    },
    items: [
      { id: 'oi5', orderId: 'o3', menuItemId: 'i6', name: 'Grilled Salmon', quantity: 1, price: 18.99 },
      { id: 'oi6', orderId: 'o3', menuItemId: 'i12', name: 'Mashed Potatoes', quantity: 1, price: 4.99 },
      { id: 'oi7', orderId: 'o3', menuItemId: 'i7', name: 'Chocolate Cake', quantity: 1, price: 6.99 },
    ],
    subtotal: 30.97,
    tax: 1.86,
    total: 32.83,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
];

const ActiveOrdersPanel = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const prefersReducedMotion = useReducedMotion();
  
  // Filter orders based on status and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = !searchTerm || 
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.tableId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  // Group orders by status for easy viewing
  const ordersByStatus = {
    new: filteredOrders.filter(order => order.status === 'new'),
    preparing: filteredOrders.filter(order => order.status === 'preparing'),
    ready: filteredOrders.filter(order => order.status === 'ready'),
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() } 
          : order
      )
    );
  };
  
  return (
    <Card className="flex-1 flex flex-col h-full border-0 shadow-none">
      <div className="p-3 border-b border-neutral-200 flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-lg">Active Orders</h2>
        
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search orders..."
            className="w-60 pl-8 h-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 border-b border-neutral-200">
          <TabsList className="w-full">
            <TabsTrigger
              value="all"
              onClick={() => setFilterStatus('all')}
              className="data-[state=active]:bg-neutral-100 data-[state=active]:text-neutral-900 flex gap-1 items-center"
            >
              All
              <span className="bg-neutral-200 text-neutral-700 rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {filteredOrders.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="new"
              onClick={() => setFilterStatus('new')}
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 flex gap-1 items-center"
            >
              New
              <span className="bg-blue-200 text-blue-800 rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {ordersByStatus.new.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="preparing"
              onClick={() => setFilterStatus('preparing')}
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 flex gap-1 items-center"
            >
              Preparing
              <span className="bg-amber-200 text-amber-800 rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {ordersByStatus.preparing.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="ready"
              onClick={() => setFilterStatus('ready')}
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 flex gap-1 items-center"
            >
              Ready
              <span className="bg-green-200 text-green-800 rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {ordersByStatus.ready.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="flex-1 overflow-auto m-0 p-3 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400">
              <Clock className="h-10 w-10 mb-2 text-neutral-300" />
              <p>No active orders</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <ActiveOrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="new" className="flex-1 overflow-auto m-0 p-3 space-y-3">
          {ordersByStatus.new.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400">
              <Info className="h-10 w-10 mb-2 text-neutral-300" />
              <p>No new orders</p>
            </div>
          ) : (
            ordersByStatus.new.map(order => (
              <ActiveOrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="preparing" className="flex-1 overflow-auto m-0 p-3 space-y-3">
          {ordersByStatus.preparing.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400">
              <Info className="h-10 w-10 mb-2 text-neutral-300" />
              <p>No orders being prepared</p>
            </div>
          ) : (
            ordersByStatus.preparing.map(order => (
              <ActiveOrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="ready" className="flex-1 overflow-auto m-0 p-3 space-y-3">
          {ordersByStatus.ready.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400">
              <CheckCircle2 className="h-10 w-10 mb-2 text-neutral-300" />
              <p>No orders ready for pickup/delivery</p>
            </div>
          ) : (
            ordersByStatus.ready.map(order => (
              <ActiveOrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ActiveOrdersPanel; 